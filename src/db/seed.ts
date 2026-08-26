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
  hubs,
  drivers,
  orders,
  orderItems,
  deliveries,
  qualityInspections,
  financeApplications,
  quoteRequests,
  reviews,
  notifications,
  messages,
} from './schema.ts';
import { sql } from 'drizzle-orm';

export async function seedDatabase() {
  try {
    // Check if categories or users already exist
    const existingCats = await db.select().from(productCategories).limit(1);
    if (existingCats.length > 0) {
      console.log('Database already has seeded data. Skipping initial seeding.');
      return;
    }

    console.log('Seeding AgriLink PostgreSQL database with authentic agricultural data...');

    // 1. Seed Product Categories
    const categoriesData = await db.insert(productCategories).values([
      {
        name: 'Fresh Vegetables',
        slug: 'vegetables',
        description: 'Premium grade tomatoes, onions, peppers, cabbages, and root vegetables sourced directly from Rift Valley and highland growers.',
        icon: 'Carrot',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Fresh Fruits',
        slug: 'fruits',
        description: 'Hass avocados, sweet mangoes, papayas, strawberries, and citrus harvested at peak brix level.',
        icon: 'Apple',
        imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Grains & Cereals',
        slug: 'grains',
        description: 'Magna white teff, durum wheat, organic barley, and highland maize direct from cooperative unions.',
        icon: 'Wheat',
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Specialty Coffee & Spices',
        slug: 'coffee-spices',
        description: 'Washed Yirgacheffe, Sidama Grade 1, Guji micro-lots, Korarima (Ethiopian cardamom), and dried ginger.',
        icon: 'Coffee',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Cut Flowers & Herbs',
        slug: 'flowers-herbs',
        description: 'Fresh cut export roses, carnations, rosemary, basil, and mint from Ziway and Debre Zeit greenhouses.',
        icon: 'Flower2',
        imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Pulses & Oilseeds',
        slug: 'pulses-oilseeds',
        description: 'Sesame seeds (Humera type), chickpeas, red kidney beans, and sunflower seeds for export & processing.',
        icon: 'Boxes',
        imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
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
        preferredCategories: ['Fresh Vegetables', 'Fresh Fruits', 'Specialty Coffee & Spices', 'Cut Flowers & Herbs'],
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

    // 10. Seed Produce Products
    const vegCat = categoriesData[0].id;
    const fruitCat = categoriesData[1].id;
    const grainCat = categoriesData[2].id;
    const coffeeCat = categoriesData[3].id;
    const flowerCat = categoriesData[4].id;

    const seededProducts = await db.insert(products).values([
      {
        farmerId: farmer1.id,
        farmId: farmsData[0].id,
        categoryId: vegCat,
        name: 'Fresh Greenhouse Roma Tomatoes',
        variety: 'Ty-Shine Export Grade',
        description: 'Firm, uniform-red greenhouse Roma tomatoes with thick flesh and superior shelf life. Ideal for commercial supermarkets, hotels, and processing.',
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
      {
        farmerId: farmer1.id,
        farmId: farmsData[0].id,
        categoryId: fruitCat,
        name: 'Export-Grade Hass Avocados',
        variety: 'Hass Grafted (Size 14-18)',
        description: 'Pebbly-skinned Hass avocados grown under optimal highland climate. High healthy monounsaturated fat content and creamy texture.',
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
      {
        farmerId: farmer1.id,
        farmId: farmsData[0].id,
        categoryId: vegCat,
        name: 'Highland Red Bombay Onions',
        variety: 'Bombay Red Premium',
        description: 'Dry cured, deep burgundy color, high pungency red onions with tight skins and low moisture for long transit storage.',
        grade: 'GRADE_1_LOCAL',
        pricePerUnitEtb: 62,
        unit: 'KG',
        availableQuantity: 6200,
        minOrderQuantity: 100,
        harvestDate: '2026-08-15',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Wonji Gefersa, East Shewa',
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
      {
        farmerId: farmer1.id,
        farmId: farmsData[0].id,
        categoryId: grainCat,
        name: 'Magna Super-White Teff Grain',
        variety: 'Quncho DZ-Cr-387 (Super White)',
        description: 'Double-cleaned, high-iron, gluten-free super-white Teff grain harvested from the fertile soils of East Shewa.',
        grade: 'GRADE_1_EXPORT',
        pricePerUnitEtb: 11500,
        unit: 'QUINTAL', // 100kg
        availableQuantity: 120,
        minOrderQuantity: 5,
        harvestDate: '2026-07-30',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Wonji Highland Parcel, Oromia',
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
      {
        farmerId: farmer2.id,
        farmId: farmsData[1].id,
        categoryId: fruitCat,
        name: 'Hydroponic Sweet Strawberries',
        variety: 'San Andreas Large Berry',
        description: 'Vibrant red, fragrant strawberries harvested daily into ventilated 250g punnets. Maintained strictly at 2-4°C cold chain.',
        grade: 'GRADE_1_EXPORT',
        pricePerUnitEtb: 220,
        unit: 'KG',
        availableQuantity: 850,
        minOrderQuantity: 10,
        harvestDate: '2026-08-21',
        expectedAvailability: 'Daily Harvest',
        farmLocation: 'Lake Ziway North Shore, Oromia',
        region: 'Oromia',
        images: [
          'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-ZWY-STR-2026-08',
        qualityScore: 97,
        certifications: ['Cold-Chain Guaranteed', 'GlobalG.A.P'],
        isOrganic: false,
        status: 'ACTIVE',
        shelfLifeDays: 8,
      },
      {
        farmerId: farmer2.id,
        farmId: farmsData[1].id,
        categoryId: flowerCat,
        name: 'Export Cut Red Roses (Rhodos)',
        variety: 'Rhodos 60-70cm Stems',
        description: 'Velvety dark-red floricultural roses grown in climate-controlled Ziway greenhouses. Packed 20 stems per bunch.',
        grade: 'GRADE_1_EXPORT',
        pricePerUnitEtb: 380,
        unit: 'CRATE', // bunch / crate
        availableQuantity: 400,
        minOrderQuantity: 10,
        harvestDate: '2026-08-21',
        expectedAvailability: 'Daily Harvest',
        farmLocation: 'Lake Ziway Flower Park, Oromia',
        region: 'Oromia',
        images: [
          'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-ZWY-ROS-2026-08',
        qualityScore: 99,
        certifications: ['FairTrade Africa', 'EHPEA Gold Code'],
        isOrganic: false,
        status: 'ACTIVE',
        shelfLifeDays: 12,
      },
      {
        farmerId: farmer1.id,
        farmId: farmsData[0].id,
        categoryId: coffeeCat,
        name: 'Washed Yirgacheffe Grade 1 Specialty Coffee Beans',
        variety: 'Heirloom Ethiopian Typica',
        description: 'Cup score 89.5. Floral jasmine aroma, bergamot citrus notes, and refined honey sweetness from Gedeo highlands.',
        grade: 'GRADE_1_EXPORT',
        pricePerUnitEtb: 19500,
        unit: 'BAG', // 60kg jute bag
        availableQuantity: 75,
        minOrderQuantity: 2,
        harvestDate: '2026-06-15',
        expectedAvailability: 'Immediate Dispatch',
        farmLocation: 'Yirgacheffe Highland Micro-Station',
        region: 'SNNPR',
        images: [
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        ],
        lotBatchNumber: 'LOT-YRG-COF-2026-06',
        qualityScore: 99,
        certifications: ['Rainforest Alliance', 'Specialty Coffee Association 89.5+'],
        isOrganic: true,
        status: 'ACTIVE',
        shelfLifeDays: 365,
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
      notes: 'Please ensure temperature-controlled transit below 6°C for Hass Avocados and Strawberries.',
    }).returning();

    await db.insert(orderItems).values([
      {
        orderId: order1[0].id,
        itemType: 'PRODUCE',
        productId: seededProducts[1].id, // Hass Avocados
        sellerId: farmer1.id,
        name: 'Export-Grade Hass Avocados',
        grade: 'GRADE_1_EXPORT',
        unit: 'KG',
        quantity: 300,
        unitPriceEtb: 140,
        subtotalEtb: 42000,
        lotBatchNumber: 'LOT-WNJ-AVO-2026-08',
      },
      {
        orderId: order1[0].id,
        itemType: 'PRODUCE',
        productId: seededProducts[4].id, // Strawberries
        sellerId: farmer2.id,
        name: 'Hydroponic Sweet Strawberries',
        grade: 'GRADE_1_EXPORT',
        unit: 'KG',
        quantity: 100,
        unitPriceEtb: 220,
        subtotalEtb: 22000,
        lotBatchNumber: 'LOT-ZWY-STR-2026-08',
      },
    ]);

    // Seed Delivery Record
    await db.insert(deliveries).values({
      orderId: order1[0].id,
      driverId: driverProfile[0].id,
      deliveryModel: 'HUB_CROSS_DOCK',
      hubId: hubsData[0].id,
      pickupLocation: 'Wonji Horizon Main Estate & Ziway Lakeside Hub',
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
        productId: seededProducts[1].id,
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
        purpose: 'Installation of automated drip irrigation fertigation system and 5,000 sq meter commercial greenhouse expansion.',
        farmId: farmsData[0].id,
        targetCrop: 'Export Hass Avocados & Greenhouse Tomatoes',
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
        purpose: 'Procurement of certified hybrid strawberry runners, bio-pesticides, and cold storage boxes for 2026/27 harvest cycle.',
        farmId: farmsData[1].id,
        targetCrop: 'Hydroponic Strawberries',
        expectedYieldTons: 12.0,
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
        productId: seededProducts[3].id, // White Teff
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
        targetId: seededProducts[1].id,
        rating: 5,
        title: 'Superb Hass Avocados — Exceptional Culinary Quality',
        comment: 'We served these avocados in our five-star dining rooms. Uniform ripeness, silky texture, zero waste. Will be placing recurring weekly bulk orders.',
        isVerifiedPurchase: true,
      },
      {
        orderId: order1[0].id,
        reviewerId: buyer2.id,
        targetType: 'FARMER',
        targetId: farmer1.id,
        rating: 5,
        title: 'Professional and Reliable Partner',
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
