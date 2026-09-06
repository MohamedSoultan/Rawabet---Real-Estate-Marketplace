import React, { useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property, PropertyVersion } from '../../types';
import { useApp } from '../../context/AppContext';
import { Bookmark, MapPin, ChevronLeft, GitCompare, Maximize2, Bed, Bath, Eye } from 'lucide-react';
import { MatchScore } from '../recommendations/MatchScore';
import { getOptimizedImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageOptimizer';

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
  onSelect?: (property: Property) => void;
  onPreviewClick?: (property: Property) => void;
  onDetailsClick?: (property: Property) => void;
  onFilterTag?: (filterType: 'property_type_id' | 'transaction_type_id' | 'city_id' | 'area_id', value: string) => void;
}

export const PropertyCard = memo<PropertyCardProps>(({ 
  property, 
  viewMode = 'grid', 
  onSelect,
  onPreviewClick,
  onDetailsClick
}) => {
  const navigate = useNavigate();
  const { 
    propertyTypes, 
    transactionTypes, 
    isFavorite, 
    toggleFavorite,
    isInCompare,
    addToCompare,
    removeFromCompare 
  } = useApp();

  // Find approved active version to display to public
  const activeVersionId = property.current_published_version_id || property.versions[0]?.id;
  const version: PropertyVersion = property.versions.find(v => v.id === activeVersionId) || property.versions[0];

  const pType = propertyTypes.find(pt => pt.id === property.property_type_id) || propertyTypes[0];
  const txType = transactionTypes.find(tx => tx.id === property.transaction_type_id) || transactionTypes[0];

  const coverMedia = version?.media?.find(m => m.is_cover) || version?.media?.[0];
  const rawCoverImage = coverMedia?.path || DEFAULT_FALLBACK_IMAGE;
  const coverImage = useMemo(() => getOptimizedImageUrl(rawCoverImage, { width: 640, quality: 80 }), [rawCoverImage]);

  const favorited = isFavorite(property.id);
  const inCompare = isInCompare(property.id);

  const formattedPrice = useMemo(() => new Intl.NumberFormat('ar-EG', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(version?.price || 0), [version?.price]);

  // Handler for triggering preview modal (via main card click or eye icon)
  const triggerPreview = () => {
    if (onPreviewClick) {
      onPreviewClick(property);
    } else if (onSelect) {
      onSelect(property);
    } else {
      // Fallback if no preview handler passed
      navigate(`/property/${property.reference_number || property.id}`);
    }
  };

  // Handler for dedicated details navigation
  const triggerFullDetails = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (onDetailsClick) {
      onDetailsClick(property);
    } else {
      navigate(`/property/${property.reference_number || property.id}`);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(property.id);
    } else {
      addToCompare(property.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const handleQuickPreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerPreview();
  };

  return (
    <div 
      id={`property-card-${property.id}`}
      role="button"
      tabIndex={0}
      onClick={triggerPreview}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerPreview();
        }
      }}
      className={`w-full max-w-full overflow-hidden bg-white rounded-xl border border-slate-200/90 hover:border-[#14a800] hover:shadow-lg transition-all duration-200 flex group cursor-pointer text-right select-none min-w-0 h-full ${
        viewMode === 'list' ? 'flex-col sm:flex-row' : 'flex-col'
      }`}
    >
      
      {/* Clean Media Container */}
      <div className={`relative overflow-hidden bg-slate-100 shrink-0 w-full max-w-full min-w-0 ${
        viewMode === 'list' ? 'aspect-[16/10] sm:aspect-auto sm:w-72 md:w-80 min-h-[200px]' : 'aspect-[16/10] w-full'
      }`}>
        <img
          src={coverImage}
          alt={version?.title || 'عقار'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
          }}
        />

        {/* Subtle Gradient for Tag Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

        {/* Top-Right: Transaction & Property Type Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 pointer-events-none max-w-[calc(100%-115px)] min-w-0 overflow-hidden">
          <span 
            className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-xs whitespace-nowrap min-h-[28px] flex items-center shrink-0 ${
              txType?.slug === 'rent' ? 'bg-amber-500' : 'bg-[#14a800]'
            }`}
          >
            {txType?.name_ar || 'للبيع'}
          </span>
          
          <span 
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#001e00]/80 text-white backdrop-blur-xs shadow-xs whitespace-nowrap min-h-[28px] flex items-center shrink min-w-0 truncate"
          >
            {pType?.name_ar || 'عقار'}
          </span>
        </div>

        {/* Top-Left: Secondary Actions (Quick Preview, Compare, Favorite) - Isolated with stopPropagation */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 shrink-0">
          <button
            id={`card-quick-preview-btn-${property.id}`}
            type="button"
            onClick={handleQuickPreviewClick}
            className="p-2.5 rounded-xl backdrop-blur-md bg-white/90 hover:bg-white text-slate-700 hover:text-[#14a800] transition active:scale-90 cursor-pointer shadow-xs min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-[#14a800]"
            title="معاينة سريعة"
            aria-label="معاينة سريعة"
          >
            <Eye className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            id={`card-compare-btn-${property.id}`}
            type="button"
            onClick={handleCompareClick}
            className={`p-2.5 rounded-xl backdrop-blur-md transition active:scale-90 cursor-pointer shadow-xs min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-[#14a800] ${
              inCompare 
                ? 'bg-[#001e00] text-[#14a800] ring-2 ring-[#14a800]' 
                : 'bg-white/90 hover:bg-white text-slate-700 hover:text-[#14a800]'
            }`}
            title={inCompare ? "إزالة من المقارنة" : "إضافة إلى المقارنة"}
            aria-label="مقارنة العقار"
          >
            <GitCompare className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            id={`card-favorite-btn-${property.id}`}
            type="button"
            onClick={handleFavoriteClick}
            className={`p-2.5 rounded-xl backdrop-blur-md transition active:scale-90 cursor-pointer shadow-xs min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-[#14a800] ${
              favorited 
                ? 'bg-[#f2f7f2] border border-[#14a800] text-[#14a800]' 
                : 'bg-white/90 hover:bg-white text-slate-700 border border-slate-200/60'
            }`}
            title={favorited ? "إزالة من المفضلة" : "حفظ في المفضلة"}
            aria-label="حفظ في المفضلة"
          >
            <Bookmark className={`w-4 h-4 ${favorited ? 'fill-[#14a800] text-[#14a800]' : ''}`} aria-hidden="true" />
          </button>
        </div>

        {/* MatchScore Badge (if future backend value is present) */}
        {property.match_score !== undefined && property.match_score !== null && (
          <div className="absolute bottom-2.5 right-2.5 z-10">
            <MatchScore score={property.match_score} size="sm" variant="badge" />
          </div>
        )}
      </div>

      {/* Card Body - Spacious, Clean Hierarchy, min-w-0 and overflow-hidden for robust overflow protection */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 min-w-0 w-full overflow-hidden">
        
        <div className="space-y-2.5 min-w-0 w-full overflow-hidden">
          {/* Price (Code removed from public cards) */}
          <div className="flex items-baseline justify-between gap-2 min-w-0 w-full overflow-hidden">
            <div className="flex items-baseline gap-1.5 min-w-0 overflow-hidden">
              <span className="text-xl sm:text-2xl font-black text-[#14a800] truncate min-w-0 font-display tabular-nums tracking-tight">
                {formattedPrice}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-700 shrink-0 inline-block" dir="rtl">
                <bdi>ج.م</bdi>
              </span>
              {txType?.slug === 'rent' && (
                <span className="text-xs font-semibold text-slate-500 shrink-0">/ شهرياً</span>
              )}
            </div>
          </div>

          {/* Short Title - Reduced visual weight, fixed 2-lines height with line-clamp-2 and break-words */}
          <h3 className="h-11 sm:h-12 text-sm sm:text-[15px] font-semibold text-slate-900 line-clamp-2 break-words leading-relaxed group-hover:text-[#14a800] transition min-w-0 overflow-hidden w-full">
            {version?.title}
          </h3>

          {/* Location Tag - Fixed location overflow with truncate, min-w-0, overflow-hidden, break-words */}
          <div className="pt-0.5 min-w-0 w-full overflow-hidden">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f2f7f2] text-[#001e00] border border-[#14a800]/20 text-xs font-bold max-w-full min-w-0 overflow-hidden">
              <MapPin className="w-3.5 h-3.5 text-[#14a800] shrink-0" aria-hidden="true" />
              <span className="truncate min-w-0 overflow-hidden break-words text-slate-700">
                {version?.public_location_text || 'كفر الشيخ'}
              </span>
            </span>
          </div>

          {/* Essential Specs Only (Area and Bedrooms) - Presented ONCE with wrap safety */}
          <div className="pt-2 border-t border-slate-100 flex items-center flex-wrap gap-x-4 gap-y-1.5 text-xs font-bold text-slate-600 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 shrink-0">
              <Maximize2 className="w-3.5 h-3.5 text-[#14a800] shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">{version?.area_sqm} م²</span>
            </div>

            {version?.bedrooms !== undefined && version.bedrooms > 0 && (
              <div className="flex items-center gap-1.5 shrink-0">
                <Bed className="w-3.5 h-3.5 text-[#14a800] shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">{version.bedrooms} غرف</span>
              </div>
            )}

            {(!version?.bedrooms || version.bedrooms === 0) && version?.bathrooms !== undefined && version.bathrooms > 0 && (
              <div className="flex items-center gap-1.5 shrink-0">
                <Bath className="w-3.5 h-3.5 text-[#14a800] shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">{version.bathrooms} حمام</span>
              </div>
            )}
          </div>
        </div>

        {/* Primary Action Button: View Full Details (Dedicated Navigation Button) */}
        <div className="pt-2 w-full min-w-0 overflow-hidden">
          <button
            id={`card-full-details-btn-${property.id}`}
            type="button"
            onClick={triggerFullDetails}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-[#14a800] text-slate-800 hover:text-white text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-2xs min-h-[44px] min-w-0 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#14a800]"
          >
            <span className="truncate">عرض تفاصيل العقار</span>
            <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0" aria-hidden="true" />
          </button>
        </div>

      </div>

    </div>
  );
});

PropertyCard.displayName = 'PropertyCard';


