import { db } from './index.ts';
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
  notifications,
  messages,
  auditLogs,
} from './schema.ts';
import { sql } from 'drizzle-orm';

export async function seedDatabase(force = false) {
  try {
    // Check if categories or users already exist
    const existingCats = await db.select().from(productCategories).limit(1);
    if (existingCats.length > 0 && !force) {
      console.log('Database already has seeded data. Skipping initial seeding.');
      return;
    }

    console.log('Seeding AgriLink PostgreSQL database with authentic agricultural data...');

    // If force re-seeding, clean tables in proper reverse foreign key dependency order
    if (force || existingCats.length > 0) {
      await db.delete(auditLogs);
      await db.delete(messages);
      await db.delete(notifications);
      await db.delete(reviews);
      await db.delete(quoteRequests);
      await db.delete(financeApplications);
      await db.delete(qualityInspections);
      await db.delete(deliveries);
      await db.delete(hubMovements);
      await db.delete(payments);
      await db.delete(orderStatusHistory);
      await db.delete(orderItems);
      await db.delete(orders);
      await db.delete(cartItems);
      await db.delete(carts);
      await db.delete(inputProducts);
      await db.delete(products);
      await db.delete(farmFields);
      await db.delete(farms);
      await db.delete(drivers);
      await db.delete(inputSuppliers);
      await db.delete(buyerProfiles);
      await db.delete(farmerProfiles);
      await db.delete(users);
      await db.delete(hubs);
      await db.delete(inputCategories);
      await db.delete(productCategories);
    }

    // 1. Seed Product Categories
    const categoriesData = await db.insert(productCategories).values([
      {
        name: 'Fresh Vegetables & Tomatoes',
        slug: 'vegetables',
        description: 'Greenhouse Roma tomatoes, highland beefsteak tomatoes, onions, sweet bell peppers, crisp cabbages, and carrots sourced directly from smallholders and cooperatives.',
        icon: 'Carrot',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Teff & Staple Grains',
        slug: 'grains',
        description: 'Magna super-white teff, sergegna teff, high-iron red teff, durum milling wheat, and highland hybrid maize direct from union storages.',
        icon: 'Wheat',
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Fresh Tubers & Root Crops',
        slug: 'tubers-roots',
        description: 'Shashemene highland potatoes (Jalene/Gudene), Chencha organic garlic bulbs, sweet potatoes, and highland ginger roots.',
        icon: 'Carrot',
        imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Pulses & Legumes',
        slug: 'pulses-oilseeds',
        description: 'Adet export red split lentils, Gondar Kabuli chickpeas, and highland horse beans harvested by cooperative outgrowers.',
        icon: 'Boxes',
        imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Highland Tree Fruits',
        slug: 'fruits',
        description: 'Export-grade Hass avocados, sweet Rift Valley papayas, highland strawberries, and fresh citrus.',
        icon: 'Apple',
        imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Fresh Herbs & Peppers',
        slug: 'herbs-peppers',
        description: 'Fresh Mareko Fana hot peppers, green chili peppers, rosemary, basil, and coriander from irrigated valley farms.',
        icon: 'Sprout',
        imageUrl: 'https://images.unsplash.com/photo-1588879460618-924b172a6b29?auto=format&fit=crop&w=800&q=80',
      },
    ]).returning();

    // 2. Seed Input Categories
    const inputCategoriesData = await db.insert(inputCategories).values([
      { name: 'Certified Hybrid Seeds', slug: 'seeds', icon: 'Sprout' },
      { name: 'Fertilizers & Soil Health', slug: 'fertilizers', icon: 'FlaskConical' },
      { name: 'Crop Protection & Bio-control', slug: 'crop-protection', icon: 'ShieldCheck' },
      { name: 'Irrigation & Solar Systems', slug: 'irrigation', icon: 'Droplets' },
      { name: 'Farm Tools & Machinery', slug: 'tools', icon: 'Wrench' },
    ]).returning();

    // 3. Seed Logistics Hubs
    const hubsData = await db.insert(hubs).values([
      {
        name: 'Addis Central Cross-Dock Hub',
        code: 'HUB-ADD-01',
        region: 'Addis Ababa',
        city: 'Addis Ababa (Kality Terminal)',
        address: 'Kality Freight Logistics Zone, Ring Road Corridor',
        latitude: 8.9123,
        longitude: 38.7612,
        capacityTons: 600,
        currentStorageTons: 185,
        managerName: 'Tariku Bekele',
        contactPhone: '+251 91 144 8822',
        coldStorageAvailable: true,
      },
      {
        name: 'Adama Fast-Transit Hub',
        code: 'HUB-ADA-02',
        region: 'Oromia',
        city: 'Adama / Nazret',
        address: 'Expressway Gateway, Adama Industrial Zone',
        latitude: 8.5400,
        longitude: 39.2700,
        capacityTons: 450,
        currentStorageTons: 92,
        managerName: 'Kenenisa Gemechu',
        contactPhone: '+251 92 334 1199',
        coldStorageAvailable: true,
      },
      {
        name: 'Hawassa Fresh Produce Hub',
        code: 'HUB-HAW-03',
        region: 'Sidama',
        city: 'Hawassa',
        address: 'Lake Hawassa Agro-Corridor, Plot 44',
        latitude: 7.0504,
        longitude: 38.4955,
        capacityTons: 350,
        currentStorageTons: 74,
        managerName: 'Mulugeta Tadesse',
        contactPhone: '+251 93 555 4321',
        coldStorageAvailable: true,
      },
      {
        name: 'Bahir Dar Tana Hub',
        code: 'HUB-BDR-04',
        region: 'Amhara',
        city: 'Bahir Dar',
        address: 'Tana Logistics Port, Kebele 14',
        latitude: 11.5742,
        longitude: 37.3614,
        capacityTons: 300,
        currentStorageTons: 45,
        managerName: 'Abebech Worku',
        contactPhone: '+251 91 887 6655',
        coldStorageAvailable: false,
      },
    ]).returning();

    // 4. Seed Platform Users
    const seededUsers = await db.insert(users).values([
      // 0: Farmer 1
      {
        uid: 'user_farmer_bekele',
        email: 'bekele.tadesse@agrilink.et',
        fullName: 'Bekele Tadesse',
        phone: '+251 91 234 5678',
        role: 'FARMER',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        organizationName: 'Wonji Horizon Farms',
        region: 'Oromia',
        address: 'Wonji Gefersa, East Shewa Zone',
        isVerified: true,
      },
      // 1: Farmer 2
      {
        uid: 'user_farmer_almaz',
        email: 'almaz.desta@agrilink.et',
        fullName: 'Almaz Desta',
        phone: '+251 92 987 6543',
        role: 'FARMER',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        organizationName: 'Rift Valley Fresh Co-op',
        region: 'Oromia',
        address: 'Ziway Shore, Batu District',
        isVerified: true,
      },
      // 2: Individual Buyer
      {
        uid: 'user_buyer_yonas',
        email: 'yonas.alemu@gmail.com',
        fullName: 'Yonas Alemu',
        phone: '+251 91 445 6677',
        role: 'BUYER',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        organizationName: 'Bole Fresh Marts',
        region: 'Addis Ababa',
        address: 'Bole Medhanealem, House 842, Addis Ababa',
        isVerified: true,
      },
      // 3: Business Buyer (Supermarket/Hotel)
      {
        uid: 'user_business_sara',
        email: 'procurement@skylightaddis.et',
        fullName: 'Sara Kebede',
        phone: '+251 91 556 7788',
        role: 'BUSINESS_BUYER',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        organizationName: 'Ethiopian Skylight Hotels & Catering',
        region: 'Addis Ababa',
        address: 'Airport Road, Bole International Zone',
        isVerified: true,
      },
      // 4: Input Supplier
      {
        uid: 'user_supplier_tesfaye',
        email: 'info@ethioagroinputs.et',
        fullName: 'Dr. Tesfaye Wolde',
        phone: '+251 91 112 3344',
        role: 'INPUT_SUPPLIER',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        organizationName: 'EthioAgro Certified Seeds & Nutrition',
        region: 'Addis Ababa',
        address: 'Gotera Commercial Center, Block C',
        isVerified: true,
      },
      // 5: Driver
      {
        uid: 'user_driver_dawit',
        email: 'dawit.logistics@agrilink.et',
        fullName: 'Dawit Haile',
        phone: '+251 92 667 8899',
        role: 'DRIVER',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
        organizationName: 'AgriLink Express Fleet',
        region: 'Addis Ababa',
        address: 'Akaki Kality Subcity, Addis Ababa',
        isVerified: true,
      },
      // 6: Financial Institution
      {
        uid: 'user_finance_meron',
        email: 'agribusiness@awashbank.com',
        fullName: 'Meron Girma',
        phone: '+251 91 889 0011',
        role: 'FINANCIAL_INSTITUTION',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        organizationName: 'Awash Agribusiness & Development Bank',
        region: 'Addis Ababa',
        address: 'Ras Abebe Aregay Ave, Awash Towers',
        isVerified: true,
      },
      // 7: Hub Operator
      {
        uid: 'user_hub_tariku',
        email: 'tariku.hub@agrilink.et',
        fullName: 'Tariku Bekele',
        phone: '+251 91 144 8822',
        role: 'HUB_OPERATOR',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        organizationName: 'Addis Central Cross-Dock Hub',
        region: 'Addis Ababa',
        address: 'Kality Logistics Hub',
        isVerified: true,
      },
      // 8: Platform Admin
      {
        uid: 'user_admin_agrilink',
        email: 'admin@agrilink.et',
        fullName: 'AgriLink Operations Admin',
        phone: '+251 91 000 1122',
        role: 'PLATFORM_ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        organizationName: 'AgriLink HQ Addis Ababa',
        region: 'Addis Ababa',
        address: 'Kazanchis ICT Park, Addis Ababa',
        isVerified: true,
      },
    ]).returning();

    // 5. Seed Farmer Profiles & Digital Farms
    const farmer1 = seededUsers[0];
    const farmer2 = seededUsers[1];

    await db.insert(farmerProfiles).values([
      {
        userId: farmer1.id,
        farmName: 'Wonji Horizon Agro-Farm',
        region: 'Oromia',
        zone: 'East Shewa',
        woreda: 'Wonji Gefersa',
        totalAreaHectares: 14.5,
        primaryCrops: ['Roma Tomatoes', 'Hass Avocados', 'Red Onions', 'White Teff'],
        farmingExperienceYears: 12,
        nationalIdNumber: 'ET-ID-8849204',
        cooperativeMembership: 'Wonji Farmers Union (WFU-108)',
        bankAccountNumber: '1000284719284',
        bankName: 'Commercial Bank of Ethiopia',
        bio: 'Leading supplier of export-grade Hass avocados and greenhouse Roma tomatoes with drip irrigation and GlobalG.A.P certification.',
        rating: 4.95,
        completedOrdersCount: 142,
        totalProduceSoldTons: 86.4,
        isCertifiedOrganic: true,
      },
      {
        userId: farmer2.id,
        farmName: 'Rift Valley Lakeside Farms',
        region: 'Oromia',
        zone: 'East Shewa',
        woreda: 'Batu / Ziway',
        totalAreaHectares: 8.0,
        primaryCrops: ['Fresh Strawberries', 'Green Peppers', 'Cut Roses', 'Export Beans'],
        farmingExperienceYears: 8,
        nationalIdNumber: 'ET-ID-7729183',
        cooperativeMembership: 'Ziway Horticulture Cooperative',
        bankAccountNumber: '01320492817200',
        bankName: 'Awash Bank',
        bio: 'Specializing in hydroponic and cold-chain integrated berry, pepper and cut flower cultivation overlooking Lake Ziway.',
        rating: 4.88,
        completedOrdersCount: 96,
        totalProduceSoldTons: 42.1,
        isCertifiedOrganic: false,
      },
    ]);

    // 6. Seed Farms and Fields
    const farmsData = await db.insert(farms).values([
      {
        farmerId: farmer1.id,
        name: 'Wonji Horizon Main Estate',
        locationName: 'Wonji Gefersa Plot 12B',
        region: 'Oromia',
        latitude: 8.4521,
        longitude: 39.2942,
        sizeHectares: 14.5,
        soilType: 'Volcanic Sandy Loam',
        irrigationType: 'Drip & Awash River Canal',
        certifications: ['GlobalG.A.P', 'Ethiopian Organic Quality Seal', 'Traceable Origin #ET-WNJ-09'],
      },
      {
        farmerId: farmer2.id,
        name: 'Ziway Lakeside Horticulture Farm',
        locationName: 'Lake Ziway North Bank',
        region: 'Oromia',
        latitude: 7.9254,
        longitude: 38.7189,
        sizeHectares: 8.0,
        soilType: 'Lacustrine Alluvial Soil',
        irrigationType: 'Smart Drip & Greenhouse Mist',
        certifications: ['FairTrade Africa', 'Phytosanitary Export Seal'],
      },
    ]).returning();

    // Seed Farm Fields
    await db.insert(farmFields).values([
      {
        farmId: farmsData[0].id,
        fieldName: 'Sector Alpha - Roma Tomatoes Greenhouse',
        areaHectares: 3.5,
        currentCrop: 'Roma Tomato',
        variety: 'Ty-Shine Hybrid',
        plantingDate: '2026-05-15',
        expectedHarvestDate: '2026-09-01',
        status: 'HARVEST_READY',
        healthScore: 98,
        soilMoisturePercent: 72,
        notes: 'High brix content, uniform firmness, zero synthetic pesticides used.',
      },
      {
        farmId: farmsData[0].id,
        fieldName: 'Sector Beta - Hass Avocado Orchard',
        areaHectares: 6.0,
        currentCrop: 'Hass Avocado',
        variety: 'Export Hass Grafted',
        plantingDate: '2023-03-10',
        expectedHarvestDate: '2026-09-15',
        status: 'GROWING',
        healthScore: 94,
        soilMoisturePercent: 65,
        notes: 'Average dry matter 24.5%, ideal export oil content.',
      },
      {
        farmId: farmsData[0].id,
        fieldName: 'Sector Gamma - Magna Teff Parcel',
        areaHectares: 5.0,
        currentCrop: 'White Teff (Magna)',
        variety: 'Quncho DZ-Cr-387',
        plantingDate: '2026-06-20',
        expectedHarvestDate: '2026-10-30',
        status: 'GROWING',
        healthScore: 92,
        soilMoisturePercent: 58,
        notes: 'Pure white grain, high protein yield.',
      },
      {
        farmId: farmsData[1].id,
        fieldName: 'Greenhouse 1 - Sweet Strawberries',
        areaHectares: 2.0,
        currentCrop: 'Strawberries',
        variety: 'San Andreas Everbearing',
        plantingDate: '2026-04-10',
        expectedHarvestDate: '2026-08-28',
        status: 'HARVEST_READY',
        healthScore: 97,
        soilMoisturePercent: 80,
        notes: 'Pre-cooled on site, brix 11.5, daily harvest.',
      },
      {
        farmId: farmsData[1].id,
        fieldName: 'Greenhouse 2 - Export Cut Roses',
        areaHectares: 3.5,
        currentCrop: 'Red Roses',
        variety: 'Rhodos & Madam Red',
        plantingDate: '2025-09-01',
        expectedHarvestDate: '2026-08-25',
        status: 'HARVEST_READY',
        healthScore: 99,
        soilMoisturePercent: 75,
        notes: 'Stem length 60-80cm, large head size.',
      },
    ]);

    // 7. Seed Buyer Profiles
    const buyer1 = seededUsers[2];
    const buyer2 = seededUsers[3];

    await db.insert(buyerProfiles).values([
      {
        userId: buyer1.id,
        buyerType: 'SUPERMARKET',
        companyName: 'Bole Fresh Marts Ltd',
        tinNumber: '0049281729',
        vatRegistered: true,
        deliveryAddress: 'Bole Medhanealem Commercial District, Addis Ababa',
        preferredPaymentMethod: 'CHAPA',
        creditLimitEtb: 250000,
        preferredCategories: ['Fresh Vegetables', 'Fresh Fruits', 'Grains & Cereals'],
      },
      {
        userId: buyer2.id,
        buyerType: 'HOTEL',
        companyName: 'Ethiopian Skylight Hotel & Aviation Catering',
        tinNumber: '0098472910',
        vatRegistered: true,
        deliveryAddress: 'Bole International Airport Road, Skylight Culinary Hub, Addis Ababa',
        preferredPaymentMethod: 'CHAPA',
        creditLimitEtb: 1500000,
        preferredCategories: ['Fresh Vegetables', 'Fresh Fruits', 'Fresh Tubers & Root Crops', 'Cut Flowers & Herbs'],
      },
    ]);

    // 8. Seed Input Supplier Profile
    const supplierUser = seededUsers[4];
    const supplierProfile = await db.insert(inputSuppliers).values({
      userId: supplierUser.id,
      companyName: 'EthioAgro Certified Seeds & Nutrition',
      registrationNumber: 'MOA-INPUT-REG-2024-092',
      contactPhone: '+251 91 112 3344',
      contactEmail: 'orders@ethioagroinputs.et',
      warehouseLocation: 'Gotera Logistics Park Warehouse 7, Addis Ababa',
      region: 'Addis Ababa',
      isVerified: true,
      rating: 4.92,
      totalProductsCount: 12,
    }).returning();

    // 9. Seed Driver Profile
    const driverUser = seededUsers[5];
    const driverProfile = await db.insert(drivers).values({
      userId: driverUser.id,
      fullName: 'Dawit Haile',
      phone: '+251 92 667 8899',
      licenseNumber: 'ET-DL-4920194',
      vehicleType: 'ISUZU_NPR_REFRIGERATED_TRUCK',
      vehiclePlateNumber: '3-B49201-AA',
      capacityTons: 5.0,
      hasRefrigeration: true,
      region: 'Addis Ababa & Oromia Corridor',
      currentStatus: 'AVAILABLE',
      currentLat: 8.9140,
      currentLng: 38.7650,
      rating: 4.96,
      totalDeliveries: 318,
      isVerified: true,
    }).returning();

    // 10. Seed Produce Products (100% Authentic Ethiopian Farmer Crops)
    const vegCat = categoriesData[0].id;
    const grainCat = categoriesData[1].id;
    const tuberCat = categoriesData[2].id;
    const pulseCat = categoriesData[3].id;
    const fruitCat = categoriesData[4].id;
    const herbCat = categoriesData[5].id;

    const seededProducts = await db.insert(products).values([
      // 0: Fresh Greenhouse Roma Tomatoes
      {
        farmerId: farmer1.id,
        farmId: farmsData[0].id,
        categoryId: vegCat,
        name: 'Fresh Greenhouse Roma Tomatoes',
        variety: 'Ty-Shine Export Grade',
        description: 'Firm, uniform deep-red greenhouse Roma tomatoes with thick flesh and superior transport shelf life. Harvested daily with stem-on freshness.',
        grade: 'GRADE_1_EXPORT',
        pricePerUnitEtb: 75,
        unit: 'KG',
        availableQuantity: 4500,
        minOrderQuantity: 50,
        harvestDate: '2026-08-20',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Wonji Horizon Farm, East Shewa',
        region: 'Oromia',
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1546470427-0d4db154ceb7?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-WNJ-TOM-2026-08',
        qualityScore: 98,
        certifications: ['GlobalG.A.P', 'Residue Free Tested'],
        isOrganic: true,
        status: 'ACTIVE',
        shelfLifeDays: 14,
      },
      // 1: Fresh Salad Beefsteak Tomatoes
      {
        farmerId: farmer2.id,
        farmId: farmsData[1].id,
        categoryId: vegCat,
        name: 'Highland Salad Beefsteak Tomatoes',
        variety: 'Anna F1 Highland Hybrid',
        description: 'Juicy, large multi-locular slicing beefsteak tomatoes grown in volcanic soils. Sweet balanced acidity, ideal for hotels, restaurants, and fresh retail.',
        grade: 'GRADE_1_LOCAL',
        pricePerUnitEtb: 82,
        unit: 'KG',
        availableQuantity: 3200,
        minOrderQuantity: 40,
        harvestDate: '2026-08-21',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Holeta Agro-Valley Outgrowers',
        region: 'Oromia',
        images: [
          'https://images.unsplash.com/photo-1546470427-0d4db154ceb7?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-HLT-TOM-2026-08',
        qualityScore: 96,
        certifications: ['Ethiopian Quality Standard', 'Traceable Origin'],
        isOrganic: false,
        status: 'ACTIVE',
        shelfLifeDays: 12,
      },
      // 2: Magna Super-White Teff Grain
      {
        farmerId: farmer1.id,
        farmId: farmsData[0].id,
        categoryId: grainCat,
        name: 'Magna Super-White Teff Grain',
        variety: 'Quncho DZ-Cr-387 (Super White)',
        description: 'Double-cleaned, high-iron, gluten-free super-white Teff grain harvested from the fertile black soils of East Shewa (Ada’a / Debre Zeit). Purity 99.8%.',
        grade: 'GRADE_1_EXPORT',
        pricePerUnitEtb: 11500,
        unit: 'QUINTAL', // 100kg
        availableQuantity: 140,
        minOrderQuantity: 5,
        harvestDate: '2026-07-30',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Wonji & Ada’a Highland Parcel, East Shewa',
        region: 'Oromia',
        images: [
          'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-WNJ-TEF-2026-07',
        qualityScore: 99,
        certifications: ['Ethiopian Grain Board Certificate', 'Purity 99.8%'],
        isOrganic: true,
        status: 'ACTIVE',
        shelfLifeDays: 365,
      },
      // 3: Sergegna Mixed Brown-White Teff Grain
      {
        farmerId: farmer2.id,
        farmId: farmsData[1].id,
        categoryId: grainCat,
        name: 'Sergegna Mixed White-Brown Teff Grain',
        variety: 'Kora DZ-01-196 Traditional Grain',
        description: 'Nutrient-dense Sergegna blended grain harvested from Gojjam highlands. Rich in dietary fiber, phosphorus, and essential amino acids.',
        grade: 'GRADE_1_LOCAL',
        pricePerUnitEtb: 9800,
        unit: 'QUINTAL',
        availableQuantity: 95,
        minOrderQuantity: 5,
        harvestDate: '2026-08-05',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'East Gojjam Cooperative Union Hub',
        region: 'Amhara',
        images: [
          'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-GJM-TEF-2026-08',
        qualityScore: 97,
        certifications: ['MoA Grain Certification', 'Residue Clean'],
        isOrganic: true,
        status: 'ACTIVE',
        shelfLifeDays: 365,
      },
      // 4: Fresh Shashemene Highland Potatoes
      {
        farmerId: farmer1.id,
        farmId: farmsData[0].id,
        categoryId: tuberCat,
        name: 'Fresh Shashemene Highland Potatoes',
        variety: 'Jalene & Gudene Red-Skin Elite',
        description: 'High dry-matter highland cooking potatoes harvested fresh from Southern volcanic loam soils. Thick skin, low bruising, superior frying and boiling texture.',
        grade: 'GRADE_1_LOCAL',
        pricePerUnitEtb: 48,
        unit: 'KG',
        availableQuantity: 7500,
        minOrderQuantity: 100,
        harvestDate: '2026-08-22',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Shashemene Highland Outgrower Cluster',
        region: 'Oromia',
        images: [
          'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-SHS-POT-2026-08',
        qualityScore: 97,
        certifications: ['Ethiopian Quality Standard', '100% Farm Fresh'],
        isOrganic: true,
        status: 'ACTIVE',
        shelfLifeDays: 45,
      },
      // 5: Chencha Organic White Garlic Bulbs
      {
        farmerId: farmer2.id,
        farmId: farmsData[1].id,
        categoryId: tuberCat,
        name: 'Chencha Organic White Garlic Bulbs',
        variety: 'Chencha Giant White (Local Highland)',
        description: 'Sun-cured, pungent organic white garlic bulbs with tight skins and high allicin content. Grown at 2,700m elevation in the Gamo highlands.',
        grade: 'GRADE_1_EXPORT',
        pricePerUnitEtb: 165,
        unit: 'KG',
        availableQuantity: 1800,
        minOrderQuantity: 25,
        harvestDate: '2026-08-16',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Chencha Outgrower Network, Gamo',
        region: 'SNNPR',
        images: [
          'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-CHN-GAR-2026-08',
        qualityScore: 99,
        certifications: ['Certified Organic', 'Purity Tested'],
        isOrganic: true,
        status: 'ACTIVE',
        shelfLifeDays: 90,
      },
      // 6: Highland Red Bombay Onions
      {
        farmerId: farmer1.id,
        farmId: farmsData[0].id,
        categoryId: vegCat,
        name: 'Highland Red Bombay Onions',
        variety: 'Bombay Red Premium Cured',
        description: 'Dry cured, deep burgundy color, high pungency red onions with tight skins and low moisture content for extended transit and storage.',
        grade: 'GRADE_1_LOCAL',
        pricePerUnitEtb: 62,
        unit: 'KG',
        availableQuantity: 6200,
        minOrderQuantity: 100,
        harvestDate: '2026-08-15',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Wonji & Meki-Batu Corridor, East Shewa',
        region: 'Oromia',
        images: [
          'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-WNJ-ONN-2026-08',
        qualityScore: 95,
        certifications: ['Ethiopian Quality Standard'],
        isOrganic: false,
        status: 'ACTIVE',
        shelfLifeDays: 45,
      },
      // 7: Green Bell Peppers & Hot Mareko Fana Chilies
      {
        farmerId: farmer2.id,
        farmId: farmsData[1].id,
        categoryId: herbCat,
        name: 'Green Bell Peppers & Mareko Fana Chilies',
        variety: 'California Wonder & Mareko Fana',
        description: 'Glossy thick-walled green bell peppers and authentic sun-ripened pungent Mareko Fana chili peppers grown under drip irrigation.',
        grade: 'GRADE_1_EXPORT',
        pricePerUnitEtb: 85,
        unit: 'KG',
        availableQuantity: 2400,
        minOrderQuantity: 30,
        harvestDate: '2026-08-21',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Alaba & Ziway Irrigated Farms',
        region: 'Oromia',
        images: [
          'https://images.unsplash.com/photo-1588879460618-924b172a6b29?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-ALB-PEP-2026-08',
        qualityScore: 98,
        certifications: ['GlobalG.A.P', 'Freshness Seal'],
        isOrganic: true,
        status: 'ACTIVE',
        shelfLifeDays: 14,
      },
      // 8: Bale Highland Durum Wheat Grain
      {
        farmerId: farmer1.id,
        farmId: farmsData[0].id,
        categoryId: grainCat,
        name: 'Bale Highland Durum Wheat Grain',
        variety: 'Utuba Hard Amber Milling Wheat',
        description: 'High-protein amber durum wheat harvested from the fertile wheat plains of Bale and Arsi. Ideal for flour milling, bakeries, and pasta production.',
        grade: 'GRADE_1_LOCAL',
        pricePerUnitEtb: 7200,
        unit: 'QUINTAL',
        availableQuantity: 210,
        minOrderQuantity: 10,
        harvestDate: '2026-07-20',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Arsi-Bale Robe Plain Farm Union',
        region: 'Oromia',
        images: [
          'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-BAL-WHT-2026-07',
        qualityScore: 96,
        certifications: ['Ethiopian Grain Board Certificate', 'Protein >13.5%'],
        isOrganic: false,
        status: 'ACTIVE',
        shelfLifeDays: 365,
      },
      // 9: Adet Super Red Split Lentils
      {
        farmerId: farmer2.id,
        farmId: farmsData[1].id,
        categoryId: pulseCat,
        name: 'Adet Super Red Split Lentils',
        variety: 'Alemaya Red Lentil Elite',
        description: 'Machine-cleaned, uniform size, quick-cooking high-iron red lentils sourced directly from West Gojjam farmers. Purity >99.5%.',
        grade: 'GRADE_1_EXPORT',
        pricePerUnitEtb: 14200,
        unit: 'QUINTAL',
        availableQuantity: 80,
        minOrderQuantity: 5,
        harvestDate: '2026-08-01',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Adet Research Agricultural Cluster',
        region: 'Amhara',
        images: [
          'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-ADT-LNT-2026-08',
        qualityScore: 99,
        certifications: ['Export Quality Pass', 'MoA Certified'],
        isOrganic: true,
        status: 'ACTIVE',
        shelfLifeDays: 365,
      },
      // 10: Export-Grade Hass Avocados
      {
        farmerId: farmer1.id,
        farmId: farmsData[0].id,
        categoryId: fruitCat,
        name: 'Export-Grade Hass Avocados',
        variety: 'Hass Grafted (Size 14-18)',
        description: 'Pebbly-skinned Hass avocados grown under optimal highland climate. High healthy monounsaturated fat content and rich creamy texture.',
        grade: 'GRADE_1_EXPORT',
        pricePerUnitEtb: 140,
        unit: 'KG',
        availableQuantity: 2800,
        minOrderQuantity: 100,
        harvestDate: '2026-08-18',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Wonji Horizon Orchard, East Shewa',
        region: 'Oromia',
        images: [
          'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-WNJ-AVO-2026-08',
        qualityScore: 99,
        certifications: ['GlobalG.A.P', 'Traceable Origin'],
        isOrganic: true,
        status: 'ACTIVE',
        shelfLifeDays: 21,
      },
      // 11: Fresh Holeta Green Cabbage & Crisp Carrots
      {
        farmerId: farmer2.id,
        farmId: farmsData[1].id,
        categoryId: vegCat,
        name: 'Fresh Holeta Cabbage & Crisp Orange Carrots',
        variety: 'Copenhagen Market & Nantes Carrots',
        description: 'Tight-headed, sweet green cabbage and freshly washed crisp highland carrots harvested daily from Holeta research valleys.',
        grade: 'GRADE_1_LOCAL',
        pricePerUnitEtb: 38,
        unit: 'KG',
        availableQuantity: 5800,
        minOrderQuantity: 80,
        harvestDate: '2026-08-22',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Holeta Agricultural Valley Hub',
        region: 'Oromia',
        images: [
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-HLT-CAB-2026-08',
        qualityScore: 95,
        certifications: ['Ethiopian Quality Standard'],
        isOrganic: true,
        status: 'ACTIVE',
        shelfLifeDays: 20,
      },
      // 12: Bako Hybrid White Maize Grain
      {
        farmerId: farmer1.id,
        farmId: farmsData[0].id,
        categoryId: grainCat,
        name: 'Bako Hybrid White Maize Grain',
        variety: 'BH-661 High-Starch Hybrid',
        description: 'Dry-shelled, large kernel white maize harvested from West Oromia. Moisture <13%, ideal for posho flour, animal feed, and food manufacturing.',
        grade: 'GRADE_1_LOCAL',
        pricePerUnitEtb: 4800,
        unit: 'QUINTAL',
        availableQuantity: 320,
        minOrderQuantity: 10,
        harvestDate: '2026-07-28',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Bako Agricultural Center, West Shewa',
        region: 'Oromia',
        images: [
          'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-BKO-MAZ-2026-07',
        qualityScore: 95,
        certifications: ['MoA Grain Certification', 'Aflatoxin Tested Clean'],
        isOrganic: false,
        status: 'ACTIVE',
        shelfLifeDays: 365,
      },
      // 13: Highland Sweet Potatoes & Fresh Ginger Roots
      {
        farmerId: farmer2.id,
        farmId: farmsData[1].id,
        categoryId: tuberCat,
        name: 'Highland Sweet Potatoes & Fresh Ginger',
        variety: 'Kulfo Orange-Fleshed & Tepi Ginger',
        description: 'Vitamin-A rich orange-fleshed sweet potatoes paired with aromatic freshly washed ginger rhizomes from highland cooperative farmers.',
        grade: 'GRADE_1_LOCAL',
        pricePerUnitEtb: 58,
        unit: 'KG',
        availableQuantity: 4100,
        minOrderQuantity: 60,
        harvestDate: '2026-08-20',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Hawassa & Welayta Highland Outgrowers',
        region: 'SNNPR',
        images: [
          'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-WLT-SWP-2026-08',
        qualityScore: 97,
        certifications: ['Ethiopian Quality Standard'],
        isOrganic: true,
        status: 'ACTIVE',
        shelfLifeDays: 30,
      },
    ]).returning();

    // 11. Seed Input Products
    const inSeedCat = inputCategoriesData[0].id;
    const inFertCat = inputCategoriesData[1].id;
    const inProtCat = inputCategoriesData[2].id;
    const inIrrigCat = inputCategoriesData[3].id;
    const inToolCat = inputCategoriesData[4].id;

    await db.insert(inputProducts).values([
      {
        supplierId: supplierProfile[0].id,
        categoryId: inFertCat,
        name: 'NPSB + Zinc Blended Mineral Fertilizer',
        brand: 'EthioAgro NutriSoil Pro',
        description: 'Government certified balanced fertilizer tailored for Ethiopian volcanic soils with Nitrogen, Phosphorus, Sulfur, Boron, and Zinc.',
        priceEtb: 3650,
        unit: 'BAG', // 50kg bag
        stockQuantity: 450,
        minOrderQuantity: 2,
        specifications: '19% N, 38% P2O5, 7% S, 0.1% B, 0.2% Zn (50kg Net)',
        applicationGuide: 'Apply 100kg/hectare at sowing or basal preparation.',
        images: ['https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80'],
        isCertified: true,
      },
      {
        supplierId: supplierProfile[0].id,
        categoryId: inSeedCat,
        name: 'BH-661 Certified Hybrid Maize Seed',
        brand: 'Ethiopian Seed Enterprise (ESE Elite)',
        description: 'Drought-tolerant, high-yielding highland hybrid maize with excellent resistance to leaf blight and ear rot.',
        priceEtb: 1450,
        unit: 'BAG', // 12.5kg bag (1 hectare seed rate approx 25kg)
        stockQuantity: 280,
        minOrderQuantity: 1,
        specifications: 'Germination rate >98%, Purity >99%, Treated with Thiram.',
        applicationGuide: 'Plant at 75cm row spacing and 25cm plant spacing.',
        images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'],
        isCertified: true,
      },
      {
        supplierId: supplierProfile[0].id,
        categoryId: inIrrigCat,
        name: 'Solar-Powered Smart Drip Irrigation Kit (1 Hectare)',
        brand: 'SolarAgro NileFlow-100',
        description: 'Complete 1-hectare turnkey drip irrigation package including 1.5HP DC submersible solar pump, 4x 450W mono solar panels, controller, filters, and UV-stabilized drip laterals.',
        priceEtb: 88000,
        unit: 'SET',
        stockQuantity: 25,
        minOrderQuantity: 1,
        specifications: '35,000 Liters/day flow rate at 30m head, 0.9L/hr pressure compensating emitters.',
        applicationGuide: 'Includes full installation guide and 2-year warranty.',
        images: ['https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'],
        isCertified: true,
      },
      {
        supplierId: supplierProfile[0].id,
        categoryId: inProtCat,
        name: 'BioCure Neem Extract Organic Bio-Pesticide',
        brand: 'EthioBio GreenShield',
        description: 'Certified organic cold-pressed Azadirachtin concentrate for broad spectrum aphid, thrip, whitefly, and caterpillar control without residue.',
        priceEtb: 850,
        unit: 'LITER',
        stockQuantity: 180,
        minOrderQuantity: 1,
        specifications: '10,000 PPM pure Azadirachtin, 0 days pre-harvest interval.',
        applicationGuide: 'Dilute 30ml in 15L water, spray during early morning or late afternoon.',
        images: ['https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80'],
        isCertified: true,
      },
    ]);

    // 12. Seed Real Orders, Deliveries, and Payments
    const order1 = await db.insert(orders).values({
      orderNumber: 'AGR-2026-08-9901',
      buyerId: buyer2.id, // Skylight Hotel
      orderType: 'BULK_COMMERCIAL',
      totalAmountEtb: 65000,
      deliveryFeeEtb: 3500,
      serviceFeeEtb: 1300,
      grandTotalEtb: 69800,
      paymentStatus: 'PAID',
      orderStatus: 'IN_TRANSIT',
      deliveryModel: 'HUB_CROSS_DOCK',
      hubId: hubsData[0].id, // Addis Central Hub
      deliveryAddress: 'Ethiopian Skylight Hotel & Aviation Catering, Bole Airport Road, Addis Ababa',
      deliveryRegion: 'Addis Ababa',
      deliveryContactName: 'Sara Kebede (Head Chef Procurement)',
      deliveryContactPhone: '+251 91 556 7788',
      requestedDeliveryDate: '2026-08-22',
      tinNumber: 'TIN-00482910-ADDIS',
      payerAccountNumber: '0915567788 (Telebirr SuperApp)',
      notes: 'Please ensure temperature-controlled transit below 6°C for Hass Avocados and Strawberries.',
    }).returning();

    await db.insert(orderItems).values([
      {
        orderId: order1[0].id,
        itemType: 'PRODUCE',
        productId: seededProducts[0].id, // Roma Tomatoes
        sellerId: farmer1.id,
        name: 'Fresh Greenhouse Roma Tomatoes',
        grade: 'GRADE_1_EXPORT',
        unit: 'KG',
        quantity: 400,
        unitPriceEtb: 75,
        subtotalEtb: 30000,
        lotBatchNumber: 'LOT-WNJ-TOM-2026-08',
      },
      {
        orderId: order1[0].id,
        itemType: 'PRODUCE',
        productId: seededProducts[10].id, // Hass Avocados
        sellerId: farmer1.id,
        name: 'Export-Grade Hass Avocados',
        grade: 'GRADE_1_EXPORT',
        unit: 'KG',
        quantity: 250,
        unitPriceEtb: 140,
        subtotalEtb: 35000,
        lotBatchNumber: 'LOT-WNJ-AVO-2026-08',
      },
    ]);

    // Payment for Order 1 (Telebirr)
    await db.insert(payments).values({
      orderId: order1[0].id,
      userId: buyer2.id,
      amountEtb: 69800,
      currency: 'ETB',
      provider: 'TELEBIRR',
      transactionRef: 'TX-TELEBIRR-8829104',
      status: 'PAID',
      paymentMethod: 'MOBILE_MONEY',
      payerAccountNumber: '0915567788',
      paidAt: new Date(Date.now() - 3600000 * 5),
    });

    // Seed Delivery Record
    await db.insert(deliveries).values({
      orderId: order1[0].id,
      driverId: driverProfile[0].id,
      deliveryModel: 'HUB_CROSS_DOCK',
      hubId: hubsData[0].id,
      pickupLocation: 'Wonji Horizon Main Estate & Adama Fast-Transit Hub',
      dropoffLocation: 'Skylight Hotel Central Commissary, Bole, Addis Ababa',
      pickupLat: 8.4521,
      pickupLng: 39.2942,
      dropoffLat: 8.9950,
      dropoffLng: 38.7900,
      currentLat: 8.7800,
      currentLng: 38.8200,
      status: 'IN_TRANSIT',
      estimatedArrival: 'Today at 3:30 PM (ETB Time)',
    });

    // Seed Order 2 (Teff Grain Order by Addis Supermarket)
    const order2 = await db.insert(orders).values({
      orderNumber: 'AGR-2026-08-4102',
      buyerId: buyer1.id, // Dawit Haile / Addis Supermarket
      orderType: 'PRODUCE',
      totalAmountEtb: 115000,
      deliveryFeeEtb: 2500,
      serviceFeeEtb: 2300,
      grandTotalEtb: 119800,
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
      deliveryModel: 'DIRECT',
      hubId: hubsData[1].id,
      deliveryAddress: 'Addis Supermarket Central Storehouse, Kazanchis, Addis Ababa',
      deliveryRegion: 'Addis Ababa',
      deliveryContactName: 'Dawit Haile',
      deliveryContactPhone: '+251 91 144 5566',
      requestedDeliveryDate: '2026-08-25',
      tinNumber: 'TIN-00918234-ET',
      payerAccountNumber: '100018274920 (CBE Birr)',
      notes: 'Deliver 10 quintals of double-sifted Magna Teff with official Ethiopian grain standards inspection seal.',
    }).returning();

    await db.insert(orderItems).values([
      {
        orderId: order2[0].id,
        itemType: 'PRODUCE',
        productId: seededProducts[2].id, // Magna White Teff
        sellerId: farmer1.id,
        name: 'Magna Super-White Teff Grain',
        grade: 'GRADE_1_EXPORT',
        unit: 'QUINTAL',
        quantity: 10,
        unitPriceEtb: 11500,
        subtotalEtb: 115000,
        lotBatchNumber: 'LOT-DBZ-TEFF-2026-01',
      },
    ]);

    await db.insert(payments).values({
      orderId: order2[0].id,
      userId: buyer1.id,
      amountEtb: 119800,
      currency: 'ETB',
      provider: 'CBE_BIRR',
      transactionRef: 'TX-CBE-99182374',
      status: 'PAID',
      paymentMethod: 'CBE_DIRECT',
      payerAccountNumber: '100018274920',
      paidAt: new Date(Date.now() - 3600000 * 12),
    });

    await db.insert(deliveries).values({
      orderId: order2[0].id,
      driverId: driverProfile[0].id,
      deliveryModel: 'DIRECT',
      hubId: hubsData[1].id,
      pickupLocation: 'Adaa Teff Cooperative, Bishoftu / Debre Zeit',
      dropoffLocation: 'Addis Supermarket Kazanchis, Addis Ababa',
      status: 'ASSIGNED',
      estimatedArrival: 'Tomorrow morning 10:00 AM',
    });

    // Seed Order 3 (Highland Potatoes & Chencha Garlic by Hilton Addis)
    const order3 = await db.insert(orders).values({
      orderNumber: 'AGR-2026-08-2205',
      buyerId: buyer2.id,
      orderType: 'PRODUCE',
      totalAmountEtb: 40500,
      deliveryFeeEtb: 2000,
      serviceFeeEtb: 810,
      grandTotalEtb: 43310,
      paymentStatus: 'ESCROW_HELD',
      orderStatus: 'PREPARING',
      deliveryModel: 'HUB_CROSS_DOCK',
      hubId: hubsData[0].id,
      deliveryAddress: 'Menelik II Avenue, Hilton Addis Culinary Department',
      deliveryRegion: 'Addis Ababa',
      deliveryContactName: 'Marta Tadesse',
      deliveryContactPhone: '+251 91 334 9900',
      requestedDeliveryDate: '2026-08-26',
      tinNumber: 'TIN-00129481-HLT',
      payerAccountNumber: '0913349900 (Awash Agribusiness Wallet)',
      notes: 'Grade 1 Shashemene Highland potatoes for hotel kitchen.',
    }).returning();

    await db.insert(orderItems).values([
      {
        orderId: order3[0].id,
        itemType: 'PRODUCE',
        productId: seededProducts[4].id, // Shashemene Potatoes
        sellerId: farmer2.id,
        name: 'Fresh Shashemene Highland Potatoes',
        grade: 'GRADE_1_LOCAL',
        unit: 'KG',
        quantity: 500,
        unitPriceEtb: 48,
        subtotalEtb: 24000,
        lotBatchNumber: 'LOT-SHS-POT-2026-08',
      },
      {
        orderId: order3[0].id,
        itemType: 'PRODUCE',
        productId: seededProducts[5].id, // Chencha Garlic
        sellerId: farmer2.id,
        name: 'Chencha Organic White Garlic Bulbs',
        grade: 'GRADE_1_EXPORT',
        unit: 'KG',
        quantity: 100,
        unitPriceEtb: 165,
        subtotalEtb: 16500,
        lotBatchNumber: 'LOT-CHN-GAR-2026-08',
      },
    ]);

    await db.insert(payments).values({
      orderId: order3[0].id,
      userId: buyer2.id,
      amountEtb: 43310,
      currency: 'ETB',
      provider: 'AWASH_BANK',
      transactionRef: 'TX-AWASH-4491028',
      status: 'ESCROW_HELD',
      paymentMethod: 'ESCROW_ACCOUNT',
      payerAccountNumber: '0913349900',
      paidAt: new Date(Date.now() - 3600000 * 2),
    });

    await db.insert(deliveries).values({
      orderId: order3[0].id,
      driverId: null,
      deliveryModel: 'HUB_CROSS_DOCK',
      hubId: hubsData[0].id,
      pickupLocation: 'Shashemene Highland Farmers Hub, Oromia',
      dropoffLocation: 'Hilton Addis Main Loading Bay',
      status: 'PENDING_ASSIGNMENT',
      estimatedArrival: 'Thursday 2:00 PM',
    });

    // 13. Seed Quality Inspections
    await db.insert(qualityInspections).values([
      {
        productId: seededProducts[0].id,
        orderId: order1[0].id,
        batchNumber: 'LOT-WNJ-TOM-2026-08',
        inspectorId: seededUsers[8].id,
        inspectorName: 'Alemayehu Moges (Lead Ag Quality Inspector)',
        inspectionDate: '2026-08-21',
        gradeAssigned: 'GRADE_1_EXPORT',
        moistureContentPercent: 92.4,
        defectRatePercent: 0.8,
        appearanceScore: 98,
        status: 'PASSED',
        reportSummary: 'Exemplary uniformity in skin firmness, color index 5 (deep red), zero pesticide residues, optimal brix score 4.8. Certified for immediate commercial and export dispatch.',
        certificateUrl: 'https://agrilink.et/certs/QC-2026-08-WNJ-01.pdf',
      },
      {
        productId: seededProducts[10].id,
        orderId: order1[0].id,
        batchNumber: 'LOT-WNJ-AVO-2026-08',
        inspectorId: seededUsers[8].id,
        inspectorName: 'Alemayehu Moges',
        inspectionDate: '2026-08-20',
        gradeAssigned: 'GRADE_1_EXPORT',
        moistureContentPercent: 74.2,
        defectRatePercent: 0.5,
        appearanceScore: 99,
        status: 'PASSED',
        reportSummary: 'Dry matter content tested at 24.8% exceeding export threshold. Zero thrips or mechanical bruising. Pre-cooled to 5.5°C in Addis Hub.',
        certificateUrl: 'https://agrilink.et/certs/QC-2026-08-WNJ-02.pdf',
      },
    ]);

    // 14. Seed Farmer Finance Applications
    await db.insert(financeApplications).values([
      {
        farmerId: farmer1.id,
        institutionId: seededUsers[6].id, // Awash Bank
        loanType: 'EQUIPMENT_FINANCING',
        amountRequestedEtb: 350000,
        purpose: 'Installation of automated drip irrigation fertigation system and 5,000 sq meter commercial greenhouse expansion for Roma tomatoes.',
        farmId: farmsData[0].id,
        targetCrop: 'Greenhouse Roma Tomatoes & Magna White Teff',
        expectedYieldTons: 35.0,
        expectedRevenueEtb: 1450000,
        repaymentPeriodMonths: 18,
        status: 'APPROVED',
        approvedAmountEtb: 350000,
        interestRatePercent: 8.5,
        reviewNotes: 'Verified track record of 142 completed orders with 4.95 star rating. 14.5 hectare title deed confirmed. Recommended for immediate disbursement.',
      },
      {
        farmerId: farmer2.id,
        institutionId: seededUsers[6].id,
        loanType: 'INPUT_FINANCING',
        amountRequestedEtb: 120000,
        purpose: 'Procurement of certified highland potato seed tubers (Jalene), bio-pesticides, and organic soil amendments for 2026/27 harvest cycle.',
        farmId: farmsData[1].id,
        targetCrop: 'Shashemene Highland Potatoes & Chencha Garlic',
        expectedYieldTons: 25.0,
        expectedRevenueEtb: 650000,
        repaymentPeriodMonths: 6,
        status: 'UNDER_REVIEW',
        approvedAmountEtb: null,
        interestRatePercent: 9.0,
        reviewNotes: 'Application documents submitted. Production history with Skylight Hotel and Bole Marts verified.',
      },
    ]);

    // 15. Seed Bulk Quote Requests
    await db.insert(quoteRequests).values([
      {
        businessBuyerId: buyer2.id,
        sellerId: farmer1.id,
        productId: seededProducts[2].id, // Magna White Teff
        productName: 'Magna Super-White Teff Grain',
        requestedQuantity: 25,
        unit: 'QUINTAL',
        requestedGrade: 'GRADE_1_EXPORT',
        targetPriceEtb: 11000,
        deliveryDate: '2026-09-10',
        deliveryLocation: 'Skylight Bakery & Culinary Center, Addis Ababa',
        status: 'OFFERED',
        offerPriceEtb: 11200,
        offerNotes: 'We can supply 25 quintals of double-cleaned Magna Teff with certificate of purity and deliver directly to your commissary.',
      },
    ]);

    // 16. Seed Reviews
    await db.insert(reviews).values([
      {
        orderId: order1[0].id,
        reviewerId: buyer2.id,
        targetType: 'PRODUCT',
        targetId: seededProducts[0].id,
        rating: 5,
        title: 'Superb Roma Tomatoes — Exceptional Culinary Quality',
        comment: 'We received 400kg of pristine greenhouse Roma tomatoes at our hotel commissary. Uniform deep red ripeness, zero bruises, excellent sauce yield.',
        isVerifiedPurchase: true,
      },
      {
        orderId: order1[0].id,
        reviewerId: buyer2.id,
        targetType: 'FARMER',
        targetId: farmer1.id,
        rating: 5,
        title: 'Professional and Reliable Farm Partner',
        comment: 'Farmer Bekele maintains highest agricultural hygiene and cold chain handling. AgriLink verified traceability barcode made audit effortless.',
        isVerifiedPurchase: true,
      },
    ]);

    // 17. Seed Notifications
    await db.insert(notifications).values([
      {
        userId: farmer1.id,
        title: 'Financing Approved: 350,000 ETB',
        message: 'Awash Agribusiness Bank approved your Equipment Financing application. Funds ready for disbursement.',
        type: 'FINANCE',
        linkUrl: '/farmer/finance',
      },
      {
        userId: buyer2.id,
        title: 'Order Dispatch: AGR-2026-08-9901',
        message: 'Driver Dawit Haile is en route with your refrigerated produce shipment from Wonji Hub.',
        type: 'DELIVERY',
        linkUrl: '/buyer/orders',
      },
    ]);

    console.log('Database seeding successfully completed with authentic Ethiopian agricultural records!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}
