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
  // Gamified progress percentage map
  const stepProgressPercentage: Record<number, number> = {
    1: 30,
    2: 60,
    3: 90,
    4: 95,
    5: 100,
  };
  const currentProgress = stepProgressPercentage[currentStep] || 30;

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
        { id: 'near_services', label: 'قريب من الخدمات', internalFeature: 'خدمات', desc: '', icon: Store },
        { id: 'family_suitable', label: 'مناسب لعائلة', internalFeature: 'عائلي', desc: '', icon: Home },
        { id: 'larger_area', label: 'مساحة واسعة', internalFeature: 'مساحة واسعة', desc: '', icon: Layers },
        { id: 'luxury_finishing', label: 'تشطيب سوبر لوكس', internalFeature: 'تشطيب سوبر لوكس', desc: '', icon: Sparkles }
      ];
    }
    if (typeName.includes('فيلا') || typeName.includes('بيت') || typeName.includes('تاون')) {
      return [
        { id: 'privacy', label: 'خصوصية وهدوء', internalFeature: 'خصوصية', desc: '', icon: ShieldCheck },
        { id: 'garden', label: 'حديقة خاصة', internalFeature: 'حديقة', desc: '', icon: Trees },
        { id: 'large_space', label: 'مساحة كبيرة', internalFeature: 'مساحة واسعة', desc: '', icon: Layers },
        { id: 'upscale_area', label: 'منطقة راقية', internalFeature: 'حي راقي', desc: '', icon: Compass }
      ];
    }
    if (typeName.includes('محل') || typeName.includes('تجاري') || typeName.includes('مكتب') || selectedIntent === 'COMMERCIAL') {
      return [
        { id: 'main_street', label: 'شارع رئيسي', internalFeature: 'شارع رئيسي', desc: '', icon: Compass },
        { id: 'vital_area', label: 'منطقة حيوية', internalFeature: 'منطقة حيوية', desc: '', icon: Store },
        { id: 'customer_traffic', label: 'كثافة مرورية', internalFeature: 'كثافة مرورية', desc: '', icon: TrendingUp },
        { id: 'strong_facade', label: 'واجهة عريضة', internalFeature: 'واجهة عريضة', desc: '', icon: Building2 }
      ];
    }
    if (typeName.includes('أرض') || selectedIntent === 'INVEST') {
      return [
        { id: 'investment_potential', label: 'عائد استثماري', internalFeature: 'استثمار', desc: '', icon: TrendingUp },
        { id: 'ready_building', label: 'بناء وتراخيص', internalFeature: 'بناء', desc: '', icon: Building2 },
        { id: 'future_location', label: 'امتداد عمراني', internalFeature: 'امتداد عمراني', desc: '', icon: Compass },
        { id: 'clear_documents', label: 'أوراق مسجلة', internalFeature: 'حصة بالأرض', desc: '', icon: ShieldCheck }
      ];
    }

    // Default general preferences
    return [
      { id: 'near_services', label: 'قريب من الخدمات', internalFeature: 'خدمات', desc: '', icon: Store },
      { id: 'family_suitable', label: 'مناسب لعائلة', internalFeature: 'عائلي', desc: '', icon: Home },
      { id: 'luxury_finishing', label: 'تشطيب فوري', internalFeature: 'تشطيب سوبر لوكس', desc: '', icon: Sparkles },
      { id: 'main_street', label: 'شارع رئيسي', internalFeature: 'شارع رئيسي', desc: '', icon: Compass }
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
    <div className="max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2 flex flex-col justify-center min-h-[calc(100vh-85px)] animate-soft-fade" dir="rtl">
      
      {/* PHASE 6: Elegant Loading Overlay Transition */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-soft-fade">
          <div className="w-14 h-14 rounded-2xl bg-[#f0faf0] border-2 border-[#14a800]/20 flex items-center justify-center shadow-lg mb-3 relative">
            <div className="absolute inset-0 rounded-2xl bg-[#14a800]/10 animate-ping opacity-30"></div>
            {loadingPhase === 'SEARCHING' ? (
              <Loader2 className="w-7 h-7 text-[#14a800] animate-spin" />
            ) : (
              <CheckCircle2 className="w-7 h-7 text-[#14a800] animate-bounce" />
            )}
          </div>

          <div className="space-y-1 max-w-md">
            <h3 className="text-base sm:text-lg font-black text-[#001e00]">
              {loadingPhase === 'SEARCHING' ? 'بندورلك على أحسن الخيارات...' : 'لقينا عقارات مناسبة لطلبك!'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {loadingPhase === 'SEARCHING'
                ? 'بنطابق مواصفاتك مع كافة العقارات المعتمدة بكفر الشيخ'
                : 'ثواني وهتتفرج على العقارات المختارة ليك'}
            </p>
          </div>
        </div>
      )}

      {/* Main Wizard Card Container - Tight vertical footprint to fit cleanly in 100vh */}
      <div className="space-y-2">
        {/* Compact Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#14a800]" />
            <h1 className="text-sm sm:text-base font-black text-[#001e00]">
              يلا نبدأ البحث الذكي؟
            </h1>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-700 transition cursor-pointer"
            title="إعادة البدء"
          >
            <RotateCcw className="w-3 h-3" />
            <span>من الأول</span>
          </button>
        </div>

        {/* Gamified Progress Bar (30% -> 60% -> 90% -> 95% -> 100%) - Visual only */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative shadow-2xs">
          <div 
            className="bg-gradient-to-l from-[#14a800] to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${currentProgress}%` }}
          />
        </div>

        {/* Step Content Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4.5 border border-slate-200 shadow-2xs">
          {/* STEP 1: What are you looking for? */}
          {currentStep === 1 && (
            <div className="space-y-2.5 animate-soft-fade">
              <h2 className="text-sm sm:text-base font-black text-[#001e00] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#14a800]" />
                <span>عايز إيه بالضبط؟</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                {[
                  { id: 'BUY', title: 'شراء عقار', icon: Home },
                  { id: 'RENT', title: 'إيجار عقار', icon: Key },
                  { id: 'INVEST', title: 'فرصة استثمار', icon: TrendingUp },
                  { id: 'COMMERCIAL', title: 'عقار تجاري', icon: Store },
                ].map((choice) => {
                  const isSelected = selectedIntent === choice.id;
                  const IconComponent = choice.icon;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => handleSelectIntent(choice.id as any)}
                      className={`p-2.5 sm:p-3 rounded-xl border-2 text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 group relative ${
                        isSelected
                          ? 'border-[#14a800] bg-[#f0faf0] shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition ${
                        isSelected ? 'bg-[#14a800] text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="font-black text-xs text-[#001e00] block">{choice.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Property Type */}
          {currentStep === 2 && (
            <div className="space-y-2.5 animate-soft-fade">
              <h2 className="text-sm sm:text-base font-black text-[#001e00] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#14a800]" />
                <span>نوع العقار اللي بتدور عليه</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setFilterState(prev => ({ ...prev, propertyType: '' }))}
                  className={`p-2 sm:p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    !filterState.propertyType
                      ? 'border-[#14a800] bg-[#f0faf0] text-[#14a800] font-black shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold'
                  }`}
                >
                  <Compass className="w-4 h-4 text-[#14a800]" />
                  <span className="text-xs">كل الأنواع</span>
                </button>

                {propertyTypes.slice(0, 7).map(pt => {
                  const isSelected = filterState.propertyType === pt.id;
                  const IconComponent = getPropertyIcon(pt.name_ar);
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => setFilterState(prev => ({ ...prev, propertyType: pt.id }))}
                      className={`p-2 sm:p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'border-[#14a800] bg-[#f0faf0] text-[#14a800] font-black shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[#14a800]' : 'text-slate-500'}`} />
                      <span className="text-xs">{pt.name_ar}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-2.5 animate-soft-fade">
              <h2 className="text-sm sm:text-base font-black text-[#001e00] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#14a800]" />
                <span>فين في كفر الشيخ؟</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#14a800] outline-hidden cursor-pointer"
                  >
                    <option value="">كل مدن كفر الشيخ</option>
                    {cities.filter(c => c.is_active).map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name_ar}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    الحي / المنطقة
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#14a800] outline-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">كل الأحياء والمناطق</option>
                    {availableAreas.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name_ar}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Popular City Quick Pills */}
              <div className="pt-0.5 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500">الأكتر طلباً:</span>
                {cities.filter(c => c.is_active).slice(0, 5).map(city => {
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
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
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
          )}

          {/* STEP 4: Budget */}
          {currentStep === 4 && (
            <div className="space-y-2.5 animate-soft-fade">
              <h2 className="text-sm sm:text-base font-black text-[#001e00] flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-[#14a800]" />
                <span>الميزانية المتوقعة</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      className={`p-2 sm:p-2.5 rounded-xl border text-right transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#14a800] bg-[#f0faf0] text-[#14a800] font-black shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <span className="text-xs">{preset.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#14a800] stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Inputs */}
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-[11px] font-bold text-slate-600">من (ج.م)</label>
                    <input
                      type="number"
                      placeholder="500,000"
                      value={filterState.minPrice || ''}
                      onChange={e =>
                        setFilterState(prev => ({
                          ...prev,
                          minPrice: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:border-[#14a800] outline-hidden"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[11px] font-bold text-slate-600">إلى (ج.م)</label>
                    <input
                      type="number"
                      placeholder="2,500,000"
                      value={filterState.maxPrice || ''}
                      onChange={e =>
                        setFilterState(prev => ({
                          ...prev,
                          maxPrice: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:border-[#14a800] outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Interest questions */}
          {currentStep === 5 && (
            <div className="space-y-2.5 animate-soft-fade">
              <h2 className="text-sm sm:text-base font-black text-[#001e00] flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#14a800]" />
                <span>حاجات تانية تهمك؟</span>
              </h2>

              <div className="grid grid-cols-2 gap-2">
                {interestQuestions.map((q) => {
                  const isSelected = selectedPreferences.includes(q.id);
                  const IconComponent = (q as any).icon || Sparkles;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => togglePreference(q.id)}
                      className={`p-2 sm:p-2.5 rounded-xl border-2 text-right transition cursor-pointer flex items-center justify-between gap-1.5 group ${
                        isSelected
                          ? 'border-[#14a800] bg-[#f0faf0] shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition ${
                          isSelected ? 'bg-[#14a800] text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-[#001e00] truncate">
                          {q.label}
                        </span>
                      </div>

                      <div className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center border transition ${
                        isSelected 
                          ? 'border-[#14a800] bg-[#14a800] text-white' 
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Matches Count Assurance */}
              <div className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#14a800]" />
                  <span className="text-xs">عقارات مطابقة:</span>
                </div>
                {matchingProperties.length > 0 ? (
                  <span className="text-[#14a800] font-black text-xs">
                    {matchingProperties.length} عقار جاهز
                  </span>
                ) : (
                  <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md text-[11px] font-bold border border-amber-200/60">
                    طلب خاص
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stepper Navigation Footer */}
          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(s => s - 1)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                السابق
              </Button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/properties')}
                className="text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer"
              >
                شوف كل العقارات
              </button>
            )}

            {currentStep < totalSteps ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentStep(s => s + 1)}
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                التالي
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleCompleteSmartSearch}
                leftIcon={<Sparkles className="w-4 h-4" />}
                className="shadow-xs text-xs font-bold"
              >
                {matchingProperties.length > 0 ? 'شوف العقارات المطابقة' : 'كمّل الطلب'}
              </Button>
            )}
          </div>
        </div>

        {/* Discreet 1-liner Trust Tag (Safe for 100vh) */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-500 py-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#14a800]" />
          <span>عقارات مفحوصة ومضمونة 100% بكفر الشيخ</span>
        </div>
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
