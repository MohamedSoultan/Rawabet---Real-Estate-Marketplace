import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Property, PropertyVersion } from '../../types';
import { useApp } from '../../context/AppContext';
import { MatchScore } from './MatchScore';
import { MatchReasons } from './MatchReasons';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  GitCompare, 
  Bookmark, 
  MessageSquare, 
  ChevronLeft,
  Eye,
  Building2,
  Sparkles
} from 'lucide-react';

export interface RecommendationCardProps {
  /** Property object */
  property: Property;
  /** Future backend value: match_score (can also be read from property.match_score) */
  match_score?: number | null;
  /** Future backend value: match_reasons (can also be read from property.match_reasons) */
  match_reasons?: string[] | null;
  /** Optional click handler (defaults to navigating to /property/:id) */
  onSelect?: (property: Property) => void;
  /** Optional quick preview handler */
  onQuickPreview?: (property: Property) => void;
  /** Optional lead contact handler */
  onContact?: (property: Property) => void;
  /** Visual presentation mode */
  variant?: 'grid' | 'featured' | 'compact';
  /** Optional extra classes */
  className?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  property,
  match_score,
  match_reasons,
  onSelect,
  onQuickPreview,
  onContact,
  variant = 'grid',
  className = '',
}) => {
  const navigate = useNavigate();
  const {
    propertyTypes,
    transactionTypes,
    cities,
    areas,
    isFavorite,
    toggleFavorite,
    isInCompare,
    addToCompare,
    removeFromCompare,
  } = useApp();

  // Purely use the backend values passed via props or property model (no calculation)
  const effectiveScore = match_score !== undefined ? match_score : property.match_score;
  const effectiveReasons = match_reasons !== undefined ? match_reasons : property.match_reasons;

  // Active published or first version
  const activeVersionId = property.current_published_version_id || property.versions[0]?.id;
  const version: PropertyVersion =
    property.versions.find(v => v.id === activeVersionId) || property.versions[0];

  const pType = propertyTypes.find(pt => pt.id === property.property_type_id);
  const txType = transactionTypes.find(tx => tx.id === property.transaction_type_id);

  const cityName = cities.find(c => c.id === version?.city_id)?.name_ar;
  const areaName = areas.find(a => a.id === version?.area_id)?.name_ar;

  const coverMedia = version?.media?.find(m => m.is_cover) || version?.media?.[0];
  const coverImage =
    coverMedia?.path ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const favorited = isFavorite(property.id);
  const inCompare = isInCompare(property.id);

  const formattedPrice = new Intl.NumberFormat('ar-EG', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(version?.price || 0);

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(property);
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

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickPreview) {
      onQuickPreview(property);
    } else {
      handleCardClick();
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onContact) {
      onContact(property);
    } else {
      handleCardClick();
    }
  };

  return (
    <div
      id={`recommendation-card-${property.id}`}
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={`w-full bg-white rounded-2xl border border-slate-200/90 hover:border-[#14a800] hover:shadow-lg transition-all duration-200 flex flex-col group cursor-pointer text-right select-none overflow-hidden min-w-0 ${className}`}
      dir="rtl"
    >
      {/* Media & Top Highlight Section */}
      <div className="relative aspect-[16/10] w-full max-w-full overflow-hidden bg-slate-100 shrink-0 min-w-0">
        <img
          src={coverImage}
          alt={version?.title || 'عقار مقترح'}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
          onError={e => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top-Right Badges: Transaction Type & Property Type */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 pointer-events-none max-w-[calc(100%-115px)] min-w-0 overflow-hidden">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-xs whitespace-nowrap min-h-[28px] flex items-center shrink-0 ${
              txType?.slug === 'rent' ? 'bg-amber-500' : 'bg-[#14a800]'
            }`}
          >
            {txType?.name_ar || 'للبيع'}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#001e00]/80 text-white backdrop-blur-xs shadow-xs whitespace-nowrap min-h-[28px] flex items-center shrink min-w-0 truncate">
            {pType?.name_ar || 'عقار'}
          </span>
        </div>

        {/* Top-Left Action Icons (isolated with stopPropagation) */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 shrink-0">
          {onQuickPreview && (
            <button
              type="button"
              onClick={handlePreviewClick}
              className="p-2 rounded-xl backdrop-blur-md bg-white/90 hover:bg-white text-slate-700 hover:text-[#14a800] transition active:scale-90 shadow-xs cursor-pointer shrink-0"
              title="معاينة سريعة"
              aria-label="معاينة سريعة"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCompareClick}
            className={`p-2 rounded-xl backdrop-blur-md transition active:scale-90 shadow-xs cursor-pointer shrink-0 ${
              inCompare
                ? 'bg-[#001e00] text-[#14a800] ring-2 ring-[#14a800]'
                : 'bg-white/90 hover:bg-white text-slate-700 hover:text-[#14a800]'
            }`}
            title={inCompare ? 'إزالة من المقارنة' : 'إضافة إلى المقارنة'}
            aria-label="مقارنة العقار"
          >
            <GitCompare className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`p-2 rounded-xl backdrop-blur-md transition active:scale-90 shadow-xs cursor-pointer shrink-0 ${
              favorited 
                ? 'bg-[#f2f7f2] border border-[#14a800] text-[#14a800]' 
                : 'bg-white/90 hover:bg-white text-slate-700 border border-slate-200/60'
            }`}
            title={favorited ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
            aria-label="حفظ في المفضلة"
          >
            <Bookmark className={`w-3.5 h-3.5 ${favorited ? 'fill-[#14a800] text-[#14a800]' : ''}`} />
          </button>
        </div>

        {/* Bottom Banner: MatchScore Badge */}
        {effectiveScore !== undefined && effectiveScore !== null && (
          <div className="absolute bottom-3 right-3 z-10">
            <MatchScore score={effectiveScore} size="sm" variant="badge" />
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 min-w-0 w-full overflow-hidden">
        <div className="space-y-2.5 min-w-0 w-full overflow-hidden">
          {/* Location */}
          <div className="flex items-center text-xs text-slate-500 font-bold min-w-0 w-full overflow-hidden">
            <span className="flex items-center gap-1 min-w-0 overflow-hidden text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-[#14a800] shrink-0" />
              <span className="truncate min-w-0 overflow-hidden break-words text-slate-700">
                {cityName ? `${cityName} ${areaName ? `• ${areaName}` : ''}` : 'كفر الشيخ'}
              </span>
            </span>
          </div>

          {/* Title - Reduced visual weight, fixed 2-lines height with line-clamp-2 and break-words */}
          <h3 className="h-11 sm:h-12 font-semibold text-sm sm:text-[15px] text-slate-900 line-clamp-2 break-words leading-relaxed group-hover:text-[#14a800] transition-colors min-w-0 overflow-hidden w-full">
            {version?.title || 'عقار متميز في كفر الشيخ'}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 pt-1 min-w-0 w-full overflow-hidden">
            <span className="text-lg sm:text-xl font-black text-[#14a800] truncate min-w-0">
              {formattedPrice}
            </span>
            <span className="text-xs font-bold text-slate-600 shrink-0">
              {txType?.slug === 'rent' ? 'ج.م / شهرياً' : 'جنيه مصري'}
            </span>
          </div>

          {/* Specifications Chips */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-slate-700 min-w-0 overflow-hidden">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold bg-slate-50 py-1.5 rounded-lg min-w-0 overflow-hidden">
              <Bed className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{version?.bedrooms || 0} غرف</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold bg-slate-50 py-1.5 rounded-lg min-w-0 overflow-hidden">
              <Bath className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{version?.bathrooms || 0} حمام</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold bg-slate-50 py-1.5 rounded-lg min-w-0 overflow-hidden">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{version?.area_sqm || 0} م²</span>
            </div>
          </div>

          {/* Future Backend Match Reasons UI */}
          {effectiveReasons && effectiveReasons.length > 0 && (
            <div className="pt-1 min-w-0 overflow-hidden">
              <MatchReasons reasons={effectiveReasons} maxDisplay={2} variant="chips" />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 min-w-0 overflow-hidden">
          <button
            type="button"
            onClick={handleContactClick}
            className="flex-1 py-2 px-3 rounded-xl bg-[#f0faf0] hover:bg-[#e2f5e2] text-[#14a800] text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer min-w-0 overflow-hidden"
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">تواصل واستفسار</span>
          </button>

          <button
            type="button"
            onClick={handleCardClick}
            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>التفاصيل</span>
            <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
