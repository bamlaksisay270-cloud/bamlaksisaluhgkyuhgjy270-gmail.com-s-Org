import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ShieldCheck,
  Star,
  MapPin,
  Sparkles,
  ArrowUpDown,
  Carrot,
  Apple,
  Wheat,
  Coffee,
  Flower2,
  Boxes,
  Truck,
  Plus,
  Check,
  SlidersHorizontal,
  Factory,
  Briefcase,
  Store,
  Globe,
} from 'lucide-react';
import { Product, ProductCategory } from '../types/index.ts';

interface MarketplaceViewProps {
  categories: ProductCategory[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  categories,
  onSelectProduct,
  onAddToCart,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedTargetBuyer, setSelectedTargetBuyer] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'availability'>('recommended');
  const [addedItemMap, setAddedItemMap] = useState<{ [id: number]: boolean }>({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products?';
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedGrade !== 'all') params.append('grade', selectedGrade);
      if (selectedRegion !== 'all') params.append('region', selectedRegion);
      if (selectedTargetBuyer !== 'ALL') params.append('targetBuyer', selectedTargetBuyer);
      if (searchQuery) params.append('search', searchQuery);
      if (organicOnly) params.append('organic', 'true');

      const res = await fetch(`${url}${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedGrade, selectedRegion, selectedTargetBuyer, organicOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(p, p.minOrderQuantity);
    setAddedItemMap((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [p.id]: false }));
    }, 1500);
  };

  const getCategoryIcon = (iconName?: string | null) => {
    switch (iconName) {
      case 'Carrot':
        return <Carrot className="h-4 w-4" />;
      case 'Apple':
        return <Apple className="h-4 w-4" />;
      case 'Wheat':
        return <Wheat className="h-4 w-4" />;
      case 'Coffee':
        return <Coffee className="h-4 w-4" />;
      case 'Flower2':
        return <Flower2 className="h-4 w-4" />;
      default:
        return <Boxes className="h-4 w-4" />;
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price_asc') return a.pricePerUnitEtb - b.pricePerUnitEtb;
    if (sortBy === 'price_desc') return b.pricePerUnitEtb - a.pricePerUnitEtb;
    if (sortBy === 'availability') return b.availableQuantity - a.availableQuantity;
    return (b.qualityScore || 95) - (a.qualityScore || 95);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Tagline */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" /> Transparent Produce Marketplace
            </div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
              Fresh Agricultural Harvest
            </h1>
            <p className="text-sm text-zinc-600 mt-1 max-w-2xl">
              Source verified export & domestic grade crops directly from Ethiopian commercial growers and farmer cooperatives with batch-level traceability.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search tomatoes, teff, avocados, regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
          }`}
        >
          <Boxes className="h-4 w-4" /> All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat.slug
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            {getCategoryIcon(cat.icon)}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Target Buyer Channel Classifier Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <span className="text-[11px] font-bold text-zinc-500 uppercase shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-emerald-700" /> Buyer Channel:
        </span>
        {[
          { id: 'ALL', label: 'All Channels', icon: Globe },
          { id: 'PROCESSOR', label: 'Food Processors & Mills', icon: Factory },
          { id: 'INVESTOR', label: 'Agri-Investors & Exporters', icon: Briefcase },
          { id: 'BUYER', label: 'Supermarkets & Retail', icon: Store },
        ].map((chan) => {
          const Icon = chan.icon;
          const isSelected = selectedTargetBuyer === chan.id;
          return (
            <button
              key={chan.id}
              onClick={() => setSelectedTargetBuyer(chan.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-950 text-white ring-1 ring-emerald-600 shadow-xs'
                  : 'bg-white border border-zinc-200/90 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`} />
              {chan.label}
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold uppercase">
            <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-700" /> Filters:
          </div>

          {/* Grade Select */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="all">All Grades</option>
            <option value="GRADE_1_EXPORT">Export Grade 1</option>
            <option value="GRADE_1_LOCAL">Local Grade 1</option>
            <option value="GRADE_2_COMMERCIAL">Grade 2 Commercial</option>
            <option value="PROCESSING_GRADE">Processing Grade</option>
          </select>

          {/* Region Select */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="all">All Regions (Ethiopia)</option>
            <option value="Oromia">Oromia (Rift Valley / Wonji / Ziway)</option>
            <option value="Addis Ababa">Addis Ababa Logistics Corridor</option>
            <option value="Sidama">Sidama / Hawassa</option>
            <option value="Amhara">Amhara / Bahir Dar</option>
            <option value="SNNPR">SNNPR / Gedeo / Yirgacheffe</option>
          </select>

          {/* Organic Checkbox */}
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="accent-emerald-700 h-3.5 w-3.5 rounded"
            />
            Organic Certified
          </label>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="recommended">Highest Quality Index</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="availability">Highest Available Volume</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-4 border border-zinc-200 animate-pulse space-y-3">
              <div className="h-44 bg-zinc-200 rounded-xl"></div>
              <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
              <div className="h-3 bg-zinc-200 rounded w-1/2"></div>
              <div className="h-8 bg-zinc-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200 p-8">
          <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <Boxes className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">No matching produce found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, grade filter, or regional criteria to explore other available harvests.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedGrade('all');
              setSelectedRegion('all');
              setSearchQuery('');
              setOrganicOnly(false);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((p) => {
            const img = p.images && p.images.length > 0
              ? p.images[0]
              : 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80';

            const isJustAdded = addedItemMap[p.id];

            return (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="group bg-white rounded-2xl border border-zinc-200/80 hover:border-emerald-500/80 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative aspect-4/3 overflow-hidden bg-zinc-100">
                  <img
                    src={img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Top Badge: Grade */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-900/90 text-white shadow-xs backdrop-blur-xs">
                      {p.grade.replace(/_/g, ' ')}
                    </span>
                    {p.isOrganic && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-900 shadow-xs">
                        🌱 Organic
                      </span>
                    )}
                  </div>

                  {/* Quality index */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-white/95 text-zinc-900 shadow-xs flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    <span>QC {p.qualityScore || 98}%</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category & Variety */}
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                      <span className="font-semibold text-emerald-700">{p.categoryName}</span>
                      <span className="font-mono text-zinc-400">Lot #{p.lotBatchNumber.slice(-6)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-zinc-900 text-sm leading-snug line-clamp-1 group-hover:text-emerald-800 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
                      {p.variety ? `Variety: ${p.variety}` : p.description}
                    </p>

                    {/* Target Buyer Channel Tag */}
                    {p.targetBuyerType && (
                      <div className="mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          p.targetBuyerType === 'PROCESSOR'
                            ? 'bg-amber-100/80 text-amber-900 border border-amber-300/60'
                            : p.targetBuyerType === 'INVESTOR'
                            ? 'bg-purple-100/80 text-purple-900 border border-purple-300/60'
                            : p.targetBuyerType === 'BUYER'
                            ? 'bg-blue-100/80 text-blue-900 border border-blue-300/60'
                            : 'bg-emerald-100/80 text-emerald-900 border border-emerald-300/60'
                        }`}>
                          {p.targetBuyerType === 'PROCESSOR' && <Factory className="h-3 w-3 text-amber-700" />}
                          {p.targetBuyerType === 'INVESTOR' && <Briefcase className="h-3 w-3 text-purple-700" />}
                          {p.targetBuyerType === 'BUYER' && <Store className="h-3 w-3 text-blue-700" />}
                          {p.targetBuyerType === 'ALL' && <Globe className="h-3 w-3 text-emerald-700" />}
                          <span>
                            {p.targetBuyerType === 'PROCESSOR'
                              ? 'For Food Processors'
                              : p.targetBuyerType === 'INVESTOR'
                              ? 'For Agri-Investors / Exporters'
                              : p.targetBuyerType === 'BUYER'
                              ? 'For Supermarkets & Retail'
                              : 'Open to All Buyers'}
                          </span>
                        </span>
                      </div>
                    )}

                    {/* Location and Farmer */}
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 mt-2.5 pt-2.5 border-t border-zinc-100">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{p.farmLocation || p.region}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-600 mt-1">
                      <span className="truncate font-medium">{p.farmerName || 'Verified Producer'}</span>
                      {p.farmerVerified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Add to Cart Footer */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">Direct Price</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-black text-emerald-950">
                          {p.pricePerUnitEtb.toLocaleString()} ETB
                        </span>
                        <span className="text-[11px] font-bold text-zinc-500">/{p.unit}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">
                        Avail: {p.availableQuantity.toLocaleString()} {p.unit}s
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(p, e)}
                      className={`p-2.5 rounded-xl font-bold transition-all shadow-xs flex items-center justify-center cursor-pointer ${
                        isJustAdded
                          ? 'bg-emerald-800 text-white'
                          : 'bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white border border-emerald-200 hover:border-emerald-700'
                      }`}
                      title="Quick Add Minimum Order"
                    >
                      {isJustAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
