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
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs animate-soft-fade"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      dir="rtl"
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[96vh] flex flex-col animate-slide-up text-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-l from-[#001e00] to-[#043304] text-white px-4 py-3 sm:px-5 sm:py-3.5 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="absolute left-3 top-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#14a800] text-white text-[11px] font-bold shadow-2xs">
              <Sparkles className="w-3 h-3" />
              طلب مخصص
            </span>
          </div>

          <h2 id={titleId} className="text-base sm:text-lg font-black tracking-tight text-white">
            مالقيناش طلبك دلوقتي
          </h2>

          <p id={descId} className="text-xs text-slate-200 mt-0.5 leading-snug font-medium">
            ولا يهمك، هاندور لك عليه ونجيبلك أحسن سعر.. سيب بياناتك تحت.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-3 flex-1">
          
          {submittedRequest ? (
            /* Success State — Stays inside discovery experience */
            <div className="py-3 space-y-4 text-center animate-soft-fade">
              <div className="w-14 h-14 rounded-full bg-[#f0faf0] border-2 border-[#14a800] text-[#14a800] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-black text-[#001e00]">
                  تم استلام طلبك بنجاح!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  فريقنا هيبدأ يدورلك فوراً وهنكلمك أول ما نلاقي طلبك.
                </p>
              </div>

              {/* Reference ID Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 max-w-xs mx-auto flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">رقم الطلب:</span>
                <span className="text-[#14a800] font-black tracking-wider font-mono">
                  {submittedRequest.reference_number}
                </span>
              </div>

              <div className="bg-[#f0faf0] border border-[#d7eed7] rounded-xl p-2.5 text-xs text-slate-700 leading-relaxed font-medium text-right space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#001e00]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#14a800]" />
                  <span>هنعمل إيه دلوقتي؟</span>
                </div>
                <p className="text-[11px] sm:text-xs">
                  هنكلمك على الواتساب على (<span className="font-bold text-[#001e00]" dir="ltr">{whatsappNumber}</span>) أول ما يتوفر العقار المناسب وبأحسن سعر.
                </p>
              </div>

              {/* Discovery Actions */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartNewSearch();
                  }}
                  className="w-full sm:w-auto px-5 py-2 bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold rounded-xl transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>بحث ذكي جديد</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/properties');
                  }}
                  className="w-full sm:w-auto px-5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-slate-500" />
                  <span>شوف كل العقارات</span>
                </button>
              </div>
            </div>
          ) : (
            /* Request Form with Collected Preferences */
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Collected Preferences Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#14a800]" />
                    <span className="text-xs font-black text-[#001e00]">
                      مواصفات طلبك
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
                    <Edit3 className="w-3 h-3" />
                    <span>تعديل</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {/* Transaction Type */}
                  <div className="bg-white p-2 rounded-lg border border-slate-200/80 flex items-center justify-between gap-1">
                    <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-400" />
                      الطلب:
                    </span>
                    <span className="font-bold text-[#001e00] text-[11px] truncate">{transactionLabel}</span>
                  </div>

                  {/* Property Type */}
                  <div className="bg-white p-2 rounded-lg border border-slate-200/80 flex items-center justify-between gap-1">
                    <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      النوع:
                    </span>
                    <span className="font-bold text-[#001e00] text-[11px] truncate">{propertyTypeName}</span>
                  </div>

                  {/* Location */}
                  <div className="bg-white p-2 rounded-lg border border-slate-200/80 flex items-center justify-between gap-1">
                    <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      المكان:
                    </span>
                    <span className="font-bold text-[#001e00] text-[11px] truncate max-w-[120px]">{locationSummary}</span>
                  </div>

                  {/* Budget */}
                  <div className="bg-white p-2 rounded-lg border border-slate-200/80 flex items-center justify-between gap-1">
                    <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
                      <Banknote className="w-3 h-3 text-slate-400" />
                      الميزانية:
                    </span>
                    <span className="font-bold text-[#14a800] text-[11px] truncate">{budgetLabel}</span>
                  </div>
                </div>

                {/* Selected Interests Badges */}
                {selectedInterestLabels.length > 0 && (
                  <div className="pt-1 border-t border-slate-200 flex flex-wrap gap-1 items-center">
                    <span className="text-[10px] font-bold text-slate-500">التفضيلات:</span>
                    {selectedInterestLabels.map((label, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 bg-white border border-[#14a800]/30 text-[#14a800] rounded-md text-[10px] font-bold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#14a800]" />
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Customer Contact Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#14a800]" />
                  <h4 className="text-xs sm:text-sm font-black text-[#001e00]">
                    بياناتك عشان نكلمك
                  </h4>
                </div>

                {errorMsg && (
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 animate-soft-fade">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      الاسم بالكامل <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="اسمك"
                        className="w-full pl-2.5 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#14a800] outline-hidden"
                      />
                      <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* WhatsApp Phone */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
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
                        className="w-full pl-2.5 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#14a800] outline-hidden text-right"
                      />
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    ملاحظات تانية لو تحب (اختياري)
                  </label>
                  <input
                    type="text"
                    value={additionalNotes}
                    onChange={e => setAdditionalNotes(e.target.value)}
                    placeholder="مثال: دور أخير، تقسيط، تسليم فوري..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-[#14a800] outline-hidden"
                  />
                </div>
              </div>

              {/* Trust Badge */}
              <div className="py-1.5 px-2.5 bg-[#f0faf0] border border-[#d7eed7] rounded-xl flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#14a800] shrink-0" />
                <span>بياناتك في سرية تامة والتواصل رسمي فقط.</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEditPreferences(4);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  تعديل
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial px-6 py-2 bg-[#14a800] hover:bg-[#108a00] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5 rotate-180" />
                  <span>{isSubmitting ? 'ثواني...' : 'ابعت الطلب'}</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
