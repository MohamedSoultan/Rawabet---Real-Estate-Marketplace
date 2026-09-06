import React, { useState } from 'react';
import { Property, PropertyVersion } from '../../types';
import { useApp } from '../../context/AppContext';
import { RequestViewingModal } from './RequestViewingModal';
import { 
  X, 
  MapPin, 
  Maximize2, 
  Bed, 
  Bath, 
  Building2, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Bookmark, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Clock,
  Lock,
  Sparkles,
  Share2,
  Check,
  Calendar,
  Award
} from 'lucide-react';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
  onFilterByTag?: (filterType: 'property_type_id' | 'transaction_type_id' | 'city_id' | 'area_id', value: string) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ property, onClose, onFilterByTag }) => {
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
  const [leadCreatedToast, setLeadCreatedToast] = useState<string | null>(null);
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);

  if (!property) return null;

  // Active public version
  const activeVersionId = property.current_published_version_id || property.versions[0]?.id;
  const version: PropertyVersion = property.versions.find(v => v.id === activeVersionId) || property.versions[0];

  const pType = propertyTypes.find(pt => pt.id === property.property_type_id) || propertyTypes[0];
  const txType = transactionTypes.find(tx => tx.id === property.transaction_type_id) || transactionTypes[0];
  const favorited = isFavorite(property.id);

  const images = version?.media && version.media.length > 0
    ? version.media.map(m => m.path)
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const formattedPrice = new Intl.NumberFormat('ar-EG', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(version?.price || 0);

  // WhatsApp Handler - Direct and unblocked
  const handleWhatsAppContact = () => {
    if (currentUser) {
      try {
        createLeadFromInteraction(property.id, 'WHATSAPP');
      } catch {
        // Continue opening WhatsApp
      }
    }

    setLeadCreatedToast('جارٍ فتح محادثة واتساب المباشرة...');
    setTimeout(() => setLeadCreatedToast(null), 4000);

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
    const waUrl = `https://wa.me/${waNumber}?text=${templateMsg}`;
    window.open(waUrl, '_blank');
  };

  // Phone Call Handler
  const handlePhoneCall = () => {
    if (!currentUser) {
      openAuthModal('REGISTER', () => handlePhoneCall());
      return;
    }

    const res = createLeadFromInteraction(property.id, 'CALL');
    if (res.success) {
      setLeadCreatedToast('تم تسجيل طلب المعاينة وتحويل الاتصال لفرع مبيعات كفر الشيخ');
      setTimeout(() => setLeadCreatedToast(null), 5000);
      window.location.href = `tel:${settings.primary_phone}`;
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-soft-fade">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-[#e4ebe4] my-auto text-right">
        
        {/* Modal Top Header (Upwork Style) */}
        <div className="px-4 sm:px-6 py-3.5 bg-white text-[#001e00] flex items-center justify-between border-b border-[#e4ebe4] shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#14a800]" />
            <span className="text-sm font-black text-[#001e00]">معاينة وتفاصيل العقار</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyShareLink}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              title="مشاركة رابط العقار"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#14a800]" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => toggleFavorite(property.id)}
              className={`p-2 rounded-full hover:bg-slate-100 transition cursor-pointer ${
                favorited ? 'text-[#14a800]' : 'text-slate-600'
              }`}
              title="حفظ في المفضلة"
            >
              <Bookmark className={`w-4 h-4 ${favorited ? 'fill-[#14a800]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              title="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {leadCreatedToast && (
            <div className="p-3 bg-[#f2f7f2] border border-[#14a800]/40 text-[#14a800] text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 animate-soft-fade">
              <CheckCircle2 className="w-4 h-4 text-[#14a800] shrink-0" />
              <span>{leadCreatedToast}</span>
            </div>
          )}

          {/* CODE & TAGS FILTER BAR DIRECTLY ABOVE PHOTO GALLERY */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-1 text-xs">
            {/* Reference Code Badge */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-black bg-[#f2f7f2] text-[#14a800] px-3 py-1 rounded-full border border-[#14a800]/30 shadow-2xs">
                كود: {property.reference_number}
              </span>
            </div>

            {/* Clickable Tag Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Transaction Type Tag */}
              {txType && (
                <button
                  type="button"
                  onClick={() => {
                    onFilterByTag?.('transaction_type_id', txType.id);
                    onClose();
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1 ${
                    txType.slug === 'rent'
                      ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  }`}
                  title={`عرض كافة عقارات ${txType.name_ar}`}
                >
                  <span>{txType.name_ar}</span>
                </button>
              )}

              {/* Property Type Tag */}
              {pType && (
                <button
                  type="button"
                  onClick={() => {
                    onFilterByTag?.('property_type_id', pType.id);
                    onClose();
                  }}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 transition cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1"
                  title={`عرض كافة عقارات نوع ${pType.name_ar}`}
                >
                  <Building2 className="w-3 h-3 text-blue-600 shrink-0" />
                  <span>{pType.name_ar}</span>
                </button>
              )}

              {/* Location Tag */}
              {version.city_id && (
                <button
                  type="button"
                  onClick={() => {
                    onFilterByTag?.('city_id', version.city_id);
                    onClose();
                  }}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-[#f2f7f2] text-[#001e00] border border-[#14a800]/30 hover:bg-[#e4ebe4] transition cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1"
                  title={`عرض كافة عقارات ${version.public_location_text || 'كفر الشيخ'}`}
                >
                  <MapPin className="w-3 h-3 text-[#14a800] shrink-0" />
                  <span>{version.public_location_text || 'كفر الشيخ'}</span>
                </button>
              )}

              {/* Area Badge */}
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                {version.area_sqm} م²
              </span>
            </div>
          </div>

          {/* Photo Gallery with Thumbnails */}
          <div className="space-y-2.5">
            <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-100 border border-[#e4ebe4]">
              <img
                src={images[activeImageIndex]}
                alt={version.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />

              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-2 pointer-events-none">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                    }}
                    className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md pointer-events-auto transition active:scale-95 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                    }}
                    className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md pointer-events-auto transition active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                {activeImageIndex + 1} من {images.length}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#14a800] ring-2 ring-[#14a800]/20' : 'border-[#e4ebe4] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="صورة مصغرة" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price Section */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#e4ebe4]">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#001e00] leading-snug font-display">
                {version.title}
              </h2>
              
              {/* Tags Bar */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="px-3 py-1 rounded-full bg-[#f2f7f2] text-[#001e00] border border-[#14a800]/25 text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#14a800] shrink-0" />
                  <span>{version.public_location_text || 'كفر الشيخ'}</span>
                </span>

                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-100 text-xs font-bold flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{pType.name_ar}</span>
                </span>

                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  txType?.slug === 'rent'
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                }`}>
                  {txType?.name_ar || 'للبيع'}
                </span>

                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  {version.area_sqm} م²
                </span>
              </div>
            </div>

            <div className="text-right sm:text-left shrink-0">
              <div className="text-2xl sm:text-3xl font-black text-[#14a800] font-display tabular-nums tracking-tight">
                {formattedPrice} <span className="text-sm font-bold text-slate-600 inline-block" dir="rtl"><bdi>ج.م</bdi></span>
              </div>
              <span className="text-xs text-slate-400 font-semibold block mt-0.5">
                {txType?.slug === 'rent' ? 'قيمة الإيجار الشهري' : 'السعر الإجمالي المطلوب'}
              </span>
            </div>
          </div>

          {/* Authentication Barrier for Guests */}
          {!currentUser ? (
            <div className="p-6 bg-[#f2f7f2] border border-[#14a800]/30 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#14a800] text-white flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#001e00]">سجل حسابك مجاناً للاطلاع على كامل مواصفات العقار وتحديد موعد المعاينة</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed font-semibold">
                التسجيل بروابط سريع بدون كلمة مرور (عبر البريد ورمز التأكيد OTP) لضمان جدية طلبات المعاينة وتقديم تجربة احترافية.
              </p>
              <button
                onClick={() => openAuthModal('REGISTER')}
                className="px-8 py-3 bg-[#14a800] hover:bg-[#108a00] text-white font-bold text-sm rounded-xl transition shadow-xs inline-flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>تسجيل مجاني فوري</span>
              </button>
            </div>
          ) : (
            <>
              {/* Core Specifications Grid (Upwork Style) */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#001e00]">مواصفات العقار الفنية</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
                  
                  <div className="p-3.5 rounded-xl bg-[#f9f9f9] border border-[#e4ebe4] space-y-1">
                    <span className="text-slate-400 text-[10px] block font-semibold">المساحة الإجمالية:</span>
                    <span className="text-[#001e00] text-sm font-black">{version.area_sqm} م²</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f9f9f9] border border-[#e4ebe4] space-y-1">
                    <span className="text-slate-400 text-[10px] block font-semibold">نوع العقار:</span>
                    <span className="text-[#001e00] text-sm font-black">{pType.name_ar}</span>
                  </div>

                  {version.bedrooms !== undefined && (
                    <div className="p-3.5 rounded-xl bg-[#f9f9f9] border border-[#e4ebe4] space-y-1">
                      <span className="text-slate-400 text-[10px] block font-semibold">عدد الغرف:</span>
                      <span className="text-[#001e00] text-sm font-black">{version.bedrooms} غرف</span>
                    </div>
                  )}

                  {version.bathrooms !== undefined && (
                    <div className="p-3.5 rounded-xl bg-[#f9f9f9] border border-[#e4ebe4] space-y-1">
                      <span className="text-slate-400 text-[10px] block font-semibold">الحمامات:</span>
                      <span className="text-[#001e00] text-sm font-black">{version.bathrooms} حمام</span>
                    </div>
                  )}

                  {version.floor && (
                    <div className="p-3.5 rounded-xl bg-[#f9f9f9] border border-[#e4ebe4] space-y-1">
                      <span className="text-slate-400 text-[10px] block font-semibold">الدور / الطابق:</span>
                      <span className="text-[#001e00] text-sm font-black">{version.floor}</span>
                    </div>
                  )}

                  {version.finishing && (
                    <div className="p-3.5 rounded-xl bg-[#f9f9f9] border border-[#e4ebe4] space-y-1">
                      <span className="text-slate-400 text-[10px] block font-semibold">حالة التشطيب:</span>
                      <span className="text-[#001e00] text-sm font-black">{version.finishing}</span>
                    </div>
                  )}

                  <div className="p-3.5 rounded-xl bg-[#f9f9f9] border border-[#e4ebe4] space-y-1">
                    <span className="text-slate-400 text-[10px] block font-semibold">نوع المعاملة:</span>
                    <span className="text-[#14a800] text-sm font-black">{txType.name_ar}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f9f9f9] border border-[#e4ebe4] space-y-1">
                    <span className="text-slate-400 text-[10px] block font-semibold">حالة التدقيق:</span>
                    <span className="text-[#14a800] text-sm font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#14a800]" /> مفحوص 100%
                    </span>
                  </div>

                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#001e00]">الوصف والتفاصيل العامة</h3>
                <div className="p-4 rounded-xl bg-[#f9f9f9] border border-[#e4ebe4] text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                  {version.description}
                </div>
              </div>

              {/* Features & Amenities (Skills Chips style) */}
              {version.features && version.features.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-[#001e00]">المميزات والمرافق المتاحة</h3>
                  <div className="flex flex-wrap gap-2">
                    {version.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#f2f7f2] border border-[#e4ebe4] text-[#001e00] text-xs font-bold"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#14a800] shrink-0" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust & Guarantee Box */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#001e00] text-white space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#14a800] text-white shrink-0 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 text-right flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#14a800]" />
                        <span>عقار موثق ومعتمد من روابط</span>
                      </h4>
                      <span className="text-[11px] font-mono text-[#14a800] bg-[#002b00] px-2.5 py-0.5 rounded-full border border-[#14a800]/30 font-bold">
                        كود: {property.reference_number}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      تمت المراجعة والتدقيق بواسطة فريق روابط الهندسي والقانوني. تم التحقق من المعاينة ومطابقة المواصفات.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400 font-medium">
                      <span>• تاريخ المراجعة والاعتماد: {new Date(property.updated_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span>• حماية وسرية: لا يتم إظهار بيانات المالك للعامة إطلاقاً</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Bottom CTA Action Bar (Upwork Style Action Buttons) */}
        <div className="px-4 sm:px-6 py-3.5 bg-white border-t border-[#e4ebe4] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <div className="text-xs text-slate-500 font-semibold hidden sm:flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#14a800]" />
            <span>معاينة وتنسيق مباشر مع فريق مبيعات روابط</span>
          </div>

          {/* Contact & Booking Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            
            {/* Secondary CTA: Request Viewing */}
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  openAuthModal('REGISTER', () => setIsViewingModalOpen(true));
                  return;
                }
                setIsViewingModalOpen(true);
              }}
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200 text-[#001e00] text-xs sm:text-sm font-black rounded-full transition border border-slate-300 flex items-center justify-center gap-2 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 text-[#14a800]" />
              <span>طلب حجز معاينة</span>
            </button>

            {/* Primary CTA: WhatsApp Rawabet Team */}
            <button
              type="button"
              onClick={handleWhatsAppContact}
              className="flex-1 sm:flex-initial min-w-0 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-black rounded-full transition shadow-md shadow-[#14a800]/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer shrink-0"
              title="تواصل مع فريق روابط عبر الواتساب"
            >
              <MessageSquare className="w-4 h-4 text-white shrink-0" />
              <span className="truncate">واتساب روابط</span>
            </button>

            {/* Direct Sales Call */}
            <button
              type="button"
              onClick={handlePhoneCall}
              className="flex-1 sm:flex-initial min-w-0 px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#001e00] text-[#001e00] hover:bg-[#f2f7f2] text-xs sm:text-sm font-bold rounded-full transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
              title="اتصال بمبيعات روابط"
            >
              <Phone className="w-4 h-4 text-[#14a800] shrink-0" />
              <span className="truncate font-bold">اتصال</span>
            </button>

          </div>

        </div>

      </div>

      {/* Viewing Request Modal */}
      {isViewingModalOpen && (
        <RequestViewingModal
          property={property}
          onClose={() => setIsViewingModalOpen(false)}
        />
      )}
    </div>
  );
};
