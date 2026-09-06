import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PropertyFilterState } from '../../types';
import { filterProperties, toUrlParams, getRecommendedProperties } from '../../services/filterEngine';
import { Modal, Button, Badge } from '../ui';
import { SmartSearchNoMatchModal } from './SmartSearchNoMatchModal';
import { 
  Compass, 
  Building2, 
  MapPin, 
  Banknote, 
  SlidersHorizontal, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  BedDouble,
  Bath,
  Home
} from 'lucide-react';

interface StartJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (filterState: PropertyFilterState) => void;
}

export const StartJourneyModal: React.FC<StartJourneyModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const navigate = useNavigate();
  const { propertyTypes, transactionTypes, cities, areas, getPublishedProperties } = useApp();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;
  const [isNoMatchOpen, setIsNoMatchOpen] = useState(false);

  // Centralized PropertyFilterState - no second filtering system!
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

  const publishedProperties = useMemo(() => getPublishedProperties(), [getPublishedProperties]);

  // Real-time calculation using centralized filter engine
  const matchingProperties = useMemo(
    () => filterProperties(publishedProperties, filterState),
    [publishedProperties, filterState]
  );

  const recommendations = useMemo(
    () => getRecommendedProperties(publishedProperties, filterState, 3),
    [publishedProperties, filterState]
  );

  const availableAreas = useMemo(() => {
    if (!filterState.location?.city_id) return [];
    return areas.filter(a => a.city_id === filterState.location?.city_id);
  }, [areas, filterState.location?.city_id]);

  const handleFinish = () => {
    if (matchingProperties.length === 0) {
      setIsNoMatchOpen(true);
      return;
    }
    if (onComplete) {
      onComplete(filterState);
    } else {
      const params = toUrlParams(filterState);
      navigate(`/properties?${params.toString()}`);
    }
    onClose();
  };

  const featureOptions = [
    'مصعد',
    'عداد كهرباء قديم',
    'غاز طبيعي',
    'حصة في الأرض',
    'واجهة بحرية',
    'تشطيب سوبر لوكس',
    'مدخل فندقي',
    'أمن وحراسة',
  ];

  const toggleFeature = (feat: string) => {
    setFilterState(prev => {
      const current = prev.features || [];
      const next = current.includes(feat) ? current.filter(f => f !== feat) : [...current, feat];
      return { ...prev, features: next };
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="بدء رحلة البحث الذكية"
      description="حدد تفضيلاتك خطوة بخطوة وسنوفر لك أفضل العقارات المعتمدة والمطابقة لطلبك بدقة"
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>الخطوة {step} من {totalSteps}</span>
            <span className="text-[#14a800]">
              {matchingProperties.length} عقار متوفر حالياً
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#14a800] transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Transaction Type */}
        {step === 1 && (
          <div className="space-y-4 animate-soft-fade">
            <div className="flex items-center gap-2 text-sm font-bold text-[#001e00]">
              <Compass className="w-4 h-4 text-[#14a800]" />
              <h4>ما هو هدفك الأساسي؟</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {transactionTypes.map(tx => {
                const isSelected = filterState.transactionType === tx.id;
                return (
                  <button
                    key={tx.id}
                    type="button"
                    onClick={() => setFilterState(prev => ({ ...prev, transactionType: tx.id }))}
                    className={`p-5 rounded-2xl border-2 text-right transition cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'border-[#14a800] bg-[#f0faf0] shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-base text-[#001e00]">{tx.name_ar}</span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-[#14a800]" />}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {tx.id.includes('sale')
                        ? 'البحث عن فرصة شراء وتملك عقار أو استثمار طويل الأجل'
                        : 'البحث عن خيارات إيجار سكني أو تجاري تناسب ميزانيتك'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Property Type */}
        {step === 2 && (
          <div className="space-y-4 animate-soft-fade">
            <div className="flex items-center gap-2 text-sm font-bold text-[#001e00]">
              <Building2 className="w-4 h-4 text-[#14a800]" />
              <h4>ما هو نوع العقار الذي تبحث عنه؟</h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFilterState(prev => ({ ...prev, propertyType: '' }))}
                className={`p-4 rounded-xl border text-center transition cursor-pointer font-bold text-xs sm:text-sm ${
                  !filterState.propertyType
                    ? 'border-[#14a800] bg-[#f0faf0] text-[#14a800]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                أي نوع عقار
              </button>
              {propertyTypes.map(pt => {
                const isSelected = filterState.propertyType === pt.id;
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => setFilterState(prev => ({ ...prev, propertyType: pt.id }))}
                    className={`p-4 rounded-xl border text-center transition cursor-pointer font-bold text-xs sm:text-sm ${
                      isSelected
                        ? 'border-[#14a800] bg-[#f0faf0] text-[#14a800]'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pt.name_ar}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="space-y-4 animate-soft-fade">
            <div className="flex items-center gap-2 text-sm font-bold text-[#001e00]">
              <MapPin className="w-4 h-4 text-[#14a800]" />
              <h4>في أي مركز أو مدينة تفضل موقع العقار؟</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-700">المركز / المدينة</label>
                <select
                  value={filterState.location?.city_id || ''}
                  onChange={e =>
                    setFilterState(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        city_id: e.target.value,
                        area_id: '',
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="">كافة مراكز المحافظة</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name_ar}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-700">المنطقة / الحي (اختياري)</label>
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 disabled:opacity-50"
                >
                  <option value="">كافة المناطق بالمدينة</option>
                  {availableAreas.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name_ar}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Budget Range */}
        {step === 4 && (
          <div className="space-y-4 animate-soft-fade">
            <div className="flex items-center gap-2 text-sm font-bold text-[#001e00]">
              <Banknote className="w-4 h-4 text-[#14a800]" />
              <h4>ما هو نطاق الميزانية المقدرة (بالجنيه المصري)؟</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-700">الحد الأدنى للسعر</label>
                <input
                  type="number"
                  placeholder="مثال: 500,000"
                  value={filterState.minPrice || ''}
                  onChange={e =>
                    setFilterState(prev => ({
                      ...prev,
                      minPrice: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-700">الحد الأقصى للسعر</label>
                <input
                  type="number"
                  placeholder="مثال: 2,500,000"
                  value={filterState.maxPrice || ''}
                  onChange={e =>
                    setFilterState(prev => ({
                      ...prev,
                      maxPrice: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Rooms & Features */}
        {step === 5 && (
          <div className="space-y-5 animate-soft-fade">
            <div className="flex items-center gap-2 text-sm font-bold text-[#001e00]">
              <SlidersHorizontal className="w-4 h-4 text-[#14a800]" />
              <h4>المواصفات والتفضيلات الإضافية</h4>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5 text-slate-500" />
                  <span>الحد الأدنى لعدد الغرف</span>
                </label>
                <select
                  value={filterState.rooms || ''}
                  onChange={e =>
                    setFilterState(prev => ({
                      ...prev,
                      rooms: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="">أي عدد غرف</option>
                  <option value="1">1 غرفة فأكثر</option>
                  <option value="2">2 غرف فأكثر</option>
                  <option value="3">3 غرف فأكثر</option>
                  <option value="4">4 غرف فأكثر</option>
                </select>
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-slate-500" />
                  <span>الحد الأدنى لعدد الحمامات</span>
                </label>
                <select
                  value={filterState.bathrooms || ''}
                  onChange={e =>
                    setFilterState(prev => ({
                      ...prev,
                      bathrooms: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="">أي عدد حمامات</option>
                  <option value="1">1 حمام فأكثر</option>
                  <option value="2">2 حمام فأكثر</option>
                </select>
              </div>
            </div>

            {/* Feature Chips */}
            <div className="space-y-2 text-right">
              <label className="text-xs font-bold text-slate-700">ميزات وتجهيزات مرغوبة</label>
              <div className="flex flex-wrap gap-2">
                {featureOptions.map(feat => {
                  const isSelected = (filterState.features || []).includes(feat);
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => toggleFeature(feat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#14a800] text-white border-[#14a800]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {feat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Top Recommendations Preview */}
            {recommendations.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-right">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#001e00]">
                  <Sparkles className="w-3.5 h-3.5 text-[#14a800]" />
                  <span>عقارات مقترحة مطابقة لمعايير رحلتك:</span>
                </div>
                <div className="space-y-1.5">
                  {recommendations.map(({ property, matchScore }) => {
                    const ver = property.versions.find(v => v.id === property.current_published_version_id) || property.versions[0];
                    return (
                      <div
                        key={property.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="primary" size="sm">
                            تطابق {matchScore}%
                          </Badge>
                          <span className="font-bold text-slate-800 line-clamp-1">{ver?.title}</span>
                        </div>
                        <span className="font-black text-[#14a800] shrink-0">
                          {ver?.price.toLocaleString()} ج.م
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(s => s - 1)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              السابق
            </Button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setStep(s => s + 1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              التالي
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleFinish}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              استعراض العقارات المطابقة ({matchingProperties.length})
            </Button>
          )}
        </div>
      </div>

      <SmartSearchNoMatchModal
        isOpen={isNoMatchOpen}
        onClose={() => setIsNoMatchOpen(false)}
        filterState={filterState}
        selectedIntent={filterState.transactionType === 'tx-rent' ? 'RENT' : 'BUY'}
        selectedPreferences={filterState.features || []}
        interestQuestions={featureOptions.map(f => ({ id: f, label: f, internalFeature: f, desc: '' }))}
        onEditPreferences={(targetStep) => {
          setIsNoMatchOpen(false);
          setStep(targetStep || 4);
        }}
        onStartNewSearch={() => {
          setIsNoMatchOpen(false);
          setStep(1);
        }}
      />
    </Modal>
  );
};
