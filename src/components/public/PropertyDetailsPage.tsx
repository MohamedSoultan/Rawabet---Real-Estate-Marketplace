import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { Property, PropertyVersion } from '../../types';
import { useApp } from '../../context/AppContext';
import { SimilarPropertiesCarousel, getRelatedProperties } from './SimilarPropertiesCarousel';
import { getOptimizedImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageOptimizer';

// Lazy-load viewing modal on demand
const RequestViewingModal = lazy(() => import('./RequestViewingModal').then(m => ({ default: m.RequestViewingModal })));
import { 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Share2,
  Bookmark,
  GitCompare,
  Check,
  CheckCircle2,
  MapPin,
  Building2,
  Maximize2,
  Bed,
  Bath,
  Layers,
  Sparkles,
  PhoneCall,
  MessageSquare,
  Calendar,
  ShieldCheck,
  Clock,
  CheckCheck,
  Camera,
  X,
  Copy
} from 'lucide-react';

interface PropertyDetailsPageProps {
  property: Property;
  onBack: () => void;
  onFilterByTag?: (filterType: 'property_type_id' | 'transaction_type_id' | 'city_id' | 'area_id', value: string) => void;
  onSelectProperty?: (property: Property) => void;
}

export const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({
  property,
  onBack,
  onFilterByTag,
  onSelectProperty
}) => {
  const { 
    currentUser,
    settings,
    propertyTypes,
    transactionTypes,
    cities,
    governorates,
    openAuthModal,
    createLeadFromInteraction,
    isFavorite,
    toggleFavorite,
    isInCompare,
    addToCompare,
    removeFromCompare,
    getPublishedProperties
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [leadToast, setLeadToast] = useState<string | null>(null);
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);

  // Active public version
  const activeVersionId = property.current_published_version_id || property.versions[0]?.id;
  const version: PropertyVersion = property.versions.find(v => v.id === activeVersionId) || property.versions[0];

  const pType = propertyTypes.find(pt => pt.id === property.property_type_id) || propertyTypes[0];
  const txType = transactionTypes.find(tx => tx.id === property.transaction_type_id) || transactionTypes[0];
  const city = cities.find(c => c.id === version?.city_id);
  const governorate = governorates.find(g => g.id === version?.governorate_id);

  const favorited = isFavorite(property.id);
  const inCompare = isInCompare(property.id);

  const images = version?.media && version.media.length > 0
    ? version.media.map(m => m.path)
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const formattedPrice = new Intl.NumberFormat('ar-EG', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(version?.price || 0);

  // Price per sqm
  const pricePerSqm = version?.area_sqm && version?.price
    ? Math.round(version.price / version.area_sqm)
    : null;

  // Scroll to top on property change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
    setIsLightboxOpen(false);
  }, [property.id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
      if (e.key === 'ArrowLeft') setActiveImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  // Handle WhatsApp Lead - Direct contact with no auth blockage
  const handleWhatsAppContact = () => {
    // Track lead non-blockingly if user is logged in
    if (currentUser) {
      try {
        createLeadFromInteraction(property.id, 'WHATSAPP');
      } catch {
        // Continue opening WhatsApp
      }
    }

    setLeadToast('جارٍ فتح محادثة واتساب المباشرة...');
    setTimeout(() => setLeadToast(null), 3000);

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
      'أرجو تزويدي بمزيد من التفاصيل وتنسيق موعد للمعاينة الميدانية.'
    ];

    const templateMsg = encodeURIComponent(messageLines.join('\n'));
    const waNumber = (settings.primary_whatsapp || settings.whatsapp_phone || '201000920759').replace(/\D/g, '');
    const waUrl = `https://wa.me/${waNumber}?text=${templateMsg}`;
    window.open(waUrl, '_blank');
  };

  // Handle Direct Call Lead
  const handlePhoneCall = () => {
    if (!currentUser) {
      openAuthModal('REGISTER', () => handlePhoneCall());
      return;
    }

    const res = createLeadFromInteraction(property.id, 'CALL');
    if (res.success) {
      setLeadToast('تم تسجيل طلب المعاينة وتحويل الاتصال لفرع مبيعات كفر الشيخ');
      setTimeout(() => setLeadToast(null), 4000);
      window.location.href = `tel:${settings.primary_phone}`;
    }
  };

  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname + `#property-${property.reference_number || property.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCompareToggle = () => {
    if (inCompare) {
      removeFromCompare(property.id);
    } else {
      addToCompare(property.id);
    }
  };

  // Similar / Related properties ranked without duplicating core property logic
  const allPublished = getPublishedProperties();
  const similarProperties = useMemo(() => {
    return getRelatedProperties(property, allPublished, 8);
  }, [property, allPublished]);

  // Specifications items for the compact grid
  const specifications = [
    {
      label: 'المساحة الإجمالية',
      value: `${version?.area_sqm || '—'} م²`,
      icon: <Maximize2 className="w-4 h-4 text-[#14a800]" />
    },
    {
      label: 'غرف النوم',
      value: version?.bedrooms !== undefined && version.bedrooms > 0 ? `${version.bedrooms} غرف` : 'غير محدد',
      icon: <Bed className="w-4 h-4 text-[#14a800]" />
    },
    {
      label: 'الحمامات',
      value: version?.bathrooms !== undefined && version.bathrooms > 0 ? `${version.bathrooms} حمام` : 'غير محدد',
      icon: <Bath className="w-4 h-4 text-[#14a800]" />
    },
    {
      label: 'الدور / الطابق',
      value: version?.floor || 'غير محدد',
      icon: <Layers className="w-4 h-4 text-[#14a800]" />
    },
    {
      label: 'نوع التشطيب',
      value: version?.finishing || 'غير محدد',
      icon: <Sparkles className="w-4 h-4 text-[#14a800]" />
    },
    {
      label: 'نوع العقار',
      value: pType?.name_ar || 'عقار سكنى',
      icon: <Building2 className="w-4 h-4 text-[#14a800]" />
    }
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-[#f8faf8] text-[#001e00] font-sans pb-32 lg:pb-16 text-right selection:bg-[#14a800] selection:text-white" dir="rtl">
      
      {/* Toast Notification */}
      {leadToast && (
        <div className="fixed top-24 right-4 left-4 sm:left-auto sm:right-6 z-50 p-4 bg-[#f2f7f2] border border-[#14a800]/40 text-[#001e00] rounded-xl shadow-xl flex items-center gap-3 animate-soft-fade max-w-md">
          <CheckCircle2 className="w-5 h-5 text-[#14a800] shrink-0" />
          <p className="text-xs sm:text-sm font-bold leading-relaxed">{leadToast}</p>
        </div>
      )}

      {/* Standalone Breadcrumb & Action Bar - Ultra-responsive across 320px, 360px, 390px, 430px+ with zero overlap */}
      <div className="w-full bg-white border-b border-slate-200/80 shadow-2xs relative z-20">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-1.5 sm:gap-4 min-w-0 w-full">
          
          {/* Start (Right in RTL): Back arrow button + Property Code */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-[#e4ebe4] active:bg-[#e4ebe4] text-[#001e00] flex items-center justify-center transition cursor-pointer shrink-0 min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              title="العودة لقائمة العقارات"
              aria-label="العودة لقائمة العقارات"
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#14a800] shrink-0" aria-hidden="true" />
            </button>

            {/* Property Code - Click to copy with toast */}
            <button
              id="property-details-code-btn"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(property.reference_number);
                setLeadToast('تم نسخ كود العقار');
                setTimeout(() => setLeadToast(null), 3000);
              }}
              className="px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-[#e4ebe4] active:bg-[#e4ebe4] text-slate-800 hover:text-[#001e00] font-mono text-[11px] sm:text-xs md:text-sm font-bold border border-slate-200/80 hover:border-[#14a800]/50 whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer group active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              title="انقر لنسخ كود العقار"
              aria-label="نسخ كود العقار"
            >
              <span className="text-slate-500 group-hover:text-slate-700 font-sans font-semibold text-[10px] sm:text-xs">كود:</span>
              <span className="max-w-[70px] xs:max-w-[90px] sm:max-w-none truncate tabular-nums">{property.reference_number}</span>
              <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#14a800] transition-colors shrink-0" />
            </button>
          </div>

          {/* Desktop & Tablet Breadcrumb Navigation */}
          <nav aria-label="مسار التصفح" className="hidden lg:flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-slate-500 min-w-0 flex-1 overflow-hidden px-2">
            <span className="shrink-0 hover:text-[#14a800] cursor-pointer transition-colors" onClick={onBack}>الرئيسية</span>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-300 shrink-0" aria-hidden="true" />
            <span className="shrink-0 hover:text-[#14a800] cursor-pointer transition-colors" onClick={onBack}>{city?.name_ar || 'كفر الشيخ'}</span>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-300 shrink-0" aria-hidden="true" />
            <span 
              className="text-slate-800 font-semibold truncate min-w-0" 
              title={version?.title}
            >
              {version?.title}
            </span>
          </nav>

          {/* End (Left in RTL): Actions (Compare, Favorite, Share) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Compare */}
            <button
              type="button"
              onClick={handleCompareToggle}
              className={`p-1.5 sm:p-2 rounded-xl transition cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center shrink-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#14a800] ${
                inCompare
                  ? 'bg-[#001e00] text-[#14a800] ring-2 ring-[#14a800]'
                  : 'bg-slate-100 hover:bg-[#e4ebe4] text-slate-700 hover:text-[#14a800]'
              }`}
              title={inCompare ? "إزالة من المقارنة" : "إضافة للمقارنة"}
              aria-label={inCompare ? "إزالة من المقارنة" : "إضافة للمقارنة"}
            >
              <GitCompare className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>

            {/* Favorite (Active: Rawabet green background, green border, green icon) */}
            <button
              id="property-details-favorite-btn"
              type="button"
              onClick={() => toggleFavorite(property.id)}
              className={`p-1.5 sm:p-2 rounded-xl transition cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center shrink-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#14a800] ${
                favorited 
                  ? 'bg-[#f2f7f2] border border-[#14a800] text-[#14a800]' 
                  : 'bg-slate-100 hover:bg-[#e4ebe4] border border-transparent text-slate-700 hover:text-[#14a800]'
              }`}
              title={favorited ? "إزالة من المفضلة" : "حفظ في المفضلة"}
              aria-label={favorited ? "إزالة من المفضلة" : "حفظ في المفضلة"}
            >
              <Bookmark className={`w-4 h-4 shrink-0 ${favorited ? 'fill-[#14a800] text-[#14a800]' : ''}`} aria-hidden="true" />
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-[#e4ebe4] text-slate-700 hover:text-[#14a800] transition cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center shrink-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              title="مشاركة رابط العقار"
              aria-label="مشاركة رابط العقار"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#14a800] shrink-0" aria-hidden="true" /> : <Share2 className="w-4 h-4 shrink-0" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body - Ample whitespace and elegant layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
          
          {/* Main Column (8 cols on desktop) */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            
            {/* 1. OPTIMIZED GALLERY (Mobile First, clean vertical footprint) */}
            <section aria-label="معرض الصور" className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
              
              {/* Main Image Viewport */}
              <div 
                className="relative aspect-16/10 sm:aspect-16/9 bg-slate-900 overflow-hidden select-none cursor-pointer group"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  src={getOptimizedImageUrl(images[activeImageIndex], { width: 1200, quality: 85 })}
                  alt={`${version?.title || 'عقار'} - صورة ${activeImageIndex + 1}`}
                  referrerPolicy="no-referrer"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                  }}
                />

                {/* Subtle dark vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

                {/* Top Overlay: Transaction Type & Verification */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 z-10">
                  <span className={`px-3 py-1 rounded-lg text-xs font-black shadow-md ${
                    txType?.slug === 'rent'
                      ? 'bg-amber-500 text-white'
                      : 'bg-[#14a800] text-white'
                  }`}>
                    {txType?.name_ar || 'للبيع'}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#001e00]/80 backdrop-blur-md text-white shadow-md flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#14a800]" />
                    <span>مفحوص ومعتمد</span>
                  </span>
                </div>

                {/* Bottom Overlay: View All Photos Action & Counter */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 left-3 sm:left-4 z-10 flex items-center justify-between pointer-events-none">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                    className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#001e00] text-xs font-bold shadow-md backdrop-blur-md flex items-center gap-2 transition active:scale-95 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#14a800]" />
                    <span>عرض كل الصور ({images.length})</span>
                  </button>

                  <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                    {activeImageIndex + 1} / {images.length}
                  </span>
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer z-10 active:scale-95"
                      title="الصورة السابقة"
                      aria-label="Previous image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer z-10 active:scale-95"
                      title="الصورة التالية"
                      aria-label="Next image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Compact Thumbnails Bar */}
              {images.length > 1 && (
                <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#14a800] ring-2 ring-[#14a800]/20'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={getOptimizedImageUrl(imgUrl, { width: 160, quality: 70 })}
                        alt={`مصغرة ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

            </section>

            {/* 2. UNIFIED PROPERTY SUMMARY (Single, clean, authoritative summary card) */}
            <section className="bg-white rounded-xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              
              {/* Header Price & Type */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#14a800] tracking-tight font-display tabular-nums">
                      {formattedPrice}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-slate-700 inline-block" dir="rtl">
                      <bdi>ج.م</bdi>
                    </span>
                    {txType?.slug === 'rent' && (
                      <span className="text-xs sm:text-sm font-semibold text-slate-500">/ شهرياً</span>
                    )}
                  </div>

                  {pricePerSqm && txType?.slug !== 'rent' && (
                    <p className="text-xs text-slate-500 font-medium">
                      متوسط سعر المتر: <span className="font-bold text-slate-700">{new Intl.NumberFormat('ar-EG').format(pricePerSqm)} <bdi dir="rtl">ج.م / م²</bdi></span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(property.reference_number);
                      setLeadToast('تم نسخ كود العقار');
                      setTimeout(() => setLeadToast(null), 3000);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#e4ebe4] text-slate-700 hover:text-[#001e00] text-xs font-mono font-bold border border-slate-200/80 hover:border-[#14a800]/50 transition-all cursor-pointer group active:scale-95"
                    title="انقر لنسخ كود العقار"
                  >
                    <span className="font-sans text-[11px] text-slate-500 group-hover:text-slate-700">كود:</span>
                    <span className="tabular-nums">{property.reference_number}</span>
                    <Copy className="w-3 h-3 text-slate-400 group-hover:text-[#14a800] transition-colors" />
                  </button>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {pType?.name_ar || 'عقار سكنى'}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {txType?.name_ar || 'للبيع'}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-lg sm:text-2xl font-black text-[#001e00] leading-snug break-words">
                {version?.title}
              </h1>

              {/* Location Line */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                <MapPin className="w-4 h-4 text-[#14a800] shrink-0" />
                <span>{version?.public_location_text || 'كفر الشيخ'}</span>
                {city && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>{city.name_ar}</span>
                  </>
                )}
                {onFilterByTag && (
                  <button
                    type="button"
                    onClick={() => onFilterByTag('city_id', version?.city_id || '')}
                    className="text-xs font-bold text-[#14a800] hover:underline cursor-pointer mr-auto"
                  >
                    استعراض عقارات المنطقة
                  </button>
                )}
              </div>

              {/* Key Highlights Bar (Area, Bedrooms, Bathrooms) */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 min-w-0">
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 text-center min-w-0">
                  <span className="text-[11px] text-slate-500 font-medium block">المساحة</span>
                  <span className="text-sm sm:text-base font-black text-[#001e00] truncate block">{version?.area_sqm || '—'} م²</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 text-center min-w-0">
                  <span className="text-[11px] text-slate-500 font-medium block">الغرف</span>
                  <span className="text-sm sm:text-base font-black text-[#001e00] truncate block">
                    {version?.bedrooms && version.bedrooms > 0 ? version.bedrooms : '—'}
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 text-center min-w-0">
                  <span className="text-[11px] text-slate-500 font-medium block">الحمامات</span>
                  <span className="text-sm sm:text-base font-black text-[#001e00] truncate block">
                    {version?.bathrooms && version.bathrooms > 0 ? version.bathrooms : '—'}
                  </span>
                </div>
              </div>

              {/* Mobile Quick Action Buttons (Above the fold for fast decision making) */}
              <div className="lg:hidden pt-2 grid grid-cols-2 gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsViewingModalOpen(true)}
                  className="py-3 px-4 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-black rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 min-h-[44px]"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>حجز معاينة</span>
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppContact}
                  className="py-3 px-4 bg-[#001e00] hover:bg-[#002f00] text-white text-xs sm:text-sm font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 min-h-[44px]"
                >
                  <MessageSquare className="w-4 h-4 text-[#14a800]" />
                  <span>واتساب مباشر</span>
                </button>
              </div>

            </section>

            {/* 3. COMPACT SPECIFICATIONS (Spacious, modern grid: 1 col on mobile, 2 cols on larger screens) */}
            <section className="bg-white rounded-xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4 min-w-0">
              <h2 className="text-base sm:text-lg font-black text-[#001e00] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#14a800]" />
                <span>المواصفات والبيانات الفنية</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1 min-w-0">
                {specifications.map((spec, index) => (
                  <div 
                    key={index}
                    className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-[#14a800]/30 transition-all flex items-start justify-between gap-4 min-w-0"
                  >
                    <div className="flex items-center gap-2.5 text-slate-500 text-xs sm:text-sm font-bold shrink-0 pt-0.5">
                      <div className="w-8 h-8 rounded-xl bg-[#f2f7f2] flex items-center justify-center shrink-0">
                        {spec.icon}
                      </div>
                      <span>{spec.label}</span>
                    </div>
                    <div className="text-xs sm:text-sm md:text-base font-black text-[#001e00] text-left break-words whitespace-normal leading-snug">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. DESCRIPTION */}
            <section className="bg-white rounded-xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
              <h2 className="text-base sm:text-lg font-black text-[#001e00]">
                تفاصيل ووصف العقار
              </h2>
              <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {version?.description || 'لا يوجد وصف تفصيلي إضافي لهذا العقار.'}
              </div>
            </section>

            {/* 5. FEATURES & AMENITIES (Clean pills) */}
            {version?.features && version.features.length > 0 && (
              <section className="bg-white rounded-xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
                <h2 className="text-base sm:text-lg font-black text-[#001e00] flex items-center gap-2">
                  <CheckCheck className="w-5 h-5 text-[#14a800]" />
                  <span>المميزات والخدمات</span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                  {version.features.map((feature, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#f2f7f2] border border-[#14a800]/20 flex items-center gap-2 text-xs sm:text-sm font-bold text-[#001e00]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#14a800] shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. LOCATION & PRIVACY POLICY */}
            <section className="bg-white rounded-xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
              <h2 className="text-base sm:text-lg font-black text-[#001e00] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#14a800]" />
                <span>الموقع والمعاينة الميدانية</span>
              </h2>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5">
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
                  <span>المحافظة: <strong>{governorate?.name_ar || 'كفر الشيخ'}</strong></span>
                  <span>•</span>
                  <span>المدينة: <strong>{city?.name_ar || 'كفر الشيخ'}</strong></span>
                  <span>•</span>
                  <span>المنطقة: <strong>{version?.public_location_text || 'كفر الشيخ'}</strong></span>
                </div>

                <div className="pt-2.5 border-t border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#14a800] shrink-0 mt-0.5" />
                  <p>
                    <strong>سياسة خصوصية العنوان:</strong> حفاظاً على سرية بيانات المالك وسلامة المعاملة، يتم ترتيب المعاينة الميدانية الواقعية برفقة مستشار روابط المعتمد بعد تنسيق الموعد.
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* Desktop Sticky Sidebar (4 cols) & Natural Flow on Mobile */}
          <aside className="w-full lg:col-span-4 mt-8 lg:mt-0 lg:self-start lg:sticky lg:top-[125px] space-y-5 transition-all duration-200">
            
            {/* Primary Action Card with refined spacing and luxury presentation */}
            <div className="bg-white rounded-xl p-6 sm:p-7 border border-[#14a800]/25 shadow-sm space-y-5 sm:space-y-6 text-right">
              
              {/* Price recap in sidebar - Property code removed here to eliminate redundancy (already in top bar) */}
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 block">السعر المطلوب</span>
                <div className="flex items-baseline gap-1.5 pt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#14a800]">{formattedPrice}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 inline-block" dir="rtl">
                    <bdi>ج.م</bdi>
                  </span>
                  {txType?.slug === 'rent' && <span className="text-xs text-slate-500 font-semibold">/ شهر</span>}
                </div>
              </div>

              {/* Main CTA 1: Request Viewing */}
              <button
                type="button"
                onClick={() => setIsViewingModalOpen(true)}
                className="w-full py-3.5 px-4 bg-[#14a800] hover:bg-[#108a00] text-white text-sm font-black rounded-xl transition shadow-md shadow-[#14a800]/20 flex items-center justify-center gap-2 active:scale-98 cursor-pointer min-h-[48px]"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>طلب حجز معاينة ميدانية</span>
              </button>

              {/* Main CTA 2: WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppContact}
                className="w-full py-3 px-4 bg-[#001e00] hover:bg-[#002f00] text-white text-xs sm:text-sm font-black rounded-xl transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4 text-[#14a800]" />
                <span>محادثة واتساب الرسمية</span>
              </button>

              {/* Main CTA 3: Call */}
              <button
                type="button"
                onClick={handlePhoneCall}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer min-h-[40px]"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#14a800]" />
                <span>اتصال مباشر: {settings.primary_phone}</span>
              </button>

              {/* Trust & Verification Bullets */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#14a800] shrink-0" />
                  <span>معاينة حقيقية بحضور ممثل رسمي</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#14a800] shrink-0" />
                  <span>مراجعة المستندات والعقود قانونياً</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#14a800] shrink-0" />
                  <span>وساطة معتمدة بدون عمولات خفية</span>
                </div>
              </div>

            </div>

            {/* Working Hours Card */}
            <div className="p-4 rounded-xl bg-[#f2f7f2] border border-[#14a800]/20 space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-1.5 text-[#001e00] font-bold">
                <Clock className="w-3.5 h-3.5 text-[#14a800]" />
                <span>أوقات العمل:</span>
              </div>
              <p className="leading-relaxed text-[11px] font-medium text-slate-600">
                السبت - الخميس: 9:00 ص حتى 9:00 م. الرد الفوري على رسائل الواتساب.
              </p>
            </div>

          </aside>

        </div>
      </main>

      {/* 7. FULL-WIDTH PREMIUM SIMILAR PROPERTIES CAROUSEL */}
      {similarProperties.length > 0 && (
        <SimilarPropertiesCarousel
          properties={similarProperties}
          currentProperty={property}
          onSelectProperty={onSelectProperty}
          onFilterByTag={onFilterByTag}
          onViewAll={onBack}
        />
      )}

      {/* 8. MOBILE STICKY BOTTOM ACTION BAR (Compact, premium, thumb-friendly) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-2xl pb-[max(0.6rem,env(safe-area-inset-bottom,0px))]">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          
          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppContact}
            className="p-2 sm:p-2.5 bg-[#001e00] active:bg-[#002f00] text-white rounded-xl flex items-center justify-center gap-1.5 transition shrink-0 min-h-[44px] min-w-[44px] cursor-pointer"
            title="واتساب"
          >
            <MessageSquare className="w-4 h-4 text-[#14a800]" />
            <span className="text-xs font-bold hidden min-[360px]:inline">واتساب</span>
          </button>

          {/* Call */}
          <button
            type="button"
            onClick={handlePhoneCall}
            className="p-2 sm:p-2.5 bg-slate-100 active:bg-slate-200 text-slate-800 rounded-xl flex items-center justify-center gap-1.5 transition shrink-0 min-h-[44px] min-w-[44px] cursor-pointer border border-slate-200"
            title="اتصال هاتفى"
          >
            <PhoneCall className="w-4 h-4 text-[#14a800]" />
            <span className="text-xs font-bold hidden min-[360px]:inline">اتصال</span>
          </button>

          {/* Primary Request Viewing */}
          <button
            type="button"
            onClick={() => setIsViewingModalOpen(true)}
            className="flex-1 py-2.5 px-3 bg-[#14a800] active:bg-[#108a00] text-white text-xs sm:text-sm font-black rounded-xl transition shadow-md shadow-[#14a800]/25 flex items-center justify-center gap-1.5 min-h-[44px] min-w-0 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white shrink-0" />
            <span className="truncate">طلب معاينة العقار</span>
          </button>

        </div>
      </div>

      {/* 9. FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 animate-soft-fade"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white py-2 z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-300">
                {activeImageIndex + 1} من {images.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(property.reference_number);
                  setLeadToast('تم نسخ كود العقار');
                  setTimeout(() => setLeadToast(null), 3000);
                }}
                className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="انقر لنسخ كود العقار"
              >
                <span>كود: {property.reference_number}</span>
                <Copy className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="إغلاق المعرض"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Large Image Viewport */}
          <div 
            className="relative flex-1 flex items-center justify-center overflow-hidden my-2" 
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[activeImageIndex]}
              alt={`${version?.title} - صورة ${activeImageIndex + 1}`}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain rounded-lg select-none"
            />

            {/* Prev / Next Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-black/60 hover:bg-black text-white flex items-center justify-center transition cursor-pointer active:scale-95"
                  title="الصورة السابقة"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-black/60 hover:bg-black text-white flex items-center justify-center transition cursor-pointer active:scale-95"
                  title="الصورة التالية"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {images.length > 1 && (
            <div 
              className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10 scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#14a800] scale-105'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`مصغرة ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 10. REQUEST VIEWING MODAL */}
      {isViewingModalOpen && (
        <Suspense fallback={null}>
          <RequestViewingModal
            property={property}
            onClose={() => setIsViewingModalOpen(false)}
            onSuccess={() => {
              setIsViewingModalOpen(false);
              setLeadToast('تم تسجيل طلب المعاينة الميدانية بنجاح، وسيتواصل معك مستشار روابط لتأكيد الموعد');
              setTimeout(() => setLeadToast(null), 5000);
            }}
          />
        </Suspense>
      )}

    </div>
  );
};
