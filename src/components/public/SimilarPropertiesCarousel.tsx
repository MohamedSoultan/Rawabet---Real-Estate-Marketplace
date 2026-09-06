import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../../types';
import { PropertyCard } from './PropertyCard';
import { ChevronRight, ChevronLeft, Sparkles, Compass } from 'lucide-react';

/**
 * Calculates genuine related properties without duplicating core property logic.
 * Ranks by matching city, property type, transaction type, and price range.
 */
export function getRelatedProperties(
  currentProperty: Property,
  allProperties: Property[],
  limit = 8
): Property[] {
  if (!currentProperty || !allProperties || allProperties.length === 0) {
    return [];
  }

  const currentVersion = currentProperty.versions[0];
  const currentPrice = currentVersion?.price || 0;
  const currentCityId = currentVersion?.city_id;

  const candidates = allProperties.filter(
    p => p.id !== currentProperty.id && p.current_status === 'PUBLISHED'
  );

  const scored = candidates.map(p => {
    const version = p.versions[0];
    let score = 0;

    // Same city match (+40 pts)
    if (version?.city_id && currentCityId && version.city_id === currentCityId) {
      score += 40;
    }

    // Same property type match (+30 pts)
    if (p.property_type_id === currentProperty.property_type_id) {
      score += 30;
    }

    // Same transaction type match (+20 pts)
    if (p.transaction_type_id === currentProperty.transaction_type_id) {
      score += 20;
    }

    // Price similarity within 30% (+10 pts)
    if (currentPrice > 0 && version?.price) {
      const diffRatio = Math.abs(version.price - currentPrice) / currentPrice;
      if (diffRatio <= 0.3) {
        score += 10;
      }
    }

    return { property: p, score };
  });

  // Sort by highest score first, then fallback to newest
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.property.created_at).getTime() - new Date(a.property.created_at).getTime();
  });

  return scored.slice(0, limit).map(item => item.property);
}

interface SimilarPropertiesCarouselProps {
  properties?: Property[];
  allProperties?: Property[];
  currentProperty?: Property;
  onSelectProperty?: (property: Property) => void;
  onPreviewClick?: (property: Property) => void;
  onDetailsClick?: (property: Property) => void;
  onFilterByTag?: (filterType: 'property_type_id' | 'transaction_type_id' | 'city_id' | 'area_id', value: string) => void;
  onViewAll?: () => void;
  title?: string;
  subtitle?: string;
}

export const SimilarPropertiesCarousel = React.memo<SimilarPropertiesCarouselProps>(({
  properties,
  allProperties,
  currentProperty,
  onSelectProperty,
  onPreviewClick,
  onDetailsClick,
  onFilterByTag,
  onViewAll,
  title = 'عقارات مشابهة قد تهمك',
  subtitle = 'خيارات مختارة بعناية في نفس النطاق الجغرافي والمواصفات',
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

  // Compute or filter display properties
  const displayProperties = useMemo(() => {
    if (properties && properties.length > 0) {
      return currentProperty 
        ? properties.filter(p => p.id !== currentProperty.id)
        : properties;
    }
    if (currentProperty && allProperties && allProperties.length > 0) {
      return getRelatedProperties(currentProperty, allProperties, 8);
    }
    return [];
  }, [properties, allProperties, currentProperty]);

  // Keep cardRefs array sized to displayProperties
  cardRefs.current = cardRefs.current.slice(0, displayProperties.length);

  // Update navigation button states & active index based on scroll position
  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const absScroll = Math.abs(el.scrollLeft);

    // In RTL, at the beginning absScroll is ~0, at the end absScroll is ~maxScroll
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
  }, [updateScrollState, displayProperties.length]);

  // Scroll to specific index using scrollIntoView for flawless RTL handling
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

  // Next / Prev navigation
  // In RTL Arabic layout:
  // "Next" (leftwards) advances to higher index items
  // "Prev" (rightwards) goes back to lower index items
  const handleNext = () => {
    const nextIdx = Math.min(activeIndex + 1, displayProperties.length - 1);
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

  if (!displayProperties || displayProperties.length === 0) {
    return null;
  }

  return (
    <section 
      id="similar-properties-carousel" 
      aria-label={title}
      className="w-full mt-12 sm:mt-16 mb-10 space-y-5 sm:space-y-6 overflow-hidden select-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header with Title, Status & Navigation Controls */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 sm:gap-4 min-w-0">
        <div className="space-y-1 min-w-0 max-w-full">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#14a800] animate-pulse shrink-0"></span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#001e00] flex items-center gap-2 truncate">
              <span className="truncate">{title}</span>
              <Sparkles className="w-4 h-4 text-[#14a800] hidden sm:inline-block shrink-0" aria-hidden="true" />
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">
            {subtitle}
          </p>
        </div>

        {/* Navigation Controls: Slide Counter, Prev/Next Arrows & View All */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Slide Indicator Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/90 rounded-xl text-xs font-bold text-slate-600 border border-slate-200/70">
            <span>عقار</span>
            <span className="font-black text-[#14a800]">{activeIndex + 1}</span>
            <span>من</span>
            <span>{displayProperties.length}</span>
          </div>

          {/* Precision Controls: Prev / Next Buttons */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
            {/* Previous (Right Arrow in RTL) */}
            <button
              id="carousel-prev-btn"
              type="button"
              onClick={handlePrev}
              disabled={!canScrollPrev}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition cursor-pointer active:scale-95 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#14a800] ${
                canScrollPrev 
                  ? 'text-slate-700 hover:text-[#14a800] hover:bg-slate-50' 
                  : 'text-slate-300 bg-slate-50/50 cursor-not-allowed'
              }`}
              title="العقار السابق"
              aria-label="الانتقال للعقار السابق"
            >
              <ChevronRight className="w-5 h-5 shrink-0" aria-hidden="true" />
            </button>

            <div className="w-px h-4 bg-slate-200"></div>

            {/* Next (Left Arrow in RTL) */}
            <button
              id="carousel-next-btn"
              type="button"
              onClick={handleNext}
              disabled={!canScrollNext}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition cursor-pointer active:scale-95 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#14a800] ${
                canScrollNext 
                  ? 'text-slate-700 hover:text-[#14a800] hover:bg-slate-50' 
                  : 'text-slate-300 bg-slate-50/50 cursor-not-allowed'
              }`}
              title="العقار التالي"
              aria-label="الانتقال للعقار التالي"
            >
              <ChevronLeft className="w-5 h-5 shrink-0" aria-hidden="true" />
            </button>
          </div>

          {/* View All Button */}
          {onViewAll && (
            <button
              id="carousel-view-all-btn"
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-2 rounded-xl bg-white hover:bg-[#e4ebe4] text-[#14a800] text-xs sm:text-sm font-bold border border-slate-200/80 shadow-2xs transition cursor-pointer min-h-[38px] sm:min-h-[40px] shrink-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#14a800]"
            >
              <Compass className="w-3.5 h-3.5 text-[#14a800] hidden sm:inline-block shrink-0" />
              <span>استعراض الكل</span>
              <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Premium Smart Carousel Track:
          Mobile: One card (100% visible item snap)
          Tablet (sm/md): Reduced cards (2 cards)
          Desktop (lg/xl): Multiple cards (3 to 4 cards)
          Cards keep strict same height, identical spacing, and zero overflow.
      */}
      <div className="relative w-full overflow-hidden">
        {/* Subtle Luxury Gradient Edge Masks on Large Screens */}
        <div className="hidden xl:block pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="hidden xl:block pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />

        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`w-full overflow-x-auto snap-x snap-mandatory flex gap-4 sm:gap-5 px-3 sm:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto pb-5 pt-1 scroll-smooth touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden items-stretch ${
            isDragging ? 'cursor-grabbing select-none scroll-auto' : 'cursor-grab'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {displayProperties.map((property, idx) => (
            <div
              key={property.id}
              ref={el => {
                cardRefs.current[idx] = el;
              }}
              /* Responsive card column width:
                 - Mobile (<640px): Exactly 1 card visible (w-[86vw] max-w-[340px] centered snap)
                 - Tablet (640px-1023px): 2 cards visible (w-[calc(50%-10px)] max-w-[360px])
                 - Desktop (1024px-1279px): 3 cards visible (w-[calc(33.333%-14px)] max-w-[370px])
                 - Large Desktop (>=1280px): 4 cards visible (w-[calc(25%-15px)] max-w-[340px])
                 - items-stretch and h-full ensure all cards have uniform height
              */
              className="w-[86vw] xs:w-[82vw] max-w-[340px] sm:w-[calc(50%-10px)] sm:max-w-[360px] lg:w-[calc(33.333%-14px)] lg:max-w-[370px] xl:w-[calc(25%-15px)] xl:max-w-[340px] shrink-0 snap-center sm:snap-start flex flex-col min-w-0 h-auto self-stretch overflow-hidden transition-all duration-200"
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

      {/* Mobile Swipe Pagination Dots (Active indicator) */}
      <div className="flex sm:hidden items-center justify-center gap-1.5 pt-1 px-4">
        {displayProperties.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToIndex(i)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === activeIndex 
                ? 'w-6 h-2 bg-[#14a800]' 
                : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
            }`}
            aria-label={`الانتقال للعقار ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
});

SimilarPropertiesCarousel.displayName = 'SimilarPropertiesCarousel';

