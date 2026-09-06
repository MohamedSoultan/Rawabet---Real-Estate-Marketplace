import React, { useState, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PropertyFilterState, PropertyRequest } from '../../types';
import { 
  Sparkles, 
  MapPin, 
  Banknote, 
  Building2, 
  Tag, 
  CheckCircle2, 
  Edit3, 
  Send, 
  X, 
  ShieldCheck, 
  Phone, 
  User as UserIcon, 
  FileText,
  RotateCcw,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Button, Badge } from '../ui';

interface SmartSearchNoMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: PropertyFilterState;
  selectedIntent: 'BUY' | 'RENT' | 'INVEST' | 'COMMERCIAL';
  selectedPreferences: string[];
  interestQuestions: Array<{ id: string; label: string; internalFeature: string; desc: string }>;
  onEditPreferences: (step?: number) => void;
  onStartNewSearch: () => void;
}

export const SmartSearchNoMatchModal: React.FC<SmartSearchNoMatchModalProps> = ({
  isOpen,
  onClose,
  filterState,
  selectedIntent,
  selectedPreferences,
  interestQuestions,
  onEditPreferences,
  onStartNewSearch,
}) => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    cities, 
    areas, 
    propertyTypes, 
    transactionTypes, 
    submitPropertyRequest 
  } = useApp();

  const titleId = useId();
  const descId = useId();

  // Contact inputs
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser?.mobile || '');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<PropertyRequest | null>(null);

  // Sync user details when logged in
  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.name);
      if (!whatsappNumber) setWhatsappNumber(currentUser.mobile);
    }
  }, [currentUser]);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setIsSubmitting(false);
      setSubmittedRequest(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Resolve Readable Preference Values
  // 1. Transaction Type
  const isRent = filterState.transactionType === 'tx-rent' || selectedIntent === 'RENT';
  const transactionLabel = isRent 
    ? 'إيجار عقار' 
    : selectedIntent === 'INVEST' 
      ? 'استثمار عقاري (شراء)' 
      : selectedIntent === 'COMMERCIAL' 
        ? 'عقار تجاري' 
        : 'شراء عقار';

  // 2. Property Type
  const currentPropertyType = propertyTypes.find(pt => pt.id === filterState.propertyType);
  const propertyTypeName = currentPropertyType?.name_ar || (selectedIntent === 'COMMERCIAL' ? 'محل / مقر تجاري' : 'شقة سكنية');

  // 3. Location
  const cityName = cities.find(c => c.id === filterState.location?.city_id)?.name_ar || 'كافة مراكز كفر الشيخ';
  const areaName = areas.find(a => a.id === filterState.location?.area_id)?.name_ar;
  const locationSummary = areaName ? `كفر الشيخ - ${cityName} (${areaName})` : `كفر الشيخ - ${cityName}`;

  // 4. Budget
  let budgetLabel = 'ميزانية مرنة / غير محددة';
  let computedBudgetNumber = 1500000;
  if (filterState.minPrice && filterState.maxPrice) {
    budgetLabel = `من ${filterState.minPrice.toLocaleString('ar-EG')} إلى ${filterState.maxPrice.toLocaleString('ar-EG')} ج.م`;
    computedBudgetNumber = filterState.maxPrice;
  } else if (filterState.maxPrice) {
    budgetLabel = `حتى ${filterState.maxPrice.toLocaleString('ar-EG')} ج.م`;
    computedBudgetNumber = filterState.maxPrice;
  } else if (filterState.minPrice) {
    budgetLabel = `من ${filterState.minPrice.toLocaleString('ar-EG')} ج.م`;
    computedBudgetNumber = filterState.minPrice;
  } else if (isRent) {
    budgetLabel = 'حسب القيمة الإيجارية السوقية المناسبة';
    computedBudgetNumber = 5000;
  }

  // 5. Selected Interests
  const selectedInterestLabels = interestQuestions
    .filter(q => selectedPreferences.includes(q.id))
    .map(q => q.label.replace('؟', ''));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('يرجى كتابة الاسم بالكامل للتواصل.');
      return;
    }

    const cleanPhone = whatsappNumber.replace(/\s+/g, '');
    if (!cleanPhone || !/^01[0125][0-9]{8}$/.test(cleanPhone)) {
      setErrorMsg('يرجى إدخال رقم واتساب مصري صحيح للتواصل والمتابعة (مثال: 01012345678).');
      return;
    }

    setIsSubmitting(true);

    const interestsNote = selectedInterestLabels.length > 0 
      ? `التفضيلات والاهتمامات المطلوبة: ${selectedInterestLabels.join('، ')}` 
      : '';
    const fullNotes = [interestsNote, additionalNotes.trim()].filter(Boolean).join('\n');

    const res = submitPropertyRequest({
      full_name: fullName.trim(),
      whatsapp_number: cleanPhone,
      governorate: 'كفر الشيخ',
      city_or_area: locationSummary,
      transaction_type: isRent ? 'RENT' : 'BUY',
      property_type: propertyTypeName,
      budget: computedBudgetNumber,
      additional_notes: fullNotes || undefined,
      source: 'smart_search_no_match'
    });

    setIsSubmitting(false);

    if (res.success && res.request) {
      setSubmittedRequest(res.request);
    } else {
      setErrorMsg('حدث خطأ غير متوقع أثناء إرسال طلبك، يرجى إعادة المحاولة.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/60 backdrop-blur-xs animate-soft-fade"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      dir="rtl"
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-slide-up text-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-l from-[#001e00] to-[#043304] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="absolute left-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14a800] text-white text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              خدمة توفير العقار المخصص
            </span>
            <span className="text-white/70 text-xs font-medium">بحث وتفاوض حصري</span>
          </div>

          <h2 id={titleId} className="text-lg sm:text-2xl font-black tracking-tight text-white">
            لم نجد عقاراً مطابقاً تماماً لمواصفاتك حالياً
          </h2>

          <p id={descId} className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed max-w-xl font-normal">
            لا داعي للقلق؛ فريق وسطاء ومستشاري روابط يتولى البحث الميداني والتفاوض المباشر نيابة عنك لتوفير العقار المطلوب بالمواصفات والسعر المحدد دون أي عناء.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[calc(85vh-120px)] overflow-y-auto space-y-6">
          
          {submittedRequest ? (
            /* Success State — Stays inside discovery experience */
            <div className="py-4 space-y-6 text-center animate-soft-fade">
              <div className="w-20 h-20 rounded-full bg-[#f0faf0] border-2 border-[#14a800] text-[#14a800] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl sm:text-2xl font-black text-[#001e00]">
                  تم إرسال طلبك لفريق روابط بنجاح!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  تم تسجيل طلبك رسمياً وتوجيهه إلى فريق المستشارين والوسطاء المعتمدين في كفر الشيخ للبدء في البحث الميداني فوراً.
                </p>
              </div>

              {/* Reference ID Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">رقم الطلب المرجعي:</span>
                <span className="text-[#14a800] font-black text-sm tracking-wider font-mono">
                  {submittedRequest.reference_number}
                </span>
              </div>

              <div className="bg-[#f0faf0] border border-[#d7eed7] rounded-xl p-4 text-xs text-slate-700 leading-relaxed font-medium text-right space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#001e00]">
                  <ShieldCheck className="w-4 h-4 text-[#14a800]" />
                  <span>ما هي الخطوة القادمة؟</span>
                </div>
                <p>
                  سيتواصل معك مستشار روابط العقاري عبر الواتساب على الرقم (<span className="font-bold text-[#001e00]" dir="ltr">{whatsappNumber}</span>) بالمستجدات وبمجرد فحص أي عقار مطابق للشروط والأسعار المطلوبة.
                </p>
              </div>

              {/* Discovery Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartNewSearch();
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>بدء بحث ذكي جديد</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/properties');
                  }}
                  className="w-full sm:w-auto px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-slate-500" />
                  <span>تصفح كافة العقارات المعروضة</span>
                </button>
              </div>
            </div>
          ) : (
            /* Request Form with Collected Preferences */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Collected Preferences Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#14a800]" />
                    <span className="text-xs sm:text-sm font-black text-[#001e00]">
                      المواصفات التي حددتها في البحث الذكي
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEditPreferences(4); // Jump back to edit
                    }}
                    className="text-xs font-bold text-[#14a800] hover:text-[#108a00] flex items-center gap-1 hover:underline transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل المواصفات</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Transaction Type */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      نوع الصفقة:
                    </span>
                    <span className="font-bold text-[#001e00]">{transactionLabel}</span>
                  </div>

                  {/* Property Type */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      نوع العقار:
                    </span>
                    <span className="font-bold text-[#001e00]">{propertyTypeName}</span>
                  </div>

                  {/* Location */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      الموقع:
                    </span>
                    <span className="font-bold text-[#001e00] truncate max-w-[180px]">{locationSummary}</span>
                  </div>

                  {/* Budget */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Banknote className="w-3.5 h-3.5 text-slate-400" />
                      الميزانية:
                    </span>
                    <span className="font-bold text-[#14a800]">{budgetLabel}</span>
                  </div>
                </div>

                {/* Selected Interests Badges */}
                {selectedInterestLabels.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      الاهتمامات والتفضيلات المحددة:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedInterestLabels.map((label, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 bg-white border border-[#14a800]/30 text-[#14a800] rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#14a800]" />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Contact Information */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-black text-[#001e00] flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#14a800]" />
                    <span>بيانات التواصل لمتابعة وتوفير العقار</span>
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    سيتواصل معك مستشار روابط فور توفير الخيارات المطابقة للتفاوض والمعاينة المباشرة:
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 animate-soft-fade">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      الاسم بالكامل <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="مثال: أحمد محمد"
                        className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#14a800] focus:ring-2 focus:ring-[#14a800]/20 transition outline-hidden"
                      />
                      <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* WhatsApp Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      رقم الواتساب <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        dir="ltr"
                        required
                        value={whatsappNumber}
                        onChange={e => setWhatsappNumber(e.target.value)}
                        placeholder="01012345678"
                        className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#14a800] focus:ring-2 focus:ring-[#14a800]/20 transition outline-hidden text-right"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ملاحظات أو شروط خاصة ترغب في إضافتها (اختياري)
                  </label>
                  <div className="relative">
                    <textarea
                      rows={2}
                      value={additionalNotes}
                      onChange={e => setAdditionalNotes(e.target.value)}
                      placeholder="مثال: يفضل الطوابق المتوسطة، أو شروط معينة في طريقة السداد والأقساط..."
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-[#14a800] focus:ring-2 focus:ring-[#14a800]/20 transition outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-3 bg-[#f0faf0] border border-[#d7eed7] rounded-xl flex items-center gap-3 text-xs text-slate-700 font-medium">
                <ShieldCheck className="w-5 h-5 text-[#14a800] shrink-0" />
                <span>
                  نضمن لك سرية بياناتك التامة، والتفاوض المحايد للحصول على أفضل سعر وأمان قانوني.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEditPreferences(4);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  تعديل المواصفات والخيارات
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-[#14a800] hover:bg-[#108a00] disabled:bg-slate-300 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4 rotate-180" />
                  <span>{isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال الطلب لفريق روابط'}</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
