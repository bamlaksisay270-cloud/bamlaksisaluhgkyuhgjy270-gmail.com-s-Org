import React from 'react';
import agrilinkLogo from '../assets/images/agrilink_logo_1787551924489.jpg';
import produceTruckCargo from '../assets/images/produce_truck_cargo_1787818869404.jpg';
import {
  ArrowRight,
  ShieldCheck,
  Phone,
  Sparkles,
  Award,
  LogIn,
  CheckCircle2,
} from 'lucide-react';
import { User } from '../types/index.ts';

interface IntroHeroProps {
  currentUser: User | null;
  onExploreMarket: () => void;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onOpenUSSD: () => void;
  onOpenBrand: () => void;
  onLogoutToGuest?: () => void;
  onOpenCallCenter?: () => void;
}

export const IntroHero: React.FC<IntroHeroProps> = ({
  currentUser,
  onExploreMarket,
  onOpenLogin,
  onOpenSignUp,
  onOpenUSSD,
  onOpenBrand,
  onLogoutToGuest,
  onOpenCallCenter,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-emerald-950 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/40">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mt-20"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Notification Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>National Digital Agriculture Platform for Ethiopia</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-white font-bold">Public Explorer Mode Active</span>
          </div>

          {/* Quick Support & Offline Access */}
          <div className="flex items-center gap-2 text-xs">
            {onOpenCallCenter && (
              <button
                onClick={onOpenCallCenter}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/50 hover:bg-emerald-800/70 text-emerald-300 border border-emerald-600/50 font-bold transition-all cursor-pointer shadow-xs"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>Call Center (24/7)</span>
              </button>
            )}
            <button
              onClick={onOpenUSSD}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>Offline USSD *6112#</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Value Proposition + Interactive Sign In / Register Portal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Brand Story & Impact */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenBrand}
                className="group relative cursor-pointer"
                title="View High-Res Official AgriLink Emblem"
              >
                <img
                  src={agrilinkLogo}
                  alt="AgriLink Emblem"
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl shadow-emerald-950/60 group-hover:scale-105 transition-transform bg-white"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-zinc-950">
                  <CheckCircle2 className="h-3 w-3" />
                </span>
              </button>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified Ethiopian Agri-Grid
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">
                  AGRI<span className="text-emerald-400">LINK</span> ETHIOPIA
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-1">
                  Direct Farmer-to-Processor Commerce, Input Credit & Cold-Chain Logistics
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl font-normal">
              Browse live harvest yields, wholesale contracts, and regional freight corridors <strong>without any mandatory login</strong>. When you are ready to buy, sell, or finance, join with your phone in seconds.
            </p>

            {/* Key Feature Stats Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-2xl backdrop-blur-xs">
                <p className="text-lg font-black text-emerald-400">Open Access</p>
                <p className="text-[11px] text-zinc-400 font-medium">Browse Without Sign In</p>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-2xl backdrop-blur-xs">
                <p className="text-lg font-black text-amber-400">*6112# USSD</p>
                <p className="text-[11px] text-zinc-400 font-medium">Offline 2G Farm Access</p>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-2xl backdrop-blur-xs">
                <p className="text-lg font-black text-blue-400">Escrow Security</p>
                <p className="text-[11px] text-zinc-400 font-medium">Telebirr & CBE Birr</p>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-2xl backdrop-blur-xs">
                <p className="text-lg font-black text-purple-400">Cold-Chain Hubs</p>
                <p className="text-[11px] text-zinc-400 font-medium">Addis, Adama & Hawassa</p>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreMarket}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
              >
                <span>Browse Produce Market (Free)</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onOpenLogin}
                className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700"
              >
                <LogIn className="h-4 w-4 text-emerald-400" />
                <span>Log In / Sign In</span>
              </button>

              <button
                onClick={onOpenBrand}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
              >
                <Award className="h-4 w-4 text-emerald-400" />
                <span>Official Brand</span>
              </button>
            </div>
          </div>

          {/* Right Column: Fresh Produce Transport Logistics Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/80 group">
              <img
                src={produceTruckCargo}
                alt="Direct Farm-to-Market Produce Cold-Chain Transport"
                className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent"></div>
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-zinc-950 text-[11px] font-black uppercase tracking-wider shadow-md">
                  <ShieldCheck className="h-3.5 w-3.5" /> Direct Farm Dispatch
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-md">
                  Highland Produce in Transit
                </h3>
                <p className="text-xs text-emerald-100/90 font-medium">
                  Direct transport from smallholder farms to Addis Ababa wholesale hubs & processors.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
