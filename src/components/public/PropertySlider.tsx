import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../../types';
import { PropertyCard } from './PropertyCard';
import { ChevronRight, ChevronLeft, Sparkles, Compass } from 'lucide-react';

export interface PropertySliderProps {
  properties: Property[];
  title?: string;
  subtitle?: string;
  id?: string;
  hideHeader?: boolean;
  onSelectProperty?: (property: Property) => void;
  onPreviewClick?: (property: Property) => void;
  onDetailsClick?: (property: Property) => void;
  onFilterByTag?: (filterType: 'property_type_id' | 'transaction_type_id' | 'city_id' | 'area_id', value: string) => void;
  onViewAll?: () => void;
  viewAllText?: string;
  className?: string;
}

export const PropertySlider = React.memo<PropertySliderProps>(({
  properties,
  title,
  subtitle,
  id = 'property-slider',
  hideHeader = false,
  onSelectProperty,
  onPreviewClick,
  onDetailsClick,
  onFilterByTag,
  onViewAll,
  viewAllText = 'شوف الكل',
  className = '',
}) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Keep cardRefs array sized to properties length
  cardRefs.current = cardRefs.current.slice(0, properties.length);

  // Update navigation button states & active index based on scroll position
  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const absScroll = Math.abs(el.scrollLeft);

    // In RTL, at start absScroll is ~0, at end absScroll is ~maxScroll
    setCanScrollPrev(absScroll > 8);
    setCanScrollNext(absScroll < maxScroll - 8);

    // Detect closest visible card center
    const containerRect = el.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (card) {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      }
    });

    setActiveIndex(closestIdx);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, properties.length]);

  // Scroll to specific index using scrollIntoView for RTL handling
  const scrollToIndex = (index: number) => {
    const targetCard = cardRefs.current[index];
    if (targetCard && containerRef.current) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
      setActiveIndex(index);
    }
  };

  // RTL navigation:
  // Next (Left arrow) advances index
  // Prev (Right arrow) decreases index
  const handleNext = () => {
    const nextIdx = Math.min(activeIndex + 1, properties.length - 1);
    scrollToIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = Math.max(activeIndex - 1, 0);
    scrollToIndex(prevIdx);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handleNext();
    } else if (e.key === 'ArrowRight') {
      handlePrev();
    }
  };

  // Desktop Mouse Drag to Scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollStart(el.scrollLeft);
    setHasMoved(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const el = containerRef.current;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.25;
    if (Math.abs(walk) > 6) {
      setHasMoved(true);
    }
    el.scrollLeft = scrollStart - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Universal handlers for card interactions
  const handleCardPreview = (p: Property) => {
    if (hasMoved) return;
    if (onPreviewClick) {
      onPreviewClick(p);
    } else if (onSelectProperty) {
      onSelectProperty(p);
    }
  };

  const handleCardDetails = (p: Property) => {
    if (hasMoved) return;
    if (onDetailsClick) {
      onDetailsClick(p);
    } else {
      navigate(`/property/${p.reference_number || p.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <section 
      id={id} 
      aria-label={title || 'قائمة العقارات'}
      className={`w-full space-y-4 sm:space-y-5 overflow-hidden select-none ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      dir="rtl"
    >
      {/* Header with Title, Navigation & Counter */}
      {!hideHeader && (title || subtitle || properties.length > 1) && (
        <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
          <div className="space-y-0.5 min-w-0 max-w-full">
            {title && (
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#14a800] animate-pulse shrink-0"></span>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#001e00] flex items-center gap-2 truncate">
                  <span className="truncate">{title}</span>
                  <Sparkles className="w-4 h-4 text-[#14a800] hidden sm:inline-block shrink-0" aria-hidden="true" />
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">
                {subtitle}
              </p>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Slide Counter Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 border border-slate-200">
              <span>عقار</span>
              <span className="font-black text-[#14a800]">{activeIndex + 1}</span>
              <span>من</span>
              <span>{properties.length}</span>
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canScrollPrev}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer active:scale-95 ${
                  canScrollPrev 
                    ? 'text-slate-700 hover:text-[#14a800] hover:bg-slate-50' 
                    : 'text-slate-300 bg-slate-50/50 cursor-not-allowed'
                }`}
                title="السابق"
                aria-label="السابق"
              >
                <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>

              <div className="w-px h-3.5 bg-slate-200"></div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canScrollNext}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer active:scale-95 ${
                  canScrollNext 
                    ? 'text-slate-700 hover:text-[#14a800] hover:bg-slate-50' 
                    : 'text-slate-300 bg-slate-50/50 cursor-not-allowed'
                }`}
                title="التالي"
                aria-label="التالي"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>

            {/* View All Button */}
            {onViewAll && (
              <button
                type="button"
                onClick={onViewAll}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[#14a800] text-xs font-bold border border-slate-200 shadow-2xs transition cursor-pointer min-h-[36px] shrink-0"
              >
                <span>{viewAllText}</span>
                <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Horizontal Carousel Track with Peek Sizing */}
      <div className="relative w-full overflow-hidden">
        {/* Subtle Gradient Edge Masks on Large Screens */}
        <div className="hidden xl:block pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="hidden xl:block pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />

        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`w-full overflow-x-auto snap-x snap-mandatory flex gap-3.5 sm:gap-4.5 pb-4 pt-1 scroll-smooth touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden items-stretch ${
            isDragging ? 'cursor-grabbing select-none scroll-auto' : 'cursor-grab'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {properties.map((property, idx) => (
            <div
              key={property.id}
              ref={el => {
                cardRefs.current[idx] = el;
              }}
              /* Reduced and locked card width with peek effect:
                 - Mobile: w-[74vw] xs:w-[70vw] max-w-[280px] (leaves 26-30vw of the next card visibly peeking!)
                 - Tablet: sm:w-[280px] md:w-[290px]
                 - Desktop: lg:w-[290px] xl:w-[300px]
                 - shrink-0 ensures locked width and uniform aspect ratio
              */
              className="w-[74vw] xs:w-[70vw] max-w-[280px] sm:w-[280px] md:w-[290px] lg:w-[290px] xl:w-[300px] shrink-0 snap-center sm:snap-start flex flex-col min-w-0 h-auto self-stretch overflow-hidden transition-all duration-200"
              onClickCapture={e => {
                if (hasMoved) {
                  e.stopPropagation();
                  e.preventDefault();
                }
              }}
            >
              <div className="h-full flex flex-col">
                <PropertyCard
                  property={property}
                  onPreviewClick={handleCardPreview}
                  onDetailsClick={handleCardDetails}
                  onSelect={handleCardPreview}
                  onFilterTag={onFilterByTag}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Swipe Indicator Dots */}
      {properties.length > 1 && (
        <div className="flex sm:hidden items-center justify-center gap-1.5 pt-0.5">
          {properties.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === activeIndex 
                  ? 'w-5 h-1.5 bg-[#14a800]' 
                  : 'w-1.5 h-1.5 bg-slate-200 hover:bg-slate-300'
              }`}
              aria-label={`عقار ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
});

PropertySlider.displayName = 'PropertySlider';
