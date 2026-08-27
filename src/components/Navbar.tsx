import React, { useState, useEffect } from 'react';
import agrilinkLogo from '../assets/images/agrilink_logo_1787551924489.jpg';
import {
  ShoppingCart,
  Bell,
  ChevronDown,
  Globe,
  Truck,
  Building2,
  Landmark,
  ShieldCheck,
  Menu,
  X,
  Phone,
  UserPlus,
  ArrowUpRight,
  Sprout,
  Store,
  Layers,
  Eye,
  CheckCircle2,
  LogIn,
  Users,
  LogOut,
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
  onOpenBrandModal?: () => void;
  onOpenAuthModal?: () => void;
  onLogoutToGuest?: () => void;
  onOpenCallCenter?: () => void;
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
  onOpenBrandModal,
  onOpenAuthModal,
  onLogoutToGuest,
  onOpenCallCenter,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Smart Hide on Scroll Down / Reveal on Scroll Up
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 15);

      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        // User scrolling down -> smoothly hide top header
        setIsVisible(false);
        setRoleDropdownOpen(false);
        setMoreDropdownOpen(false);
      } else if (currentScrollY < lastScrollY) {
        // User scrolling up -> smoothly reveal header
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const getRoleBadgeColor = (role?: UserRole) => {
    switch (role) {
      case 'FARMER':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'BUSINESS_BUYER':
      case 'BUYER':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'INPUT_SUPPLIER':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'DRIVER':
      case 'LOGISTICS_ADMIN':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 'FINANCIAL_INSTITUTION':
        return 'bg-teal-50 text-teal-800 border-teal-300';
      case 'HUB_OPERATOR':
        return 'bg-orange-50 text-orange-800 border-orange-300';
      case 'PLATFORM_ADMIN':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-300';
    }
  };

  // Minimized, Clean Core Navigation
  const coreNavItems = [
    { id: 'marketplace', label: 'Market' },
    { id: 'procurement', label: 'B2B' },
    { id: 'farmer-portal', label: 'Farm' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'finance', label: 'Finance' },
  ];

  const extraNavItems = [
    { id: 'admin', label: 'Owner & Admin', icon: ShieldCheck },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'about', label: 'About', icon: Globe },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-200/80'
          : 'bg-white/98 backdrop-blur-xs border-b border-zinc-200 shadow-2xs'
      }`}
    >
      {/* Sleek, Minimal Top Utility Strip */}
      <div className="bg-zinc-950 text-zinc-300 text-[11px] px-3 sm:px-6 py-1 flex justify-between items-center border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ETB Escrow Active
          </span>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <span className="text-zinc-400 hidden sm:inline">Direct Farm to Market</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Call Center Button */}
          {onOpenCallCenter ? (
            <button
              onClick={onOpenCallCenter}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 hover:text-white text-[11px] font-bold tracking-wide transition-all cursor-pointer border border-emerald-700/60 shadow-2xs"
              title="Call Center, Hotline 0961123330 & USSD *6112#"
            >
              <Phone className="h-3 w-3 text-emerald-400" />
              <span>Call Center</span>
              <span className="px-1 py-0.1 text-[9px] font-extrabold bg-emerald-400/20 text-emerald-200 rounded">24/7</span>
            </button>
          ) : (
            <a
              href="tel:0961123330"
              className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors text-[11px] font-medium"
            >
              <Phone className="h-2.5 w-2.5 text-emerald-400" /> Call Center
            </a>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              {/* Clickable Logo */}
              <button
                onClick={() => {
                  if (onOpenBrandModal) onOpenBrandModal();
                  else handleNavClick('home');
                }}
                className="relative cursor-pointer group shrink-0"
                title="View AgriLink Logo & Official Brand"
              >
                <img
                  src={agrilinkLogo}
                  alt="AgriLink Emblem"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-emerald-600 shadow-xs group-hover:ring-2 group-hover:ring-emerald-400 transition-all"
                  referrerPolicy="no-referrer"
                />
              </button>

              {/* Minimal Brand Name */}
              <button
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-1 text-left cursor-pointer group"
                title="Go to Home"
              >
                <span className="text-base sm:text-lg font-black tracking-tight text-zinc-950 group-hover:text-emerald-800 transition-colors">
                  AGRI<span className="text-emerald-700">LINK</span>
                </span>
              </button>
            </div>

            {/* Desktop Clean Nav Items */}
            <nav className="hidden lg:flex items-center gap-1">
              {coreNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* Extra Items Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    extraNavItems.some((e) => e.id === activeTab)
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-zinc-200 py-1.5 z-50 animate-in fade-in duration-100">
                    {extraNavItems.map((sec) => {
                      const Icon = sec.icon;
                      const isSecActive = activeTab === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => handleNavClick(sec.id)}
                          className={`w-full px-3 py-1.5 text-left flex items-center gap-2 text-xs font-medium cursor-pointer ${
                            isSecActive ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          <Icon className={`h-3.5 w-3.5 ${isSecActive ? 'text-emerald-700' : 'text-zinc-400'}`} />
                          <span>{sec.label}</span>
                        </button>
                      );
                    })}
                    {onOpenCallCenter && (
                      <button
                        onClick={() => {
                          setMoreDropdownOpen(false);
                          onOpenCallCenter();
                        }}
                        className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-xs text-emerald-800 hover:bg-emerald-50 border-t border-zinc-100 mt-1 pt-1.5 font-semibold cursor-pointer"
                      >
                        <Phone className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Call Center & USSD</span>
                      </button>
                    )}
                    {onOpenBrandModal && (
                      <button
                        onClick={() => {
                          setMoreDropdownOpen(false);
                          onOpenBrandModal();
                        }}
                        className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-xs text-zinc-700 hover:bg-zinc-50 font-medium cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Logo & Credentials</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Actions: Pro User Account / Sign In Trigger */}
          <div className="flex items-center gap-2">
            
            {/* Conditional Display: Guest Mode vs Logged In Account */}
            {!currentUser ? (
              <div className="flex items-center gap-1.5">
                {/* Guest Mode Badge */}
                <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px] font-bold">
                  <Eye className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Guest Explorer</span>
                </div>

                {/* Log In Button */}
                {onOpenAuthModal && (
                  <button
                    onClick={onOpenAuthModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    title="Log in to your account"
                  >
                    <LogIn className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Log In</span>
                  </button>
                )}

                {/* Sign Up Button */}
                {onOpenRegister && (
                  <button
                    onClick={onOpenRegister}
                    className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    title="Register a free account"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Sign Up</span>
                  </button>
                )}

                {/* Persona Switcher Quick Dropdown for Evaluators */}
                <div className="relative">
                  <button
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="p-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white text-zinc-600 hover:text-zinc-900 text-xs transition-colors cursor-pointer"
                    title="Try Demo Persona"
                  >
                    <Users className="h-4 w-4 text-zinc-600" />
                  </button>

                  {roleDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-zinc-200 py-1.5 z-50 animate-in fade-in duration-100">
                      <div className="px-3 py-1.5 border-b border-zinc-100 text-[11px] font-bold text-zinc-700 flex items-center justify-between">
                        <span>Demo Stakeholder Accounts</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto py-1">
                        {allUsers.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              onSwitchUser(u.id);
                              setRoleDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-emerald-50/60 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={u.avatarUrl}
                                alt={u.fullName}
                                className="h-6 w-6 rounded-full object-cover"
                              />
                              <div>
                                <p className="text-xs font-semibold text-zinc-900 leading-none">{u.fullName}</p>
                                <p className="text-[10px] text-zinc-400 mt-0.5">{u.organizationName || u.region}</p>
                              </div>
                            </div>
                            <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold border ${getRoleBadgeColor(u.role)}`}>
                              {u.role.replace('_', ' ')}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Authenticated User Menu */
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-zinc-50/70 hover:bg-white text-xs transition-colors cursor-pointer"
                  title="Account Details & Switcher"
                >
                  <img
                    src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={currentUser?.fullName || 'User'}
                    className="h-5 w-5 rounded-full object-cover shrink-0"
                  />
                  <span className="font-semibold text-zinc-900 text-xs hidden sm:inline max-w-[90px] truncate">
                    {currentUser?.fullName?.split(' ')[0] || 'User'}
                  </span>
                  <span className={`hidden md:inline px-1.5 py-0.2 rounded text-[9px] font-bold border ${getRoleBadgeColor(currentUser?.role)}`}>
                    {currentUser?.role?.replace('_', ' ')}
                  </span>
                  <ChevronDown className="h-3 w-3 text-zinc-400 shrink-0" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-zinc-200 py-1.5 z-50 animate-in fade-in duration-100">
                    <div className="px-3 py-2 border-b border-zinc-100">
                      <p className="text-xs font-bold text-zinc-900 leading-none">{currentUser.fullName}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{currentUser.organizationName || currentUser.region}</p>
                    </div>

                    <div className="px-3 py-1.5 bg-zinc-50 border-b border-zinc-100 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Switch Stakeholder Persona
                    </div>

                    <div className="max-h-52 overflow-y-auto py-1">
                      {allUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u.id);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-emerald-50/60 transition-colors cursor-pointer ${
                            currentUser?.id === u.id ? 'bg-emerald-50/80 font-bold' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={u.avatarUrl}
                              alt={u.fullName}
                              className="h-5 w-5 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-xs font-semibold text-zinc-900 leading-none">{u.fullName}</p>
                              <p className="text-[10px] text-zinc-400 mt-0.5">{u.organizationName || u.region}</p>
                            </div>
                          </div>
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold border ${getRoleBadgeColor(u.role)}`}>
                            {u.role.replace('_', ' ')}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Return to Guest Mode / Log Out */}
                    <div className="p-1.5 border-t border-zinc-100 space-y-1">
                      {onLogoutToGuest && (
                        <button
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            onLogoutToGuest();
                          }}
                          className="w-full py-1.5 px-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5 text-zinc-600" />
                          <span>Log Out (Browse as Guest)</span>
                        </button>
                      )}

                      {onOpenRegister && (
                        <button
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            onOpenRegister();
                          }}
                          className="w-full py-1 px-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <UserPlus className="h-3 w-3" /> New Account
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifs}
              className="relative p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>{cartItemCount}</span>
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 py-2 space-y-1 bg-white">
            {onOpenAuthModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold bg-emerald-700 text-white flex items-center gap-2 mb-2"
              >
                <LogIn className="h-4 w-4" /> Log In / Switch Account
              </button>
            )}

            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold ${
                activeTab === 'home' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              Home
            </button>
            {[...coreNavItems, ...extraNavItems].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold ${
                    isActive ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            {onOpenCallCenter && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCallCenter();
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 flex items-center gap-1.5 mt-1"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-600" /> Call Center & USSD
              </button>
            )}
            {onOpenBrandModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBrandModal();
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center gap-1.5"
              >
                <Eye className="h-3.5 w-3.5 text-zinc-500" /> View Logo & Brand
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
