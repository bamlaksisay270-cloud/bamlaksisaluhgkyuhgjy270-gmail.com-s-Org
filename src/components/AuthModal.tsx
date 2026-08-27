import React, { useState } from 'react';
import agrilinkLogo from '../assets/images/agrilink_logo_1787551924489.jpg';
import {
  LogIn,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Phone,
  Lock,
  Users,
  Eye,
  MoreVertical,
  Headphones,
  Smartphone,
  Award,
} from 'lucide-react';
import { User, UserRole } from '../types/index.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'LOGIN' | 'SIGNUP';
  allUsers: User[];
  currentUser: User | null;
  onSelectExistingUser: (userId: number) => void;
  onOpenSignUp: () => void;
  onOpenUSSD?: () => void;
  onContinueAsGuest?: () => void;
  onOpenCallCenter?: () => void;
  onOpenBrand?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'LOGIN',
  allUsers,
  currentUser,
  onSelectExistingUser,
  onOpenSignUp,
  onOpenUSSD,
  onContinueAsGuest,
  onOpenCallCenter,
  onOpenBrand,
}) => {
  const [activeTab, setActiveTab] = useState<'EXISTING' | 'PIN_LOGIN'>('EXISTING');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  if (!isOpen) return null;

  const filteredUsers = allUsers.filter((u) => {
    if (selectedRoleFilter === 'ALL') return true;
    return u.role === selectedRoleFilter;
  });

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      setLoginError('Please enter your phone number or email.');
      return;
    }

    const match = allUsers.find(
      (u) =>
        u.phone?.replace(/\s+/g, '') === phoneOrEmail.replace(/\s+/g, '') ||
        u.email?.toLowerCase() === phoneOrEmail.trim().toLowerCase()
    );

    if (match) {
      onSelectExistingUser(match.id);
      onClose();
    } else {
      setLoginError('Account not found with this phone/email. Please select a persona or create an account.');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'FARMER':
        return { label: 'Smallholder Farmer', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'BUSINESS_BUYER':
      case 'BUYER':
        return { label: 'Commercial Buyer', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'INPUT_SUPPLIER':
        return { label: 'Input Supplier', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'DRIVER':
      case 'LOGISTICS_ADMIN':
      case 'HUB_OPERATOR':
        return { label: 'Logistics Desk', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'FINANCIAL_INSTITUTION':
        return { label: 'Banking & Escrow', color: 'bg-teal-50 text-teal-800 border-teal-200' };
      case 'PLATFORM_ADMIN':
        return { label: 'System Admin', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      default:
        return { label: 'Stakeholder', color: 'bg-zinc-100 text-zinc-800 border-zinc-200' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-lg w-full border border-zinc-200 shadow-2xl overflow-hidden text-zinc-900 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-zinc-950 text-white p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <img
                src={agrilinkLogo}
                alt="AgriLink Emblem"
                className="h-10 w-10 rounded-full object-cover border-2 border-emerald-500 shadow-md bg-white shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-white">
                    AGRI<span className="text-emerald-400">LINK</span> ETHIOPIA
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  National Agricultural Gateway & Escrow System
                </p>
              </div>
            </div>

            {/* Three Dots Menu & Close */}
            <div className="flex items-center gap-1">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="More Options & Help"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {/* Dropdown Menu behind the three dots */}
                {moreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-200 py-1.5 z-50 text-zinc-900 animate-in fade-in duration-100">
                    <div className="px-3 py-1.5 border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      More Options
                    </div>

                    {onOpenCallCenter && (
                      <button
                        onClick={() => {
                          setMoreMenuOpen(false);
                          onClose();
                          onOpenCallCenter();
                        }}
                        className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-xs font-semibold text-zinc-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        <Headphones className="h-4 w-4 text-emerald-700" />
                        <span>Call Center & Support</span>
                      </button>
                    )}

                    {onOpenUSSD && (
                      <button
                        onClick={() => {
                          setMoreMenuOpen(false);
                          onClose();
                          onOpenUSSD();
                        }}
                        className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-xs font-semibold text-zinc-800 hover:bg-amber-50 transition-colors cursor-pointer"
                      >
                        <Smartphone className="h-4 w-4 text-amber-600" />
                        <span>*6112# Offline USSD</span>
                      </button>
                    )}

                    {onContinueAsGuest && (
                      <button
                        onClick={() => {
                          setMoreMenuOpen(false);
                          onContinueAsGuest();
                          onClose();
                        }}
                        className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors cursor-pointer"
                      >
                        <Eye className="h-4 w-4 text-zinc-600" />
                        <span>Browse as Guest</span>
                      </button>
                    )}

                    {onOpenBrand && (
                      <button
                        onClick={() => {
                          setMoreMenuOpen(false);
                          onClose();
                          onOpenBrand();
                        }}
                        className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors cursor-pointer"
                      >
                        <Award className="h-4 w-4 text-zinc-600" />
                        <span>Brand & Accreditations</span>
                      </button>
                    )}

                    <div className="border-t border-zinc-100 my-1"></div>

                    <button
                      onClick={() => {
                        setMoreMenuOpen(false);
                        onClose();
                        onOpenSignUp();
                      }}
                      className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      <UserPlus className="h-4 w-4 text-emerald-700" />
                      <span>Create New Account</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Clean Tab Bar */}
        <div className="flex border-b border-zinc-100 bg-zinc-50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('EXISTING')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'EXISTING'
                ? 'border-emerald-700 text-emerald-950'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Users className="h-4 w-4" /> Demo Stakeholders
          </button>
          <button
            onClick={() => setActiveTab('PIN_LOGIN')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'PIN_LOGIN'
                ? 'border-emerald-700 text-emerald-950'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <LogIn className="h-4 w-4" /> Phone & PIN Sign In
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'EXISTING' ? (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-zinc-600">
                  Select a verified demo account:
                </span>

                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="text-xs font-semibold bg-white border border-zinc-200 rounded-lg px-2 py-1 text-zinc-700 cursor-pointer focus:outline-emerald-600"
                >
                  <option value="ALL">All Roles</option>
                  <option value="FARMER">Farmers</option>
                  <option value="BUSINESS_BUYER">Buyers</option>
                  <option value="INPUT_SUPPLIER">Suppliers</option>
                  <option value="FINANCIAL_INSTITUTION">Banks</option>
                  <option value="LOGISTICS_ADMIN">Logistics</option>
                </select>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredUsers.map((u) => {
                  const badge = getRoleBadge(u.role);
                  const isCurrent = currentUser?.id === u.id;

                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectExistingUser(u.id);
                        onClose();
                      }}
                      className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                          : 'border-zinc-200 hover:border-emerald-500 hover:bg-zinc-50 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                          alt={u.fullName}
                          className="h-9 w-9 rounded-full object-cover border border-zinc-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-zinc-900">{u.fullName}</span>
                            {isCurrent && (
                              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 truncate max-w-[200px]">
                            {u.organizationName || u.region}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handlePinSubmit} className="space-y-3.5">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Phone Number or Email
                </label>
                <input
                  type="text"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="e.g. 0961123330 or name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  4-Digit PIN
                </label>
                <input
                  type="password"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="•••• (Default: 1234)"
                  maxLength={6}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono tracking-widest focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <LogIn className="h-4 w-4" /> Sign In
              </button>
            </form>
          )}

          {/* Clean Bottom Action Row */}
          <div className="pt-2 flex items-center justify-between border-t border-zinc-100 text-xs">
            <button
              onClick={() => {
                onClose();
                onOpenSignUp();
              }}
              className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Create Account</span>
            </button>

            {onContinueAsGuest && (
              <button
                onClick={() => {
                  onContinueAsGuest();
                  onClose();
                }}
                className="text-zinc-500 hover:text-zinc-800 font-semibold cursor-pointer"
              >
                Continue as Guest →
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-zinc-50 border-t border-zinc-200 text-center text-[10px] text-zinc-500 flex items-center justify-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
          <span>Telebirr & CBE Escrow Protected System</span>
        </div>
      </div>
    </div>
  );
};
