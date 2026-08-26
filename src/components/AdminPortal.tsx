import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Truck,
  Award,
  Sparkles,
  RefreshCw,
  Database,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { User } from '../types/index.ts';

interface AdminPortalProps {
  currentUser: User | null;
  onRefreshAll: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onRefreshAll,
}) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ovRes, usrRes] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/auth/users'),
      ]);

      if (ovRes.ok) setMetrics(await ovRes.json());
      if (usrRes.ok) setAllUsers(await usrRes.json());
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        alert('PostgreSQL database re-seeded successfully with verified Ethiopian agricultural data.');
        fetchAdminData();
        onRefreshAll();
      }
    } catch (err) {
      console.error('Seed error:', err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="h-4 w-4" /> Platform Administration & Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              AgriLink Network Operations & Metrics
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl">
              Real-time transaction settlement, gross merchandise volume (GMV) in ETB, multi-role user RBAC directory, and Cloud SQL status.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Database className="h-4 w-4" /> {seeding ? 'Seeding DB...' : 'Reset / Seed Database'}
            </button>
            <button
              onClick={fetchAdminData}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
              title="Refresh Metrics"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
          <span className="text-xs text-zinc-500 font-semibold block">Total Platform GMV</span>
          <span className="text-2xl font-black text-emerald-950 mt-1 block">
            {metrics ? (metrics.gmvEtb || 0).toLocaleString() : '1,240,000'} ETB
          </span>
          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-2">
            <TrendingUp className="h-3.5 w-3.5" /> Escrow secured volume
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
          <span className="text-xs text-zinc-500 font-semibold block">Platform Revenue (2%)</span>
          <span className="text-2xl font-black text-zinc-900 mt-1 block">
            {metrics ? (metrics.platformRevenueEtb || 0).toLocaleString() : '24,800'} ETB
          </span>
          <span className="text-[11px] text-zinc-500 font-medium mt-2 block">
            Quality audit & payment escrow fee
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
          <span className="text-xs text-zinc-500 font-semibold block">Verified Farmers</span>
          <span className="text-2xl font-black text-zinc-900 mt-1 block">
            {metrics ? metrics.farmersCount : 2} Farmers
          </span>
          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-2">
            <CheckCircle2 className="h-3.5 w-3.5" /> 100% Traceability verified
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
          <span className="text-xs text-zinc-500 font-semibold block">Disbursed Agri-Loans</span>
          <span className="text-2xl font-black text-teal-950 mt-1 block">
            {metrics ? (metrics.financeDisbursedEtb || 0).toLocaleString() : '350,000'} ETB
          </span>
          <span className="text-[11px] text-teal-700 font-bold flex items-center gap-1 mt-2">
            Awash & CBE Agribusiness Grid
          </span>
        </div>
      </div>

      {/* User RBAC Directory */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-zinc-900">Platform Users & RBAC Directory</h3>
            <p className="text-xs text-zinc-500">All registered stakeholder accounts in PostgreSQL with active role mappings</p>
          </div>
          <span className="text-xs font-mono text-zinc-500">{allUsers.length} Active Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase font-bold">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Region / Base</th>
                <th className="p-4">Organization</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {allUsers.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover border border-zinc-200"
                      />
                      <div>
                        <div className="font-bold text-zinc-900">{u.fullName}</div>
                        <div className="text-[11px] text-zinc-400 font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
                      {u.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-700 font-medium">{u.region}</td>
                  <td className="p-4 text-zinc-700">{u.organizationName || '—'}</td>
                  <td className="p-4 text-zinc-600 font-mono">{u.phone}</td>
                  <td className="p-4">
                    {u.isVerified ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-zinc-400">Standard</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
