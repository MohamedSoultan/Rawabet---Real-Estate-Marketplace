import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useModalA11y } from '../../utils/useModalA11y';
import { Property, PropertyVersion } from '../../types';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Upload, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Star, 
  Lock,
  Sparkles,
  Info,
  Check
} from 'lucide-react';

interface PropertyWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProperty?: Property | null;
  existingProperty?: Property | null;
  isRevision?: boolean;
  onPropertySaved?: (propertyId: string) => void;
}

export const PropertyWizardModal: React.FC<PropertyWizardModalProps> = ({
  isOpen,
  onClose,
  initialProperty,
  existingProperty,
  isRevision,
  onPropertySaved
}) => {
  const targetProperty = initialProperty || existingProperty;
  const { 
    currentUser, 
    governorates, 
    cities, 
    areas, 
    propertyTypes, 
    transactionTypes, 
    savePropertyDraft, 
    submitPropertyForReview, 
    validateForbiddenContact 
  } = useApp();

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const { containerRef } = useModalA11y({
    isOpen,
    onClose,
    initialFocusRef: closeBtnRef
  });

  const [step, setStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forbiddenWarning, setForbiddenWarning] = useState<string | null>(null);

  // Form states initialized
  const [propertyTypeId, setPropertyTypeId] = useState<string>(() => {
    return targetProperty?.property_type_id || propertyTypes[0]?.id || 'pt-apartment';
  });

  const [transactionTypeId, setTransactionTypeId] = useState<string>(() => {
    return targetProperty?.transaction_type_id || transactionTypes[0]?.id || 'tx-sale';
  });

  const [governorateId, setGovernorateId] = useState<string>(() => {
    return governorates[0]?.id || 'gov-kafr-el-sheikh';
  });

  const [cityId, setCityId] = useState<string>(() => {
    const available = cities.filter(c => c.governorate_id === governorateId);
    return available[0]?.id || 'city-kafr-el-sheikh';
  });

  const [areaId, setAreaId] = useState<string>(() => {
    const available = areas.filter(a => a.city_id === cityId);
    return available[0]?.id || 'area-mohafaza';
  });

  const [publicLocationText, setPublicLocationText] = useState<string>('');
  const [privateAddress, setPrivateAddress] = useState<string>('');
  const [privateNotes, setPrivateNotes] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [areaSqm, setAreaSqm] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('3');
  const [bathrooms, setBathrooms] = useState<string>('2');
  const [floor, setFloor] = useState<string>('الدور الثالث');
  const [finishing, setFinishing] = useState<string>('سوبر لوكس');
  const [features, setFeatures] = useState<string[]>([
    'عداد كهرباء رسمي', 
    'عداد مياه مستقل', 
    'غاز طبيعي متصل', 
    'حصة في الأرض'
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Media
  const [mediaList, setMediaList] = useState<Array<{ id: string; path: string; is_cover: boolean }>>([
    { id: 'm-1', path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', is_cover: true },
    { id: 'm-2', path: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', is_cover: false },
    { id: 'm-3', path: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', is_cover: false }
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  if (!isOpen) return null;

  const activeGovs = governorates.filter(g => g.is_active);
  const activeCities = cities.filter(c => c.governorate_id === governorateId && c.is_active);
  const activeAreas = areas.filter(a => a.city_id === cityId && a.is_active);

  // Validation handlers
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const check = validateForbiddenContact(val);
    if (check.hasForbidden) {
      setForbiddenWarning(`تنبيه: يُمنع كتابة أرقام الهواتف أو وسائل التواصل في عنوان الإعلان (${check.match}). تواصل المشترين يتم رسمياً عبر أرقام خدمة عملاء روابط.`);
    } else {
      setForbiddenWarning(null);
    }
  };

  const handleDescChange = (val: string) => {
    setDescription(val);
    const check = validateForbiddenContact(val);
    if (check.hasForbidden) {
      setForbiddenWarning(`تنبيه: تم رصد رقم هاتف (${check.match}) في الوصف. يرجى حذفه لنشر العقار بنجاح.`);
    } else {
      setForbiddenWarning(null);
    }
  };

  const addFeature = () => {
    if (newFeatureInput.trim() && !features.includes(newFeatureInput.trim())) {
      setFeatures(prev => [...prev, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const removeFeature = (f: string) => {
    setFeatures(prev => prev.filter(item => item !== f));
  };

  const addMediaUrl = () => {
    if (newImageUrl.trim()) {
      setMediaList(prev => [
        ...prev,
        { id: `m-${Date.now()}`, path: newImageUrl.trim(), is_cover: prev.length === 0 }
      ]);
      setNewImageUrl('');
    }
  };

  const removeMedia = (id: string) => {
    setMediaList(prev => {
      const filtered = prev.filter(m => m.id !== id);
      if (filtered.length > 0 && !filtered.some(m => m.is_cover)) {
        filtered[0].is_cover = true;
      }
      return filtered;
    });
  };

  const setCoverMedia = (id: string) => {
    setMediaList(prev => prev.map(m => ({ ...m, is_cover: m.id === id })));
  };

  // Step transitions & validation
  const validateStep = (currentStep: number): boolean => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (!publicLocationText.trim()) {
        setErrorMessage('يرجى كتابة الوصف العام للموقع (مثل: حي المحافظة - بالقرب من ميدان النصر)');
        return false;
      }
    } else if (currentStep === 2) {
      if (!title.trim()) {
        setErrorMessage('يرجى كتابة عنوان جذاب للإعلان');
        return false;
      }
      if (!price || Number(price) <= 0) {
        setErrorMessage('يرجى تحديد السعر المطلوب بدقة');
        return false;
      }
      if (!areaSqm || Number(areaSqm) <= 0) {
        setErrorMessage('يرجى تحديد المساحة بالمتر المربع');
        return false;
      }
      if (!description.trim()) {
        setErrorMessage('يرجى كتابة الوصف التفصيلي للعقار');
        return false;
      }
      if (forbiddenWarning) {
        setErrorMessage('يرجى إزالة أرقام الهواتف من النص للمتابعة');
        return false;
      }
    } else if (currentStep === 3) {
      if (mediaList.length < 3) {
        setErrorMessage('يتطلب نشر العقار إضافة 3 صور حقيقية على الأقل');
        return false;
      }
    } else if (currentStep === 4) {
      if (!privateAddress.trim()) {
        setErrorMessage('يرجى إدخال العنوان الدقيق ورقم العقار (يستخدم داخلياً فقط لإدارة المعاينات)');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(s + 1, 4));
    }
  };

  const handleSave = (submitForReview: boolean) => {
    if (!validateStep(4)) return;

    const payload: Partial<PropertyVersion> = {
      property_id: initialProperty?.id,
      title: title.trim(),
      description: description.trim(),
      governorate_id: governorateId,
      city_id: cityId,
      area_id: areaId,
      public_location_text: publicLocationText.trim(),
      private_address: privateAddress.trim(),
      price: Number(price),
      area_sqm: Number(areaSqm),
      bedrooms: bedrooms ? Number(bedrooms) : 0,
      bathrooms: bathrooms ? Number(bathrooms) : 0,
      floor: floor.trim(),
      finishing: finishing.trim(),
      features,
      media: mediaList.map((m, idx) => ({
        id: m.id,
        property_version_id: '',
        media_type: 'IMAGE',
        path: m.path,
        mime_type: 'image/jpeg',
        file_size: 1024000,
        sort_order: idx + 1,
        is_cover: m.is_cover,
        created_at: new Date().toISOString()
      }))
    };

    if (submitForReview) {
      const draftRes = savePropertyDraft(payload, initialProperty?.id);

      if (draftRes.success && draftRes.propertyId) {
        const subRes = submitPropertyForReview(draftRes.propertyId, payload);
        if (subRes.success) {
          if (onPropertySaved) onPropertySaved(draftRes.propertyId);
          onClose();
        } else {
          setErrorMessage(subRes.error || 'تعذر إرسال العقار للمراجعة.');
        }
      } else {
        setErrorMessage(draftRes.error || 'حدث خطأ أثناء حفظ البيانات.');
      }
    } else {
      const res = savePropertyDraft(payload, initialProperty?.id);
      if (res.success && res.propertyId) {
        if (onPropertySaved) onPropertySaved(res.propertyId);
        onClose();
      } else {
        setErrorMessage(res.error || 'تعذر حفظ المسودة.');
      }
    }
  };

  const stepsList = [
    { num: 1, label: 'الموقع والتصنيف' },
    { num: 2, label: 'المواصفات والأسعار' },
    { num: 3, label: 'الصور والوسائط' },
    { num: 4, label: 'البيانات السرية والاعتماد' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#001e00]/60 backdrop-blur-xs overflow-y-auto font-sans text-right animate-soft-fade"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-wizard-title"
        tabIndex={-1}
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[94vh] sm:max-h-[92vh] flex flex-col overflow-hidden border border-[#e4ebe4] my-auto outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-3.5 sm:px-6 py-3 sm:py-4 bg-[#001e00] text-white flex items-center justify-between border-b border-[#003a00] shrink-0 gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-[#14a800] text-white flex items-center justify-center font-black shrink-0">
              <Building2 className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 id="property-wizard-title" className="text-xs sm:text-base font-black text-white truncate">
                {initialProperty ? 'تعديل بيانات الإعلان العقاري' : 'إضافة عقار جديد للنشر'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium truncate">
                فحص هندسي واعتماد رسمي لضمان المصداقية
              </p>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/10 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white transition cursor-pointer shrink-0"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-3 bg-[#f2f7f2] border-b border-[#e4ebe4] shrink-0">
          {/* Mobile Stepper (< sm) */}
          <div className="sm:hidden space-y-2">
            <div className="flex items-center justify-between gap-1.5">
              {stepsList.map(s => {
                const isCurrent = step === s.num;
                const isDone = step > s.num;

                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      if (s.num < step || validateStep(step)) {
                        setStep(s.num);
                      }
                    }}
                    className={`flex-1 py-1.5 px-1 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer ${
                      isCurrent 
                        ? 'bg-[#14a800] text-white shadow-xs font-black' 
                        : isDone 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' 
                          : 'bg-white text-slate-500 font-medium border border-slate-200'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                      isCurrent 
                        ? 'bg-white text-[#14a800]' 
                        : isDone 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isDone ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : s.num}
                    </span>
                    <span className="text-[10px] font-bold whitespace-nowrap">
                      {s.num === 1 ? 'الموقع' : s.num === 2 ? 'المواصفات' : s.num === 3 ? 'الصور' : 'الاعتماد'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Current Step Banner for mobile */}
            <div className="flex items-center justify-between px-2.5 py-1 bg-white rounded-lg border border-[#e4ebe4] text-xs">
              <span className="font-bold text-[#001e00] flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14a800]" />
                الخطوة {step} من 4: <strong className="text-[#14a800]">{stepsList[step - 1].label}</strong>
              </span>
              <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                {step === 1 ? '25%' : step === 2 ? '50%' : step === 3 ? '75%' : '100%'}
              </span>
            </div>
          </div>

          {/* Desktop Stepper (>= sm) */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-2">
            {stepsList.map(s => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;

              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (s.num < step || validateStep(step)) {
                      setStep(s.num);
                    }
                  }}
                  className={`py-2 px-3 rounded-xl text-center transition flex items-center justify-center gap-2 cursor-pointer ${
                    isCurrent 
                      ? 'bg-[#14a800] text-white shadow-2xs font-black' 
                      : isDone 
                        ? 'bg-white text-[#001e00] border border-[#14a800]/30 font-bold hover:bg-emerald-50' 
                        : 'bg-white/60 text-slate-500 font-medium'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-black ${
                    isCurrent 
                      ? 'bg-white text-[#14a800]' 
                      : isDone 
                        ? 'bg-[#14a800] text-white' 
                        : 'bg-slate-200 text-slate-700'
                  }`}>
                    {isDone ? <Check className="w-3 h-3 stroke-[2.5]" /> : s.num}
                  </span>
                  <span className="text-xs font-bold whitespace-nowrap">
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-5">
          
          {/* Error & Warning Banners */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-soft-fade">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {forbiddenWarning && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl flex items-center gap-2 animate-soft-fade">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{forbiddenWarning}</span>
            </div>
          )}

          {/* STEP 1: Location & Taxonomy */}
          {step === 1 && (
            <div className="space-y-4 animate-soft-fade">
              <div className="pb-2 border-b border-[#e4ebe4]">
                <h4 className="text-sm font-black text-[#001e00] whitespace-nowrap">المعلومات الجغرافية وتصنيف العقار</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">حدد التصنيف والموقع العام للعقار</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">نوع المعاملة</label>
                  <select
                    value={transactionTypeId}
                    onChange={e => setTransactionTypeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800]"
                  >
                    {transactionTypes.map(tx => (
                      <option key={tx.id} value={tx.id}>{tx.name_ar}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">نوع العقار</label>
                  <select
                    value={propertyTypeId}
                    onChange={e => setPropertyTypeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800]"
                  >
                    {propertyTypes.map(pt => (
                      <option key={pt.id} value={pt.id}>{pt.name_ar}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                <div>
                  <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">المحافظة</label>
                  <select
                    value={governorateId}
                    onChange={e => {
                      const newGov = e.target.value;
                      setGovernorateId(newGov);
                      const availableCities = cities.filter(c => c.governorate_id === newGov && c.is_active);
                      if (availableCities.length > 0) {
                        const newCityId = availableCities[0].id;
                        setCityId(newCityId);
                        const availableAreas = areas.filter(a => a.city_id === newCityId && a.is_active);
                        if (availableAreas.length > 0) {
                          setAreaId(availableAreas[0].id);
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800]"
                  >
                    {activeGovs.map(gov => (
                      <option key={gov.id} value={gov.id}>{gov.name_ar}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">المركز / المدينة</label>
                  <select
                    value={cityId}
                    onChange={e => {
                      setCityId(e.target.value);
                      const availableAreas = areas.filter(a => a.city_id === e.target.value && a.is_active);
                      if (availableAreas.length > 0) setAreaId(availableAreas[0].id);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800]"
                  >
                    {activeCities.map(city => (
                      <option key={city.id} value={city.id}>{city.name_ar}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">الحي / المنطقة</label>
                  <select
                    value={areaId}
                    onChange={e => setAreaId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800]"
                  >
                    {activeAreas.map(area => (
                      <option key={area.id} value={area.id}>{area.name_ar}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">
                  الوصف العام للموقع (يظهر للجمهور بدون تفاصيل دقيقة) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كفر الشيخ - حي المحافظة - بالقرب من ميدان النصر"
                  value={publicLocationText}
                  onChange={e => setPublicLocationText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  ملاحظة: العنوان الدقيق ورقم العقار سيتم إدخالهما في الخطوة الرابعة بسرية تامة لمراجعي روابط فقط.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Specs & Pricing */}
          {step === 2 && (
            <div className="space-y-4 animate-soft-fade">
              <div className="pb-2 border-b border-[#e4ebe4]">
                <h4 className="text-sm font-black text-[#001e00] whitespace-nowrap">المواصفات والبيانات السعرية</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">تفاصيل المساحة والمرافق والوصف العام</p>
              </div>

              <div>
                <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">
                  عنوان الإعلان التسويقي <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شقة سوبر لوكس 160م تطل على حديقة صنعاء"
                  value={title}
                  onChange={e => handleTitleChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">
                    السعر المطلوب (بالجنيه المصري) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    placeholder="مثال: 1850000"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800] dir-ltr text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">
                    المساحة الإجمالية (م²) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    placeholder="مثال: 150"
                    value={areaSqm}
                    onChange={e => setAreaSqm(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800] dir-ltr text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">عدد الغرف</label>
                  <input
                    type="number"
                    min={0}
                    value={bedrooms}
                    onChange={e => setBedrooms(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">عدد الحمامات</label>
                  <input
                    type="number"
                    min={1}
                    value={bathrooms}
                    onChange={e => setBathrooms(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">الدور / الطابق</label>
                  <input
                    type="text"
                    value={floor}
                    onChange={e => setFloor(e.target.value)}
                    placeholder="مثال: الثالث"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">مستوى التشطيب</label>
                  <select
                    value={finishing}
                    onChange={e => setFinishing(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800]"
                  >
                    <option value="سوبر لوكس">سوبر لوكس</option>
                    <option value="الترا لوكس">ألترا لوكس</option>
                    <option value="لوكس">لوكس</option>
                    <option value="نصف تشطيب">نصف تشطيب</option>
                    <option value="على المحارة">على المحارة</option>
                    <option value="بدون تشطيب">بدون تشطيب</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">
                  الوصف التفصيلي للعقار <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="اكتب مواصفات العقار، التقسيم الداخلي، والمزايا المحيطة... (يمنع كتابة أي أرقام هواتف)"
                  value={description}
                  onChange={e => handleDescChange(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#14a800]"
                ></textarea>
              </div>

              {/* Features Chips */}
              <div>
                <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">المزايا والملحقات</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="أضف ميزة (مثال: غاز طبيعي، حصة جراج...)"
                    value={newFeatureInput}
                    onChange={e => setNewFeatureInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-[#001e00] hover:bg-[#14a800] text-white text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap"
                  >
                    إضافة
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {features.map(f => (
                    <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f2f7f2] text-[#001e00] border border-[#14a800]/30 text-xs font-bold rounded-full whitespace-nowrap">
                      <span>{f}</span>
                      <button type="button" onClick={() => removeFeature(f)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Media */}
          {step === 3 && (
            <div className="space-y-4 animate-soft-fade">
              <div className="pb-2 border-b border-[#e4ebe4]">
                <h4 className="text-sm font-black text-[#001e00] whitespace-nowrap">صور العقار (3 صور على الأقل)</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  الصور الواضحة تزيد فرص المعاينة بـ 4 أضعاف. يمنع وضع أرقام هواتف على الصور.
                </p>
              </div>

              {/* Add image URL bar */}
              <div className="flex items-center gap-2 p-3 bg-[#f2f7f2] rounded-xl border border-[#e4ebe4]">
                <input
                  type="url"
                  placeholder="ضع رابط الصورة (URL) هنا..."
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium dir-ltr text-right"
                />
                <button
                  type="button"
                  onClick={addMediaUrl}
                  className="px-4 py-2 bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-2xs cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة صورة</span>
                </button>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mediaList.map((media) => (
                  <div key={media.id} className="relative group rounded-xl overflow-hidden border border-[#e4ebe4] bg-slate-100 aspect-video">
                    <img
                      src={media.path}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />

                    {media.is_cover && (
                      <span className="absolute top-2 right-2 bg-[#14a800] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 whitespace-nowrap">
                        <Star className="w-3 h-3 fill-current" /> صورة الغلاف
                      </span>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-[#001e00]/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      {!media.is_cover && (
                        <button
                          type="button"
                          onClick={() => setCoverMedia(media.id)}
                          className="p-2 rounded-xl bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="تعيين كصورة غلاف"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeMedia(media.id)}
                        className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                        title="حذف الصورة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Private Seller Info (Strictly Internal) */}
          {step === 4 && (
            <div className="space-y-4 animate-soft-fade">
              <div className="p-4 rounded-xl bg-[#001e00] text-white flex items-start gap-3 border border-[#003a00]">
                <ShieldAlert className="w-6 h-6 text-[#14a800] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h4 className="font-black text-[#14a800]">السرية التامة للبيانات الخاصة</h4>
                  <p className="text-slate-300 font-normal leading-relaxed">
                    العنوان الدقيق ورقم الشقة يظلان سريين تماماً ولن يظهرا لأي زائر على الموقع. يتم استخدامهما فقط بواسطة فريق مراجعة روابط لتنظيم المعاينات الميدانية.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">
                  العنوان التفصيلي الدقيق (لإدارة روابط فقط) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: برج الهدى، الدور الثالث، شقة رقم 6، بجوار صيدلية السلام"
                  value={privateAddress}
                  onChange={e => setPrivateAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">
                  ملاحظات الملكية والمعاينة (للمراجعين فقط)
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: العقار مرخص بحصة في الأرض، المعاينة متاحة يومياً بعد الساعة 5 مساءً بالتنسيق المسبق..."
                  value={privateNotes}
                  onChange={e => setPrivateNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#14a800]"
                ></textarea>
              </div>

              {/* Notice */}
              <div className="p-3 bg-[#f2f7f2] rounded-xl border border-[#14a800]/20 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-[#001e00]">إرسال للمراجعة والاعتماد:</div>
                <p className="text-slate-600">
                  عند الضغط على <strong>"إرسال للمراجعة والاعتماد"</strong>، ينتقل العقار لطابور المراجعة الهندسية لدى روابط للتحقق منه واعتماده للنشر المباشر.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Wizard Controls */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#f2f7f2] border-t border-[#e4ebe4] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
                <span>الخطوة السابقة</span>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:ring-offset-2"
              >
                <span>متابعة للخطوة التالية</span>
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold rounded-xl transition text-center cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  حفظ كمسودة
                </button>

                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-black rounded-xl transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:ring-offset-2"
                >
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>إرسال للمراجعة والاعتماد</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
