import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface FloatingFilterButtonProps {
  onOpenFilters: () => void;
  activeFiltersCount?: number;
  triggerScrollOffset?: number;
}

export const FloatingFilterButton: React.FC<FloatingFilterButtonProps> = ({
  onOpenFilters,
  activeFiltersCount = 0,
  triggerScrollOffset = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY > triggerScrollOffset) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [triggerScrollOffset]);

  if (!isVisible) return null;

  return (
    <div className="lg:hidden fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 animate-slide-up">
      <button
        type="button"
        onClick={onOpenFilters}
        className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-[#001e00] hover:bg-[#14a800] text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-white/20 backdrop-blur-md"
        title="تصفية وفلاتر البحث"
      >
        <SlidersHorizontal className="w-4 h-4 text-[#14a800] group-hover:text-white" />
        <span>فلاتر البحث</span>
        {activeFiltersCount > 0 && (
          <span className="w-5 h-5 rounded-lg bg-[#14a800] text-white text-[11px] font-black flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>
    </div>
  );
};
