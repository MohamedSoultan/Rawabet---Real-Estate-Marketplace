import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingAddPropertyButtonProps {
  onClick: () => void;
  className?: string;
}

export const FloatingAddPropertyButton: React.FC<FloatingAddPropertyButtonProps> = ({ 
  onClick,
  className = ''
}) => {
  return (
    <aside 
      aria-label="إضافة إعلان عقاري جديد" 
      className={`fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-8 right-3 sm:right-6 md:right-8 z-30 ${className}`}
    >
      <button
        type="button"
        onClick={onClick}
        className="group relative flex items-center justify-center sm:justify-start gap-2 w-12 h-12 sm:w-auto sm:h-auto sm:px-5 sm:py-3.5 bg-[#14a800] hover:bg-[#108a00] text-white font-black text-xs sm:text-sm rounded-xl shadow-xl shadow-[#14a800]/30 hover:shadow-[#14a800]/50 transition-all duration-300 transform active:scale-95 hover:-translate-y-0.5 border border-white/80 backdrop-blur-sm cursor-pointer min-h-[48px] min-w-[48px]"
        title="أضف عقارك مجاناً - فحص هندسي واعتماد رسمي من روابط"
      >
        {/* Subtle breathing ring */}
        <span className="absolute -inset-0.5 rounded-xl bg-[#14a800] opacity-25 group-hover:opacity-50 blur-xs transition duration-300" />
        
        {/* Plus Icon Container */}
        <span className="relative w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 group-hover:rotate-90 transition-transform duration-300">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[3]" />
        </span>

        {/* Text Label - Hidden on mobile, shown on tablet/desktop */}
        <span className="hidden sm:inline relative whitespace-nowrap font-bold tracking-tight">
          أضف عقارك
        </span>

        {/* Free Badge 'مجاناً' - Hidden on mobile to avoid clutter */}
        <span className="hidden sm:inline-block absolute -top-2 -left-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-md shadow-xs border border-white">
          مجاناً
        </span>
      </button>
    </aside>
  );
};

