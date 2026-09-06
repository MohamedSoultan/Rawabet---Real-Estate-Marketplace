import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useModalA11y } from '../../utils/useModalA11y';
import { 
  X, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Coins, 
  Phone, 
  User, 
  FileText, 
  Bed, 
  Maximize2, 
  Info, 
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { PropertyRequest } from '../../types';

interface RequestPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewMyRequests?: () => void;
  initialValues?: {
    transaction_type?: 'BUY' | 'RENT';
    property_type?: string;
    city_or_area?: string;
  };
}

export const RequestPropertyModal: React.FC<RequestPropertyModalProps> = ({
  isOpen,
  onClose,
  onViewMyRequests,
  initialValues
}) => {
  const { 
    currentUser, 
    settings, 
    cities, 
    propertyTypes, 
    submitPropertyRequest 
  } = useApp();

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const { containerRef } = useModalA11y({
    isOpen,
    onClose,
    initialFocusRef: closeBtnRef
  });

  const [transactionType, setTransactionType] = useState<'BUY' | 'RENT'>(initialValues?.transaction_type || 'BUY');
  const [propertyType, setPropertyType] = useState(initialValues?.property_type || 'شقة سكنية');
  const [govChoice, setGovChoice] = useState<'KFR' | 'OTHER'>('KFR');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [customCityArea, setCustomCityArea] = useState(initialValues?.city_or_area || '');
  const [otherGovDetails, setOtherGovDetails] = useState('');
  const [budget, setBudget] = useState('');
  const [areaSqm, setAreaSqm] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser?.mobile || '');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<PropertyRequest | null>(null);

  // Sync user details if logged in
  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.name);
      if (!whatsappNumber) setWhatsappNumber(currentUser.mobile);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!fullName.trim()) {
      setErrorMsg('يرجى إدخال الاسم بالكامل.');
      return;
    }

    const cleanPhone = whatsappNumber.replace(/\s+/g, '');
    if (!cleanPhone || !/^01[0125][0-9]{8}$/.test(cleanPhone)) {
      setErrorMsg('يرجى إدخال رقم واتساب مصري صحيح (مثال: 01012345678).');
      return;
    }

    const numBudget = Number(budget);
    if (!budget || isNaN(numBudget) || numBudget <= 0) {
      setErrorMsg('يرجى تحديد الميزانية المتوقعة بشكل صحيح.');
      return;
    }

    let finalGov = 'كفر الشيخ';
    let finalLocation = '';

    if (govChoice === 'KFR') {
      const cityName = cities.find(c => c.id === selectedCityId)?.name_ar || 'مدينة كفر الشيخ';
      finalLocation = customCityArea.trim() ? `${cityName} - ${customCityArea.trim()}` : cityName;
    } else {
      finalGov = 'محافظات أخرى - طلب خاص';
      if (!otherGovDetails.trim()) {
        setErrorMsg('يرجى ذكر اسم المحافظة والمدينة المطلوبة للطلب الخاص.');
        return;
      }
      finalLocation = otherGovDetails.trim();
    }

    const res = submitPropertyRequest({
      full_name: fullName.trim(),
      whatsapp_number: cleanPhone,
      governorate: finalGov,
      city_or_area: finalLocation,
      transaction_type: transactionType,
      property_type: propertyType,
      budget: numBudget,
      area_sqm: areaSqm ? Number(areaSqm) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      additional_notes: additionalNotes.trim() || undefined
    });

    if (res.success && res.request) {
      setSubmittedRequest(res.request);
    } else {
      setErrorMsg('حدث خطأ أثناء حفظ الطلب، يرجى المحاولة مرة أخرى.');
    }
  };

  const handleResetForm = () => {
    setSubmittedRequest(null);
    setBudget('');
    setAreaSqm('');
    setBedrooms('');
    setAdditionalNotes('');
    setOtherGovDetails('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-soft-fade overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-modal-title"
        tabIndex={-1}
        className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 text-right my-8 animate-soft-scale outline-none"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#001e00] text-white p-5 sm:p-6 relative">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white transition cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#14a800] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="request-modal-title" className="text-lg sm:text-xl font-black text-white">
                اطلب عقار بمواصفاتك الخاصة
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                لم تجد العقار المناسب؟ فريق روابط سيبحث ويفاوض نيابة عنك لتوفير طلبك
              </p>
            </div>
          </div>
        </div>

        {/* Success Screen */}
        {submittedRequest ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-xl bg-[#f2f7f2] text-[#14a800] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-black px-3 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                رقم الطلب: {submittedRequest.reference_number}
              </span>
              <h3 className="text-xl font-black text-[#001e00]">
                تم استلام طلبك العقاري بنجاح!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                شكراً لك يا <strong>{submittedRequest.full_name}</strong>. تم تسجيل طلبك لدى مستشاري روابط العقارية، وسيقوم مسؤول المبيعات بالتواصل معك عبر واتساب على الرقم <strong className="dir-ltr inline-block">{submittedRequest.whatsapp_number}</strong> بمجرد توفر أو مطابقة خيارات مناسبة.
              </p>
            </div>

            <div className="bg-[#f9f9f9] border border-[#e4ebe4] rounded-xl p-4 text-xs text-slate-700 text-right space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">نوع الطلب:</span>
                <span className="font-bold text-[#001e00]">
                  {submittedRequest.property_type} ({submittedRequest.transaction_type === 'BUY' ? 'شراء' : 'إيجار'})
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">الموقع المستهدف:</span>
                <span className="font-bold text-[#001e00]">
                  {submittedRequest.city_or_area} - {submittedRequest.governorate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">الميزانية المرصودة:</span>
                <span className="font-black text-[#14a800]">
                  {new Intl.NumberFormat('ar-EG').format(submittedRequest.budget)} جنيه
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onViewMyRequests && currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    onViewMyRequests();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#001e00] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
                >
                  عرض طلباتي في حسابي
                </button>
              )}

              <a
                href={`https://wa.me/201021469032?text=${encodeURIComponent(
                  `أهلاً روابط، قمت بتقديم طلب عقار خاص برقم مرجعي: ${submittedRequest.reference_number} (${submittedRequest.property_type} في ${submittedRequest.city_or_area}).`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>المتابعة السريعة عبر واتساب</span>
              </a>

              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
            
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Transaction Type (Buy vs Rent) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                نوع الصفقة المطلوبة <span className="text-rose-600">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTransactionType('BUY')}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${
                    transactionType === 'BUY'
                      ? 'bg-[#14a800] text-white border-[#14a800] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>أرغب في الشراء (تمليك)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('RENT')}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${
                    transactionType === 'RENT'
                      ? 'bg-[#14a800] text-white border-[#14a800] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>أرغب في الإيجار (شهري / سنوي)</span>
                </button>
              </div>
            </div>

            {/* Property Type & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نوع العقار المطلوب <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={propertyType}
                    onChange={e => setPropertyType(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:ring-2 focus:ring-[#14a800]/20 transition cursor-pointer"
                  >
                    <option value="شقة سكنية">شقة سكنية</option>
                    <option value="فيلا / دوبلكس">فيلا / دوبلكس</option>
                    <option value="أرض بناء / زراعية">أرض بناء أو زراعية</option>
                    <option value="محل / مقر تجاري">محل أو مقر تجاري أو إداري</option>
                    <option value="عمارة / برج سكني">عمارة أو برج استثماري كامل</option>
                    <option value="شاليه ساحلي">شاليه ساحلي (بلطيم / مصيف)</option>
                    <option value="أخرى">أخرى (مستودع، مخزن، مزرعة)</option>
                  </select>
                  <Building2 className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الميزانية المتوقعة (جنيه مصري) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder={transactionType === 'BUY' ? 'مثال: 1800000' : 'مثال: 6000'}
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:ring-2 focus:ring-[#14a800]/20 transition"
                  />
                  <Coins className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
                {budget && Number(budget) > 0 && (
                  <span className="text-[11px] text-[#14a800] font-bold mt-1 block">
                    {new Intl.NumberFormat('ar-EG').format(Number(budget))} جنيه {transactionType === 'RENT' ? 'شهرياً' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Location Selector (Phase 6: Kafr El Sheikh vs Other Governorates Special Request) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                الموقع الجغرافي المستهدف <span className="text-rose-600">*</span>
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setGovChoice('KFR')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    govChoice === 'KFR'
                      ? 'bg-[#14a800] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  محافظة كفر الشيخ (نطاق العمل المعتمد)
                </button>

                <button
                  type="button"
                  onClick={() => setGovChoice('OTHER')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    govChoice === 'OTHER'
                      ? 'bg-[#001e00] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  محافظات أخرى - طلب خاص
                </button>
              </div>

              {govChoice === 'KFR' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">المركز / المدينة بكفر الشيخ</label>
                    <select
                      value={selectedCityId}
                      onChange={e => setSelectedCityId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-[#14a800] transition cursor-pointer"
                    >
                      <option value="">مدينة كفر الشيخ (العاصمة)</option>
                      {cities.filter(c => c.is_active).map(c => (
                        <option key={c.id} value={c.id}>{c.name_ar}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">الحي أو المنطقة المفضلة</label>
                    <input
                      type="text"
                      placeholder="مثال: القنطرة، سخا، تقسيم المحاربين، الزواوي"
                      value={customCityArea}
                      onChange={e => setCustomCityArea(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-[#14a800] transition"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed font-medium">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      نطاق التغطية المباشرة لروابط حالياً يتركز في <strong>كفر الشيخ</strong>. تسجيل طلبك في محافظة أخرى يُسجل كـ <strong>«طلب خاص»</strong> وسيقوم فريقنا بدراسة توفيره عبر شبكة علاقاتنا المعتمدة لخدمتك.
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="اكتب المحافظة والمدينة المطلوبة (مثال: الإسكندرية - سموحة، أو الغربية - طنطا)"
                    value={otherGovDetails}
                    onChange={e => setOtherGovDetails(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-[#14a800] transition"
                  />
                </div>
              )}
            </div>

            {/* Optional Specs (Area & Bedrooms) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المساحة المطلوبة التقريبية (م²) <span className="text-slate-400 font-normal">(اختياري)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="مثال: 140"
                    value={areaSqm}
                    onChange={e => setAreaSqm(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] transition"
                  />
                  <Maximize2 className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  عدد الغرف المطلوب <span className="text-slate-400 font-normal">(اختياري)</span>
                </label>
                <div className="relative">
                  <select
                    value={bedrooms}
                    onChange={e => setBedrooms(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] transition cursor-pointer"
                  >
                    <option value="">غير محدد / أي عدد</option>
                    <option value="1">غرفة نوم واحدة</option>
                    <option value="2">غرفتان نوم</option>
                    <option value="3">3 غرف نوم</option>
                    <option value="4">4 غرف نوم فأكثر</option>
                  </select>
                  <Bed className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Contact Details (Required) */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="text-xs font-black text-[#001e00] flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#14a800]" />
                <span>بيانات التواصل لمتابعة الطلب</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الاسم بالكامل <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="الاسم ثلاثي"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم الواتساب <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="01012345678"
                      value={whatsappNumber}
                      onChange={e => setWhatsappNumber(e.target.value)}
                      className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] transition dir-ltr text-right"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                    يُستخدم لإرسال العروض والصور وروابط المعاينة المتاحة
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Notes (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ملاحظات ومواصفات إضافية <span className="text-slate-400 font-normal">(اختياري)</span>
              </label>
              <textarea
                rows={2}
                placeholder="مثال: الطابق المفضل، وجود مصعد (أسانسير)، طريقة السداد كاش أو تقسيط، موعد الاستلام المطلوب..."
                value={additionalNotes}
                onChange={e => setAdditionalNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-[#14a800] transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 min-h-[44px] text-xs font-bold text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-xl transition cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 min-h-[44px] bg-[#14a800] hover:bg-[#108a00] active:bg-[#108a00] text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:ring-offset-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب لمستشار روابط'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
