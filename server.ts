import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import * as dotenv from 'dotenv';
import { db } from './src/db/index.ts';
import {
  users,
  farmerProfiles,
  farms,
  farmFields,
  buyerProfiles,
  productCategories,
  products,
  inputSuppliers,
  inputCategories,
  inputProducts,
  carts,
  cartItems,
  hubs,
  drivers,
  orders,
  orderItems,
  orderStatusHistory,
  payments,
  deliveries,
  hubMovements,
  qualityInspections,
  financeApplications,
  quoteRequests,
  reviews,
  messages,
  notifications,
  auditLogs,
} from './src/db/schema.ts';
import { eq, desc, and, or, ilike, sql } from 'drizzle-orm';
import { seedDatabase } from './src/db/seed.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory active user simulation for multi-role preview navigation
let currentUserId = 1; // Default to Bekele Tadesse (Farmer) or switchable in UI

// Multi-role constants
const ALL_ROLES = [
  'FARMER',
  'BUYER',
  'BUSINESS_BUYER',
  'INPUT_SUPPLIER',
  'DRIVER',
  'LOGISTICS_ADMIN',
  'FINANCIAL_INSTITUTION',
  'HUB_OPERATOR',
  'PLATFORM_ADMIN',
] as const;

// Auth Helper Middleware
const getAuthUser = async (req: express.Request) => {
  const headerUserId = req.headers['x-user-id'] || req.headers['x-auth-user'];
  const targetId = headerUserId ? Number(headerUserId) : currentUserId;
  const userList = await db.select().from(users).where(eq(users.id, targetId)).limit(1);
  return userList[0] || null;
};

// Role-Based Authorization Middleware
const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required. Please log in or select an active user.' });
    }
    (req as any).user = user;
    next();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const requireRole = (...allowedRoles: string[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user = await getAuthUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Authentication required.' });
      }
      (req as any).user = user;
      if (!allowedRoles.includes(user.role) && user.role !== 'PLATFORM_ADMIN') {
        return res.status(403).json({
          error: `Access denied. Role '${user.role}' is not authorized to access this resource. Allowed roles: ${allowedRoles.join(', ')}`,
        });
      }
      next();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
};

// Auto-seed database on start with fresh farmer produce data
seedDatabase(true).catch((err) => {
  console.error('Initial database seed error:', err);
});

// ==========================================
// 1. HEALTH & SEED API
// ==========================================
app.get('/api/health', async (req, res) => {
  try {
    const userCount = await db.select({ count: sql`count(*)` }).from(users);
    res.json({
      status: 'ok',
      database: 'connected',
      usersCount: userCount[0]?.count || 0,
      activeUserId: currentUserId,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.post('/api/seed', async (req, res) => {
  try {
    const force = req.body?.force !== false;
    await seedDatabase(force);
    res.json({ success: true, message: 'Database seeded successfully with authentic Ethiopian farmer crops' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. AUTH & USER ROLES
// ==========================================
app.get('/api/auth/roles', (req, res) => {
  res.json({
    roles: [
      { id: 'FARMER', title: 'Smallholder / Commercial Farmer', description: 'Lists produce, manages farm plots, tracks soil & harvest analytics, applies for agricultural credit' },
      { id: 'BUYER', title: 'Individual / Household Consumer', description: 'Browses fresh local produce, orders direct or hub cross-dock delivery with mobile money' },
      { id: 'BUSINESS_BUYER', title: 'Commercial & Institutional Buyer', description: 'Issues bulk RFQs, negotiates recurring supply contracts for supermarkets, hotels, and exporters' },
      { id: 'INPUT_SUPPLIER', title: 'Certified Input Supplier', description: 'Distributes MoA-certified seeds, fertilizers, crop protection, and solar irrigation systems' },
      { id: 'DRIVER', title: 'Fleet Logistics Driver', description: 'Receives regional transport dispatches, tracks GPS routes, completes digital proof-of-delivery' },
      { id: 'FINANCIAL_INSTITUTION', title: 'Agri-Credit & Underwriting Officer', description: 'Underwrites farmer loans based on verifiable harvest history and escrow performance' },
      { id: 'HUB_OPERATOR', title: 'Regional Cross-Dock Hub Manager', description: 'Manages cold storage staging, grading inspections, and cross-dock dispatch' },
      { id: 'PLATFORM_ADMIN', title: 'Platform Governance & Escrow Admin', description: 'Oversees nationwide GMV, settlement reconciliation, dispute resolution, and audit logs' },
    ],
  });
});

app.get('/api/auth/users', async (req, res) => {
  try {
    const allUsers = await db.select().from(users).orderBy(users.id);
    res.json(allUsers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/current', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      const first = await db.select().from(users).limit(1);
      if (first.length) {
        currentUserId = first[0].id;
        return res.json(first[0]);
      }
      return res.status(404).json({ error: 'No user found' });
    }

    // Fetch role-specific details
    let profileData: any = {};
    if (user.role === 'FARMER') {
      const fProf = await db.select().from(farmerProfiles).where(eq(farmerProfiles.userId, user.id)).limit(1);
      const userFarms = await db.select().from(farms).where(eq(farms.farmerId, user.id));
      profileData = { farmerProfile: fProf[0] || null, farms: userFarms };
    } else if (user.role === 'BUYER' || user.role === 'BUSINESS_BUYER') {
      const bProf = await db.select().from(buyerProfiles).where(eq(buyerProfiles.userId, user.id)).limit(1);
      profileData = { buyerProfile: bProf[0] || null };
    } else if (user.role === 'INPUT_SUPPLIER') {
      const sProf = await db.select().from(inputSuppliers).where(eq(inputSuppliers.userId, user.id)).limit(1);
      profileData = { supplierProfile: sProf[0] || null };
    } else if (user.role === 'DRIVER') {
      const dProf = await db.select().from(drivers).where(eq(drivers.userId, user.id)).limit(1);
      profileData = { driverProfile: dProf[0] || null };
    }

    res.json({ ...user, ...profileData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      email,
      fullName,
      role,
      phone,
      organizationName,
      region,
      zone,
      woreda,
      nationalIdNumber,
      tinNumber,
      address,
      farmSize,
      primaryCrops,
      farmerClassification,
      targetBuyerTypes,
      buyerType,
    } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({ error: 'Email and Full Name are required.' });
    }

    const assignedRole = ALL_ROLES.includes(role) ? role : 'BUYER';
    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
    if (existing.length) {
      return res.status(400).json({ error: 'A user with this email address already exists.' });
    }

    const uid = `USR-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newUser = await db
      .insert(users)
      .values({
        uid,
        email: email.toLowerCase().trim(),
        fullName,
        phone: phone || '+251 91 000 0000',
        role: assignedRole,
        organizationName: organizationName || null,
        region: region || 'Oromia',
        zone: zone || null,
        woreda: woreda || null,
        nationalIdNumber: nationalIdNumber || null,
        tinNumber: tinNumber || null,
        address: address || null,
        isVerified: assignedRole === 'PLATFORM_ADMIN',
        status: 'ACTIVE',
      })
      .returning();

    const createdUser = newUser[0];
    currentUserId = createdUser.id;

    // Bootstrap role-specific profile
    if (assignedRole === 'FARMER') {
      await db.insert(farmerProfiles).values({
        userId: createdUser.id,
        farmName: organizationName || `${createdUser.fullName}'s Farm`,
        region: region || 'Oromia',
        zone: zone || 'East Shewa',
        woreda: woreda || 'Adama Woreda',
        nationalIdNumber: nationalIdNumber || null,
        totalAreaHectares: Number(farmSize) || 2.5,
        primaryCrops: Array.isArray(primaryCrops) ? primaryCrops : ['Roma Tomatoes', 'Red Onions'],
      });
      await db.insert(farms).values({
        farmerId: createdUser.id,
        name: organizationName || `${createdUser.fullName} Primary Farm`,
        locationName: `${woreda || 'Adama'}, ${region || 'Oromia'}`,
        region: region || 'Oromia',
        sizeHectares: Number(farmSize) || 2.5,
      });
    } else if (assignedRole === 'BUYER' || assignedRole === 'BUSINESS_BUYER') {
      await db.insert(buyerProfiles).values({
        userId: createdUser.id,
        buyerType: buyerType || (assignedRole === 'BUSINESS_BUYER' ? 'SUPERMARKET' : 'INDIVIDUAL'),
        companyName: organizationName || `${createdUser.fullName} Enterprise`,
        tinNumber: tinNumber || null,
        deliveryAddress: address || `${region || 'Addis Ababa'}, Ethiopia`,
      });
    } else if (assignedRole === 'INPUT_SUPPLIER') {
      await db.insert(inputSuppliers).values({
        userId: createdUser.id,
        companyName: organizationName || `${createdUser.fullName} Agro Supplies`,
        contactPhone: phone || '+251 91 000 0000',
        contactEmail: email,
        warehouseLocation: address || `${region || 'Addis Ababa'} Distribution Center`,
        region: region || 'Addis Ababa',
      });
    } else if (assignedRole === 'DRIVER') {
      await db.insert(drivers).values({
        userId: createdUser.id,
        fullName: createdUser.fullName,
        phone: phone || '+251 91 000 0000',
        licenseNumber: `ETH-DL-${Math.floor(100000 + Math.random() * 900000)}`,
        vehicleType: 'ISUZU_NPR_TRUCK',
        vehiclePlateNumber: `3-${Math.floor(10000 + Math.random() * 90000)} ET`,
        capacityTons: 3.5,
        region: region || 'Oromia',
        currentStatus: 'AVAILABLE',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: createdUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required to login.' });
    const userList = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
    if (!userList.length) {
      return res.status(404).json({ error: 'User not found with this email.' });
    }
    const user = userList[0];
    currentUserId = user.id;
    res.json({
      success: true,
      message: 'Logged in successfully',
      user,
      token: `agrilink-session-${user.id}-${Date.now()}`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/switch-user', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const targetUser = await db.select().from(users).where(eq(users.id, Number(userId))).limit(1);
    if (!targetUser.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    currentUserId = Number(userId);
    res.json({ success: true, user: targetUser[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Firebase Sync endpoint
app.post('/api/auth/sync', async (req, res) => {
  try {
    const { uid, email, fullName, role, phone, organizationName, region } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ error: 'uid and email are required' });
    }

    const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (existing.length) {
      currentUserId = existing[0].id;
      return res.json({ user: existing[0], isNew: false });
    }

    const newUser = await db.insert(users).values({
      uid,
      email,
      fullName: fullName || email.split('@')[0],
      phone: phone || '+251 91 000 0000',
      role: role || 'BUYER',
      organizationName: organizationName || null,
      region: region || 'Addis Ababa',
      isVerified: false,
    }).returning();

    currentUserId = newUser[0].id;

    // Create profile
    if (role === 'FARMER') {
      await db.insert(farmerProfiles).values({
        userId: newUser[0].id,
        farmName: `${newUser[0].fullName}'s Farm`,
        region: region || 'Oromia',
        totalAreaHectares: 2.0,
      });
    } else {
      await db.insert(buyerProfiles).values({
        userId: newUser[0].id,
        buyerType: role === 'BUSINESS_BUYER' ? 'BUSINESS' : 'INDIVIDUAL',
        companyName: organizationName || null,
      });
    }

    res.json({ user: newUser[0], isNew: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. CATEGORIES & PRODUCE PRODUCTS
// ==========================================
app.get('/api/categories', async (req, res) => {
  try {
    const cats = await db.select().from(productCategories).orderBy(productCategories.id);
    res.json(cats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { category, search, grade, region, organic, farmerId, minPrice, maxPrice, targetBuyer } = req.query;

    let query = db
      .select({
        id: products.id,
        farmerId: products.farmerId,
        farmId: products.farmId,
        categoryId: products.categoryId,
        name: products.name,
        variety: products.variety,
        description: products.description,
        grade: products.grade,
        pricePerUnitEtb: products.pricePerUnitEtb,
        unit: products.unit,
        availableQuantity: products.availableQuantity,
        minOrderQuantity: products.minOrderQuantity,
        harvestDate: products.harvestDate,
        expectedAvailability: products.expectedAvailability,
        farmLocation: products.farmLocation,
        region: products.region,
        images: products.images,
        lotBatchNumber: products.lotBatchNumber,
        qualityScore: products.qualityScore,
        certifications: products.certifications,
        isOrganic: products.isOrganic,
        status: products.status,
        shelfLifeDays: products.shelfLifeDays,
        farmerName: users.fullName,
        farmerRating: farmerProfiles.rating,
        farmerVerified: users.isVerified,
        categoryName: productCategories.name,
        categorySlug: productCategories.slug,
      })
      .from(products)
      .leftJoin(users, eq(products.farmerId, users.id))
      .leftJoin(farmerProfiles, eq(users.id, farmerProfiles.userId))
      .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
      .where(eq(products.status, 'ACTIVE'))
      .orderBy(desc(products.id));

    const productList = await query;

    // Attach targetBuyerType
    const enhancedProducts = productList.map((p) => {
      let targetBuyerType: 'ALL' | 'PROCESSOR' | 'INVESTOR' | 'BUYER' = 'ALL';
      let targetBuyerNotes = 'Open to all verified buyers, processors & retail chains.';

      if (p.grade === 'PROCESSING_GRADE' || p.name.toLowerCase().includes('paste') || p.id % 3 === 0) {
        targetBuyerType = 'PROCESSOR';
        targetBuyerNotes = 'Targeted for Food Processors, Canneries & Industrial Mills (High volume bulk delivery).';
      } else if (p.grade === 'GRADE_1_EXPORT' || p.name.toLowerCase().includes('avocado') || p.name.toLowerCase().includes('teff') || p.id % 3 === 1) {
        targetBuyerType = 'INVESTOR';
        targetBuyerNotes = 'Targeted for Agri-Investors & Exporters (Contract farming & export lots).';
      } else {
        targetBuyerType = 'BUYER';
        targetBuyerNotes = 'Targeted for Supermarkets, Hotels & Retail Wholesalers (Fresh daily dispatch).';
      }

      return {
        ...p,
        targetBuyerType,
        targetBuyerNotes,
      };
    });

    // In-memory refine for combined query filters
    let filtered = enhancedProducts;
    if (category) {
      filtered = filtered.filter(
        (p) =>
          p.categorySlug === String(category) ||
          p.categoryId === Number(category) ||
          p.categoryName?.toLowerCase() === String(category).toLowerCase()
      );
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.variety && p.variety.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          (p.farmerName && p.farmerName.toLowerCase().includes(q))
      );
    }
    if (grade) {
      filtered = filtered.filter((p) => p.grade === String(grade));
    }
    if (region) {
      filtered = filtered.filter((p) => p.region.toLowerCase() === String(region).toLowerCase());
    }
    if (organic === 'true') {
      filtered = filtered.filter((p) => p.isOrganic === true);
    }
    if (farmerId) {
      filtered = filtered.filter((p) => p.farmerId === Number(farmerId));
    }
    if (minPrice) {
      filtered = filtered.filter((p) => p.pricePerUnitEtb >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.pricePerUnitEtb <= Number(maxPrice));
    }
    if (targetBuyer && targetBuyer !== 'ALL') {
      filtered = filtered.filter(
        (p) => (p.targetBuyerType as string) === String(targetBuyer) || (p.targetBuyerType as string) === 'ALL'
      );
    }

    res.json(filtered);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const prodId = Number(req.params.id);
    const prodList = await db
      .select({
        id: products.id,
        farmerId: products.farmerId,
        farmId: products.farmId,
        categoryId: products.categoryId,
        name: products.name,
        variety: products.variety,
        description: products.description,
        grade: products.grade,
        pricePerUnitEtb: products.pricePerUnitEtb,
        unit: products.unit,
        availableQuantity: products.availableQuantity,
        minOrderQuantity: products.minOrderQuantity,
        harvestDate: products.harvestDate,
        expectedAvailability: products.expectedAvailability,
        farmLocation: products.farmLocation,
        region: products.region,
        images: products.images,
        lotBatchNumber: products.lotBatchNumber,
        qualityScore: products.qualityScore,
        certifications: products.certifications,
        isOrganic: products.isOrganic,
        status: products.status,
        shelfLifeDays: products.shelfLifeDays,
        farmerName: users.fullName,
        farmerRating: farmerProfiles.rating,
        farmerVerified: users.isVerified,
        farmerBio: farmerProfiles.bio,
        farmerCompletedOrders: farmerProfiles.completedOrdersCount,
        categoryName: productCategories.name,
      })
      .from(products)
      .leftJoin(users, eq(products.farmerId, users.id))
      .leftJoin(farmerProfiles, eq(users.id, farmerProfiles.userId))
      .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
      .where(eq(products.id, prodId))
      .limit(1);

    if (!prodList.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Fetch related inspections & reviews
    const inspections = await db
      .select()
      .from(qualityInspections)
      .where(eq(qualityInspections.productId, prodId));

    const prodReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        comment: reviews.comment,
        isVerifiedPurchase: reviews.isVerifiedPurchase,
        createdAt: reviews.createdAt,
        reviewerName: users.fullName,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.reviewerId, users.id))
      .where(and(eq(reviews.targetType, 'PRODUCT'), eq(reviews.targetId, prodId)));

    const targetBuyerType =
      prodList[0].grade === 'PROCESSING_GRADE' || prodList[0].name.toLowerCase().includes('paste') || prodList[0].id % 3 === 0
        ? 'PROCESSOR'
        : prodList[0].grade === 'GRADE_1_EXPORT' || prodList[0].name.toLowerCase().includes('avocado') || prodList[0].name.toLowerCase().includes('teff') || prodList[0].id % 3 === 1
        ? 'INVESTOR'
        : 'BUYER';

    const targetBuyerNotes =
      targetBuyerType === 'PROCESSOR'
        ? 'Targeted for Food Processors, Canneries & Industrial Mills (High volume bulk delivery & forward contracting).'
        : targetBuyerType === 'INVESTOR'
        ? 'Targeted for Agri-Investors & Exporters (Certified export outgrower lots with verifiable traceability).'
        : 'Targeted for Supermarkets, Hotels & Retail Wholesalers (Fresh daily cold-chain dispatch).';

    res.json({
      ...prodList[0],
      targetBuyerType,
      targetBuyerNotes,
      inspections,
      reviews: prodReviews,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const {
      name,
      variety,
      description,
      categoryId,
      grade,
      pricePerUnitEtb,
      unit,
      availableQuantity,
      minOrderQuantity,
      harvestDate,
      expectedAvailability,
      farmLocation,
      region,
      images,
      lotBatchNumber,
      isOrganic,
      shelfLifeDays,
      farmId,
    } = req.body;

    const newProd = await db
      .insert(products)
      .values({
        farmerId: currentUserId,
        farmId: farmId ? Number(farmId) : null,
        categoryId: Number(categoryId) || 1,
        name,
        variety: variety || '',
        description: description || '',
        grade: grade || 'GRADE_1_LOCAL',
        pricePerUnitEtb: Number(pricePerUnitEtb) || 50,
        unit: unit || 'KG',
        availableQuantity: Number(availableQuantity) || 100,
        minOrderQuantity: Number(minOrderQuantity) || 10,
        harvestDate: harvestDate || new Date().toISOString().split('T')[0],
        expectedAvailability: expectedAvailability || 'Immediate',
        farmLocation: farmLocation || 'Ethiopia',
        region: region || 'Oromia',
        images: images && images.length ? images : ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'],
        lotBatchNumber: lotBatchNumber || `LOT-AGR-${Date.now().toString().slice(-6)}`,
        qualityScore: 96,
        isOrganic: Boolean(isOrganic),
        status: 'ACTIVE',
        shelfLifeDays: Number(shelfLifeDays) || 14,
      })
      .returning();

    res.json(newProd[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/products/:id', async (req, res) => {
  try {
    const prodId = Number(req.params.id);
    const updated = await db
      .update(products)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(products.id, prodId))
      .returning();

    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 4. FARMERS, DIGITAL FARMS & FIELDS
// ==========================================
app.get('/api/farmers', async (req, res) => {
  try {
    const farmerList = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
        avatarUrl: users.avatarUrl,
        region: users.region,
        isVerified: users.isVerified,
        farmName: farmerProfiles.farmName,
        totalAreaHectares: farmerProfiles.totalAreaHectares,
        primaryCrops: farmerProfiles.primaryCrops,
        farmingExperienceYears: farmerProfiles.farmingExperienceYears,
        bio: farmerProfiles.bio,
        rating: farmerProfiles.rating,
        completedOrdersCount: farmerProfiles.completedOrdersCount,
        totalProduceSoldTons: farmerProfiles.totalProduceSoldTons,
        isCertifiedOrganic: farmerProfiles.isCertifiedOrganic,
      })
      .from(users)
      .innerJoin(farmerProfiles, eq(users.id, farmerProfiles.userId))
      .where(eq(users.role, 'FARMER'));

    res.json(farmerList);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/farmers/:id', async (req, res) => {
  try {
    const farmerId = Number(req.params.id);
    const userRes = await db.select().from(users).where(eq(users.id, farmerId)).limit(1);
    if (!userRes.length) return res.status(404).json({ error: 'Farmer not found' });

    const profileRes = await db.select().from(farmerProfiles).where(eq(farmerProfiles.userId, farmerId)).limit(1);
    const farmerFarms = await db.select().from(farms).where(eq(farms.farmerId, farmerId));

    // Get fields for all farms
    const farmIds = farmerFarms.map((f) => f.id);
    let farmFieldsList: any[] = [];
    if (farmIds.length) {
      farmFieldsList = await db.select().from(farmFields);
      farmFieldsList = farmFieldsList.filter((f) => farmIds.includes(f.farmId));
    }

    const farmerProds = await db.select().from(products).where(eq(products.farmerId, farmerId));
    const farmerReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        comment: reviews.comment,
        isVerifiedPurchase: reviews.isVerifiedPurchase,
        createdAt: reviews.createdAt,
        reviewerName: users.fullName,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.reviewerId, users.id))
      .where(and(eq(reviews.targetType, 'FARMER'), eq(reviews.targetId, farmerId)));

    res.json({
      ...userRes[0],
      profile: profileRes[0] || null,
      farms: farmerFarms.map((fm) => ({
        ...fm,
        fields: farmFieldsList.filter((fld) => fld.farmId === fm.id),
      })),
      products: farmerProds,
      reviews: farmerReviews,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/farms', async (req, res) => {
  try {
    const { name, locationName, region, sizeHectares, soilType, irrigationType, certifications } = req.body;
    const newFarm = await db
      .insert(farms)
      .values({
        farmerId: currentUserId,
        name: name || 'My Commercial Estate',
        locationName: locationName || 'Oromia Region',
        region: region || 'Oromia',
        sizeHectares: Number(sizeHectares) || 2.5,
        soilType: soilType || 'Clay Loam',
        irrigationType: irrigationType || 'Drip & Rainfed',
        certifications: certifications || ['Traceable Origin'],
      })
      .returning();

    res.json(newFarm[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/farms/:farmId/fields', async (req, res) => {
  try {
    const farmId = Number(req.params.farmId);
    const { fieldName, areaHectares, currentCrop, variety, plantingDate, expectedHarvestDate, notes } = req.body;

    const newField = await db
      .insert(farmFields)
      .values({
        farmId,
        fieldName,
        areaHectares: Number(areaHectares) || 1.0,
        currentCrop,
        variety: variety || '',
        plantingDate: plantingDate || new Date().toISOString().split('T')[0],
        expectedHarvestDate: expectedHarvestDate || '',
        status: 'GROWING',
        healthScore: 96,
        soilMoisturePercent: 70,
        notes: notes || '',
      })
      .returning();

    res.json(newField[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 5. INPUT MARKETPLACE & SUPPLIERS
// ==========================================
app.get('/api/input-categories', async (req, res) => {
  try {
    const cats = await db.select().from(inputCategories);
    res.json(cats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/inputs', async (req, res) => {
  try {
    const { category, search } = req.query;
    let list = await db
      .select({
        id: inputProducts.id,
        supplierId: inputProducts.supplierId,
        categoryId: inputProducts.categoryId,
        name: inputProducts.name,
        brand: inputProducts.brand,
        description: inputProducts.description,
        priceEtb: inputProducts.priceEtb,
        unit: inputProducts.unit,
        stockQuantity: inputProducts.stockQuantity,
        minOrderQuantity: inputProducts.minOrderQuantity,
        specifications: inputProducts.specifications,
        applicationGuide: inputProducts.applicationGuide,
        images: inputProducts.images,
        isCertified: inputProducts.isCertified,
        status: inputProducts.status,
        supplierName: inputSuppliers.companyName,
        supplierVerified: inputSuppliers.isVerified,
        categoryName: inputCategories.name,
        categorySlug: inputCategories.slug,
      })
      .from(inputProducts)
      .leftJoin(inputSuppliers, eq(inputProducts.supplierId, inputSuppliers.id))
      .leftJoin(inputCategories, eq(inputProducts.categoryId, inputCategories.id))
      .orderBy(desc(inputProducts.id));

    if (category) {
      list = list.filter((p) => p.categorySlug === String(category) || p.categoryId === Number(category));
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/inputs', async (req, res) => {
  try {
    const { categoryId, name, brand, description, priceEtb, unit, stockQuantity, minOrderQuantity, specifications, applicationGuide, images } = req.body;

    let supp = await db.select().from(inputSuppliers).where(eq(inputSuppliers.userId, currentUserId)).limit(1);
    let supplierId = supp[0]?.id;
    if (!supplierId) {
      const firstSupp = await db.select().from(inputSuppliers).limit(1);
      supplierId = firstSupp[0]?.id || 1;
    }

    const newInProd = await db
      .insert(inputProducts)
      .values({
        supplierId,
        categoryId: Number(categoryId) || 1,
        name,
        brand,
        description,
        priceEtb: Number(priceEtb),
        unit: unit || 'BAG',
        stockQuantity: Number(stockQuantity) || 50,
        minOrderQuantity: Number(minOrderQuantity) || 1,
        specifications: specifications || '',
        applicationGuide: applicationGuide || '',
        images: images && images.length ? images : ['https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80'],
        isCertified: true,
      })
      .returning();

    res.json(newInProd[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 6. PERSISTENT DATABASE CART
// ==========================================
app.get('/api/cart', async (req, res) => {
  try {
    let userCart = await db.select().from(carts).where(eq(carts.userId, currentUserId)).limit(1);
    if (!userCart.length) {
      userCart = await db.insert(carts).values({ userId: currentUserId }).returning();
    }
    const cartId = userCart[0].id;

    const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cartId));

    // Hydrate items
    const hydrated = await Promise.all(
      items.map(async (item) => {
        if (item.itemType === 'PRODUCE' && item.productId) {
          const p = await db.select().from(products).where(eq(products.id, item.productId)).limit(1);
          return { ...item, product: p[0] || null };
        } else if (item.itemType === 'INPUT' && item.inputProductId) {
          const ip = await db.select().from(inputProducts).where(eq(inputProducts.id, item.inputProductId)).limit(1);
          return { ...item, inputProduct: ip[0] || null };
        }
        return item;
      })
    );

    const subtotal = hydrated.reduce((acc, curr) => acc + curr.quantity * curr.unitPriceEtb, 0);
    const deliveryFee = subtotal > 0 ? (subtotal > 20000 ? 0 : 2500) : 0;
    const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.02) : 0;

    res.json({
      cartId,
      items: hydrated,
      subtotalEtb: subtotal,
      deliveryFeeEtb: deliveryFee,
      serviceFeeEtb: serviceFee,
      grandTotalEtb: subtotal + deliveryFee + serviceFee,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cart/items', async (req, res) => {
  try {
    const { itemType, productId, inputProductId, quantity, unitPriceEtb } = req.body;

    let userCart = await db.select().from(carts).where(eq(carts.userId, currentUserId)).limit(1);
    if (!userCart.length) {
      userCart = await db.insert(carts).values({ userId: currentUserId }).returning();
    }
    const cartId = userCart[0].id;

    // Check if already in cart
    const existing = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cartId),
          itemType === 'PRODUCE' ? eq(cartItems.productId, Number(productId)) : eq(cartItems.inputProductId, Number(inputProductId))
        )
      )
      .limit(1);

    if (existing.length) {
      const updated = await db
        .update(cartItems)
        .set({ quantity: existing[0].quantity + Number(quantity) })
        .where(eq(cartItems.id, existing[0].id))
        .returning();
      return res.json(updated[0]);
    }

    const newItem = await db
      .insert(cartItems)
      .values({
        cartId,
        itemType: itemType || 'PRODUCE',
        productId: productId ? Number(productId) : null,
        inputProductId: inputProductId ? Number(inputProductId) : null,
        quantity: Number(quantity) || 1,
        unitPriceEtb: Number(unitPriceEtb),
      })
      .returning();

    res.json(newItem[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/cart/items/:id', async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    const { quantity } = req.body;
    if (quantity <= 0) {
      await db.delete(cartItems).where(eq(cartItems.id, itemId));
      return res.json({ deleted: true });
    }
    const updated = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId)).returning();
    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cart/items/:id', async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cart', async (req, res) => {
  try {
    const userCart = await db.select().from(carts).where(eq(carts.userId, currentUserId)).limit(1);
    if (userCart.length) {
      await db.delete(cartItems).where(eq(cartItems.cartId, userCart[0].id));
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 7. REAL DATABASE ORDERS & TRANSACTIONS
// ==========================================
app.post('/api/orders/checkout', async (req, res) => {
  try {
    const {
      deliveryAddress,
      deliveryRegion,
      deliveryZone,
      deliveryWoreda,
      deliveryContactName,
      deliveryContactPhone,
      deliveryModel,
      hubId,
      nationalIdNumber,
      tinNumber,
      payerAccountNumber,
      notes,
      paymentMethod,
    } = req.body;

    const userCart = await db.select().from(carts).where(eq(carts.userId, currentUserId)).limit(1);
    if (!userCart.length) return res.status(400).json({ error: 'Cart is empty' });

    const items = await db.select().from(cartItems).where(eq(cartItems.cartId, userCart[0].id));
    if (!items.length) return res.status(400).json({ error: 'Cart has no items' });

    let subtotal = 0;
    const orderItemsToInsert: any[] = [];

    for (const item of items) {
      const itemSubtotal = item.quantity * item.unitPriceEtb;
      subtotal += itemSubtotal;

      let sellerId = 1;
      let name = 'Agricultural Produce';
      let grade = 'GRADE_1_LOCAL';
      let unit = 'KG';
      let lotBatchNumber = 'LOT-DEFAULT';

      if (item.itemType === 'PRODUCE' && item.productId) {
        const p = await db.select().from(products).where(eq(products.id, item.productId)).limit(1);
        if (p.length) {
          sellerId = p[0].farmerId;
          name = p[0].name;
          grade = p[0].grade;
          unit = p[0].unit;
          lotBatchNumber = p[0].lotBatchNumber;
        }
      } else if (item.itemType === 'INPUT' && item.inputProductId) {
        const ip = await db.select().from(inputProducts).where(eq(inputProducts.id, item.inputProductId)).limit(1);
        if (ip.length) {
          const supp = await db.select().from(inputSuppliers).where(eq(inputSuppliers.id, ip[0].supplierId)).limit(1);
          sellerId = supp[0]?.userId || 1;
          name = ip[0].name;
          unit = ip[0].unit;
        }
      }

      orderItemsToInsert.push({
        itemType: item.itemType,
        productId: item.productId,
        inputProductId: item.inputProductId,
        sellerId,
        name,
        grade,
        unit,
        quantity: item.quantity,
        unitPriceEtb: item.unitPriceEtb,
        subtotalEtb: itemSubtotal,
        lotBatchNumber,
      });
    }

    const deliveryFee = subtotal > 20000 ? 0 : 2500;
    const serviceFee = Math.round(subtotal * 0.02);
    const grandTotal = subtotal + deliveryFee + serviceFee;
    const orderNum = `AGR-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Order in DB with full KYC & regional hierarchy
    const newOrder = await db
      .insert(orders)
      .values({
        orderNumber: orderNum,
        buyerId: currentUserId,
        orderType: 'PRODUCE',
        totalAmountEtb: subtotal,
        deliveryFeeEtb: deliveryFee,
        serviceFeeEtb: serviceFee,
        grandTotalEtb: grandTotal,
        paymentStatus: 'PAID', // Directly simulate verified payment
        orderStatus: 'CONFIRMED',
        deliveryModel: deliveryModel || 'DIRECT',
        hubId: hubId ? Number(hubId) : null,
        deliveryAddress: deliveryAddress || 'Addis Ababa, Ethiopia',
        deliveryRegion: deliveryRegion || 'Addis Ababa',
        deliveryZone: deliveryZone || null,
        deliveryWoreda: deliveryWoreda || null,
        nationalIdNumber: nationalIdNumber || null,
        tinNumber: tinNumber || null,
        payerAccountNumber: payerAccountNumber || null,
        deliveryContactName: deliveryContactName || 'Customer',
        deliveryContactPhone: deliveryContactPhone || '+251 91 000 0000',
        requestedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        notes: notes || '',
      })
      .returning();

    const createdOrder = newOrder[0];

    // Insert Order Items
    for (const oi of orderItemsToInsert) {
      await db.insert(orderItems).values({
        ...oi,
        orderId: createdOrder.id,
      });
    }

    // Create Payment Record
    const txRef = `TX-${(paymentMethod || 'CHAPA').toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await db.insert(payments).values({
      orderId: createdOrder.id,
      userId: currentUserId,
      amountEtb: grandTotal,
      currency: 'ETB',
      provider: paymentMethod || 'CHAPA',
      transactionRef: txRef,
      status: 'PAID',
      paymentMethod: 'MOBILE_MONEY_OR_CARD',
      payerAccountNumber: payerAccountNumber || null,
      paidAt: new Date(),
    });

    // Create Delivery Record & Assign available driver
    const availDriver = await db.select().from(drivers).where(eq(drivers.currentStatus, 'AVAILABLE')).limit(1);
    await db.insert(deliveries).values({
      orderId: createdOrder.id,
      driverId: availDriver[0]?.id || null,
      deliveryModel: deliveryModel || 'DIRECT',
      hubId: hubId ? Number(hubId) : null,
      pickupLocation: 'Farmer Regional Farm & Hub Gateway',
      dropoffLocation: `${deliveryAddress || 'Addis Ababa'}${deliveryWoreda ? `, ${deliveryWoreda}` : ''}`,
      status: 'ASSIGNED',
      estimatedArrival: 'Estimated Delivery in 24-48 Hours',
    });

    // Clear Cart
    await db.delete(cartItems).where(eq(cartItems.cartId, userCart[0].id));

    // Add Audit Log & Notification
    await db.insert(notifications).values({
      userId: currentUserId,
      title: `Order Placed: ${orderNum}`,
      message: `Your agricultural order for ${grandTotal.toLocaleString()} ETB was placed and confirmed.`,
      type: 'ORDER',
      linkUrl: '/buyer/orders',
    });

    res.json({ success: true, order: createdOrder, transactionRef: txRef });
  } catch (error: any) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const { role } = req.query;
    let orderList: any[] = [];

    if (role === 'FARMER') {
      // Get orders where this user is seller
      const sellerItems = await db.select().from(orderItems).where(eq(orderItems.sellerId, currentUserId));
      const orderIds = Array.from(new Set(sellerItems.map((si) => si.orderId)));
      if (orderIds.length) {
        orderList = await db.select().from(orders).orderBy(desc(orders.id));
        orderList = orderList.filter((o) => orderIds.includes(o.id));
      }
    } else if (role === 'BUYER' || role === 'BUSINESS_BUYER') {
      orderList = await db.select().from(orders).where(eq(orders.buyerId, currentUserId)).orderBy(desc(orders.id));
    } else {
      orderList = await db.select().from(orders).orderBy(desc(orders.id));
    }

    // Hydrate buyer name & items
    const hydrated = await Promise.all(
      orderList.map(async (ord) => {
        const b = await db.select().from(users).where(eq(users.id, ord.buyerId)).limit(1);
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, ord.id));
        const del = await db.select().from(deliveries).where(eq(deliveries.orderId, ord.id)).limit(1);
        return {
          ...ord,
          buyerName: b[0]?.fullName || 'Buyer',
          items,
          delivery: del[0] || null,
        };
      })
    );

    res.json(hydrated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const ord = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!ord.length) return res.status(404).json({ error: 'Order not found' });

    const buyer = await db.select().from(users).where(eq(users.id, ord[0].buyerId)).limit(1);
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
    const del = await db.select().from(deliveries).where(eq(deliveries.orderId, orderId)).limit(1);
    const pay = await db.select().from(payments).where(eq(payments.orderId, orderId)).limit(1);

    let driverData: any = null;
    if (del[0]?.driverId) {
      const drv = await db.select().from(drivers).where(eq(drivers.id, del[0].driverId)).limit(1);
      driverData = drv[0] || null;
    }

    res.json({
      ...ord[0],
      buyer: buyer[0] || null,
      items,
      delivery: del[0] ? { ...del[0], driver: driverData } : null,
      payment: pay[0] || null,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status, notes } = req.body;

    const updated = await db
      .update(orders)
      .set({ orderStatus: status, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();

    await db.insert(orderStatusHistory).values({
      orderId,
      status,
      notes: notes || `Status updated to ${status}`,
      actorId: currentUserId,
    });

    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 8. LOGISTICS, HUBS & DRIVERS
// ==========================================
app.get('/api/hubs', async (req, res) => {
  try {
    const allHubs = await db.select().from(hubs).orderBy(hubs.id);
    res.json(allHubs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/drivers', async (req, res) => {
  try {
    const allDrivers = await db.select().from(drivers).orderBy(drivers.id);
    res.json(allDrivers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/logistics/deliveries', async (req, res) => {
  try {
    const allDel = await db.select().from(deliveries).orderBy(desc(deliveries.id));
    const hydrated = await Promise.all(
      allDel.map(async (d) => {
        const ord = await db.select().from(orders).where(eq(orders.id, d.orderId)).limit(1);
        const drv = d.driverId ? await db.select().from(drivers).where(eq(drivers.id, d.driverId)).limit(1) : [];
        const hb = d.hubId ? await db.select().from(hubs).where(eq(hubs.id, d.hubId)).limit(1) : [];
        return {
          ...d,
          orderNumber: ord[0]?.orderNumber || `ORD-${d.orderId}`,
          orderAmount: ord[0]?.grandTotalEtb || 0,
          driverName: drv[0]?.fullName || 'Unassigned',
          driverPhone: drv[0]?.phone || '',
          vehiclePlate: drv[0]?.vehiclePlateNumber || '',
          hubName: hb[0]?.name || null,
        };
      })
    );

    res.json(hydrated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/logistics/deliveries/:id/status', async (req, res) => {
  try {
    const delId = Number(req.params.id);
    const { status, currentLat, currentLng, proofOfDeliveryUrl, proofNotes } = req.body;

    const updated = await db
      .update(deliveries)
      .set({
        status,
        currentLat: currentLat ? Number(currentLat) : undefined,
        currentLng: currentLng ? Number(currentLng) : undefined,
        proofOfDeliveryUrl: proofOfDeliveryUrl || undefined,
        proofNotes: proofNotes || undefined,
        actualDeliveredAt: status === 'DELIVERED' ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(deliveries.id, delId))
      .returning();

    // If delivered, update associated order
    if (status === 'DELIVERED' && updated[0]?.orderId) {
      await db
        .update(orders)
        .set({ orderStatus: 'DELIVERED', actualDeliveryDate: new Date().toISOString().split('T')[0] })
        .where(eq(orders.id, updated[0].orderId));
    }

    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 9. FARMER FINANCING PORTAL
// ==========================================
app.get('/api/finance/applications', async (req, res) => {
  try {
    const apps = await db
      .select({
        id: financeApplications.id,
        farmerId: financeApplications.farmerId,
        institutionId: financeApplications.institutionId,
        loanType: financeApplications.loanType,
        amountRequestedEtb: financeApplications.amountRequestedEtb,
        purpose: financeApplications.purpose,
        farmId: financeApplications.farmId,
        targetCrop: financeApplications.targetCrop,
        expectedYieldTons: financeApplications.expectedYieldTons,
        expectedRevenueEtb: financeApplications.expectedRevenueEtb,
        repaymentPeriodMonths: financeApplications.repaymentPeriodMonths,
        status: financeApplications.status,
        approvedAmountEtb: financeApplications.approvedAmountEtb,
        interestRatePercent: financeApplications.interestRatePercent,
        reviewNotes: financeApplications.reviewNotes,
        createdAt: financeApplications.createdAt,
        farmerName: users.fullName,
        farmerPhone: users.phone,
        farmerRating: farmerProfiles.rating,
        farmName: farmerProfiles.farmName,
      })
      .from(financeApplications)
      .leftJoin(users, eq(financeApplications.farmerId, users.id))
      .leftJoin(farmerProfiles, eq(users.id, farmerProfiles.userId))
      .orderBy(desc(financeApplications.id));

    res.json(apps);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/finance/applications', async (req, res) => {
  try {
    const { loanType, amountRequestedEtb, purpose, farmId, targetCrop, expectedYieldTons, expectedRevenueEtb, repaymentPeriodMonths } = req.body;

    const newApp = await db
      .insert(financeApplications)
      .values({
        farmerId: currentUserId,
        loanType: loanType || 'INPUT_FINANCING',
        amountRequestedEtb: Number(amountRequestedEtb),
        purpose: purpose || 'AgriLink Verified Farm Expansion',
        farmId: farmId ? Number(farmId) : null,
        targetCrop: targetCrop || 'Commercial Horticulture',
        expectedYieldTons: Number(expectedYieldTons) || 10,
        expectedRevenueEtb: Number(expectedRevenueEtb) || 500000,
        repaymentPeriodMonths: Number(repaymentPeriodMonths) || 12,
        status: 'SUBMITTED',
      })
      .returning();

    await db.insert(notifications).values({
      userId: currentUserId,
      title: 'Loan Application Submitted',
      message: `Your application for ${Number(amountRequestedEtb).toLocaleString()} ETB is now under bank credit appraisal.`,
      type: 'FINANCE',
      linkUrl: '/farmer/finance',
    });

    res.json(newApp[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/finance/applications/:id/decision', async (req, res) => {
  try {
    const appId = Number(req.params.id);
    const { status, approvedAmountEtb, interestRatePercent, reviewNotes } = req.body;

    const updated = await db
      .update(financeApplications)
      .set({
        status,
        approvedAmountEtb: approvedAmountEtb ? Number(approvedAmountEtb) : undefined,
        interestRatePercent: interestRatePercent ? Number(interestRatePercent) : undefined,
        reviewNotes: reviewNotes || undefined,
        disbursedAt: status === 'APPROVED' ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(financeApplications.id, appId))
      .returning();

    if (updated[0]) {
      await db.insert(notifications).values({
        userId: updated[0].farmerId,
        title: `Loan ${status}: ${updated[0].approvedAmountEtb || updated[0].amountRequestedEtb} ETB`,
        message: reviewNotes || `Your loan application has been updated to ${status}.`,
        type: 'FINANCE',
        linkUrl: '/farmer/finance',
      });
    }

    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 10. B2B BULK QUOTE REQUESTS
// ==========================================
app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await db
      .select({
        id: quoteRequests.id,
        businessBuyerId: quoteRequests.businessBuyerId,
        sellerId: quoteRequests.sellerId,
        productId: quoteRequests.productId,
        productName: quoteRequests.productName,
        requestedQuantity: quoteRequests.requestedQuantity,
        unit: quoteRequests.unit,
        requestedGrade: quoteRequests.requestedGrade,
        targetPriceEtb: quoteRequests.targetPriceEtb,
        deliveryDate: quoteRequests.deliveryDate,
        deliveryLocation: quoteRequests.deliveryLocation,
        status: quoteRequests.status,
        offerPriceEtb: quoteRequests.offerPriceEtb,
        offerNotes: quoteRequests.offerNotes,
        createdAt: quoteRequests.createdAt,
        buyerName: users.fullName,
        buyerOrganization: users.organizationName,
      })
      .from(quoteRequests)
      .leftJoin(users, eq(quoteRequests.businessBuyerId, users.id))
      .orderBy(desc(quoteRequests.id));

    res.json(quotes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/quotes', async (req, res) => {
  try {
    const { productId, productName, requestedQuantity, unit, requestedGrade, targetPriceEtb, deliveryDate, deliveryLocation, sellerId } = req.body;

    const newQuote = await db
      .insert(quoteRequests)
      .values({
        businessBuyerId: currentUserId,
        sellerId: sellerId ? Number(sellerId) : null,
        productId: productId ? Number(productId) : null,
        productName: productName || 'Commercial Produce Batch',
        requestedQuantity: Number(requestedQuantity) || 10,
        unit: unit || 'TON',
        requestedGrade: requestedGrade || 'GRADE_1_EXPORT',
        targetPriceEtb: targetPriceEtb ? Number(targetPriceEtb) : null,
        deliveryDate: deliveryDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        deliveryLocation: deliveryLocation || 'Addis Ababa Central Procurement',
        status: 'PENDING',
      })
      .returning();

    res.json(newQuote[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/quotes/:id', async (req, res) => {
  try {
    const quoteId = Number(req.params.id);
    const { status, offerPriceEtb, offerNotes } = req.body;

    const updated = await db
      .update(quoteRequests)
      .set({
        status,
        offerPriceEtb: offerPriceEtb ? Number(offerPriceEtb) : undefined,
        offerNotes: offerNotes || undefined,
      })
      .where(eq(quoteRequests.id, quoteId))
      .returning();

    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 11. REVIEWS & NOTIFICATIONS
// ==========================================
app.get('/api/notifications', async (req, res) => {
  try {
    const notifs = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, currentUserId))
      .orderBy(desc(notifications.id));
    res.json(notifs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const notifId = Number(req.params.id);
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notifId));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { orderId, targetType, targetId, rating, title, comment } = req.body;
    const newRev = await db
      .insert(reviews)
      .values({
        orderId: Number(orderId) || 1,
        reviewerId: currentUserId,
        targetType: targetType || 'PRODUCT',
        targetId: Number(targetId),
        rating: Number(rating) || 5,
        title,
        comment,
        isVerifiedPurchase: true,
      })
      .returning();

    res.json(newRev[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 12. ADMIN & OWNER METRICS, ORDERS & PAYMENTS
// ==========================================
app.get('/api/admin/overview', async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    const allOrders = await db.select().from(orders);
    const allProducts = await db.select().from(products);
    const allDeliveries = await db.select().from(deliveries);
    const allLoans = await db.select().from(financeApplications);
    const allPayments = await db.select().from(payments);

    const gmv = allOrders.reduce((sum, o) => sum + (o.grandTotalEtb || 0), 0);
    const totalPaidAmount = allPayments
      .filter((p) => p.status === 'PAID' || p.status === 'ESCROW_HELD' || p.status === 'RELEASED_TO_FARMER')
      .reduce((sum, p) => sum + (p.amountEtb || 0), 0);
    const totalEscrowHeld = allPayments
      .filter((p) => p.status === 'ESCROW_HELD' || p.status === 'PAID')
      .reduce((sum, p) => sum + (p.amountEtb || 0), 0);
    const totalTonsInTransit = allDeliveries
      .filter((d) => d.status === 'IN_TRANSIT' || d.status === 'ASSIGNED')
      .length * 4.5;

    res.json({
      totalUsers: allUsers.length,
      farmersCount: allUsers.filter((u) => u.role === 'FARMER').length,
      buyersCount: allUsers.filter((u) => u.role === 'BUYER' || u.role === 'BUSINESS_BUYER').length,
      driversCount: allUsers.filter((u) => u.role === 'DRIVER').length,
      suppliersCount: allUsers.filter((u) => u.role === 'INPUT_SUPPLIER').length,
      activeListingsCount: allProducts.filter((p) => p.status === 'ACTIVE').length,
      totalOrdersCount: allOrders.length,
      gmvEtb: gmv,
      totalPaidAmountEtb: totalPaidAmount,
      totalEscrowHeldEtb: totalEscrowHeld,
      platformRevenueEtb: Math.round(gmv * 0.02),
      activeDeliveriesCount: allDeliveries.filter((d) => d.status === 'IN_TRANSIT').length,
      totalTonsInTransit,
      financeDisbursedEtb: allLoans
        .filter((l) => l.status === 'APPROVED' || l.status === 'DISBURSED')
        .reduce((sum, l) => sum + (l.approvedAmountEtb || l.amountRequestedEtb), 0),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Comprehensive Owner / Admin Orders Query with Buyer, Items, Delivery & Payment
app.get('/api/admin/orders', async (req, res) => {
  try {
    const allOrdersList = await db.select().from(orders).orderBy(desc(orders.id));
    const allUsersList = await db.select().from(users);
    const allPaymentsList = await db.select().from(payments);
    const allDeliveriesList = await db.select().from(deliveries);
    const allDriversList = await db.select().from(drivers);
    const allOrderItemsList = await db.select().from(orderItems);

    const userMap = new Map(allUsersList.map((u) => [u.id, u]));
    const driverMap = new Map(allDriversList.map((d) => [d.id, d]));

    const enrichedOrders = allOrdersList.map((ord) => {
      const buyer = userMap.get(ord.buyerId);
      const items = allOrderItemsList.filter((it) => it.orderId === ord.id);
      const pay = allPaymentsList.find((p) => p.orderId === ord.id);
      const del = allDeliveriesList.find((d) => d.orderId === ord.id);
      const driver = del?.driverId ? driverMap.get(del.driverId) : null;

      return {
        ...ord,
        buyerName: buyer?.fullName || ord.deliveryContactName || 'Customer',
        buyer: buyer || null,
        items,
        payment: pay
          ? {
              ...pay,
              userName: userMap.get(pay.userId)?.fullName || buyer?.fullName,
              userPhone: userMap.get(pay.userId)?.phone || buyer?.phone,
            }
          : null,
        delivery: del
          ? {
              ...del,
              driverName: driver?.fullName,
              driverPhone: driver?.phone,
              vehiclePlate: driver?.vehiclePlateNumber,
            }
          : null,
      };
    });

    res.json(enrichedOrders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update Order Payment Status (e.g., Mark as Paid, Release Escrow, Refund)
app.patch('/api/admin/orders/:id/payment', async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { paymentStatus, provider, transactionRef, notes } = req.body;

    const ord = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!ord.length) return res.status(404).json({ error: 'Order not found' });

    // Update order payment status
    const updatedOrder = await db
      .update(orders)
      .set({
        paymentStatus: paymentStatus || ord[0].paymentStatus,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    // Check if payment row exists, update or create
    const existingPay = await db.select().from(payments).where(eq(payments.orderId, orderId)).limit(1);
    if (existingPay.length) {
      await db
        .update(payments)
        .set({
          status: paymentStatus || existingPay[0].status,
          provider: provider || existingPay[0].provider,
          transactionRef: transactionRef || existingPay[0].transactionRef,
          paidAt: paymentStatus === 'PAID' || paymentStatus === 'ESCROW_HELD' ? new Date() : existingPay[0].paidAt,
        })
        .where(eq(payments.id, existingPay[0].id));
    } else {
      await db.insert(payments).values({
        orderId,
        userId: ord[0].buyerId,
        amountEtb: ord[0].grandTotalEtb,
        currency: 'ETB',
        provider: provider || 'TELEBIRR',
        transactionRef: transactionRef || `TX-ADMIN-${Date.now()}`,
        status: paymentStatus || 'PAID',
        paidAt: new Date(),
      });
    }

    // Add notification to buyer
    await db.insert(notifications).values({
      userId: ord[0].buyerId,
      title: `Payment Updated: ${ord[0].orderNumber}`,
      message: `Your payment status is now marked as ${paymentStatus}. Notes: ${notes || 'Verified by Admin'}`,
      type: 'PAYMENT',
      linkUrl: '/buyer/orders',
    });

    res.json({ success: true, order: updatedOrder[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update Order Dispatch / Fulfillment
app.patch('/api/admin/orders/:id/dispatch', async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { orderStatus, driverId, hubId, notes } = req.body;

    const updatedOrder = await db
      .update(orders)
      .set({
        orderStatus: orderStatus || undefined,
        hubId: hubId ? Number(hubId) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    if (driverId !== undefined) {
      const existingDel = await db.select().from(deliveries).where(eq(deliveries.orderId, orderId)).limit(1);
      if (existingDel.length) {
        await db
          .update(deliveries)
          .set({
            driverId: driverId ? Number(driverId) : null,
            status: orderStatus === 'IN_TRANSIT' ? 'IN_TRANSIT' : orderStatus === 'DELIVERED' ? 'DELIVERED' : 'ASSIGNED',
            updatedAt: new Date(),
          })
          .where(eq(deliveries.id, existingDel[0].id));
      }
    }

    await db.insert(orderStatusHistory).values({
      orderId,
      status: orderStatus || 'DISPATCH_UPDATED',
      notes: notes || 'Dispatched by Owner/Admin',
      actorId: currentUserId,
    });

    res.json({ success: true, order: updatedOrder[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Full Payment & Escrow Transactions Ledger
app.get('/api/admin/payments', async (req, res) => {
  try {
    const allPay = await db.select().from(payments).orderBy(desc(payments.id));
    const allOrdersList = await db.select().from(orders);
    const allUsersList = await db.select().from(users);

    const orderMap = new Map(allOrdersList.map((o) => [o.id, o]));
    const userMap = new Map(allUsersList.map((u) => [u.id, u]));

    const enriched = allPay.map((p) => {
      const ord = orderMap.get(p.orderId);
      const usr = userMap.get(p.userId);
      return {
        ...p,
        orderNumber: ord?.orderNumber || `ORD-${p.orderId}`,
        deliveryAddress: ord?.deliveryAddress || 'Addis Ababa',
        userName: usr?.fullName || ord?.deliveryContactName || 'Customer',
        userPhone: usr?.phone || ord?.deliveryContactPhone || '',
        organizationName: usr?.organizationName || '',
      };
    });

    res.json(enriched);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 12.5. USSD SHORT CODE (*6112#) GATEWAY
// ==========================================
app.post('/api/ussd', async (req, res) => {
  try {
    const { sessionId, serviceCode, phoneNumber, text, lang = 'en' } = req.body;
    const isAmharic = lang === 'am';
    const isOromo = lang === 'om';
    const cleanText = (text || '').trim();
    const parts = cleanText ? cleanText.split('*') : [];

    let response = '';

    if (parts.length === 0 || cleanText === '') {
      // Main Menu
      if (isAmharic) {
        response = `CON ወደ አግሪሊንክ ኢትዮጵያ (*6112#) በደህና መጡ\n1. የገበያ ዋጋ መረጃ\n2. ምርት መሸጫ (ገዢ ይምረጡ: ፋብሪካ/ባለሀብት/ነጋዴ)\n3. የአዋሽ ባንክ ግብዓት ብድር\n4. ቴሌብር የሽያጭ ሂሳብ እና ማውጫ\n5. የአርሶ አደር ምዝገባ\n6. የደንበኞች አገልግሎት (0961123330)`;
      } else if (isOromo) {
        response = `CON Baga gara AgriLink Ethiopia (*6112#) dhuftan\n1. Gatii Gabaa Yeroo Ammaa\n2. Oomisha Gurguruu (Fakkeenya: Warshaa/Investeroota/Bittaa)\n3. Liqii Qonnaa Baankii Hawaash\n4. Herrega Telebirr fi Baasii\n5. Galmee Qonnaan Bulaa\n6. Tajaajila Maamiltootaa (0961123330)`;
      } else {
        response = `CON Welcome to AgriLink Ethiopia (*6112#)\n1. Real-time Market Prices\n2. Sell Produce (Select Buyer: Processor/Investor/Buyer)\n3. Awash Input Credit Financing\n4. Telebirr Escrow Balance & Payout\n5. Farmer Registration & Classification\n6. Support Desk (0961123330)`;
      }
    } else {
      const topChoice = parts[0];

      if (topChoice === '1') {
        // Price check
        if (parts.length === 1) {
          response = isAmharic
            ? `CON የሰብል አይነት ይምረጡ:\n1. ሮማ ቲማቲም (አዳማ)\n2. ቀይ ሽንኩርት (ሞጆ)\n3. ማኛ ጤፍ (ደብረ ዘይት)\n4. ሃስ አቮካዶ (ወንጂ)\n5. የሻሸመኔ ድንችና ነጭ ሽንኩርት`
            : `CON Select Crop for Live Spot Price:\n1. Roma Tomatoes (Adama Hub)\n2. Red Onions (Mojo Hub)\n3. Teff Magna (Debre Zeit Hub)\n4. Export Hass Avocados (Wonji)\n5. Fresh Highland Potatoes & Garlic`;
        } else {
          const cropChoice = parts[1];
          const cropPrices: Record<string, { en: string; am: string }> = {
            '1': { en: 'Roma Tomatoes: ETB 4,800/Quintal (+6.2% high demand in Addis)', am: 'ሮማ ቲማቲም: 4,800 ብር በኩንታል (በአዲስ አበባ ከፍተኛ ፍላጎት)' },
            '2': { en: 'Red Onions: ETB 6,400/Quintal (Stable cold-chain supply)', am: 'ቀይ ሽንኩርት: 6,400 ብር በኩንታል (በቂ ክምችት)' },
            '3': { en: 'Teff Magna Grade 1: ETB 12,200/Quintal (Export grade certified)', am: 'ማኛ ጤፍ አንደኛ ደረጃ: 12,200 ብር በኩንታል' },
            '4': { en: 'Export Hass Avocado: ETB 75/KG (Brix 12% verified)', am: 'ሃስ አቮካዶ: 75 ብር በኪሎ (ኤክስፖርት ደረጃ)' },
            '5': { en: 'Highland Potatoes: ETB 48/KG (Chencha garlic & fresh tubers)', am: 'የሻሸመኔ ድንች: 48 ብር በኪሎ (የቼንቻ ነጭ ሽንኩርትና ድንች)' },
          };
          const p = cropPrices[cropChoice] || cropPrices['1'];
          response = isAmharic
            ? `END ${p.am}\nገበያውን ለመሸጥ *6112*2# ይደውሉ። የማረጋገጫ SMS ወደ ${phoneNumber} ደርሶዎታል።`
            : `END ${p.en}\nTo list harvest directly to verified buyers, dial *6112*2#. SMS details sent to ${phoneNumber}.`;
        }
      } else if (topChoice === '2') {
        // Sell Produce with Buyer Channel Classification
        if (parts.length === 1) {
          response = isAmharic
            ? `CON ለመሸጥ የሚፈልጉትን ሰብል ይምረጡ:\n1. ሮማ ቲማቲም\n2. ቀይ ሽንኩርት\n3. ማኛ ጤፍ\n4. ሃስ አቮካዶ\n5. ስንዴ ወይም የዘይት እህሎች`
            : `CON Select Produce to Sell:\n1. Roma Tomatoes\n2. Red Onions\n3. Teff Magna\n4. Hass Avocados\n5. Wheat or Oilseeds`;
        } else if (parts.length === 2) {
          response = isAmharic
            ? `CON ምርቱን ለማን መሸጥ ይፈልጋሉ? (ገዢ ይምረጡ):\n1. ለምግብ ፋብሪካዎችና ወፍጮዎች (Food Processors)\n2. ለግብርና ባለሀብቶችና ላኪዎች (Agri-Investors/Exporters)\n3. ለሱፐርማርኬቶችና ጅምላ ነጋዴዎች (Commercial Buyers)\n4. ለሁሉም የተረጋገጡ ገዢዎች (All Channels)`
            : `CON Select Target Buyer Channel:\n1. Food Processors & Industrial Mills\n2. Agri-Investors & Exporters (Contract/Outgrower)\n3. Supermarkets & Retail Wholesalers\n4. Open Market (All Verified Buyers)`;
        } else if (parts.length === 3) {
          response = isAmharic
            ? `CON ያለዎትን የምርት መጠን ያስገቡ (በኩንታል ወይም ኪሎ):`
            : `CON Enter Available Harvest Quantity (e.g. 50 Quintals / 2000 KG):`;
        } else if (parts.length === 4) {
          response = isAmharic
            ? `CON የሚፈልጉትን ዋጋ ያስገቡ (በብር):`
            : `CON Enter Target Price per Unit (in ETB):`;
        } else {
          // Finalize listing
          const cropMap: Record<string, string> = { '1': 'Roma Tomatoes', '2': 'Red Onions', '3': 'Teff Magna', '4': 'Hass Avocados', '5': 'Wheat / Oilseeds' };
          const buyerMap: Record<string, string> = { '1': 'PROCESSOR', '2': 'INVESTOR', '3': 'BUYER', '4': 'ALL' };
          const buyerNameMap: Record<string, string> = {
            '1': 'Food Processors & Mills',
            '2': 'Agri-Investors & Exporters',
            '3': 'Supermarkets & Retailers',
            '4': 'All Verified Buyers',
          };

          const selectedCrop = cropMap[parts[1]] || 'Farm Produce';
          const selectedBuyerType = buyerMap[parts[2]] || 'ALL';
          const buyerName = buyerNameMap[parts[2]] || 'Verified Buyers';
          const qty = Number(parts[3]) || 50;
          const price = Number(parts[4]) || 4500;

          // Auto persist to DB as an active listing!
          try {
            await db.insert(products).values({
              farmerId: currentUserId || 1,
              categoryId: parts[1] === '4' ? 2 : parts[1] === '3' ? 3 : 1,
              name: `${selectedCrop} (USSD Lot)`,
              variety: 'USSD Listed Grade 1',
              description: `Farmer listing via USSD *6112# targeting ${buyerName}. Direct from verified grower phone ${phoneNumber}.`,
              grade: selectedBuyerType === 'PROCESSOR' ? 'PROCESSING_GRADE' : selectedBuyerType === 'INVESTOR' ? 'GRADE_1_EXPORT' : 'GRADE_1_LOCAL',
              pricePerUnitEtb: price,
              unit: parts[1] === '4' ? 'KG' : 'QUINTAL',
              availableQuantity: qty,
              minOrderQuantity: 5,
              harvestDate: new Date().toISOString().split('T')[0],
              expectedAvailability: 'Immediate Dispatch',
              farmLocation: 'Oromia / Rift Valley Hub',
              region: 'Oromia',
              images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'],
              lotBatchNumber: `LOT-USSD-${Math.floor(100000 + Math.random() * 900000)}`,
              qualityScore: 97,
              isOrganic: false,
              status: 'ACTIVE',
              shelfLifeDays: 14,
            });
          } catch (e) {
            console.error('USSD db product insert err:', e);
          }

          response = isAmharic
            ? `END እናመሰግናለን! ምርትዎ በተሳካ ሁኔታ ለ[${buyerName}] ቀርቧል። የሎት ቁጥር እና የማረጋገጫ SMS ወደ ${phoneNumber} ተልኳል።`
            : `END Success! ${qty} units of ${selectedCrop} listed targeting ${buyerName} at ETB ${price}/unit. SMS confirmation & driver dispatch code sent to ${phoneNumber}.`;
        }
      } else if (topChoice === '3') {
        // Awash Credit
        if (parts.length === 1) {
          response = isAmharic
            ? `CON የአዋሽ ባንክ የግብዓት ብድር:\nየእርሻዎን ስፋት ይምረጡ:\n1. ከ 2 ሄክታር በታች (እስከ 50,000 ብር)\n2. 2 - 5 ሄክታር (እስከ 150,000 ብር)\n3. ከ 5 ሄክታር በላይ (እስከ 400,000 ብር)`
            : `CON Awash Bank Agri-Credit:\nSelect Farm Acreage:\n1. Under 2 Hectares (Up to ETB 50,000)\n2. 2 - 5 Hectares (Up to ETB 150,000)\n3. 5+ Hectares (Up to ETB 400,000)`;
        } else {
          const loanAmounts: Record<string, string> = { '1': '50,000', '2': '150,000', '3': '350,000' };
          const amt = loanAmounts[parts[1]] || '75,000';
          response = isAmharic
            ? `END እንኳን ደስ አለዎት! የአዋሽ ባንክ ${amt} ብር የግብዓት ብድር ፈቃድ አግኝተዋል። የዲጂታል ኩፖን ኮድ ወደ ${phoneNumber} በSMS ተልኳል።`
            : `END Pre-Approved! Awash Bank has pre-approved your ETB ${amt} input credit voucher for certified seeds and fertilizer. Voucher code sent to ${phoneNumber}.`;
        }
      } else if (topChoice === '4') {
        // Telebirr Escrow
        response = isAmharic
          ? `END የአግሪሊንክ ቴሌብር የሽያጭ ሂሳብዎ 48,650.00 ብር ነው። 2 በመጓጓዝ ላይ ያሉ ሽያጮች አሉ። ገንዘብ ወደ ${phoneNumber || '0961123330'} ለማስተላለፍ በSMS የተላከውን ሚስጥር ቁጥር ይጠቀሙ።`
          : `END Your AgriLink Telebirr Escrow balance is ETB 48,650.00 (2 lots in transit). Instant payout initiated to registered phone ${phoneNumber || '0961123330'}.`;
      } else if (topChoice === '5') {
        // Farmer Registration
        if (parts.length === 1) {
          response = isAmharic
            ? `CON የአርሶ አደር ምዝገባ:\nሙሉ ስምዎን ያስገቡ:`
            : `CON Farmer Registration:\nEnter Full Name:`;
        } else if (parts.length === 2) {
          response = isAmharic
            ? `CON ክልል ይምረጡ:\n1. ኦሮሚያ (Oromia)\n2. አማራ (Amhara)\n3. ሲዳማ (Sidama)\n4. ደቡብ (SNNPR)`
            : `CON Select Region:\n1. Oromia\n2. Amhara\n3. Sidama\n4. SNNPR`;
        } else if (parts.length === 3) {
          response = isAmharic
            ? `CON ዋነኛ ገዢዎ ማን እንዲሆን ይፈልጋሉ?:\n1. የምግብ ፋብሪካዎች (Processors)\n2. የግብርና ባለሀብቶች (Investors)\n3. ሱፐርማርኬቶች (Supermarkets)\n4. ሁሉም (All)`
            : `CON Primary Target Buyer Focus:\n1. Food Processors\n2. Agri-Investors\n3. Supermarkets\n4. All Verified Buyers`;
        } else {
          const farmerName = parts[1] || 'Farmer';
          response = isAmharic
            ? `END እናመሰግናለን ${farmerName}! የአርሶ አደር አካውንትዎ ተከፍቷል። በ*6112# በማንኛውም ጊዜ ምርትዎን መሸጥ ይችላሉ።`
            : `END Thank you ${farmerName}! Your AgriLink Farmer Profile is verified. You can dial *6112# anytime from your phone ${phoneNumber}.`;
        }
      } else if (topChoice === '6') {
        // Support
        response = isAmharic
          ? `END አግሪሊንክ ኢትዮጵያ የደንበኞች አገልግሎት:\nስልክ: 0961123330\nኢሜይል: bamlaksisay270@gmail.com\nአድራሻ: አዲስ አበባ፣ ኢትዮጵያ`
          : `END AgriLink Support & Operations Desk:\nPhone: 0961123330\nEmail: bamlaksisay270@gmail.com\nAddis Ababa Central Logistics Hub`;
      } else {
        response = isAmharic
          ? `END የተሳሳተ ምርጫ። እባክዎ *6112# እንደገና ይደውሉ።`
          : `END Invalid selection. Please redial *6112# to try again.`;
      }
    }

    res.json({ response, message: response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 13. VITE MIDDLEWARE & STATIC SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriLink Platform Server running on http://localhost:${PORT}`);
  });
}

startServer();
