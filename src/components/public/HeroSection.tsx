import React from 'react';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
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
  onAddProperty?: () => void;
  onStartJourney?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onExploreAll, onStartJourney }) => {
  const handleQuickSearch = (cityId?: string, typeId?: string, txId?: string) => {
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
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#f2f7f2] border border-[#14a800]/30 text-[#14a800] text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-[#14a800] shrink-0" />
            <span>الوساطة العقارية الرقمية الموثوقة بكفر الشيخ</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-snug text-[#001e00] font-display">
            اعثر على عقارك المناسب بثقة
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            روابط وسيط رقمي موثوق ينظم رحلة البحث والبيع والإيجار من خلال عقارات مؤكدة وبيانات واضحة وتجربة رقمية بسيطة ومنظمة.
          </p>

          {/* Entry Experience: Two Clear Options */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 pt-3 max-w-xl mx-auto">
            {/* Option 2: ابدأ البحث الذكي (Premium Guided Discovery) */}
            <button
              type="button"
              onClick={onStartJourney}
              className="flex-1 px-6 py-3.5 rounded-xl bg-[#14a800] hover:bg-[#118f00] text-white font-black text-sm sm:text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
              <span>ابدأ البحث الذكي</span>
            </button>

            {/* Option 1: استكشف جميع العقارات (Normal Marketplace Browsing) */}
            <button
              type="button"
              onClick={onExploreAll}
              className="flex-1 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#001e00] font-black text-sm sm:text-base border-2 border-slate-200 hover:border-[#14a800] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Search className="w-5 h-5 text-slate-700" />
              <span>استكشف جميع العقارات</span>
            </button>
          </div>

          {/* Upwork-Style Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1 text-xs font-bold text-[#001e00]">
            <div className="flex items-center gap-1.5 bg-[#f2f7f2] px-3.5 py-1.5 rounded-xl border border-[#e4ebe4]">
              <CheckCircle2 className="w-4 h-4 text-[#14a800] shrink-0" />
              <span>فحص ومطابقة 100% لكافة الإعلانات</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f2f7f2] px-3.5 py-1.5 rounded-xl border border-[#e4ebe4]">
              <CheckCircle2 className="w-4 h-4 text-[#14a800] shrink-0" />
              <span>سرية بيانات الاتصال والعناوين الدقيقة</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f2f7f2] px-3.5 py-1.5 rounded-xl border border-[#e4ebe4]">
              <CheckCircle2 className="w-4 h-4 text-[#14a800] shrink-0" />
              <span>معاينات موثقة بإشراف ممثلينا</span>
            </div>
          </div>
        </div>

        {/* Upwork-Style Popular / Trending Searches */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 font-bold">
          <span className="flex items-center gap-1 text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-[#14a800]" />
            الأكثر بحثاً:
          </span>
          <button
            onClick={() => handleQuickSearch('city-kfs')}
            className="px-3 py-1 bg-slate-100 hover:bg-[#f2f7f2] hover:text-[#14a800] rounded-xl transition border border-[#e4ebe4] cursor-pointer"
          >
            شقق مدينة كفر الشيخ
          </button>
          <button
            onClick={() => handleQuickSearch('city-desouk')}
            className="px-3 py-1 bg-slate-100 hover:bg-[#f2f7f2] hover:text-[#14a800] rounded-xl transition border border-[#e4ebe4] cursor-pointer"
          >
            عقارات دسوق
          </button>
          <button
            onClick={() => handleQuickSearch(undefined, 'pt-commercial')}
            className="px-3 py-1 bg-slate-100 hover:bg-[#f2f7f2] hover:text-[#14a800] rounded-xl transition border border-[#e4ebe4] cursor-pointer"
          >
            محلات ومقرات تجارية
          </button>
          <button
            onClick={() => handleQuickSearch(undefined, 'pt-land')}
            className="px-3 py-1 bg-slate-100 hover:bg-[#f2f7f2] hover:text-[#14a800] rounded-xl transition border border-[#e4ebe4] cursor-pointer"
          >
            أراضي استثمارية
          </button>
        </div>

      </div>

    </div>
  );
};
