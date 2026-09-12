import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Property, PropertyVersion } from '../../types';
import { useApp } from '../../context/AppContext';
import { RequestViewingModal } from './RequestViewingModal';
import { useModalA11y } from '../../utils/useModalA11y';
import { getOptimizedImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageOptimizer';
import { 
  X, 
  MapPin, 
  Maximize2, 
  Bed, 
  Bath, 
  Sparkles,
  MessageSquare, 
  Bookmark, 
  ChevronLeft, 
  Share2, 
  Check, 
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface PropertyPreviewModalProps {
  property: Property | null;
  onClose: () => void;
  onViewFullDetails: (property: Property) => void;
  onFilterByTag?: (filterType: 'property_type_id' | 'transaction_type_id' | 'city_id' | 'area_id', value: string) => void;
}

export const PropertyPreviewModal: React.FC<PropertyPreviewModalProps> = ({
  property,
  onClose,
  onViewFullDetails,
  onFilterByTag: _onFilterByTag,
}) => {
  const { 
    currentUser, 
    settings, 
    propertyTypes, 
    transactionTypes, 
    openAuthModal, 
    createLeadFromInteraction, 
    isFavorite, 
    toggleFavorite 
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const { containerRef } = useModalA11y({
    isOpen: !!property,
    onClose,
    initialFocusRef: closeBtnRef
  });

  // Lock body scroll when modal is active
  useEffect(() => {
    if (property) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [property]);

  // Reset active image index when previewing a new property
  useEffect(() => {
    setActiveImageIndex(0);
  }, [property?.id]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!property) return null;

  const activeVersionId = property.current_published_version_id || property.versions[0]?.id;
  const version: PropertyVersion = property.versions.find(v => v.id === activeVersionId) || property.versions[0];

  const pType = propertyTypes.find(pt => pt.id === property.property_type_id) || propertyTypes[0];
  const txType = transactionTypes.find(tx => tx.id === property.transaction_type_id) || transactionTypes[0];
  const favorited = isFavorite(property.id);

  const rawImages = version?.media && version.media.length > 0
    ? version.media.map(m => m.path)
    : [DEFAULT_FALLBACK_IMAGE];

  const rawCoverImage = rawImages[activeImageIndex] || rawImages[0] || DEFAULT_FALLBACK_IMAGE;
  const coverImage = useMemo(() => getOptimizedImageUrl(rawCoverImage, { width: 900, quality: 85 }), [rawCoverImage]);

  const formattedPrice = useMemo(() => new Intl.NumberFormat('ar-EG', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(version?.price || 0), [version?.price]);

  // WhatsApp Contact Handler - Unblocked direct contact with pre-filled details
  const handleWhatsAppContact = () => {
    // Non-blocking interaction tracking if user is logged in
    if (currentUser) {
      try {
        createLeadFromInteraction(property.id, 'WHATSAPP');
      } catch {
        // Continue opening WhatsApp regardless
      }
    }

    const propertyUrl = `${window.location.origin}/property/${property.reference_number || property.id}`;
    const pTypeName = pType?.name_ar || 'عقار';
    const locationText = version?.public_location_text || 'كفر الشيخ';

    const messageLines = [
      'مرحباً روابط، أود الاستفسار بخصوص هذا العقار:',
      `• كود العقار: ${property.reference_number}`,
      `• عنوان العقار: ${version?.title || ''}`,
      `• نوع العقار: ${pTypeName}`,
      `• الموقع: ${locationText}`,
      `• الرابط: ${propertyUrl}`,
      '',
      'أرجو تزويدي بمزيد من التفاصيل وترتيب موعد للمعاينة.'
    ];

    const templateMsg = encodeURIComponent(messageLines.join('\n'));
    const waNumber = (settings.primary_whatsapp || settings.whatsapp_phone || '201000920759').replace(/\D/g, '');
    window.open(`https://wa.me/${waNumber}?text=${templateMsg}`, '_blank');
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/property/${property.reference_number || property.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Quick facts requested: Area, Rooms, Bathrooms, Finishing
  const quickFacts = [
    {
      id: 'area',
      label: 'المساحة الإجمالية',
      value: `${version?.area_sqm || '—'} م²`,
      icon: <Maximize2 className="w-4 h-4 text-[#14a800]" aria-hidden="true" />
    },
    {
      id: 'rooms',
      label: 'عدد الغرف',
      value: version?.bedrooms !== undefined && version.bedrooms > 0 ? `${version.bedrooms} غرف` : 'غير محدد',
      icon: <Bed className="w-4 h-4 text-[#14a800]" aria-hidden="true" />
    },
    {
      id: 'bathrooms',
      label: 'الحمامات',
      value: version?.bathrooms !== undefined && version.bathrooms > 0 ? `${version.bathrooms} حمام` : 'غير محدد',
      icon: <Bath className="w-4 h-4 text-[#14a800]" aria-hidden="true" />
    },
    {
      id: 'finishing',
      label: 'مستوى التشطيب',
      value: version?.finishing || 'تشطيب كامل',
      icon: <Sparkles className="w-4 h-4 text-[#14a800]" aria-hidden="true" />
    }
  ];

  return createPortal(
    <div 
      id="property-preview-backdrop"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-soft-fade"
      onClick={onClose}
    >
      <div 
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-preview-modal-title"
        tabIndex={-1}
        id="property-preview-modal-dialog"
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[calc(100vw-1.5rem)] sm:max-w-lg md:max-w-xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200/90 my-auto text-right relative z-10 outline-none animate-soft-scale"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* HEADER: Close, Favorite, Share (Property code removed) */}
        <header className="px-4 sm:px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 min-w-0">
          {/* Close */}
          <button
            ref={closeBtnRef}
            id="property-preview-close-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#14a800] active:scale-95"
            title="إغلاق النافذة (Esc)"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Action Icons: Favorite & Share */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Favorite (Active: Rawabet green background, green border, green icon) */}
            <button
              id="property-preview-favorite-btn"
              type="button"
              onClick={() => toggleFavorite(property.id)}
              className={`p-2 rounded-xl transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#14a800] active:scale-95 ${
                favorited 
                  ? 'bg-[#f2f7f2] border border-[#14a800] text-[#14a800]' 
                  : 'bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600'
              }`}
              title={favorited ? "إزالة من المفضلة" : "حفظ في المفضلة"}
              aria-label={favorited ? "إزالة من المفضلة" : "حفظ في المفضلة"}
            >
              <Bookmark className={`w-4 h-4 ${favorited ? 'fill-[#14a800] text-[#14a800]' : ''}`} aria-hidden="true" />
            </button>

            {/* Share */}
            <button
              id="property-preview-share-btn"
              type="button"
              onClick={copyShareLink}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-slate-900 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#14a800] active:scale-95"
              title="مشاركة رابط العقار"
              aria-label="مشاركة رابط العقار"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#14a800]" aria-hidden="true" /> : <Share2 className="w-4 h-4" aria-hidden="true" />}
            </button>
          </div>
        </header>

        {/* CONTENT: Image, Status, Price, Title, Location, Specifications */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-4 min-w-0">
          
          {/* 1. Image Viewport & Status Badges */}
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs group min-w-0 shrink-0">
            <img
              src={coverImage}
              alt={version?.title || 'عقار روابط'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
              }}
            />

            {/* Subtle Contrast Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Top-Right: Status (Transaction Type & Property Type) */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white shadow-xs whitespace-nowrap ${
                txType?.slug === 'rent' ? 'bg-amber-500' : 'bg-[#14a800]'
              }`}>
                {txType?.name_ar || 'للبيع'}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#001e00]/85 text-white backdrop-blur-xs shadow-xs whitespace-nowrap">
                {pType?.name_ar || 'عقار'}
              </span>
            </div>

            {/* Bottom-Right: Verified Status */}
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 text-[#14a800] text-xs font-bold shadow-xs backdrop-blur-xs">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="text-[#001e00] text-[11px] sm:text-xs">عقار مفحوص ومعتمد</span>
            </div>

            {/* Bottom-Left: Photo Count Indicator */}
            {rawImages.length > 1 && (
              <div className="absolute bottom-3 left-3 z-10 bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                {activeImageIndex + 1} من {rawImages.length}
              </div>
            )}
          </div>

          {/* Optional Thumbnails Strip if multi-image */}
          {rawImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none min-w-0">
              {rawImages.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-11 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                    activeImageIndex === idx 
                      ? 'border-[#14a800] ring-2 ring-[#14a800]/20' 
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`صورة مصغرة ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* 2. Price, Title, Location */}
          <div className="space-y-2 min-w-0 border-b border-slate-100 pb-3.5">
            {/* Price */}
            <div className="flex items-baseline justify-between gap-3 min-w-0">
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="text-2xl sm:text-3xl font-black text-[#14a800] truncate min-w-0 font-display tabular-nums tracking-tight">
                  {formattedPrice}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-700 shrink-0 inline-block" dir="rtl">
                  <bdi>ج.م</bdi>
                </span>
                {txType?.slug === 'rent' && (
                  <span className="text-xs sm:text-sm font-semibold text-slate-500 shrink-0">/ شهرياً</span>
                )}
              </div>

              {version?.floor && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg shrink-0">
                  <Layers className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>{version.floor}</span>
                </span>
              )}
            </div>

            {/* Title: Reduced visual weight with line-clamp-2 */}
            <h2 id="property-preview-modal-title" className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 break-words">
              {version?.title}
            </h2>

            {/* Location */}
            <div className="pt-0.5 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f2f7f2] text-[#001e00] border border-[#14a800]/20 text-xs font-bold max-w-full">
                <MapPin className="w-3.5 h-3.5 text-[#14a800] shrink-0" aria-hidden="true" />
                <span className="truncate max-w-[280px] sm:max-w-md text-slate-700">
                  {version?.public_location_text || 'كفر الشيخ'}
                </span>
              </span>
            </div>
          </div>

          {/* 3. Specifications (المواصفات السريعة): المساحة، الغرف، الحمامات، التشطيب */}
          <div className="space-y-2 min-w-0">
            <h3 className="text-xs font-bold text-slate-500">المواصفات:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickFacts.map((fact) => (
                <div 
                  key={fact.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col items-center text-center justify-center space-y-1 min-w-0"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#f2f7f2] flex items-center justify-center shrink-0">
                    {fact.icon}
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold block truncate w-full">
                    {fact.label}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-[#001e00] block truncate w-full font-display tabular-nums">
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ACTIONS (Primary & Secondary Decision Layer) */}
        <footer className="p-4 sm:p-5 bg-white border-t border-slate-200/80 space-y-2.5 shrink-0 min-w-0">
          
          {/* PRIMARY ACTION: "عرض تفاصيل العقار كاملة" */}
          <button
            id="modal-view-full-details-btn"
            type="button"
            onClick={() => {
              onClose();
              onViewFullDetails(property);
            }}
            className="w-full py-3.5 px-4 bg-[#14a800] hover:bg-[#108a00] active:bg-[#108a00] text-white text-sm sm:text-base font-black rounded-xl transition-all shadow-md shadow-[#14a800]/20 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:ring-offset-2"
          >
            <span>شوف كل التفاصيل</span>
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" aria-hidden="true" />
          </button>

          {/* SECONDARY ACTIONS: WhatsApp, Request Viewing */}
          <div className="grid grid-cols-2 gap-2 w-full min-w-0">
            {/* WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsAppContact}
              className="py-3 px-3 bg-[#001e00] hover:bg-[#002f00] active:bg-[#002f00] text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer min-h-[44px] min-w-0 focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              title="محادثة واتساب"
              aria-label="محادثة واتساب"
            >
              <MessageSquare className="w-4 h-4 text-[#14a800] shrink-0" aria-hidden="true" />
              <span className="truncate">واتساب مباشر</span>
            </button>

            {/* Request Viewing */}
            <button
              type="button"
              onClick={() => setIsViewingModalOpen(true)}
              className="py-3 px-3 bg-[#f2f7f2] hover:bg-[#e4ebe4] active:bg-[#e4ebe4] text-[#14a800] border border-[#14a800]/30 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer min-h-[44px] min-w-0 focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              title="طلب معاينة"
              aria-label="طلب معاينة للعقار"
            >
              <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">احجز معاينة</span>
            </button>
          </div>

        </footer>

      </div>

      {/* Viewing Request Modal if triggered from preview */}
      {isViewingModalOpen && (
        <RequestViewingModal
          property={property}
          onClose={() => setIsViewingModalOpen(false)}
        />
      )}
    </div>,
    document.body
  );
};

export default PropertyPreviewModal;
