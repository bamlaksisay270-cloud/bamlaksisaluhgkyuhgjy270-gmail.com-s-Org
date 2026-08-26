import React from 'react';
import agrilinkLogo from '../assets/images/agrilink_logo_1787551924489.jpg';
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
} from 'lucide-react';
import { ProductCategory, Product } from '../types/index.ts';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  categories: ProductCategory[];
  featuredProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  categories,
  featuredProducts,
  onSelectProduct,
}) => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-zinc-900 to-emerald-900 text-white shadow-2xl border border-emerald-800/40">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
          
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-4xl space-y-6 flex flex-col md:flex-row md:items-center md:gap-10">
            <div className="space-y-6 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 backdrop-blur-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                Ethiopia & African Agricultural Trade Grid
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
                Connecting <span className="text-emerald-400">Farmers</span>, Markets, Finance & Logistics.
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
                Direct-to-grower transparency with batch traceability, cold-chain aggregation hubs in Addis Ababa & Adama, and real-time escrow settlements in Ethiopian Birr (ETB).
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-700/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  Explore Live Produce <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onNavigate('farmer-portal')}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold backdrop-blur-xs border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sprout className="h-4 w-4" /> For Farmers & Producers
                </button>
                <button
                  onClick={() => onNavigate('procurement')}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold backdrop-blur-xs border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Building2 className="h-4 w-4" /> B2B Sourcing
                </button>
              </div>
            </div>

            {/* Emblem Logo Badge Showcase */}
            <div className="shrink-0 flex flex-col items-center justify-center p-4 bg-emerald-900/60 rounded-2xl border border-emerald-700/50 shadow-2xl backdrop-blur-md">
              <img
                src={agrilinkLogo}
                alt="AgriLink Official Emblem"
                className="h-36 w-36 sm:h-44 sm:w-44 rounded-full object-cover border-4 border-emerald-400 shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <span className="mt-3 text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                Official Seal
              </span>
              <span className="text-[10px] text-emerald-200/80 font-medium">
                Verified Agriculture
              </span>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
            {/* Trade Feature */}
            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Sprout className="h-4 w-4" /> Trade — Produce Marketplace
                </span>
                <h3 className="text-base font-bold text-zinc-900">
                  Direct B2B Produce Marketplace
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  AgriLink’s Produce Marketplace is a B2B e-commerce platform that makes it easy and safe to trade fruit and vegetables with multiple producers across different regions. Our digital solutions solve issues inherent to food trading, including price discovery, quality verification, payments, and batch traceability.
                </p>
              </div>
              <button
                onClick={() => onNavigate('marketplace')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start cursor-pointer"
              >
                Browse Produce Marketplace <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Transact Feature */}
            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                  <Boxes className="h-4 w-4" /> Transact — Inputs Marketplace
                </span>
                <h3 className="text-base font-bold text-zinc-900">
                  Input Procurement & Data-Backed Financing
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Farmers can procure all their farm supplies directly from manufacturers by using AgriLink's Inputs Marketplace. We also provide input financing solutions based on a farmer’s trading data and regional benchmarking.
                </p>
              </div>
              <button
                onClick={() => onNavigate('inputs')}
                className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 self-start cursor-pointer"
              >
                Browse Inputs Marketplace <ArrowRight className="h-3.5 w-3.5" />
              </button>
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
            Our founding team combines managerial experience in Food, E‑commerce, Finance, and Software Development at world-leading companies — including Amazon, Jumia, JP Morgan, and Luno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Louis de Kock */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center text-lg font-black shadow-md">
                  LdK
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800">
                  Co-Founder
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-zinc-900">Louis de Kock</h3>
                <span className="text-[11px] font-semibold text-emerald-700 block">Chartered Accountant & Oxford MBA</span>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                Son of a vegetable farmer, Louis started his career in investment banking before joining Amazon’s e-commerce teams in EU and US. Louis’s e-commerce experience includes launching Amazon Go’s produce division and managing meat & seafood for Amazon Fresh. His stint at Jumia, Africa’s largest online retailer, provided exposure to cross-border e-commerce in Africa.
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
              <span>Ex-Amazon, Jumia, Oxford</span>
            </div>
          </div>

          {/* Eugene Roodt */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white flex items-center justify-center text-lg font-black shadow-md">
                  ER
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-800">
                  Co-Founder
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-zinc-900">Eugene Roodt</h3>
                <span className="text-[11px] font-semibold text-blue-700 block">Chartered Accountant & Corporate Finance</span>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                Prior to AgriLink, Eugene worked for J.P. Morgan as an experienced Investment Banker and qualified Chartered Accountant working in London, Sydney, and Johannesburg. He focused on clients and transactions in the Consumer, Retail and Technology space. During his corporate finance career he helped corporations on numerous transactions including mergers & acquisitions, IPOs and fundraising.
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
              <span>Ex-J.P. Morgan (London/Sydney)</span>
            </div>
          </div>

          {/* Rick Kleinhans */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-700 to-purple-900 text-white flex items-center justify-center text-lg font-black shadow-md">
                  RK
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-purple-50 text-purple-800">
                  Co-Founder
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-zinc-900">Rick Kleinhans</h3>
                <span className="text-[11px] font-semibold text-purple-700 block">Software Developer & Systems Architect</span>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                A software developer by trade, Rick is passionate about building companies and has spent his entire career either as a founder, or an early employee, at various startups. Most recently he helped Luno grow from a 15 person team into a global brand serving more than 5 million customers, in more than 40 countries. Alongside fintech his experience also includes time in travel, e‑commerce, and enterprise SaaS systems.
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
              <span>Ex-Luno, Global FinTech & SaaS</span>
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
