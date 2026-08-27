import React from 'react';
import agrilinkLogo from '../assets/images/agrilink_logo_1787551924489.jpg';
import {
  Sprout,
  ShieldCheck,
  Globe,
  Phone,
  Mail,
  MapPin,
  Landmark,
  Truck,
  Building2,
  Lock,
} from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-zinc-900">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => {
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <img
                src={agrilinkLogo}
                alt="AgriLink Logo"
                className="h-11 w-11 rounded-full object-cover border-2 border-emerald-500 shadow-md shadow-emerald-950 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  AGRI<span className="text-emerald-500">LINK</span>
                </span>
                <span className="block text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">
                  Ethiopia & African Agritech
                </span>
              </div>
            </button>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Empowering farmers to trade and transact digitally. AgriLink creates digital solutions and logistical networks that transform the agricultural value chain across Africa.
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-500 pt-1">
              <span className="flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-emerald-500" /> PostgreSQL Secured
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Chapa & CBE Escrow
              </span>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  About & Big Picture
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  Meet the Team
                </button>
              </li>
              <li>
                <span className="text-zinc-600 cursor-not-allowed">Careers (Hiring)</span>
              </li>
              <li>
                <span className="text-zinc-600 cursor-not-allowed">News & Press</span>
              </li>
            </ul>
          </div>

          {/* By Role & Marketplaces */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">By Marketplace & Role</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-white transition-colors cursor-pointer">
                  Fresh Produce Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('inputs')} className="hover:text-white transition-colors cursor-pointer">
                  Inputs & Supplies Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('farmer-portal')} className="hover:text-white transition-colors cursor-pointer">
                  For Farmers: Sell Produce
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('procurement')} className="hover:text-white transition-colors cursor-pointer">
                  For Local & Global Buyers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('finance')} className="hover:text-white transition-colors cursor-pointer">
                  Input Financing Solutions
                </button>
              </li>
            </ul>
          </div>

          {/* Get the App & Contact */}
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Get the App</h4>
              <div className="space-y-1.5">
                <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-zinc-300">
                  <span>Google Play</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Available</span>
                </div>
                <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-zinc-300">
                  <span>App Store</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Available</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-zinc-900">
              <a href="mailto:bamlaksisay270@gmail.com" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <Mail className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>bamlaksisay270@gmail.com</span>
              </a>
              <a href="tel:0961123330" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>0961123330 (+251 96 112 3330)</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} AgriLink Agro-Trade Network PLC. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Ethiopian Birr (ETB) Verified</span>
            <span>Cloud SQL PostgreSQL Grid</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
