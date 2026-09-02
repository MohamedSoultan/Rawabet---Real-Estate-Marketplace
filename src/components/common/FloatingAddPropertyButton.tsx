import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingAddPropertyButtonProps {
  onClick: () => void;
}

export const FloatingAddPropertyButton: React.FC<FloatingAddPropertyButtonProps> = ({ onClick }) => {
  return (
    <aside aria-label="إضافة إعلان عقاري جديد" className="fixed bottom-20 md:bottom-8 right-3 sm:right-6 md:right-8 z-40">
      <button
        type="button"
        onClick={onClick}
        className="group relative flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-[#14a800] hover:bg-[#108a00] text-white font-black text-xs sm:text-sm rounded-full shadow-2xl shadow-[#14a800]/40 hover:shadow-[#14a800]/60 transition-all duration-300 transform active:scale-95 hover:-translate-y-0.5 border-2 border-white/90 backdrop-blur-sm cursor-pointer"
        title="أضف عقارك مجاناً - فحص هندسي واعتماد رسمي"
      >
        {/* Subtle breathing ring effect */}
        <span className="absolute -inset-0.5 rounded-full bg-[#14a800] opacity-30 group-hover:opacity-60 blur-xs transition duration-300 animate-pulse" />
        
        {/* Icon with circular white background inside button */}
        <span className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:rotate-90 transition-transform duration-300">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[3]" />
        </span>

        {/* Text Label */}
        <span className="relative whitespace-nowrap font-bold tracking-tight">
          أضف عقارك
        </span>

        {/* Badge 'مجاناً' on top right for high conversion */}
        <span className="absolute -top-2 -left-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-xs border border-white">
          مجاناً
        </span>
      </button>
    </aside>
  );
};
