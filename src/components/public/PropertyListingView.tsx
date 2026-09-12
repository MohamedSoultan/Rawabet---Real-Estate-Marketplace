import React, { useState, useMemo, useEffect, useCallback, lazy, Suspense } from 'react';
import { Property, FilterCriteria, PropertySortOption, PropertyFilterState } from '../../types';
import { useApp } from '../../context/AppContext';
import { filterProperties, sortProperties, toFilterCriteria } from '../../services/filterEngine';
import { PropertyCard } from './PropertyCard';
import { PropertySlider } from './PropertySlider';
import { Pagination } from '../common/Pagination';
import { FloatingFilterButton } from './FloatingFilterButton';
import { Filter, RotateCcw, ArrowUpDown, ChevronRight, ChevronLeft, Building2, MapPin, Sparkles, LayoutGrid, List, X, SlidersHorizontal, ChevronDown, Search } from 'lucide-react';

// Lazy-load RequestPropertyModal on demand
const RequestPropertyModal = lazy(() => import('./RequestPropertyModal').then(m => ({ default: m.RequestPropertyModal })));

interface PropertyListingViewProps {
  initialFilters?: FilterCriteria;
  hideHeader?: boolean;
  onSelectProperty?: (property: Property) => void;
  onFilterChange?: (filters: FilterCriteria) => void;
}

export const PropertyListingView: React.FC<PropertyListingViewProps> = ({ 
  initialFilters, 
  hideHeader = false,
  onSelectProperty,
  onFilterChange
}) => {
  const { 
    getPublishedProperties, 
    governorates, 
    cities, 
    areas, 
    propertyTypes, 
    transactionTypes 
  } = useApp();

  const [selectedGov, setSelectedGov] = useState(initialFilters?.governorate_id || initialFilters?.selectedGov || 'gov-kfs');
  const [selectedCity, setSelectedCity] = useState(initialFilters?.city_id || initialFilters?.selectedCity || '');
  const [selectedArea, setSelectedArea] = useState(initialFilters?.area_id || initialFilters?.selectedArea || '');
  const [selectedType, setSelectedType] = useState(initialFilters?.property_type_id || initialFilters?.selectedType || '');
  const [selectedTx, setSelectedTx] = useState(initialFilters?.transaction_type_id || initialFilters?.selectedTx || '');
  const [searchQuery, setSearchQuery] = useState(initialFilters?.search_query || initialFilters?.searchQuery || '');
  const [minPrice, setMinPrice] = useState<string>(
    initialFilters?.minPrice !== undefined ? String(initialFilters.minPrice) : (initialFilters?.min_price !== undefined ? String(initialFilters.min_price) : '')
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    initialFilters?.maxPrice !== undefined ? String(initialFilters.maxPrice) : (initialFilters?.max_price !== undefined ? String(initialFilters.max_price) : '')
  );
  const [minArea, setMinArea] = useState<string>(
    initialFilters?.minArea !== undefined ? String(initialFilters.minArea) : ''
  );
  const [maxArea, setMaxArea] = useState<string>(
    initialFilters?.maxArea !== undefined ? String(initialFilters.maxArea) : ''
  );
  const [bedrooms, setBedrooms] = useState<string>(
    initialFilters?.bedrooms !== undefined ? String(initialFilters.bedrooms) : (initialFilters?.rooms !== undefined ? String(initialFilters.rooms) : '')
  );
  const [bathrooms, setBathrooms] = useState<string>(
    initialFilters?.bathrooms !== undefined ? String(initialFilters.bathrooms) : ''
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC'>(initialFilters?.sortBy || 'NEWEST');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const PAGE_SIZE = 6;

  const activeGovs = useMemo(() => governorates.filter(g => g.is_active), [governorates]);
  const activeCities = useMemo(() => cities.filter(c => c.is_active && c.governorate_id === selectedGov), [cities, selectedGov]);
  const activeAreas = useMemo(() => areas.filter(a => a.is_active && (!selectedCity || a.city_id === selectedCity)), [areas, selectedCity]);

  // Validation message if min > max
  const filterValidationError = useMemo(() => {
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      return 'الحد الأدنى للسعر لازم يكون أقل من الحد الأقصى.';
    }
    if (minArea && maxArea && Number(minArea) > Number(maxArea)) {
      return 'الحد الأدنى للمساحة لازم يكون أقل من الحد الأقصى.';
    }
    return null;
  }, [minPrice, maxPrice, minArea, maxArea]);

  const handleCardFilterTag = useCallback((filterType: 'property_type_id' | 'transaction_type_id' | 'city_id' | 'area_id', value: string) => {
    if (filterType === 'property_type_id') {
      setSelectedType(value);
    } else if (filterType === 'transaction_type_id') {
      setSelectedTx(value);
    } else if (filterType === 'city_id') {
      setSelectedCity(value);
      setSelectedArea('');
    } else if (filterType === 'area_id') {
      setSelectedArea(value);
    }
    setCurrentPage(1);
  }, []);

  // Centralized Filter State
  const currentFilterState: PropertyFilterState = useMemo(() => ({
    transactionType: selectedTx || undefined,
    propertyType: selectedType || undefined,
    location: {
      governorate_id: selectedGov || undefined,
      city_id: selectedCity || undefined,
      area_id: selectedArea || undefined,
    },
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    rooms: bedrooms ? Number(bedrooms) : undefined,
    bathrooms: bathrooms ? Number(bathrooms) : undefined,
    minArea: minArea ? Number(minArea) : undefined,
    maxArea: maxArea ? Number(maxArea) : undefined,
    searchQuery: searchQuery.trim() || undefined,
    sortBy,
  }), [
    selectedTx,
    selectedType,
    selectedGov,
    selectedCity,
    selectedArea,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    minArea,
    maxArea,
    searchQuery,
    sortBy,
  ]);

  // Filter and Sort properties using Centralized Filter Engine
  const filteredProperties = useMemo(() => {
    const published = getPublishedProperties();
    const filtered = filterProperties(published, currentFilterState);
    return sortProperties(filtered, sortBy);
  }, [getPublishedProperties, currentFilterState, sortBy]);

  // Paginated slice
  const totalPages = Math.ceil(filteredProperties.length / PAGE_SIZE) || 1;
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProperties.slice(start, start + PAGE_SIZE);
  }, [filteredProperties, currentPage]);

  const activeFiltersCount = [
    searchQuery,
    selectedCity,
    selectedArea,
    selectedType,
    selectedTx,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    bedrooms,
    bathrooms
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSelectedGov('gov-kfs');
    setSelectedCity('');
    setSelectedArea('');
    setSelectedType('');
    setSelectedTx('');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setMaxArea('');
    setBedrooms('');
    setBathrooms('');
    setSortBy('NEWEST');
    setCurrentPage(1);
  };

  return (
    <div className={`w-full max-w-[1600px] mx-auto ${hideHeader ? 'p-0' : 'py-2 sm:py-4'} relative text-right`}>
      
      {/* Page Header (Upwork Style) */}
      {!hideHeader ? (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#e4ebe4]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#001e00]">عقارات كفر الشيخ المضمونة</h1>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
              كل المعروض مفحوص ومطابق على الطبيعة من فريق روابط
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {/* Mobile/Tablet Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex-1 px-4 py-2.5 bg-[#14a800] hover:bg-[#108a00] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap shadow-xs cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              <span>فلاتر البحث</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-[#14a800] text-[11px] px-2 py-0.2 rounded-lg font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-[#14a800] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="عرض شبكي"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-[#14a800] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="عرض قائمة"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop Filter Sidebar Toggle */}
            {!hideHeader && (
              <button
                type="button"
                onClick={() => setShowDesktopSidebar(prev => !prev)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-[#e4ebe4] text-xs font-bold transition shadow-xs cursor-pointer select-none"
                title={showDesktopSidebar ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}
              >
                <Filter className="w-3.5 h-3.5 text-[#14a800]" />
                <span>{showDesktopSidebar ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#14a800] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            )}

            {/* Sort selector */}
            <div className="flex items-center gap-2 bg-white border border-[#e4ebe4] rounded-xl px-3.5 py-2 shadow-xs w-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-700 hidden sm:inline whitespace-nowrap">الترتيب:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as PropertySortOption)}
                className="bg-transparent text-xs font-bold text-[#001e00] focus:outline-hidden py-0.5 cursor-pointer"
              >
                <option value="NEWEST">الأحدث أولاً</option>
                <option value="PRICE_ASC">السعر: الأقل للأعلى</option>
                <option value="PRICE_DESC">السعر: الأعلى للأقل</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between pb-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              المعروض: <strong className="text-[#001e00] font-black">{filteredProperties.length} عقار</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-[#14a800] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="عرض شبكي"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-[#14a800] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="عرض قائمة"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile/Tablet Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden px-3.5 py-1.5 bg-[#14a800] hover:bg-[#108a00] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 shadow-xs cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>فلاتر</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-[#14a800] text-[10px] px-1.5 rounded-lg font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort selector */}
            <div className="flex items-center gap-1.5 bg-white border border-[#e4ebe4] rounded-xl px-3 py-1.5 shadow-2xs">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as PropertySortOption)}
                className="bg-transparent text-xs font-bold text-[#001e00] focus:outline-hidden py-0.5 cursor-pointer"
              >
                <option value="NEWEST">الأحدث</option>
                <option value="PRICE_ASC">الأقل سعراً</option>
                <option value="PRICE_DESC">الأعلى سعراً</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Filters Sidebar + Properties list */}
      <div className={`grid grid-cols-1 ${!hideHeader && showDesktopSidebar ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-6 lg:gap-8 items-start relative ${hideHeader ? 'pt-2' : 'pt-6'} w-full max-w-full`}>
        
        {/* Permanent Sticky Filters Sidebar (Desktop lg+: 1024px+) */}
        {!hideHeader && showDesktopSidebar && (
          <aside 
            id="property-filters-sidebar"
            className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 self-start z-10"
          >
          <div className="bg-white rounded-xl p-5 border border-[#e4ebe4] shadow-xs space-y-5 text-right max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-[#001e00] flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#14a800]" />
                فلاتر البحث
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-[#14a800] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                إعادة ضبط
              </button>
            </div>

            {/* Validation Error Alert */}
            {filterValidationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold">
                <span>{filterValidationError}</span>
              </div>
            )}

            {/* Search Query Input */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-1.5">البحث بالكلمة أو الكود</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="مثال: شقة، دسوق، RWT..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-[#e4ebe4] focus:border-[#14a800] focus:bg-white rounded-xl text-xs font-bold text-[#001e00] outline-hidden transition"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-2">نوع المعاملة</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedTx('')}
                  className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    selectedTx === '' 
                      ? 'bg-[#001e00] text-white border-[#001e00]' 
                      : 'bg-slate-50 text-slate-700 border-[#e4ebe4] hover:bg-[#f2f7f2]'
                  }`}
                >
                  الكل
                </button>
                {transactionTypes.map(tx => (
                  <button
                    key={tx.id}
                    type="button"
                    onClick={() => setSelectedTx(tx.id)}
                    className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      selectedTx === tx.id 
                        ? 'bg-[#14a800] text-white border-[#14a800]' 
                        : 'bg-slate-50 text-slate-700 border-[#e4ebe4] hover:bg-[#f2f7f2]'
                    }`}
                  >
                    {tx.name_ar}
                  </button>
                ))}
              </div>
            </div>

            {/* City / Center */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-1">المركز / المدينة</label>
              <select
                value={selectedCity}
                onChange={e => {
                  setSelectedCity(e.target.value);
                  setSelectedArea('');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:outline-hidden cursor-pointer"
              >
                <option value="">كافة مراكز كفر الشيخ</option>
                {activeCities.map(c => (
                  <option key={c.id} value={c.id}>{c.name_ar}</option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-1">المنطقة / الحي</label>
              <select
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
                disabled={!selectedCity || activeAreas.length === 0}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:outline-hidden disabled:opacity-50 cursor-pointer"
              >
                <option value="">كافة المناطق والأحياء</option>
                {activeAreas.map(a => (
                  <option key={a.id} value={a.id}>{a.name_ar}</option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-1">نوع العقار</label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:outline-hidden cursor-pointer"
              >
                <option value="">جميع أنواع العقارات</option>
                {propertyTypes.filter(pt => pt.is_active).map(pt => (
                  <option key={pt.id} value={pt.id}>{pt.name_ar}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-1">نطاق السعر (جنيه)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="من"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800] focus:outline-hidden dir-ltr text-right"
                />
                <input
                  type="number"
                  placeholder="إلى"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800] focus:outline-hidden dir-ltr text-right"
                />
              </div>
            </div>

            {/* Area Range */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-1">المساحة (م²)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="أقل مساحة"
                  value={minArea}
                  onChange={e => setMinArea(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800] focus:outline-hidden dir-ltr text-right"
                />
                <input
                  type="number"
                  placeholder="أكبر مساحة"
                  value={maxArea}
                  onChange={e => setMaxArea(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800] focus:outline-hidden dir-ltr text-right"
                />
              </div>
            </div>

            {/* Bedrooms count */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-1">عدد الغرف</label>
              <select
                value={bedrooms}
                onChange={e => setBedrooms(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:outline-hidden cursor-pointer"
              >
                <option value="">أي عدد غرف</option>
                <option value="1">1 غرفة فأكثر</option>
                <option value="2">2 غرف فأكثر</option>
                <option value="3">3 غرف فأكثر</option>
                <option value="4">4 غرف فأكثر</option>
                <option value="5">5 غرف فأكثر</option>
              </select>
            </div>

            {/* Bathrooms count */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-1">عدد الحمامات</label>
              <select
                value={bathrooms}
                onChange={e => setBathrooms(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:outline-hidden cursor-pointer"
              >
                <option value="">أي عدد حمامات</option>
                <option value="1">1 حمام فأكثر</option>
                <option value="2">2 حمام فأكثر</option>
                <option value="3">3 حمامات فأكثر</option>
              </select>
            </div>

          </div>
        </aside>
        )}

        {/* Results Area */}
        <section id="property-results-grid" className={`${hideHeader || !showDesktopSidebar ? 'col-span-12' : 'lg:col-span-9'} space-y-5 min-w-0 w-full`}>
          
          {/* Results count indicator */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 font-bold px-1">
            <span>تم العثور على <strong className="text-[#14a800] font-black">{filteredProperties.length}</strong> عقار معتمد</span>
            <span>الصفحة {currentPage} من {totalPages}</span>
          </div>

          {/* Active Filters Display Chips */}
          {activeFiltersCount > 0 && (
            <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-500">الفلاتر المطبقة:</span>

              {selectedCity && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  <span>المركز: {cities.find(c => c.id === selectedCity)?.name_ar}</span>
                  <button onClick={() => setSelectedCity('')} className="hover:text-emerald-950 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {selectedArea && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  <span>المنطقة: {areas.find(a => a.id === selectedArea)?.name_ar}</span>
                  <button onClick={() => setSelectedArea('')} className="hover:text-emerald-950 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {selectedType && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  <span>النوع: {propertyTypes.find(pt => pt.id === selectedType)?.name_ar}</span>
                  <button onClick={() => setSelectedType('')} className="hover:text-emerald-950 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {selectedTx && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  <span>المعاملة: {transactionTypes.find(tx => tx.id === selectedTx)?.name_ar}</span>
                  <button onClick={() => setSelectedTx('')} className="hover:text-emerald-950 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  <span>السعر: {minPrice ? `من ${minPrice}` : ''} {maxPrice ? `إلى ${maxPrice}` : ''} ج.م</span>
                  <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="hover:text-emerald-950 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {(minArea || maxArea) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  <span>المساحة: {minArea ? `من ${minArea}` : ''} {maxArea ? `إلى ${maxArea}` : ''} م²</span>
                  <button onClick={() => { setMinArea(''); setMaxArea(''); }} className="hover:text-emerald-950 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {bedrooms && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  <span>الغرف: {bedrooms}+</span>
                  <button onClick={() => setBedrooms('')} className="hover:text-emerald-950 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {bathrooms && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  <span>الحمامات: {bathrooms}+</span>
                  <button onClick={() => setBathrooms('')} className="hover:text-emerald-950 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={resetFilters}
                className="mr-auto text-xs font-black text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
              >
                مسح كافة الفلاتر
              </button>
            </div>
          )}

          {/* Results Display - Threshold Rule: Carousel/Slider when > 3 cards, Grid when <= 3 */}
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-xl p-6 sm:p-10 text-center border border-[#e4ebe4] shadow-xs space-y-4 animate-soft-fade">
              <div className="w-14 h-14 rounded-xl bg-[#f2f7f2] text-[#14a800] flex items-center justify-center mx-auto shadow-xs">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-[#001e00]">
                  ملقناش عقار بالمواصفات دي
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
                  اكتب مواصفاتك وفريقنا هيوفرهالك بالسعر اللي يناسبك وبدون لفة.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>اطلب عقارك</span>
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
                >
                  مسح الفلاتر
                </button>
              </div>
            </div>
          ) : filteredProperties.length > 3 ? (
            /* Threshold Rule: > 3 properties rendered as horizontal Carousel/Slider */
            <div className="space-y-4">
              <PropertySlider
                properties={filteredProperties}
                onSelectProperty={onSelectProperty}
                onPreviewClick={onSelectProperty}
                onFilterByTag={handleCardFilterTag}
                hideHeader={false}
                title="العقارات المتاحة"
                subtitle={`لقينا ${filteredProperties.length} عقار متراجع ومفحوص`}
              />
            </div>
          ) : (
            /* Grid for <= 3 properties */
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${showDesktopSidebar && !hideHeader ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3'} gap-4 sm:gap-5 animate-soft-fade w-full`}>
              {filteredProperties.map(property => (
                <div key={property.id} className="w-full min-w-0 max-w-full h-full flex flex-col overflow-hidden">
                  <PropertyCard
                    property={property}
                    onSelect={onSelectProperty}
                    onFilterTag={handleCardFilterTag}
                  />
                </div>
              ))}
            </div>
          )}

        </section>

      </div>

      {/* Floating Filter Button when scrolled (Mobile & Tablet only) */}
      <FloatingFilterButton
        onOpenFilters={() => setShowMobileFilters(true)}
        activeFiltersCount={activeFiltersCount}
        triggerScrollOffset={400}
      />

      {/* Mobile & Tablet Filters Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-soft-fade">
          <div className="bg-white rounded-t-2xl w-full max-h-[85vh] overflow-y-auto p-5 text-right space-y-5 border-t border-[#e4ebe4] shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e4ebe4]">
              <span className="text-base font-bold text-[#001e00]">تصفية نتائج البحث</span>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 bg-slate-100 rounded-lg cursor-pointer"
              >
                إغلاق
              </button>
            </div>

            {/* Search Input in Mobile Drawer */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-1.5">البحث بالكلمة أو الكود</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="مثال: شقة، دسوق، RWT..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-[#e4ebe4] focus:border-[#14a800] focus:bg-white rounded-xl text-xs font-bold text-[#001e00] outline-hidden transition"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-2">نوع المعاملة</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTx('')}
                  className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    selectedTx === '' ? 'bg-[#001e00] text-white border-[#001e00]' : 'bg-slate-50 text-slate-700 border-[#e4ebe4]'
                  }`}
                >
                  الكل
                </button>
                {transactionTypes.map(tx => (
                  <button
                    key={tx.id}
                    type="button"
                    onClick={() => setSelectedTx(tx.id)}
                    className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      selectedTx === tx.id ? 'bg-[#14a800] text-white border-[#14a800]' : 'bg-slate-50 text-slate-700 border-[#e4ebe4]'
                    }`}
                  >
                    {tx.name_ar}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-1">المركز / المدينة</label>
              <select
                value={selectedCity}
                onChange={e => {
                  setSelectedCity(e.target.value);
                  setSelectedArea('');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="">كافة مراكز كفر الشيخ</option>
                {activeCities.map(c => (
                  <option key={c.id} value={c.id}>{c.name_ar}</option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-1">المنطقة / الحي</label>
              <select
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="">كافة المناطق</option>
                {activeAreas.map(a => (
                  <option key={a.id} value={a.id}>{a.name_ar}</option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-1">نوع العقار</label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="">جميع الأنواع</option>
                {propertyTypes.filter(pt => pt.is_active).map(pt => (
                  <option key={pt.id} value={pt.id}>{pt.name_ar}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-1">نطاق السعر (جنيه)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="من"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-900 dir-ltr text-right"
                />
                <input
                  type="number"
                  placeholder="إلى"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-900 dir-ltr text-right"
                />
              </div>
            </div>

            {/* Area Range */}
            <div>
              <label className="block text-xs font-bold text-[#001e00] mb-1">المساحة (م²)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="أقل مساحة"
                  value={minArea}
                  onChange={e => setMinArea(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-900 dir-ltr text-right"
                />
                <input
                  type="number"
                  placeholder="أكبر مساحة"
                  value={maxArea}
                  onChange={e => setMaxArea(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-900 dir-ltr text-right"
                />
              </div>
            </div>

            {/* Rooms and Bathrooms */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#001e00] mb-1">الغرف</label>
                <select
                  value={bedrooms}
                  onChange={e => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="">أي عدد</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001e00] mb-1">الحمامات</label>
                <select
                  value={bathrooms}
                  onChange={e => setBathrooms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="">أي عدد</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                </select>
              </div>
            </div>

            {/* Apply & Reset Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-[#e4ebe4] sticky bottom-0 bg-white pb-3">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                إعادة ضبط
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="flex-2 py-3 bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
              >
                عرض {filteredProperties.length} عقار
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Request Property Modal for Demand Capture */}
      {isRequestModalOpen && (
        <Suspense fallback={null}>
          <RequestPropertyModal
            isOpen={isRequestModalOpen}
            onClose={() => setIsRequestModalOpen(false)}
            initialValues={{
              transaction_type: selectedTx === 'tx-rent' ? 'RENT' : 'BUY',
              property_type: propertyTypes.find(pt => pt.id === selectedType)?.name_ar,
              city_or_area: cities.find(c => c.id === selectedCity)?.name_ar,
            }}
          />
        </Suspense>
      )}

    </div>
  );
};
