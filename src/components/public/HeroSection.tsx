import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  MapPin, 
  Building2, 
  Tag, 
  Coins, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface HeroSectionProps {
  onSearch: (filters: {
    governorate_id?: string;
    city_id?: string;
    area_id?: string;
    property_type_id?: string;
    transaction_type_id?: string;
    max_price?: number;
  }) => void;
  onExploreAll: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onExploreAll }) => {
  const { settings, governorates, cities, areas, propertyTypes, transactionTypes } = useApp();

  const [selectedGov, setSelectedGov] = useState('gov-kfs');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTx, setSelectedTx] = useState('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const activeGovs = governorates.filter(g => g.is_active);
  const activeCities = cities.filter(c => c.is_active && c.governorate_id === selectedGov);
  const activeAreas = areas.filter(a => a.is_active && (!selectedCity || a.city_id === selectedCity));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      governorate_id: selectedGov || undefined,
      city_id: selectedCity || undefined,
      area_id: selectedArea || undefined,
      property_type_id: selectedType || undefined,
      transaction_type_id: selectedTx || undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined
    });
  };

  const handleQuickSearch = (cityId?: string, typeId?: string, txId?: string) => {
    if (cityId) setSelectedCity(cityId);
    if (typeId) setSelectedType(typeId);
    if (txId) setSelectedTx(txId);
    onSearch({
      governorate_id: 'gov-kfs',
      city_id: cityId,
      property_type_id: typeId,
      transaction_type_id: txId
    });
  };

  return (
    <div className="relative bg-[#ffffff] border-b border-[#e4ebe4] text-[#001e00] overflow-hidden py-10 sm:py-16">
      
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute -top-32 right-10 w-96 h-96 rounded-full bg-[#14a800]/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Title & Trust Message (Upwork Style) */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2f7f2] border border-[#14a800]/30 text-[#14a800] text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-[#14a800] shrink-0" />
            <span>الوساطة العقارية الرقمية الموثوقة بكفر الشيخ</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-snug text-[#001e00]">
            اعثر على عقارك المثالي بكل ثقة وشفافية
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            عقارات مفحوصة هندسياً، أسعار واقعية، وسرية تامة لبيانات الملاك مع معاينات رسمية بإشراف فريق روابط
          </p>

          {/* Upwork-Style Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1 text-xs font-bold text-[#001e00]">
            <div className="flex items-center gap-1.5 bg-[#f2f7f2] px-3.5 py-1.5 rounded-full border border-[#e4ebe4]">
              <CheckCircle2 className="w-4 h-4 text-[#14a800] shrink-0" />
              <span>فحص ومطابقة 100% لكافة الإعلانات</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f2f7f2] px-3.5 py-1.5 rounded-full border border-[#e4ebe4]">
              <CheckCircle2 className="w-4 h-4 text-[#14a800] shrink-0" />
              <span>سرية بيانات الاتصال والعناوين الدقيقة</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f2f7f2] px-3.5 py-1.5 rounded-full border border-[#e4ebe4]">
              <CheckCircle2 className="w-4 h-4 text-[#14a800] shrink-0" />
              <span>معاينات موثقة بإشراف ممثلينا</span>
            </div>
          </div>
        </div>

        {/* Upwork Unified Search Box */}
        <div className="mt-8 sm:mt-10 max-w-5xl mx-auto">
          <form 
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-[#e4ebe4] text-slate-900 transition-all hover:border-[#14a800]/40"
          >
            
            {/* Top Transaction Tabs (Pills) */}
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs font-bold text-slate-500 ml-1 shrink-0 whitespace-nowrap">نوع الصفقة:</span>
              <button
                type="button"
                onClick={() => setSelectedTx('')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition whitespace-nowrap cursor-pointer ${
                  selectedTx === '' 
                    ? 'bg-[#001e00] text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-700 hover:bg-[#f2f7f2]'
                }`}
              >
                الكل
              </button>
              {transactionTypes.map(tx => (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => setSelectedTx(tx.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition whitespace-nowrap cursor-pointer ${
                    selectedTx === tx.id 
                      ? 'bg-[#14a800] text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-700 hover:bg-[#f2f7f2]'
                  }`}
                >
                  {tx.name_ar}
                </button>
              ))}
            </div>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              
              {/* City / Center */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">المركز / المدينة</label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={e => {
                      setSelectedCity(e.target.value);
                      setSelectedArea('');
                    }}
                    className="w-full pl-2 pr-8 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:ring-2 focus:ring-[#14a800]/20 transition cursor-pointer"
                  >
                    <option value="">كافة مراكز كفر الشيخ</option>
                    {activeCities.map(c => (
                      <option key={c.id} value={c.id}>{c.name_ar}</option>
                    ))}
                  </select>
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">المنطقة / الحي</label>
                <div className="relative">
                  <select
                    value={selectedArea}
                    onChange={e => setSelectedArea(e.target.value)}
                    disabled={!selectedCity || activeAreas.length === 0}
                    className="w-full pl-2 pr-8 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:ring-2 focus:ring-[#14a800]/20 transition disabled:opacity-50 cursor-pointer"
                  >
                    <option value="">كافة المناطق والأحياء</option>
                    {activeAreas.map(a => (
                      <option key={a.id} value={a.id}>{a.name_ar}</option>
                    ))}
                  </select>
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">نوع العقار</label>
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value)}
                    className="w-full pl-2 pr-8 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:ring-2 focus:ring-[#14a800]/20 transition cursor-pointer"
                  >
                    <option value="">جميع أنواع العقارات</option>
                    {propertyTypes.map(pt => (
                      <option key={pt.id} value={pt.id}>{pt.name_ar}</option>
                    ))}
                  </select>
                  <Building2 className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">الميزانية القصوى (جنيه)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="مثال: 2000000"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-full pl-2 pr-8 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:ring-2 focus:ring-[#14a800]/20 transition"
                  />
                  <Coins className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Action Search Row (Upwork Style Primary Button) */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              
              <button
                type="button"
                onClick={onExploreAll}
                className="text-xs font-bold text-slate-600 hover:text-[#14a800] transition flex items-center gap-1 cursor-pointer order-2 sm:order-1"
              >
                <span>تصفح جميع العقارات المتاحة</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-bold rounded-full transition shadow-xs flex items-center justify-center gap-2 active:scale-95 cursor-pointer order-1 sm:order-2 shrink-0"
              >
                <Search className="w-4 h-4 text-white stroke-[2.5]" />
                <span>بحث في العقارات الموثوقة</span>
              </button>

            </div>

          </form>
        </div>

        {/* Upwork-Style Popular / Trending Searches */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 font-bold">
          <span className="flex items-center gap-1 text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-[#14a800]" />
            الأكثر بحثاً:
          </span>
          <button
            onClick={() => handleQuickSearch('city-kfs')}
            className="px-3 py-1 bg-slate-100 hover:bg-[#f2f7f2] hover:text-[#14a800] rounded-full transition border border-[#e4ebe4] cursor-pointer"
          >
            شقق مدينة كفر الشيخ
          </button>
          <button
            onClick={() => handleQuickSearch('city-desouk')}
            className="px-3 py-1 bg-slate-100 hover:bg-[#f2f7f2] hover:text-[#14a800] rounded-full transition border border-[#e4ebe4] cursor-pointer"
          >
            عقارات دسوق
          </button>
          <button
            onClick={() => handleQuickSearch(undefined, 'pt-commercial')}
            className="px-3 py-1 bg-slate-100 hover:bg-[#f2f7f2] hover:text-[#14a800] rounded-full transition border border-[#e4ebe4] cursor-pointer"
          >
            محلات ومقرات تجارية
          </button>
          <button
            onClick={() => handleQuickSearch(undefined, 'pt-land')}
            className="px-3 py-1 bg-slate-100 hover:bg-[#f2f7f2] hover:text-[#14a800] rounded-full transition border border-[#e4ebe4] cursor-pointer"
          >
            أراضي استثمارية
          </button>
        </div>

      </div>

    </div>
  );
};
