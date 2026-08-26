import React, { useState } from 'react';
import agrilinkLogo from '../assets/images/agrilink_logo_1787551924489.jpg';
import {
  Sprout,
  ShoppingCart,
  Bell,
  UserCheck,
  ChevronDown,
  Globe,
  Truck,
  Building2,
  Landmark,
  ShieldCheck,
  Menu,
  X,
  Package,
  Layers,
  Sparkles,
  Phone,
  UserPlus,
} from 'lucide-react';
import { User, UserRole } from '../types/index.ts';

interface NavbarProps {
  currentUser: User | null;
  allUsers: User[];
  onSwitchUser: (userId: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartItemCount: number;
  onOpenCart: () => void;
  unreadNotifsCount: number;
  onOpenNotifs: () => void;
  onOpenUSSD?: () => void;
  onOpenRegister?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  activeTab,
  setActiveTab,
  cartItemCount,
  onOpenCart,
  unreadNotifsCount,
  onOpenNotifs,
  onOpenUSSD,
  onOpenRegister,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadgeColor = (role?: UserRole) => {
    switch (role) {
      case 'FARMER':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'BUSINESS_BUYER':
      case 'BUYER':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'INPUT_SUPPLIER':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'DRIVER':
      case 'LOGISTICS_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'FINANCIAL_INSTITUTION':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'HUB_OPERATOR':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'PLATFORM_ADMIN':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-300';
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About & Team' },
    { id: 'marketplace', label: 'Produce Market' },
    { id: 'inputs', label: 'Inputs & Seeds' },
    { id: 'farmer-portal', label: 'My Farm & Produce' },
    { id: 'procurement', label: 'B2B Procurement' },
    { id: 'logistics', label: 'Logistics & Hubs' },
    { id: 'finance', label: 'Agri-Finance' },
    { id: 'admin', label: 'Admin Ops' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-zinc-200 shadow-xs">
      {/* Top Notification / Context Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 flex justify-between items-center border-b border-emerald-800/60">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Ethiopia Agro-Commerce Grid Active
          </span>
          <span className="hidden md:inline text-emerald-400/40">|</span>
          <span className="hidden md:inline text-emerald-200">
            Real-time trade in ETB (Birr) • Direct Farms & Cold-Chain Hubs
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          {onOpenUSSD && (
            <button
              onClick={onOpenUSSD}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold text-[11px] transition-colors cursor-pointer"
              title="Open USSD *6112# Simulation"
            >
              <Phone className="h-3 w-3 text-amber-300" />
              <span>*6112# USSD Code</span>
            </button>
          )}
          <a
            href="tel:0961123330"
            className="hidden sm:flex items-center gap-1 text-emerald-300 hover:text-white transition-colors"
          >
            <Phone className="h-3 w-3" /> 0961123330
          </a>
          <span className="hidden sm:inline text-emerald-400/40">|</span>
          <span className="flex items-center gap-1 text-emerald-200">
            <Globe className="h-3.5 w-3.5" /> Addis Ababa (UTC+3)
          </span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <img
                src={agrilinkLogo}
                alt="AgriLink Logo"
                className="h-11 w-11 rounded-full object-cover border-2 border-emerald-600 shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-xl font-black tracking-tight text-zinc-900">
                  AGRI<span className="text-emerald-700">LINK</span>
                </span>
                <span className="block text-[10px] font-semibold text-zinc-500 tracking-wider uppercase">
                  Ethiopia & African Agritech
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Side: Role Switcher & Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-300 hover:border-emerald-500 bg-zinc-50 hover:bg-white text-xs font-medium transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Active Persona</span>
                  <span className="font-bold text-zinc-900 truncate max-w-[120px] sm:max-w-[160px]">
                    {currentUser?.fullName || 'Select User'}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeColor(currentUser?.role)}`}>
                  {currentUser?.role?.replace('_', ' ')}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-zinc-100">
                    <p className="text-xs font-bold text-zinc-900">Switch Stakeholder View</p>
                    <p className="text-[11px] text-zinc-500">
                      Experience AgriLink across all 9 connected platform roles:
                    </p>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u.id);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-emerald-50/70 transition-colors cursor-pointer ${
                          currentUser?.id === u.id ? 'bg-emerald-50 font-semibold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                            alt={u.fullName}
                            className="h-8 w-8 rounded-full object-cover border border-zinc-200"
                          />
                          <div>
                            <p className="text-xs font-bold text-zinc-900 leading-tight">{u.fullName}</p>
                            <p className="text-[11px] text-zinc-500 truncate max-w-[140px]">
                              {u.organizationName || u.region}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getRoleBadgeColor(u.role)}`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </button>
                    ))}
                  </div>
                  {onOpenRegister && (
                    <div className="p-2 border-t border-zinc-100 bg-zinc-50/70">
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          onOpenRegister();
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <UserPlus className="h-3.5 w-3.5" /> Register New Account
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Register New Farmer/Buyer Button */}
            {onOpenRegister && (
              <button
                onClick={onOpenRegister}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                <UserPlus className="h-3.5 w-3.5 text-emerald-700" />
                <span>Join & Classify</span>
              </button>
            )}

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifs}
              className="relative p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-emerald-900/60 px-1.5 py-0.5 rounded-full text-xs font-bold">
                {cartItemCount}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
