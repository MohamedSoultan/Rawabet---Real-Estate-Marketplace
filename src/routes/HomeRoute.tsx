import React, { useMemo, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/public/HeroSection';
import { PropertyCard } from '../components/public/PropertyCard';
import { Property } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  Users,
  Compass,
  GitCompare,
  MessageSquare
} from 'lucide-react';

interface OutletContextType {
  setPreviewProperty: (property: Property | null) => void;
  handleOpenAddProperty: () => void;
}

export const HomeRoute: React.FC = () => {
  const navigate = useNavigate();
  const { setPreviewProperty, handleOpenAddProperty } = useOutletContext<OutletContextType>();
  const { getPublishedProperties, cities } = useApp();

  const publishedProperties = useMemo(() => getPublishedProperties(), [getPublishedProperties]);
  const featuredProperties = useMemo(() => publishedProperties.slice(0, 6), [publishedProperties]);

  const handleSelectProperty = useCallback((p: Property) => {
    setPreviewProperty(p);
  }, [setPreviewProperty]);

  const handleFilterTag = useCallback((filterType: string, value: string) => {
    navigate(`/properties?${filterType}=${encodeURIComponent(value)}`);
  }, [navigate]);

  return (
    <div className="space-y-12 sm:space-y-16 animate-soft-fade">
      {/* Hero Section */}
      <HeroSection
        onSearch={(filters) => {
          const params = new URLSearchParams();
          if (filters.governorate_id) params.set('governorate_id', filters.governorate_id);
          if (filters.city_id) params.set('city_id', filters.city_id);
          if (filters.property_type_id) params.set('property_type_id', filters.property_type_id);
          if (filters.transaction_type_id) params.set('transaction_type_id', filters.transaction_type_id);
          if (filters.max_price) params.set('max_price', filters.max_price.toString());
          navigate(`/properties?${params.toString()}`);
        }}
        onExploreAll={() => navigate('/properties')}
        onAddProperty={handleOpenAddProperty}
        onStartJourney={() => navigate('/start')}
      />

      {/* Trust & Safety Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#e4ebe4] shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#f2f7f2] text-[#14a800] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#001e00]">عقارات معتمدة بنسبة 100%</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  يتم فحص وتدقيق كل عقار ومستنداته المرفقة والتأكد من هويته قبل اعتماده ونشره على منصة روابط.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#f2f7f2] text-[#14a800] flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#001e00]">سرعة في الإنجاز وتحديد المعاينات</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  فريق مبيعات متخصص ينسق مواعيد المعاينة مباشرة مع المشترين والمهتمين دون إزعاج المالك.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#f2f7f2] text-[#14a800] flex items-center justify-center shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#001e00]">حماية كاملة لخصوصية المالك</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  بيانات المالك الشخصية ورقم هاتفه سرية تماماً، والاتصال يتم عبر رقم منصة روابط الموحد.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#14a800] text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>عقارات مميزة ومفحوصة حديثاً</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#001e00]">أحدث الفرص العقارية في كفر الشيخ</h2>
          </div>
          <button
            onClick={() => navigate('/properties')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#14a800] hover:text-[#108a00] hover:underline cursor-pointer group"
          >
            <span>استعراض كافة العقارات ({publishedProperties.length})</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>

        {featuredProperties.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-[#e4ebe4] text-slate-500 text-sm">
            لا توجد عقارات منشورة حالياً في هذه الفئة.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <div key={property.id} className="w-full min-w-0 max-w-full overflow-hidden flex flex-col h-full">
                <PropertyCard
                  property={property}
                  onSelect={handleSelectProperty}
                  onFilterTag={handleFilterTag}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Kafr El Sheikh Coverage Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#e4ebe4] shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-[#14a800]" />
            <h3 className="text-base font-black text-[#001e00]">تغطية شاملة لمراكز ومدن محافظة كفر الشيخ</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => navigate(`/properties?city_id=${city.id}`)}
                className="px-4 py-2 bg-[#f9f9f9] hover:bg-[#f2f7f2] hover:text-[#14a800] border border-[#e4ebe4] hover:border-[#14a800]/40 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer"
              >
                {city.name_ar}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
