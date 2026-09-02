import React, { useState, useMemo } from 'react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { PropertyCard } from './PropertyCard';
import { Filter, RotateCcw, ArrowUpDown, ChevronRight, ChevronLeft, Building2, MapPin } from 'lucide-react';

interface PropertyListingViewProps {
  initialFilters?: {
    governorate_id?: string;
    city_id?: string;
    area_id?: string;
    property_type_id?: string;
    transaction_type_id?: string;
    max_price?: number;
  };
  hideHeader?: boolean;
  onSelectProperty: (property: Property) => void;
}

export const PropertyListingView: React.FC<PropertyListingViewProps> = ({ 
  initialFilters, 
  hideHeader = false,
  onSelectProperty 
}) => {
  const { 
    getPublishedProperties, 
    governorates, 
    cities, 
    areas, 
    propertyTypes, 
    transactionTypes 
  } = useApp();

  const [selectedGov, setSelectedGov] = useState(initialFilters?.governorate_id || 'gov-kfs');
  const [selectedCity, setSelectedCity] = useState(initialFilters?.city_id || '');
  const [selectedArea, setSelectedArea] = useState(initialFilters?.area_id || '');
  const [selectedType, setSelectedType] = useState(initialFilters?.property_type_id || '');
  const [selectedTx, setSelectedTx] = useState(initialFilters?.transaction_type_id || '');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>(initialFilters?.max_price ? String(initialFilters.max_price) : '');
  const [minArea, setMinArea] = useState<string>('');
  const [maxArea, setMaxArea] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC'>('NEWEST');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const PAGE_SIZE = 6;

  const activeGovs = governorates.filter(g => g.is_active);
  const activeCities = cities.filter(c => c.is_active && c.governorate_id === selectedGov);
  const activeAreas = areas.filter(a => a.is_active && (!selectedCity || a.city_id === selectedCity));

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

  const handleCardFilterTag = (filterType: 'property_type_id' | 'transaction_type_id' | 'city_id' | 'area_id', value: string) => {
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
  };

  // Filter and Sort properties
  const filteredProperties = useMemo(() => {
    const published = getPublishedProperties();

    return published.filter(p => {
      const activeVerId = p.current_published_version_id || p.versions[0]?.id;
      const ver = p.versions.find(v => v.id === activeVerId) || p.versions[0];

      if (!ver) return false;

      // Governorate
      if (selectedGov && ver.governorate_id !== selectedGov) return false;
      // City
      if (selectedCity && ver.city_id !== selectedCity) return false;
      // Area
      if (selectedArea && ver.area_id !== selectedArea) return false;
      // Property type
      if (selectedType && p.property_type_id !== selectedType) return false;
      // Transaction type
      if (selectedTx && p.transaction_type_id !== selectedTx) return false;
      // Min price
      if (minPrice && ver.price < Number(minPrice)) return false;
      // Max price
      if (maxPrice && ver.price > Number(maxPrice)) return false;
      // Min area
      if (minArea && ver.area_sqm < Number(minArea)) return false;
      // Max area
      if (maxArea && ver.area_sqm > Number(maxArea)) return false;
      // Bedrooms
      if (bedrooms && (ver.bedrooms || 0) < Number(bedrooms)) return false;

      return true;
    }).sort((a, b) => {
      const verA = a.versions.find(v => v.id === a.current_published_version_id) || a.versions[0];
      const verB = b.versions.find(v => v.id === b.current_published_version_id) || b.versions[0];

      if (sortBy === 'PRICE_ASC') {
        return (verA?.price || 0) - (verB?.price || 0);
      }
      if (sortBy === 'PRICE_DESC') {
        return (verB?.price || 0) - (verA?.price || 0);
      }
      // NEWEST
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [
    getPublishedProperties,
    selectedGov,
    selectedCity,
    selectedArea,
    selectedType,
    selectedTx,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    bedrooms,
    sortBy
  ]);

  // Paginated slice
  const totalPages = Math.ceil(filteredProperties.length / PAGE_SIZE) || 1;
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProperties.slice(start, start + PAGE_SIZE);
  }, [filteredProperties, currentPage]);

  const activeFiltersCount = [
    selectedCity,
    selectedArea,
    selectedType,
    selectedTx,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    bedrooms
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSelectedGov('gov-kfs');
    setSelectedCity('');
    setSelectedArea('');
    setSelectedType('');
    setSelectedTx('');
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setMaxArea('');
    setBedrooms('');
    setSortBy('NEWEST');
    setCurrentPage(1);
  };

  return (
    <div className={`max-w-7xl mx-auto ${hideHeader ? 'p-0' : 'px-4 sm:px-6 lg:px-8 py-6 sm:py-10'} relative text-right w-full max-w-full overflow-x-hidden`}>
      
      {/* Page Header (Upwork Style) */}
      {!hideHeader ? (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#e4ebe4]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#001e00]">تصفح العقارات المعتمدة في كفر الشيخ</h1>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
              جميع العقارات المعروضة تم فحصها وتدقيق أوراقها من قبل فريق منصة روابط
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex-1 px-4 py-2.5 bg-[#14a800] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap shadow-xs cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              <span>تصفية وفلاتر البحث</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-[#14a800] text-[11px] px-2 py-0.2 rounded-full font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort selector */}
            <div className="flex items-center gap-2 bg-white border border-[#e4ebe4] rounded-full px-3.5 py-2 shadow-xs w-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-700 hidden sm:inline whitespace-nowrap">الترتيب:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-[#001e00] focus:outline-hidden py-0.5 cursor-pointer"
              >
                <option value="NEWEST">الأحدث أولاً</option>
                <option value="PRICE_ASC">السعر: من الأقل للأعلى</option>
                <option value="PRICE_DESC">السعر: من الأعلى للأقل</option>
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
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden px-3.5 py-1.5 bg-[#14a800] text-white rounded-full text-xs font-bold flex items-center gap-1.5 active:scale-95 shadow-xs cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>تصفية</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-[#14a800] text-[10px] px-1.5 rounded-full font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort selector */}
            <div className="flex items-center gap-1.5 bg-white border border-[#e4ebe4] rounded-full px-3 py-1.5 shadow-2xs">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
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
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 ${hideHeader ? 'pt-2' : 'pt-6'}`}>
        
        {/* Filters Sidebar (Desktop) */}
        <div className="hidden md:block space-y-6">
          <div className="bg-white rounded-3xl p-5 border border-[#e4ebe4] shadow-xs space-y-5 text-right sticky top-24">
            
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
              <label className="block text-xs font-bold text-[#001e00] mb-1">عدد الغرف (حد أدنى)</label>
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

          </div>
        </div>

        {/* Results Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Results count indicator */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 font-bold px-1">
            <span>تم العثور على <strong className="text-[#14a800] font-black">{filteredProperties.length}</strong> عقار معتمد</span>
            <span>الصفحة {currentPage} من {totalPages}</span>
          </div>

          {/* Cards Grid */}
          {paginatedProperties.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#e4ebe4] shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#f2f7f2] text-[#14a800] flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#001e00]">
                لا توجد عقارات مطابقة لخيارات البحث
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed font-normal">
                جرّب تغيير فلاتر البحث أو تصفح كافة مراكز كفر الشيخ للاطلاع على كافة الفرص المتاحة.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-bold rounded-full transition shadow-xs active:scale-95 cursor-pointer"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {paginatedProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelect={onSelectProperty}
                  onFilterTag={handleCardFilterTag}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls (Upwork Style) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#e4ebe4]">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3.5 py-2 rounded-full border border-[#e4ebe4] text-xs font-bold disabled:opacity-30 hover:bg-[#f2f7f2] transition cursor-pointer"
              >
                السابق
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-full text-xs font-bold transition cursor-pointer ${
                    currentPage === page 
                      ? 'bg-[#14a800] text-white shadow-xs' 
                      : 'border border-[#e4ebe4] text-slate-700 hover:bg-[#f2f7f2]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3.5 py-2 rounded-full border border-[#e4ebe4] text-xs font-bold disabled:opacity-30 hover:bg-[#f2f7f2] transition cursor-pointer"
              >
                التالي
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-soft-fade">
          <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-5 text-right space-y-5 border-t border-[#e4ebe4] shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e4ebe4]">
              <span className="text-base font-bold text-[#001e00]">تصفية نتائج البحث</span>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 bg-slate-100 rounded-full cursor-pointer"
              >
                إغلاق
              </button>
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

            {/* Apply & Reset Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-[#e4ebe4] sticky bottom-0 bg-white pb-3">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-full transition cursor-pointer"
              >
                إعادة ضبط
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="flex-2 py-3 bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold rounded-full transition shadow-xs cursor-pointer"
              >
                عرض {filteredProperties.length} عقار
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
