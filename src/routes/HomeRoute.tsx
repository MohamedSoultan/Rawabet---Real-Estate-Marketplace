import React, { useMemo, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/public/HeroSection';
import { PropertyCard } from '../components/public/PropertyCard';
import { PropertySlider } from '../components/public/PropertySlider';
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
    <div className="space-y-10 sm:space-y-14 animate-soft-fade">
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
        <div className="bg-white rounded-xl p-5 sm:p-7 border border-[#e4ebe4] shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f2f7f2] text-[#14a800] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-[#001e00]">عقارات مفحوصة 100%</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  كل عقار متراجع ومفحوص قانونياً على الطبيعة قبل ما ينزل.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f2f7f2] text-[#14a800] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-[#001e00]">معاينات سريعة</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  فريقنا بينسق معاك المعاينة فوراً وفي الوقت اللي يناسبك.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f2f7f2] text-[#14a800] flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-[#001e00]">أمان وخصوصية</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  بياناتك في سرية تامة والتواصل رسمي بدون أي إزعاج.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section - Threshold Rule: Carousel when > 3 cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {featuredProperties.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-[#e4ebe4] text-slate-500 text-xs">
            مفيش عقارات معروضة حالياً.
          </div>
        ) : featuredProperties.length > 3 ? (
          /* Slider Standard for > 3 properties */
          <PropertySlider
            properties={featuredProperties}
            title="أحدث العقارات"
            subtitle="عقارات مفحوصة وجاهزة للمعاينة"
            onSelectProperty={handleSelectProperty}
            onPreviewClick={handleSelectProperty}
            onFilterByTag={handleFilterTag}
            onViewAll={() => navigate('/properties')}
            viewAllText="شوف كل العقارات"
          />
        ) : (
          /* Grid for <= 3 properties */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#001e00]">أحدث العقارات</h2>
                <p className="text-xs text-slate-500">عقارات مفحوصة وجاهزة للمعاينة</p>
              </div>
              <button
                onClick={() => navigate('/properties')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14a800] hover:underline cursor-pointer"
              >
                <span>شوف كل العقارات</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
          </div>
        )}
      </section>

      {/* Kafr El Sheikh Coverage Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl p-5 sm:p-7 border border-[#e4ebe4] shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[#14a800]" />
            <h3 className="text-sm font-black text-[#001e00]">تغطية مراكز كفر الشيخ</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => navigate(`/properties?city_id=${city.id}`)}
                className="px-3.5 py-1.5 bg-slate-50 hover:bg-[#f2f7f2] hover:text-[#14a800] border border-[#e4ebe4] hover:border-[#14a800]/40 rounded-xl text-xs font-bold transition cursor-pointer"
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
