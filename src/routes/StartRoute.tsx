import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PropertyFilterState } from '../types';
import { 
  filterProperties, 
  toUrlParams 
} from '../services/filterEngine';
import { 
  Compass, 
  Building2, 
  MapPin, 
  Banknote, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck, 
  Check, 
  RotateCcw,
  Store, 
  Briefcase, 
  Layers, 
  Trees,
  TrendingUp,
  Key,
  Home,
  Clock,
  HeartHandshake,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { SmartSearchNoMatchModal } from '../components/public/SmartSearchNoMatchModal';

export const StartRoute: React.FC = () => {
  const navigate = useNavigate();
  const { 
    propertyTypes, 
    cities, 
    areas, 
    getPublishedProperties 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Loading transition state for Phase 6
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loadingPhase, setLoadingPhase] = useState<'SEARCHING' | 'FOUND'>('SEARCHING');

  // No Match Smart Request Experience Modal
  const [isNoMatchModalOpen, setIsNoMatchModalOpen] = useState<boolean>(false);

  // Step 1 Discovery Intent
  const [selectedIntent, setSelectedIntent] = useState<'BUY' | 'RENT' | 'INVEST' | 'COMMERCIAL'>('BUY');

  // Single canonical PropertyFilterState
  const [filterState, setFilterState] = useState<PropertyFilterState>({
    transactionType: 'tx-sale',
    propertyType: '',
    location: {
      governorate_id: 'gov-kfs',
      city_id: '',
      area_id: '',
    },
    minPrice: undefined,
    maxPrice: undefined,
    rooms: undefined,
    bathrooms: undefined,
    features: [],
    searchQuery: undefined,
    sortBy: 'NEWEST',
  });

  // Selected interest preferences (Step 5)
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const publishedProperties = useMemo(() => getPublishedProperties(), [getPublishedProperties]);

  // Real-time matching calculation via the centralized Filter Engine
  const matchingProperties = useMemo(
    () => filterProperties(publishedProperties, filterState),
    [publishedProperties, filterState]
  );

  // Available areas based on selected city
  const availableAreas = useMemo(() => {
    if (!filterState.location?.city_id) return [];
    return areas.filter(a => a.is_active && a.city_id === filterState.location?.city_id);
  }, [areas, filterState.location?.city_id]);

  // Update transaction type & category when Step 1 intent changes
  const handleSelectIntent = (intent: 'BUY' | 'RENT' | 'INVEST' | 'COMMERCIAL') => {
    setSelectedIntent(intent);
    if (intent === 'BUY') {
      setFilterState(prev => ({
        ...prev,
        transactionType: 'tx-sale',
        minPrice: undefined,
        maxPrice: undefined,
      }));
    } else if (intent === 'RENT') {
      setFilterState(prev => ({
        ...prev,
        transactionType: 'tx-rent',
        minPrice: undefined,
        maxPrice: undefined,
      }));
    } else if (intent === 'INVEST') {
      setFilterState(prev => ({
        ...prev,
        transactionType: 'tx-sale',
        minPrice: undefined,
        maxPrice: undefined,
      }));
    } else if (intent === 'COMMERCIAL') {
      // Find commercial type or keep general
      setFilterState(prev => ({
        ...prev,
        transactionType: 'tx-sale',
        minPrice: undefined,
        maxPrice: undefined,
      }));
    }
  };

  // Preset budget options based on transaction type
  const isSale = filterState.transactionType === 'tx-sale' || !filterState.transactionType;

  const budgetPresets = useMemo(() => {
    if (isSale) {
      return [
        { label: 'أقل من 1,000,000 ج.م', min: undefined, max: 1000000 },
        { label: '1 - 2.5 مليون ج.م', min: 1000000, max: 2500000 },
        { label: '2.5 - 5 مليون ج.م', min: 2500000, max: 5000000 },
        { label: 'أكثر من 5,000,000 ج.م', min: 5000000, max: undefined },
      ];
    } else {
      return [
        { label: 'أقل من 3,000 ج.م / شهرياً', min: undefined, max: 3000 },
        { label: '3,000 - 6,000 ج.م / شهرياً', min: 3000, max: 6000 },
        { label: '6,000 - 10,000 ج.م / شهرياً', min: 6000, max: 10000 },
        { label: 'أكثر من 10,000 ج.م / شهرياً', min: 10000, max: undefined },
      ];
    }
  }, [isSale]);

  // Dynamic Interest-based questions (Step 5) based on Property Type
  const currentPropertyTypeObj = propertyTypes.find(pt => pt.id === filterState.propertyType);
  const typeName = currentPropertyTypeObj?.name_ar || '';

  const interestQuestions = useMemo(() => {
    if (typeName.includes('شقة') || typeName.includes('استوديو') || typeName.includes('دوبلكس')) {
      return [
        { id: 'near_services', label: 'قريب من الخدمات والمدارس؟', internalFeature: 'خدمات', desc: 'موقع حيوي يسهل الوصول للمرافق اليومية' },
        { id: 'family_suitable', label: 'مناسب لعائلة؟', internalFeature: 'عائلي', desc: 'تقسيم عملي وعدد غرف كافٍ للأسرة' },
        { id: 'larger_area', label: 'مساحة أكبر؟', internalFeature: 'مساحة واسعة', desc: 'غرف رحبة واستقبال مريح' },
        { id: 'luxury_finishing', label: 'تشطيب فاخر وجاهز للسكن؟', internalFeature: 'تشطيب سوبر لوكس', desc: 'تجهيزات راقية دون حاجة لمصروفات إضافية' }
      ];
    }
    if (typeName.includes('فيلا') || typeName.includes('بيت') || typeName.includes('تاون')) {
      return [
        { id: 'privacy', label: 'خصوصية تامة؟', internalFeature: 'خصوصية', desc: 'مدخل مستقل وإحساس كامل بالراحة والهدوء' },
        { id: 'garden', label: 'حديقة أو مساحة خارجية؟', internalFeature: 'حديقة', desc: 'مساحة خضراء للاسترخاء وجلسات العائلة' },
        { id: 'large_space', label: 'مساحة كبيرة وتعدد أدوار؟', internalFeature: 'مساحة واسعة', desc: 'مساحات مخصصة للمعيشة والضيوف' },
        { id: 'upscale_area', label: 'منطقة راقية ومميزة؟', internalFeature: 'حي راقي', desc: 'موقع هادئ بمستوى اجتماعي متميز' }
      ];
    }
    if (typeName.includes('محل') || typeName.includes('تجاري') || typeName.includes('مكتب') || selectedIntent === 'COMMERCIAL') {
      return [
        { id: 'main_street', label: 'شارع رئيسي؟', internalFeature: 'شارع رئيسي', desc: 'واجهة واضحة على محور حركة رئيسي' },
        { id: 'vital_area', label: 'منطقة حيوية تجارياً؟', internalFeature: 'منطقة حيوية', desc: 'سوق نشط يجذب العملاء والمترددين' },
        { id: 'customer_traffic', label: 'حركة عملاء وكثافة مرورية؟', internalFeature: 'كثافة مرورية', desc: 'فرصة تشغيلية مرتفعة لنجاح النشاط' },
        { id: 'strong_facade', label: 'واجهة قوية وإمكانية لافتة؟', internalFeature: 'واجهة عريضة', desc: 'رؤية بصرية واضحة للعلامة التجارية' }
      ];
    }
    if (typeName.includes('أرض') || selectedIntent === 'INVEST') {
      return [
        { id: 'investment_potential', label: 'فرصة استثمار ونمو للقيمة؟', internalFeature: 'استثمار', desc: 'عائد واعد وزيادة سنوية متوقعة في السعر' },
        { id: 'ready_building', label: 'صالحة للبناء الفوري وتراخيص؟', internalFeature: 'بناء', desc: 'موقف تخطيطي وقانوني واضح للبناء' },
        { id: 'future_location', label: 'موقع مستقبلي وامتداد عمراني؟', internalFeature: 'امتداد عمراني', desc: 'مناطق واعدة تشهد توسعاً حضرياً مستمراً' },
        { id: 'clear_documents', label: 'أوراق ملكية مسجلة وموثقة؟', internalFeature: 'حصة بالأرض', desc: 'تسلسل ملكية واضح وسندات سليمة 100%' }
      ];
    }

    // Default general preferences
    return [
      { id: 'near_services', label: 'قريب من الخدمات الحيوية؟', internalFeature: 'خدمات', desc: 'موقع مناسب يلبي كافة الاحتياجات' },
      { id: 'family_suitable', label: 'مناسب لأسرة واستقرار طويل الأجل؟', internalFeature: 'عائلي', desc: 'بيئة هادئة ومريحة' },
      { id: 'luxury_finishing', label: 'تشطيب فوري وجاهز للاستخدام؟', internalFeature: 'تشطيب سوبر لوكس', desc: 'جاهز للمعاينة والانتقال مباشرة' },
      { id: 'main_street', label: 'مطل على شارع واسع ومريح؟', internalFeature: 'شارع رئيسي', desc: 'سهولة الدخول والخروج وصف السيارات' }
    ];
  }, [typeName, selectedIntent]);

  const togglePreference = (pref: string) => {
    setSelectedPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  // PHASE 6 — RESULT EXPERIENCE: Elegant Loading & Match/No-Match routing
  const handleCompleteSmartSearch = () => {
    // Map preferences into filterState features
    const mappedFeatures = interestQuestions
      .filter(q => selectedPreferences.includes(q.id))
      .map(q => q.internalFeature);

    const finalFilterState: PropertyFilterState = {
      ...filterState,
      features: mappedFeatures.length > 0 ? mappedFeatures : filterState.features
    };

    const finalMatches = filterProperties(publishedProperties, finalFilterState);

    setIsSubmitting(true);
    setLoadingPhase('SEARCHING');

    // Stage 1: "نبحث عن أفضل الخيارات لك"
    setTimeout(() => {
      if (finalMatches.length === 0) {
        // NO MATCH EXPERIENCE:
        // Do NOT redirect to an empty results page.
        // Do NOT show a dead-end message.
        // Open the premium confirmation modal.
        // The customer remains inside the discovery experience.
        setIsSubmitting(false);
        setIsNoMatchModalOpen(true);
      } else {
        setLoadingPhase('FOUND');
        // Stage 2: "وجدنا لك عقارات تناسب اهتماماتك" then redirect to /properties
        setTimeout(() => {
          setIsSubmitting(false);
          const params = toUrlParams(finalFilterState);
          navigate(`/properties?${params.toString()}`);
        }, 1000);
      }
    }, 1100);
  };

  const handleReset = () => {
    setSelectedIntent('BUY');
    setSelectedPreferences([]);
    setFilterState({
      transactionType: 'tx-sale',
      propertyType: '',
      location: {
        governorate_id: 'gov-kfs',
        city_id: '',
        area_id: '',
      },
      minPrice: undefined,
      maxPrice: undefined,
      rooms: undefined,
      bathrooms: undefined,
      features: [],
      searchQuery: undefined,
      sortBy: 'NEWEST',
    });
    setCurrentStep(1);
  };

  const getPropertyIcon = (name: string) => {
    if (name.includes('شقة') || name.includes('استوديو') || name.includes('دوبلكس')) return Building2;
    if (name.includes('فيلا') || name.includes('بيت')) return Home;
    if (name.includes('محل') || name.includes('تجاري')) return Store;
    if (name.includes('مكتب') || name.includes('عيادة')) return Briefcase;
    if (name.includes('أرض')) return Layers;
    if (name.includes('مزرعة')) return Trees;
    return Compass;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-soft-fade" dir="rtl">
      
      {/* PHASE 6: Elegant Loading Overlay Transition */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-soft-fade">
          <div className="w-20 h-20 rounded-2xl bg-[#f0faf0] border-2 border-[#14a800]/20 flex items-center justify-center shadow-lg mb-6 relative">
            <div className="absolute inset-0 rounded-2xl bg-[#14a800]/10 animate-ping opacity-30"></div>
            {loadingPhase === 'SEARCHING' ? (
              <Loader2 className="w-10 h-10 text-[#14a800] animate-spin" />
            ) : (
              <CheckCircle2 className="w-10 h-10 text-[#14a800] animate-bounce" />
            )}
          </div>

          <div className="space-y-2 max-w-md">
            <h3 className="text-xl sm:text-2xl font-black text-[#001e00]">
              {loadingPhase === 'SEARCHING' ? 'نبحث عن أفضل الخيارات لك...' : 'وجدنا لك عقارات تناسب اهتماماتك'}
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              {loadingPhase === 'SEARCHING'
                ? 'نقوم بمطابقة تفضيلاتك مع كافة العقارات المعتمدة والمفحوصة بكفر الشيخ'
                : 'يتم تحويلك الآن لاستعراض الخيارات المختارة بعناية لك'}
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs font-bold text-[#14a800] bg-[#f0faf0] px-4 py-2 rounded-xl border border-[#14a800]/20">
            <ShieldCheck className="w-4 h-4" />
            <span>روابط - مستشارك العقاري الرقمي الموثوق</span>
          </div>
        </div>
      )}

      {/* Header Banner — Advisor Persona (Not a robotic filter form) */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#f0faf0] border border-[#14a800]/30 text-[#14a800] text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#14a800]" />
          <span>البحث الذكي — روابط مستشارك العقاري الرقمي</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#001e00] tracking-tight">
          البحث الذكي
        </h1>

        {/* Value Proposition — 60s Goal without stressful countdown */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-600">
          <Clock className="w-4 h-4 text-[#14a800]" />
          <span>سنساعدك للوصول للعقار المناسب خلال أقل من دقيقة</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto">
          أجب عن خطوات بسيطة لنوجهك مباشرة إلى الخيارات الأنسب لاحتياجاتك دون عناء البحث العشوائي
        </p>
      </div>

      {/* Elegant Progress Indicator (No stressful countdown, clean visual steps) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1.5 text-[#14a800]">
            <Compass className="w-4 h-4" />
            <span>الخطوة {currentStep} من {totalSteps}:</span>
            <span className="text-[#001e00] font-black">
              {currentStep === 1 && 'ما الذي تبحث عنه؟'}
              {currentStep === 2 && 'نوع العقار'}
              {currentStep === 3 && 'الموقع والمنطقة'}
              {currentStep === 4 && 'الميزانية المناسبة'}
              {currentStep === 5 && 'تفضيلاتك واهتماماتك'}
            </span>
          </span>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-700 transition cursor-pointer"
            title="إعادة البدء من جديد"
          >
            <RotateCcw className="w-3 h-3" />
            <span>إعادة ضبط</span>
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-[#14a800] h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Visual Step Dots */}
        <div className="flex items-center justify-between pt-1 text-[11px] font-bold text-slate-400">
          {['الهدف', 'النوع', 'الموقع', 'الميزانية', 'التفضيلات'].map((label, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <div 
                key={idx}
                className={`flex items-center gap-1 transition ${
                  isCurrent ? 'text-[#14a800] font-black' : isDone ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isCurrent 
                    ? 'bg-[#14a800] text-white' 
                    : isDone 
                      ? 'bg-emerald-100 text-[#14a800]' 
                      : 'bg-slate-100 text-slate-400'
                }`}>
                  {isDone ? '✓' : stepNum}
                </div>
                <span className="hidden sm:inline">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-2xl p-5 sm:p-8 border border-slate-200 shadow-sm relative">
        
        {/* STEP 1: What are you looking for? */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-soft-fade">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-[#001e00] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#14a800]" />
                <span>ما الذي تبحث عنه اليوم؟</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                اختر الغرض الأساسي لنرشدك إلى الخيارات الأنسب لاحتياجك
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: 'BUY',
                  title: 'شراء عقار',
                  desc: 'البحث عن فرصة شراء وتملك سكني أو عائلي دائم بأوراق قانونية مؤكدة',
                  icon: Home,
                  badge: 'شراء وتملك'
                },
                {
                  id: 'RENT',
                  title: 'إيجار عقار',
                  desc: 'خيارات إيجار سكني وتجاري مرنة وموثقة بعقود واضحة وبدون وسطاء عشوائيين',
                  icon: Key,
                  badge: 'إيجار شهري / سنوي'
                },
                {
                  id: 'INVEST',
                  title: 'فرصة استثمار',
                  desc: 'عقارات وأراضٍ ذات عائد إيجاري ونمو رأسمالي واعد في محافظة كفر الشيخ',
                  icon: TrendingUp,
                  badge: 'عوائد ونمو'
                },
                {
                  id: 'COMMERCIAL',
                  title: 'عقار تجاري',
                  desc: 'محلات، مكاتب، وعيادات في مواقع استراتيجية ذات حركة تجارية نشطة',
                  icon: Store,
                  badge: 'أنشطة وأعمال'
                },
              ].map((choice) => {
                const isSelected = selectedIntent === choice.id;
                const IconComponent = choice.icon;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => handleSelectIntent(choice.id as any)}
                    className={`p-5 rounded-2xl border-2 text-right transition cursor-pointer flex flex-col justify-between gap-4 group ${
                      isSelected
                        ? 'border-[#14a800] bg-[#f0faf0] shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                        isSelected ? 'bg-[#14a800] text-white shadow-xs' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                        isSelected 
                          ? 'border-[#14a800] bg-[#14a800] text-white' 
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base sm:text-lg text-[#001e00]">{choice.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {choice.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {choice.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Property Type (Dynamic from existing types) */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-soft-fade">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-[#001e00] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#14a800]" />
                <span>ما هو نوع العقار المفضل؟</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                اختر التصنيف الأكثر ملاءمة لاحتياجك، أو اختر "كافة الأنواع" للاستعراض الشامل
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {/* All types option */}
              <button
                type="button"
                onClick={() => setFilterState(prev => ({ ...prev, propertyType: '' }))}
                className={`p-4 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                  !filterState.propertyType
                    ? 'border-[#14a800] bg-[#f0faf0] text-[#14a800] font-black shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold'
                }`}
              >
                <Compass className="w-6 h-6 text-[#14a800]" />
                <span className="text-xs sm:text-sm">كافة الأنواع</span>
              </button>

              {propertyTypes.map(pt => {
                const isSelected = filterState.propertyType === pt.id;
                const IconComponent = getPropertyIcon(pt.name_ar);
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => setFilterState(prev => ({ ...prev, propertyType: pt.id }))}
                    className={`p-4 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                      isSelected
                        ? 'border-[#14a800] bg-[#f0faf0] text-[#14a800] font-black shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold'
                    }`}
                  >
                    <IconComponent className={`w-6 h-6 ${isSelected ? 'text-[#14a800]' : 'text-slate-500'}`} />
                    <span className="text-xs sm:text-sm">{pt.name_ar}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Location (Governorate, City, Area) */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-soft-fade">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-[#001e00] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#14a800]" />
                <span>أين تفضل موقع العقار في كفر الشيخ؟</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                حدد المركز أو المدينة ثم الحي والمنطقة المفضلة لديك
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* City Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-800">
                  المركز / المدينة
                </label>
                <select
                  value={filterState.location?.city_id || ''}
                  onChange={e => {
                    const nextCity = e.target.value;
                    setFilterState(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        city_id: nextCity,
                        area_id: '',
                      },
                    }));
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:border-[#14a800] outline-hidden transition cursor-pointer"
                >
                  <option value="">كافة مراكز ومدن محافظة كفر الشيخ</option>
                  {cities.filter(c => c.is_active).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name_ar}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-800">
                  الحي / المنطقة (اختياري)
                </label>
                <select
                  disabled={!filterState.location?.city_id}
                  value={filterState.location?.area_id || ''}
                  onChange={e =>
                    setFilterState(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        area_id: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:border-[#14a800] outline-hidden transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">كافة الأحياء والمناطق بالمدينة</option>
                  {availableAreas.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name_ar}
                    </option>
                  ))}
                </select>
                {!filterState.location?.city_id && (
                  <span className="text-[11px] text-slate-500 block">
                    * اختر المركز أو المدينة أولاً لعرض أحيائها
                  </span>
                )}
              </div>
            </div>

            {/* Popular City Quick Pills */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-bold text-slate-600 block">مراكز شائعة للبحث السريع:</span>
              <div className="flex flex-wrap gap-2">
                {cities.filter(c => c.is_active).slice(0, 6).map(city => {
                  const isSelected = filterState.location?.city_id === city.id;
                  return (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() =>
                        setFilterState(prev => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            city_id: city.id,
                            area_id: '',
                          },
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#14a800] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {city.name_ar}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Budget (min_price, max_price) */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-soft-fade">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-[#001e00] flex items-center gap-2">
                <Banknote className="w-5 h-5 text-[#14a800]" />
                <span>ما هي الميزانية المناسبة لك (بالجنيه المصري)؟</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                اختر نطاقاً سريعاً أو أدخل القيمة التقريبية لميزانيتك
              </p>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {budgetPresets.map((preset, idx) => {
                const isSelected =
                  filterState.minPrice === preset.min &&
                  filterState.maxPrice === preset.max;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setFilterState(prev => ({
                        ...prev,
                        minPrice: preset.min,
                        maxPrice: preset.max,
                      }))
                    }
                    className={`p-4 rounded-xl border text-right transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#14a800] bg-[#f0faf0] text-[#14a800] font-black'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{preset.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#14a800] stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Inputs */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-black text-slate-800 block">
                أو حدد نطاق الميزانية بالجنيه المصري:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">الحد الأدنى (ج.م)</label>
                  <input
                    type="number"
                    placeholder="مثال: 500000"
                    value={filterState.minPrice || ''}
                    onChange={e =>
                      setFilterState(prev => ({
                        ...prev,
                        minPrice: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-[#14a800] outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">الحد الأقصى (ج.م)</label>
                  <input
                    type="number"
                    placeholder="مثال: 2500000"
                    value={filterState.maxPrice || ''}
                    onChange={e =>
                      setFilterState(prev => ({
                        ...prev,
                        maxPrice: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-[#14a800] outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Interest-based questions (Preferences, NOT filters visually) */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-soft-fade">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-[#001e00] flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#14a800]" />
                <span>ما هي أهم التفضيلات التي تهمك في هذا العقار؟</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                هذه التفضيلات تساعدنا على ترشيح العقارات الأقرب لأسلوب حياتك واحتياجك الفعلي
              </p>
            </div>

            {/* Interest Preference Cards (NOT standard boring filters) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {interestQuestions.map((q) => {
                const isSelected = selectedPreferences.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => togglePreference(q.id)}
                    className={`p-4 rounded-2xl border-2 text-right transition cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-[#14a800] bg-[#f0faf0] shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-black text-[#001e00] flex items-center gap-2">
                        <span>{q.label}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {q.desc}
                      </p>
                    </div>

                    <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center border transition mt-0.5 ${
                      isSelected 
                        ? 'border-[#14a800] bg-[#14a800] text-white' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Matches Count Assurance */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#14a800]" />
                <span>عقارات جاهزة ومطابقة لمواصفاتك الآن:</span>
              </div>
              {matchingProperties.length > 0 ? (
                <span className="text-[#14a800] font-black text-sm">
                  {matchingProperties.length} عقار متاح
                </span>
              ) : (
                <span className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-200/60">
                  سيتم تجهيز وتوفير طلب خاص لك
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stepper Navigation Footer */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentStep(s => s - 1)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              السابق
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/properties')}
              className="text-slate-600"
            >
              استكشاف جميع العقارات بدلاً من ذلك
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentStep(s => s + 1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              التالي
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleCompleteSmartSearch}
              leftIcon={<Sparkles className="w-5 h-5" />}
              className="shadow-md"
            >
              {matchingProperties.length > 0 ? 'استعراض العقارات المطابقة' : 'متابعة الطلب وتوفير العقار'}
            </Button>
          )}
        </div>
      </div>

      {/* Trust & Guarantee Info */}
      <div className="bg-[#f0faf0] rounded-2xl p-5 border border-[#d7eed7] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-[#14a800] flex items-center justify-center border border-[#d7eed7] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-700 leading-relaxed font-medium">
            <strong className="text-[#001e00] font-bold">وساطة رقمية موثوقة بنسبة 100%:</strong> كافة العقارات مفحوصة ومطابقة الأوراق القانونية، لضمان استثمار آمن وإجراءات سليمة تماماً.
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/properties')}
          className="text-xs font-bold text-[#14a800] hover:underline whitespace-nowrap cursor-pointer"
        >
          تصفح مباشر لكافة العقارات &larr;
        </button>
      </div>

      {/* No Match Smart Request Experience Modal */}
      <SmartSearchNoMatchModal
        isOpen={isNoMatchModalOpen}
        onClose={() => setIsNoMatchModalOpen(false)}
        filterState={filterState}
        selectedIntent={selectedIntent}
        selectedPreferences={selectedPreferences}
        interestQuestions={interestQuestions}
        onEditPreferences={(step) => {
          setIsNoMatchModalOpen(false);
          setCurrentStep(step || 4);
        }}
        onStartNewSearch={handleReset}
      />
    </div>
  );
};
