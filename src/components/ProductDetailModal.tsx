import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
  Award,
  Truck,
  Sparkles,
  Star,
  FileText,
  Building2,
  ChevronRight,
  Info,
  Clock,
  ArrowRight,
  Factory,
  Briefcase,
  Store,
  Globe,
} from 'lucide-react';
import { Product } from '../types/index.ts';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onRequestQuote?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onRequestQuote,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(product?.minOrderQuantity || 10);
  const [activeTab, setActiveTab] = useState<'overview' | 'quality' | 'traceability' | 'reviews'>('overview');

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'];

  const totalPrice = quantity * product.pricePerUnitEtb;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-100/80 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Product Gallery (Left Column) */}
          <div className="md:col-span-5 p-6 bg-zinc-50 border-r border-zinc-200 flex flex-col">
            <div className="aspect-4/3 rounded-xl overflow-hidden bg-zinc-200 mb-3 border border-zinc-200 shadow-xs relative">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-xs">
                {product.grade.replace(/_/g, ' ')}
              </span>
              {product.isOrganic && (
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-200 backdrop-blur-xs border border-emerald-500/40">
                  🌱 Certified Organic
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mb-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`h-14 w-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx ? 'border-emerald-600 scale-105' : 'border-zinc-300 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Farmer Mini Profile */}
            <div className="mt-auto bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-sm">
                  {product.farmerName?.slice(0, 2) || 'FA'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900">{product.farmerName || 'Verified Producer'}</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-zinc-500">{product.farmLocation}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  <span className="font-bold text-zinc-900">{product.farmerRating || 4.9}</span> Rating
                </span>
                <span className="text-emerald-700 font-semibold">Verified AgriLink Supplier</span>
              </div>
            </div>
          </div>

          {/* Product Information & Actions (Right Column) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    {product.categoryName || 'Produce Category'}
                  </span>
                  {product.targetBuyerType && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                      product.targetBuyerType === 'PROCESSOR'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : product.targetBuyerType === 'INVESTOR'
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : product.targetBuyerType === 'BUYER'
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {product.targetBuyerType === 'PROCESSOR' && <Factory className="h-3 w-3" />}
                      {product.targetBuyerType === 'INVESTOR' && <Briefcase className="h-3 w-3" />}
                      {product.targetBuyerType === 'BUYER' && <Store className="h-3 w-3" />}
                      {product.targetBuyerType === 'ALL' && <Globe className="h-3 w-3" />}
                      <span>
                        {product.targetBuyerType === 'PROCESSOR'
                          ? 'Channel: Food Processors'
                          : product.targetBuyerType === 'INVESTOR'
                          ? 'Channel: Agri-Investors / Exporters'
                          : product.targetBuyerType === 'BUYER'
                          ? 'Channel: Supermarket & Retail'
                          : 'Channel: Open to All'}
                      </span>
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-500 font-mono">Lot #{product.lotBatchNumber}</span>
              </div>

              <h2 className="text-2xl font-black text-zinc-900 mb-1">{product.name}</h2>
              <p className="text-xs text-zinc-500 mb-4 font-medium">Variety: <span className="text-zinc-800 font-semibold">{product.variety || 'Selected Hybrid'}</span></p>

              {/* Price & Unit */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 mb-6 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-emerald-900 font-semibold block">Market Transparent Price</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-emerald-900">{product.pricePerUnitEtb.toLocaleString()} ETB</span>
                    <span className="text-sm font-bold text-emerald-800">/ {product.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-800 font-medium block">Available Volume</span>
                  <span className="text-sm font-extrabold text-zinc-900">
                    {product.availableQuantity.toLocaleString()} {product.unit}s
                  </span>
                </div>
              </div>

              {/* Detail Tabs */}
              <div className="flex border-b border-zinc-200 mb-4 gap-6 text-xs font-bold">
                {[
                  { id: 'overview', label: 'Specification' },
                  { id: 'quality', label: 'Quality & Test' },
                  { id: 'traceability', label: 'Origin & Cold Chain' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-2 transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-b-2 border-emerald-600 text-emerald-900 font-extrabold'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              {activeTab === 'overview' && (
                <div className="space-y-3 text-xs text-zinc-600 mb-6">
                  <p className="leading-relaxed">{product.description}</p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                      <span className="text-zinc-400 block text-[10px] uppercase font-bold">Harvest Date</span>
                      <span className="font-bold text-zinc-800">{product.harvestDate}</span>
                    </div>
                    <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                      <span className="text-zinc-400 block text-[10px] uppercase font-bold">Shelf Life</span>
                      <span className="font-bold text-zinc-800">{product.shelfLifeDays} Days at Optimal Storage</span>
                    </div>
                    <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                      <span className="text-zinc-400 block text-[10px] uppercase font-bold">Min Order Qty</span>
                      <span className="font-bold text-zinc-800">{product.minOrderQuantity} {product.unit}s</span>
                    </div>
                    <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                      <span className="text-zinc-400 block text-[10px] uppercase font-bold">Dispatch Status</span>
                      <span className="font-bold text-emerald-700">{product.expectedAvailability}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'quality' && (
                <div className="space-y-3 text-xs text-zinc-700 mb-6 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-emerald-600" /> Quality Index Score
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs">
                      {product.qualityScore || 98} / 100
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    Inspected and graded under Ethiopian Horticulture Export Quality standard. Zero residue, uniform firmness, pre-cooled for direct logistics.
                  </p>
                  <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">Certifications:</span>
                    <div className="flex gap-1.5">
                      {(product.certifications || ['GlobalG.A.P', 'Traceable Origin']).map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 font-semibold text-zinc-800">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'traceability' && (
                <div className="space-y-3 text-xs text-zinc-700 mb-6 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold">
                    <MapPin className="h-4 w-4 text-emerald-600" /> Direct Farm Origin Chain
                  </div>
                  <div className="space-y-2 text-[11px] text-zinc-600">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Farm Location:</span>
                      <span className="font-semibold text-zinc-800">{product.farmLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Logistic Route:</span>
                      <span className="font-semibold text-zinc-800">{product.region} → Addis Central Hub</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Cold-Chain Route:</span>
                      <span className="font-semibold text-emerald-700">Refrigerated Isuzu NPR Fleet</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector & Purchase Actions */}
            <div className="pt-4 border-t border-zinc-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-zinc-700">Order Quantity:</span>
                  <div className="flex items-center border border-zinc-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(product.minOrderQuantity, quantity - (product.unit === 'QUINTAL' ? 1 : 10)))}
                      className="px-3 py-1.5 hover:bg-zinc-100 font-bold text-zinc-700 cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      min={product.minOrderQuantity}
                      max={product.availableQuantity}
                      onChange={(e) => setQuantity(Math.max(product.minOrderQuantity, Number(e.target.value)))}
                      className="w-20 text-center font-bold text-sm text-zinc-900 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + (product.unit === 'QUINTAL' ? 1 : 10)))}
                      className="px-3 py-1.5 hover:bg-zinc-100 font-bold text-zinc-700 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-zinc-500">{product.unit}s</span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-zinc-400 font-medium block">Total Estimate</span>
                  <span className="text-lg font-black text-emerald-900">{totalPrice.toLocaleString()} ETB</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-800/20 transition-colors cursor-pointer"
                >
                  <Truck className="h-4 w-4" /> Add to Order Cart
                </button>
                {onRequestQuote && (
                  <button
                    onClick={() => {
                      onRequestQuote(product);
                      onClose();
                    }}
                    className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-sm flex items-center justify-center gap-2 border border-zinc-300 transition-colors cursor-pointer"
                  >
                    <Building2 className="h-4 w-4" /> Request B2B Quote
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
