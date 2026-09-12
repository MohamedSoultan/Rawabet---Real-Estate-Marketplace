import React from 'react';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

interface HeroSectionProps {
  onSearch?: (filters: {
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

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreAll, onStartJourney }) => {
  return (
    <div className="relative bg-[#ffffff] border-b border-[#e4ebe4] text-[#001e00] overflow-hidden py-10 sm:py-16">
      
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute -top-32 right-10 w-96 h-96 rounded-full bg-[#14a800]/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Title & Trust Message */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#f2f7f2] border border-[#14a800]/30 text-[#14a800] text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-[#14a800] shrink-0" />
            <span>عقارات متراجعة ومضمونة في كفر الشيخ</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-snug text-[#001e00] font-display">
            هتلاقي عقارك المناسب.. على الجاهز وبأمان
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            بنساعدك تشتري، تبيع، أو تأجر عقارك بأمان وبدون لفة طويلة. كل المعروض مفحوص وجاهز للمعاينة.
          </p>

          {/* Entry Experience: Primary Animated Smart Search + Secondary Explore */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 pt-3 max-w-xl mx-auto">
            {/* Primary Magnetic Button: البحث الذكي في 10 ثواني ✨ */}
            <div className="relative flex-1 group">
              {/* Soft Pulsing Ambient Glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#14a800] to-emerald-400 rounded-2xl blur-xs opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse pointer-events-none"></div>
              
              <button
                type="button"
                onClick={onStartJourney}
                className="relative w-full px-6 py-3.5 sm:py-4 rounded-xl bg-[#14a800] hover:bg-[#118f00] text-white font-black text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-[#14a800]/35 hover:shadow-xl hover:shadow-[#14a800]/50 ring-2 ring-[#14a800]/30 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-white animate-bounce group-hover:rotate-12 transition-transform duration-300" />
                <span>البحث الذكي في 10 ثواني ✨</span>
              </button>
            </div>

            {/* Secondary Option: شوف كل العقارات */}
            <button
              type="button"
              onClick={onExploreAll}
              className="flex-1 px-6 py-3.5 sm:py-4 rounded-xl bg-white hover:bg-slate-50 text-[#001e00] font-black text-sm sm:text-base border-2 border-slate-200 hover:border-[#14a800] transition-all duration-300 transform hover:scale-102 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Search className="w-5 h-5 text-slate-700" />
              <span>شوف كل العقارات</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 text-xs font-bold text-[#001e00]">
            <div className="flex items-center gap-1.5 bg-[#f2f7f2] px-3.5 py-1.5 rounded-xl border border-[#e4ebe4]">
              <CheckCircle2 className="w-4 h-4 text-[#14a800] shrink-0" />
              <span>عقارات مفحوصة 100%</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f2f7f2] px-3.5 py-1.5 rounded-xl border border-[#e4ebe4]">
              <CheckCircle2 className="w-4 h-4 text-[#14a800] shrink-0" />
              <span>بياناتك في سرية تامة</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f2f7f2] px-3.5 py-1.5 rounded-xl border border-[#e4ebe4]">
              <CheckCircle2 className="w-4 h-4 text-[#14a800] shrink-0" />
              <span>معاينة فورية ومنسقة</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
