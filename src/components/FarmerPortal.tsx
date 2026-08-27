import React, { useState, useEffect } from 'react';
import farmTractorSunrise from '../assets/images/farm_tractor_sunrise_1787815703199.jpg';
import farmTractorIrrigation from '../assets/images/farm_tractor_irrigation_1787815687313.jpg';
import ethiopiaGreenhouseFarm from '../assets/images/ethiopia_greenhouse_farm_1787814574646.jpg';
import {
  Sprout,
  Plus,
  Layers,
  MapPin,
  TrendingUp,
  Award,
  DollarSign,
  Package,
  Calendar,
  CheckCircle2,
  Droplets,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  ArrowUpRight,
  Landmark,
  Phone,
  Factory,
  Briefcase,
  Store,
  Globe,
  Tractor,
} from 'lucide-react';
import { User, Farm, FarmField, Product, FinanceApplication, TargetBuyerType } from '../types/index.ts';

interface FarmerPortalProps {
  currentUser: User | null;
  onRefreshData: () => void;
  onNavigateToFinance: () => void;
  onOpenUSSD?: () => void;
}

export const FarmerPortal: React.FC<FarmerPortalProps> = ({
  currentUser,
  onRefreshData,
  onNavigateToFinance,
  onOpenUSSD,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'fields' | 'listings' | 'sales' | 'finance'>('overview');
  const [farmsList, setFarmsList] = useState<Farm[]>([]);
  const [fieldsList, setFieldsList] = useState<FarmField[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [mySales, setMySales] = useState<any[]>([]);
  const [myLoans, setMyLoans] = useState<FinanceApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // New Field Form State
  const [showNewFieldModal, setShowNewFieldModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldCrop, setNewFieldCrop] = useState('Roma Tomatoes');
  const [newFieldArea, setNewFieldArea] = useState('2.5');
  const [newFieldHarvestDate, setNewFieldHarvestDate] = useState('2026-10-15');

  // New Listing Form State
  const [showNewListingModal, setShowNewListingModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('1');
  const [newProdGrade, setNewProdGrade] = useState('GRADE_1_EXPORT');
  const [newProdPrice, setNewProdPrice] = useState('85');
  const [newProdUnit, setNewProdUnit] = useState('KG');
  const [newProdQty, setNewProdQty] = useState('2000');
  const [newProdMinQty, setNewProdMinQty] = useState('50');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdTargetBuyer, setNewProdTargetBuyer] = useState<TargetBuyerType>('ALL');

  const loadFarmerData = async () => {
    setLoading(true);
    try {
      if (currentUser) {
        const res = await fetch(`/api/farmers/${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setFarmsList(data.farms || []);
          const allFields = (data.farms || []).flatMap((f: any) => f.fields || []);
          setFieldsList(allFields);
          setMyProducts(data.products || []);
        }

        const ordersRes = await fetch(`/api/orders?role=FARMER`);
        if (ordersRes.ok) {
          const ords = await ordersRes.json();
          setMySales(ords);
        }

        const loansRes = await fetch(`/api/finance/applications`);
        if (loansRes.ok) {
          const lns = await loansRes.json();
          setMyLoans(lns.filter((l: any) => l.farmerId === currentUser.id));
        }
      }
    } catch (err) {
      console.error('Failed to load farmer portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmerData();
  }, [currentUser]);

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmsList.length) return;
    try {
      const res = await fetch(`/api/farms/${farmsList[0].id}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldName: newFieldName,
          currentCrop: newFieldCrop,
          areaHectares: Number(newFieldArea),
          expectedHarvestDate: newFieldHarvestDate,
        }),
      });
      if (res.ok) {
        setShowNewFieldModal(false);
        setNewFieldName('');
        loadFarmerData();
      }
    } catch (err) {
      console.error('Error creating field:', err);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          categoryId: Number(newProdCategory),
          grade: newProdGrade,
          pricePerUnitEtb: Number(newProdPrice),
          unit: newProdUnit,
          availableQuantity: Number(newProdQty),
          minOrderQuantity: Number(newProdMinQty),
          description: newProdDesc || 'Premium harvest from verified AgriLink farm parcel.',
          farmLocation: farmsList[0]?.locationName || 'Wonji Horizon Estate',
          region: currentUser?.region || 'Oromia',
          farmId: farmsList[0]?.id || null,
          targetBuyerType: newProdTargetBuyer,
        }),
      });
      if (res.ok) {
        setShowNewListingModal(false);
        setNewProdName('');
        setNewProdDesc('');
        loadFarmerData();
        onRefreshData();
      }
    } catch (err) {
      console.error('Error creating listing:', err);
    }
  };

  const totalRevenue = mySales.reduce((acc, curr) => acc + (curr.totalAmountEtb || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser?.fullName}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-emerald-400/40 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{currentUser?.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Verified Producer
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
                {farmsList[0]?.name || 'Wonji Horizon Agro-Farm'} • {currentUser?.region || 'Oromia Region'}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-emerald-300">
                <span>Total Managed Land: <strong className="text-white">14.5 Hectares</strong></span>
                <span>•</span>
                <span>Active Field Plots: <strong className="text-white">{fieldsList.length || 3}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setShowNewListingModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> List Produce for Sale
            </button>
            {onOpenUSSD && (
              <button
                onClick={onOpenUSSD}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
                title="Dial *6112# USSD Code"
              >
                <Phone className="h-4 w-4 text-amber-300" /> Dial *6112# USSD
              </button>
            )}
            <button
              onClick={() => setShowNewFieldModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-xs border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <Layers className="h-4 w-4" /> Add Digital Field
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-zinc-200 mb-8 overflow-x-auto scrollbar-none gap-2">
        {[
          { id: 'overview', label: 'Farm Overview' },
          { id: 'fields', label: `Digital Fields (${fieldsList.length})` },
          { id: 'listings', label: `Active Produce Listings (${myProducts.length})` },
          { id: 'sales', label: `Verified Sales Ledger (${mySales.length})` },
          { id: 'finance', label: `Agri-Credit & Loans (${myLoans.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer ${
              activeSubTab === tab.id
                ? 'border-b-2 border-emerald-700 text-emerald-900 font-extrabold'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
              <span className="text-xs text-zinc-500 font-semibold block">Total Verified Sales</span>
              <span className="text-2xl font-black text-zinc-900 mt-1 block">
                {totalRevenue > 0 ? totalRevenue.toLocaleString() : '65,000'} ETB
              </span>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-2">
                <TrendingUp className="h-3.5 w-3.5" /> Direct escrow payouts
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
              <span className="text-xs text-zinc-500 font-semibold block">Produce Sold to Date</span>
              <span className="text-2xl font-black text-zinc-900 mt-1 block">86.4 Tonnes</span>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-2">
                <CheckCircle2 className="h-3.5 w-3.5" /> 142 completed orders
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
              <span className="text-xs text-zinc-500 font-semibold block">Quality QC Score</span>
              <span className="text-2xl font-black text-zinc-900 mt-1 block">98.5%</span>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-2">
                <Award className="h-3.5 w-3.5" /> Export Grade Certification
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
              <span className="text-xs text-zinc-500 font-semibold block">Approved Bank Credit</span>
              <span className="text-2xl font-black text-emerald-900 mt-1 block">350,000 ETB</span>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-2">
                <Landmark className="h-3.5 w-3.5" /> Awash Agribusiness
              </span>
            </div>
          </div>

          {/* Active Field Parcels Spotlight & Farmland Landscape */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Digital Farm Fields & Mechanized Land Status</h3>
                <p className="text-xs text-zinc-500">Real-time health, soil moisture, and tractor mechanization telemetry</p>
              </div>
              <button
                onClick={() => setActiveSubTab('fields')}
                className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
              >
                View all fields →
              </button>
            </div>

            {/* Visual Farm Place Banner */}
            <div className="relative rounded-2xl overflow-hidden aspect-21/9 border border-zinc-200">
              <img
                src={farmTractorSunrise}
                alt="Registered Farmland Estate"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent p-5 flex flex-col justify-end">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                      Wonji Sector 4A • Active Cultivation
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-white mt-1">
                      Mechanized Plot Alpha (14.5 Hectares)
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-700 text-xs text-white">
                    <Tractor className="h-4 w-4 text-amber-400" />
                    <span>Next Tilling: <strong>Tomorrow, 07:00 AM</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fieldsList.slice(0, 3).map((f) => (
                <div key={f.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-zinc-900">{f.fieldName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900">
                      {f.status}
                    </span>
                  </div>
                  <div className="text-xs space-y-1 text-zinc-600">
                    <p>Crop: <strong className="text-zinc-800">{f.currentCrop}</strong></p>
                    <p>Area: <strong className="text-zinc-800">{f.areaHectares} Hectares</strong></p>
                    <p>Expected Harvest: <strong className="text-emerald-800">{f.expectedHarvestDate || '2026-09-01'}</strong></p>
                  </div>
                  <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <Droplets className="h-3.5 w-3.5" /> Moisture: {f.soilMoisturePercent}%
                    </span>
                    <span className="font-bold text-zinc-900">Health: {f.healthScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fields Tab */}
      {activeSubTab === 'fields' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Digital Farm Fields</h3>
              <p className="text-xs text-zinc-500">Manage crop varieties, soil moisture telemetry, and harvest schedules</p>
            </div>
            <button
              onClick={() => setShowNewFieldModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Add Field Plot
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fieldsList.map((field) => (
              <div key={field.id} className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700">Parcel #{field.id}</span>
                    <h4 className="font-bold text-sm text-zinc-900">{field.fieldName}</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900">
                    {field.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-zinc-600 bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Current Crop:</span>
                    <span className="font-bold text-zinc-900">{field.currentCrop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Variety:</span>
                    <span className="font-medium text-zinc-800">{field.variety || 'Standard High-Yield'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Parcel Area:</span>
                    <span className="font-bold text-zinc-900">{field.areaHectares} Hectares</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Expected Harvest:</span>
                    <span className="font-extrabold text-emerald-800">{field.expectedHarvestDate || '2026-09-15'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="flex items-center gap-1 font-bold text-emerald-700">
                    <Droplets className="h-4 w-4" /> Soil Moisture {field.soilMoisturePercent}%
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-100 font-bold text-zinc-800">
                    Health Index {field.healthScore}%
                  </span>
                </div>

                {field.notes && (
                  <p className="text-[11px] text-zinc-500 italic bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60">
                    {field.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listings Tab */}
      {activeSubTab === 'listings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Active Produce for Sale</h3>
              <p className="text-xs text-zinc-500">Manage real-time inventory, pricing in ETB, and lot batch traceability</p>
            </div>
            <button
              onClick={() => setShowNewListingModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Create New Listing
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase font-bold">
                <tr>
                  <th className="p-4">Crop Name & Lot</th>
                  <th className="p-4">Grade</th>
                  <th className="p-4">Price / Unit</th>
                  <th className="p-4">Available Qty</th>
                  <th className="p-4">Harvest Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {myProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/80">
                    <td className="p-4">
                      <div className="font-bold text-zinc-900">{p.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">Lot #{p.lotBatchNumber}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {p.grade.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 font-black text-zinc-900">
                      {p.pricePerUnitEtb.toLocaleString()} ETB <span className="text-zinc-400 font-normal">/{p.unit}</span>
                    </td>
                    <td className="p-4 font-bold text-zinc-800">
                      {p.availableQuantity.toLocaleString()} {p.unit}s
                    </td>
                    <td className="p-4 text-zinc-600">{p.harvestDate}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-100 text-emerald-900">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sales Ledger Tab */}
      {activeSubTab === 'sales' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-2xs">
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Audited Transaction History</h3>
            <p className="text-xs text-zinc-500 mb-6">
              Verified order disbursements stored in PostgreSQL and used by partner banks (Awash, CBE) for instant credit evaluation.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase font-bold">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Buyer Entity</th>
                    <th className="p-4">Items / Produce</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {mySales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-zinc-50">
                      <td className="p-4 font-mono font-bold text-zinc-900">{sale.orderNumber}</td>
                      <td className="p-4 font-semibold text-zinc-800">{sale.buyerName || 'Commercial Buyer'}</td>
                      <td className="p-4 text-zinc-600">
                        {sale.items?.map((it: any) => `${it.quantity} ${it.unit} ${it.name}`).join(', ') || 'Produce Batch'}
                      </td>
                      <td className="p-4 font-black text-emerald-950">{sale.totalAmountEtb?.toLocaleString()} ETB</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                          {sale.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          {sale.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Finance Tab */}
      {activeSubTab === 'finance' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Agri-Credit & Working Capital</h3>
              <p className="text-xs text-zinc-500">
                Lending decisions powered by audited AgriLink sales, farm titling, and seasonal yield data
              </p>
            </div>
            <button
              onClick={onNavigateToFinance}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Apply for New Loan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myLoans.map((loan) => (
              <div key={loan.id} className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-2xs space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700">{loan.loanType.replace(/_/g, ' ')}</span>
                    <h4 className="text-xl font-black text-zinc-900 mt-0.5">
                      {loan.amountRequestedEtb.toLocaleString()} ETB
                    </h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    loan.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {loan.status}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  {loan.purpose}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600">
                  <div>Target Crop: <strong className="text-zinc-900">{loan.targetCrop}</strong></div>
                  <div>Period: <strong className="text-zinc-900">{loan.repaymentPeriodMonths} Months</strong></div>
                  <div>Expected Revenue: <strong className="text-emerald-800">{loan.expectedRevenueEtb?.toLocaleString()} ETB</strong></div>
                  <div>Interest Rate: <strong className="text-zinc-900">{loan.interestRatePercent || 8.5}%</strong></div>
                </div>

                {loan.reviewNotes && (
                  <div className="pt-2 border-t border-zinc-100 text-[11px] text-zinc-600">
                    <strong className="text-zinc-900">Bank Credit Memo:</strong> {loan.reviewNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Digital Field */}
      {showNewFieldModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200">
            <h3 className="text-lg font-black text-zinc-900 mb-1">Add Digital Field Parcel</h3>
            <p className="text-xs text-zinc-500 mb-4">Record GPS boundary & crop data in PostgreSQL</p>
            <form onSubmit={handleCreateField} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Field Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector Delta - Hass Avocado North"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Crop</label>
                  <input
                    type="text"
                    required
                    value={newFieldCrop}
                    onChange={(e) => setNewFieldCrop(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Area (Hectares)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newFieldArea}
                    onChange={(e) => setNewFieldArea(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Expected Harvest Date</label>
                <input
                  type="date"
                  required
                  value={newFieldHarvestDate}
                  onChange={(e) => setNewFieldHarvestDate(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFieldModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-zinc-100 font-bold text-xs text-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-700 font-bold text-xs text-white cursor-pointer"
                >
                  Save Field Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Produce Listing */}
      {showNewListingModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-zinc-900 mb-1">List Produce on AgriLink Marketplace</h3>
            <p className="text-xs text-zinc-500 mb-4">Connect directly to commercial buyers and verified supermarkets</p>
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Produce Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Export Hass Avocados (Size 16)"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="1">Fresh Vegetables</option>
                    <option value="2">Fresh Fruits</option>
                    <option value="3">Grains & Cereals (Teff, Wheat, Maize)</option>
                    <option value="4">Fresh Tubers & Root Crops (Potatoes, Garlic)</option>
                    <option value="5">Fresh Culinary Herbs & Greens</option>
                    <option value="6">Pulses & Oilseeds</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Quality Grade</label>
                  <select
                    value={newProdGrade}
                    onChange={(e) => setNewProdGrade(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="GRADE_1_EXPORT">Export Grade 1</option>
                    <option value="GRADE_1_LOCAL">Local Grade 1</option>
                    <option value="GRADE_2_COMMERCIAL">Grade 2 Commercial</option>
                    <option value="PROCESSING_GRADE">Processing Grade</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Price (ETB)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Unit</label>
                  <select
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="KG">KG</option>
                    <option value="QUINTAL">QUINTAL (100kg)</option>
                    <option value="CRATE">CRATE</option>
                    <option value="BAG">BAG</option>
                    <option value="TON">TON</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Available Qty</label>
                  <input
                    type="number"
                    required
                    value={newProdQty}
                    onChange={(e) => setNewProdQty(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Target Buyer Channel Selection */}
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                <label className="text-xs font-black text-emerald-950 block mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
                  Target Buyer Channel: Who do you want to sell to?
                </label>
                <p className="text-[10px] text-zinc-500 mb-2.5">
                  Classify your harvest lot so matched commercial buyers and mills can bid immediately.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      id: 'PROCESSOR',
                      label: 'Food Processors',
                      desc: 'Paste, oil & flour mills',
                      icon: Factory,
                    },
                    {
                      id: 'INVESTOR',
                      label: 'Agri-Investors / Exporters',
                      desc: 'Contract outgrowers & export',
                      icon: Briefcase,
                    },
                    {
                      id: 'BUYER',
                      label: 'Supermarket & Retail',
                      desc: 'Stores, hotels & restaurants',
                      icon: Store,
                    },
                    {
                      id: 'ALL',
                      label: 'Open Market (All Channels)',
                      desc: 'Maximum buyer exposure',
                      icon: Globe,
                    },
                  ].map((chan) => {
                    const Icon = chan.icon;
                    const isSelected = newProdTargetBuyer === chan.id;
                    return (
                      <button
                        type="button"
                        key={chan.id}
                        onClick={() => setNewProdTargetBuyer(chan.id as TargetBuyerType)}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2 ${
                          isSelected
                            ? 'bg-white border-emerald-600 ring-2 ring-emerald-600 shadow-2xs'
                            : 'bg-white/60 border-zinc-200 hover:bg-white text-zinc-600'
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${isSelected ? 'text-emerald-700' : 'text-zinc-400'}`} />
                        <div>
                          <span className="text-xs font-bold text-zinc-900 block leading-tight">{chan.label}</span>
                          <span className="text-[9px] text-zinc-500 block leading-tight">{chan.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Description & Quality Notes</label>
                <textarea
                  rows={3}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Describe brix content, cold-chain handling, certifications..."
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewListingModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-zinc-100 font-bold text-xs text-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-700 font-bold text-xs text-white cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
