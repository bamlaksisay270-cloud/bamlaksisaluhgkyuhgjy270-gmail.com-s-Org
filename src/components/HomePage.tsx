import React from 'react';
import agrilinkLogo from '../assets/images/agrilink_logo_1787551924489.jpg';
import farmTractorIrrigation from '../assets/images/farm_tractor_irrigation_1787815687313.jpg';
import farmTractorSunrise from '../assets/images/farm_tractor_sunrise_1787815703199.jpg';
import digitalProduceApp from '../assets/images/digital_produce_app_1787815717840.jpg';
import ethiopiaGreenhouseFarm from '../assets/images/ethiopia_greenhouse_farm_1787814574646.jpg';
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Truck,
  Building2,
  Landmark,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
  Layers,
  MapPin,
  Clock,
  Boxes,
  Zap,
  LogIn,
  UserPlus,
  Phone,
  Store,
  DollarSign,
  ChevronRight,
  Smartphone,
  Tractor,
} from 'lucide-react';
import { ProductCategory, Product, User } from '../types/index.ts';
import { IntroHero } from './IntroHero.tsx';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  categories: ProductCategory[];
  featuredProducts: Product[];
  onSelectProduct: (product: Product) => void;
  currentUser: User | null;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onOpenUSSD: () => void;
  onOpenBrand: () => void;
  onLogoutToGuest?: () => void;
  onOpenCallCenter?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  categories,
  featuredProducts,
  onSelectProduct,
  currentUser,
  onOpenLogin,
  onOpenSignUp,
  onOpenUSSD,
  onOpenBrand,
  onLogoutToGuest,
  onOpenCallCenter,
}) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Intro Page Hero & Interactive Sign In / Register Portal */}
      <IntroHero
        currentUser={currentUser}
        onExploreMarket={() => onNavigate('marketplace')}
        onOpenLogin={onOpenLogin}
        onOpenSignUp={onOpenSignUp}
        onOpenUSSD={onOpenUSSD}
        onOpenBrand={onOpenBrand}
        onLogoutToGuest={onLogoutToGuest}
        onOpenCallCenter={onOpenCallCenter}
      />

      {/* Quick Value Onboarding Banner for New & Returning Stakeholders */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/80 px-2.5 py-0.5 rounded-full inline-block">
              Integrated National Solution
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950">
              How AgriLink Works For Your Agricultural Business
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl">
              From smallholder plots in Wonji & Arsi to processing lines in Addis Ababa, explore transparent trade, direct cold-chain transport, and bank-grade escrow.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {!currentUser ? (
              <>
                <button
                  onClick={onOpenLogin}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <LogIn className="h-4 w-4 text-emerald-700" /> Log In
                </button>
                <button
                  onClick={onOpenSignUp}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <UserPlus className="h-4 w-4" /> Sign Up / Join Grid
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate(currentUser.role === 'FARMER' ? 'farmer-portal' : currentUser.role === 'BUSINESS_BUYER' ? 'procurement' : 'marketplace')}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>Go to My Portal</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4 Connected Ecosystem Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Unified Value Chain
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-2">
            Engineered for Every Agricultural Stakeholder
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Empowering Ethiopia's horticultural and grain economies with digital infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: Farmers */}
          <div
            onClick={() => onNavigate('farmer-portal')}
            className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-emerald-500 shadow-2xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sprout className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 mb-1">Direct Farmer Sales</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Sell directly to supermarkets, hotels, and exporters at transparent prices in ETB. Receive instant payouts into CBE or Telebirr.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 mt-4 flex items-center gap-1">
              Open Farmer Desk <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* Pillar 2: Commercial Buyers */}
          <div
            onClick={() => onNavigate('procurement')}
            className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-blue-500 shadow-2xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 mb-1">Commercial Procurement</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Request custom bulk quotes (RFQs), negotiate recurring weekly deliveries, and source GlobalG.A.P certified fresh produce.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 mt-4 flex items-center gap-1">
              View B2B Quotes <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* Pillar 3: Logistics & Hubs */}
          <div
            onClick={() => onNavigate('logistics')}
            className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-purple-500 shadow-2xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 mb-1">Cold-Chain Staging Hubs</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Centralized aggregation hubs with pre-cooling, lot inspection, and GPS-monitored refrigerated vehicle fleets.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 mt-4 flex items-center gap-1">
              Explore Logistics Grid <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* Pillar 4: Agri-Finance */}
          <div
            onClick={() => onNavigate('finance')}
            className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-teal-500 shadow-2xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Landmark className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 mb-1">Awash Agri-Credit</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Underwrite working capital and input loans based on verified harvest history and digital escrow performance.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 mt-4 flex items-center gap-1">
              Open Banking Desk <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* Big Picture & Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
              The Big Picture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 leading-snug">
              AgriLink exists to improve the livelihood of farmers and consumers across Africa.
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              We create digital solutions and logistical networks that are transforming the agricultural value chain — ensuring that transactions are safe, transparent, and efficient for farmers.
            </p>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
              We believe that food systems are only efficient when farmers can trade effortlessly across borders without many layers of intermediaries. Farmers should also be able to procure inputs at a fair price based on information instantly available to them. At AgriLink, we believe that technology has the potential to shape the future of agriculture — and we set out on an ambitious journey to build that future.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-zinc-100">
            {/* Trade Feature: Buy by Digital */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border border-emerald-200/90 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80">
                    <Smartphone className="h-4 w-4 text-emerald-700" /> Trade — Buy Digitally
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Direct E-Commerce
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-16/10 border border-emerald-300/60 shadow-sm group">
                  <img
                    src={digitalProduceApp}
                    alt="Buy fresh farm produce digitally via AgriLink"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent flex items-end p-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                        Digital Procurement App
                      </span>
                      <p className="text-sm font-black text-white">
                        Inspect Fresh Veggies & Grain with Batch Traceability
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-zinc-900">
                    Direct B2B Produce Marketplace
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    AgriLink’s Produce Marketplace is a B2B e-commerce platform that makes it easy and safe to trade fruit and vegetables directly with growers. Our digital platform guarantees price discovery, quality verification, mobile payments, and batch traceability.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500">
                  Escrow Protected • Telebirr & CBE
                </span>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100/80 hover:bg-emerald-200/90 transition-colors cursor-pointer"
                >
                  <span>Browse Produce Market</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Transact Feature: Modern Farmlands & Inputs */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-blue-50/40 border border-blue-200/90 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-800 flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80">
                    <Tractor className="h-4 w-4 text-blue-700" /> Transact — Farmlands & Inputs
                  </span>
                  <span className="text-[11px] font-bold text-blue-700 bg-white border border-blue-200 px-2.5 py-0.5 rounded-full">
                    Mechanization & Seeds
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-16/10 border border-blue-300/60 shadow-sm group">
                  <img
                    src={farmTractorSunrise}
                    alt="Farmland cultivation and tractor mechanization"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent flex items-end p-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                        Modern Ethiopian Farmlands
                      </span>
                      <p className="text-sm font-black text-white">
                        Certified Seeds, Tractors & Direct Input Credit
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-zinc-900">
                    Input Procurement & Farm Mechanization
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Farmers can procure certified seeds, fertilizers, and tractor tilling services directly from manufacturers. We also provide data-backed input financing and equipment leasing based on verified harvest history.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-blue-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500">
                  Direct from Verified Suppliers
                </span>
                <button
                  onClick={() => onNavigate('inputs')}
                  className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-100/80 hover:bg-blue-200/90 transition-colors cursor-pointer"
                >
                  <span>Browse Inputs Market</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fresh Produce Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-zinc-900">Featured Fresh Harvests</h2>
            <p className="text-xs text-zinc-500">Graded and ready for instant dispatch from verified regional farm estates</p>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            View all produce ({featuredProducts.length}+ listings) →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((p) => {
            const img = p.images?.[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
            return (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-zinc-100">
                  <img src={img} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900/90 text-white">
                    {p.grade.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">{p.categoryName}</span>
                    <h3 className="font-bold text-zinc-900 text-sm mt-0.5">{p.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{p.farmLocation}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-zinc-900">{p.pricePerUnitEtb.toLocaleString()} ETB</span>
                      <span className="text-xs text-zinc-400"> /{p.unit}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                      Inspect & Order
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verified Farmlands & Agricultural Mechanization Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 border border-zinc-800 shadow-xl space-y-8 overflow-hidden relative">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 rounded-full inline-block">
                Ethiopian Farmland Corridors
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                From Verified Fields to Digital B2B Settlement
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
                Connecting mechanized farms in Arsi, Sidama, and Wonji with Addis Ababa's commercial kitchens, supermarket shelves, and export terminals.
              </p>
            </div>

            <button
              onClick={() => onNavigate('marketplace')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 self-start md:self-auto shrink-0 shadow-lg shadow-emerald-500/20"
            >
              <span>Explore Farm Batches</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* 3-Column Visual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Farm Place 1: Mechanized Farmland */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 overflow-hidden group hover:border-emerald-500/60 transition-all">
              <div className="relative aspect-16/10 overflow-hidden bg-zinc-800">
                <img
                  src={farmTractorIrrigation}
                  alt="Mechanized Ethiopian farmland with irrigation tractor"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-900/90 text-emerald-200 border border-emerald-500/40">
                  Mechanized Field
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Tractor className="h-4 w-4 text-emerald-400" /> Arsi & Wonji Farmlands
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Precision boom spraying, drip irrigation channels, and mechanized harvesting across 24,000+ hectares.
                </p>
              </div>
            </div>

            {/* Farm Place 2: Greenhouse Horticulture */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 overflow-hidden group hover:border-emerald-500/60 transition-all">
              <div className="relative aspect-16/10 overflow-hidden bg-zinc-800">
                <img
                  src={ethiopiaGreenhouseFarm}
                  alt="Modern protected greenhouse horticulture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-900/90 text-blue-200 border border-blue-500/40">
                  Greenhouse Hub
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Sprout className="h-4 w-4 text-blue-400" /> Protected Horticulture
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Export-grade bell peppers, cherry tomatoes, and microgreens grown in climate-controlled polytunnels in Bishoftu.
                </p>
              </div>
            </div>

            {/* Farm Place 3: Digital Buying & Mobile App */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 overflow-hidden group hover:border-emerald-500/60 transition-all">
              <div className="relative aspect-16/10 overflow-hidden bg-zinc-800">
                <img
                  src={digitalProduceApp}
                  alt="Buy fresh vegetables digitally on mobile phone"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-900/90 text-amber-200 border border-amber-500/40">
                  Buy By Digital
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4 text-amber-400" /> Digital Order & Escrow
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Inspect lots, verify moisture/grade certifications, and order directly on phone with guaranteed escrow release.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Founding Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
            Leadership & Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">
            Meet the Founding Team
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Our leadership combines extensive domain expertise in Agritech, Digital Marketplaces, Distributed Systems, and Financial Settlement across Ethiopia and East Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Bamlak Sisay */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-7 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center text-lg font-black shadow-md">
                  BS
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800">
                  Co-Founder & Product Lead
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-zinc-900">Bamlak Sisay</h3>
                <span className="text-[11px] font-semibold text-emerald-700 block">Agro-Tech Entrepreneur & Digital Ecosystem Architect</span>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                Dedicated agricultural technologist and entrepreneur with deep expertise in digital commerce and value-chain modernizations across Ethiopia. Bamlak drives the product roadmap, merchant escrow frameworks, and partnerships with agricultural unions and commercial buyers across East Africa.
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
              <span>AgriLink Co-Founding Partner</span>
            </div>
          </div>

          {/* Besufkad Anbes */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-7 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white flex items-center justify-center text-lg font-black shadow-md">
                  BA
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-800">
                  Co-Founder & Systems Architect
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-zinc-900">Besufkad Anbes</h3>
                <span className="text-[11px] font-semibold text-blue-700 block">Fintech & Scaled Distributed Systems Engineer</span>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                Software engineer and distributed systems specialist focused on financial technologies, offline USSD infrastructure (*6112#), and high-throughput B2B settlement engines. Besufkad leads platform engineering, cold-chain IoT tracking, and bank API integrations.
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
              <span>AgriLink Co-Founding Partner</span>
            </div>
          </div>
        </div>
      </section>

      {/* Discover the Future of Agriculture CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-zinc-900 via-emerald-950 to-zinc-950 text-white p-8 sm:p-12 border border-emerald-800/40 text-center space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block">
              AgriLink Digital Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Discover the future of agriculture.
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80">
              Unlock your potential with our innovative solutions. Empowering farmers to trade and transact digitally.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => onNavigate('marketplace')}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-700/40 transition-all cursor-pointer hover:scale-105"
              >
                Get Started with AgriLink
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
