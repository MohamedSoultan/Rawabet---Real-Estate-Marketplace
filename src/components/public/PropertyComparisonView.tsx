import React from 'react';
import { useApp } from '../../context/AppContext';
import { Property, PropertyVersion } from '../../types';
import { getOptimizedImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageOptimizer';
import { 
  GitCompare, 
  Trash2, 
  Plus, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  X, 
  ArrowLeft, 
  Eye, 
  Sparkles,
  Layers,
  PhoneCall
} from 'lucide-react';

interface PropertyComparisonViewProps {
  onSelectProperty: (property: Property) => void;
  onExploreListings: () => void;
}

export const PropertyComparisonView: React.FC<PropertyComparisonViewProps> = ({
  onSelectProperty,
  onExploreListings
}) => {
  const { 
    compareIds, 
    removeFromCompare, 
    clearCompare, 
    properties, 
    governorates, 
    cities, 
    areas,
    propertyTypes,
    transactionTypes,
    settings
  } = useApp();

  const getPropVersion = (prop: Property): PropertyVersion | undefined => {
    if (!prop || !prop.versions || prop.versions.length === 0) return undefined;
    const activeVersionId = prop.current_published_version_id || prop.versions[0]?.id;
    return prop.versions.find(v => v.id === activeVersionId) || prop.versions[0];
  };

  const comparedProperties = properties.filter(p => compareIds.includes(p.id));

  // Collect all unique features across compared properties
  const allFeatures: string[] = Array.from(
    new Set<string>(
      comparedProperties.flatMap(p => {
        const ver = getPropVersion(p);
        return ver?.features || [];
      })
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 font-sans text-right">
      
      {/* Header Banner */}
      <div className="bg-[#001e00] text-white rounded-xl p-5 sm:p-8 border border-[#003a00] shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#14a800] text-white">
              <GitCompare className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              مقارنة العقارات
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#002f00] text-[#14a800] border border-[#14a800]/30">
              {comparedProperties.length} / 4 عقارات
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium max-w-2xl">
            قارن بين الأسعار والمساحات والتشطيبات جنب بعض عشان تختار الأنسب ليك ولميزانيتك.
          </p>
        </div>

        <div className="flex items-center gap-2 z-10 w-full sm:w-auto">
          {comparedProperties.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="px-4 py-2.5 bg-white/10 hover:bg-rose-900/40 text-slate-200 hover:text-rose-200 border border-white/20 hover:border-rose-500/40 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4" />
              <span>مسح المقارنة</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExploreListings}
            className="px-5 py-2.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>ضيف عقار تاني</span>
          </button>
        </div>
      </div>

      {comparedProperties.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl p-12 sm:p-16 border border-[#e4ebe4] text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-xl bg-[#f2f7f2] text-[#14a800] flex items-center justify-center mx-auto">
            <GitCompare className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-black text-[#001e00]">مفيش عقارات مضافة للمقارنة</h3>
            <p className="text-xs text-slate-500 font-medium">
              تصفح العقارات ودوس على "مقارنة" على أي عقار عشان تقارن بينهم هنا في ثواني.
            </p>
          </div>
          <button
            type="button"
            onClick={onExploreListings}
            className="px-6 py-3 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-black rounded-xl transition shadow-2xs inline-flex items-center gap-2 cursor-pointer"
          >
            <span>شوف كل العقارات المتاحة</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Comparison Table / Matrix */
        <div className="bg-white rounded-xl border border-[#e4ebe4] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#f2f7f2] border-b border-[#e4ebe4]">
                  <th className="p-4 text-xs font-black text-[#001e00] w-48 sticky right-0 bg-[#f2f7f2] z-10">
                    العقار / المواصفة
                  </th>
                  {comparedProperties.map(prop => {
                    const ver = getPropVersion(prop);
                    const cover = ver?.media?.find(m => m.is_cover) || ver?.media?.[0];
                    const gov = governorates.find(g => g.id === ver?.governorate_id)?.name_ar;
                    const city = cities.find(c => c.id === ver?.city_id)?.name_ar;

                    return (
                      <th key={prop.id} className="p-4 text-xs font-black text-[#001e00] min-w-[240px] border-r border-[#e4ebe4] align-top">
                        <div className="space-y-3">
                          {/* Image & Remove */}
                          <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                            {cover ? (
                              <img
                                src={getOptimizedImageUrl(cover.path, { width: 480, quality: 80 })}
                                alt={ver?.title || 'عقار'}
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                                <Building2 className="w-8 h-8" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeFromCompare(prop.id)}
                              className="absolute top-2 left-2 p-1.5 rounded-lg bg-white/90 hover:bg-rose-500 hover:text-white text-slate-700 transition cursor-pointer shadow-xs"
                              title="إزالة من المقارنة"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-[#001e00]/80 text-white text-[10px] font-bold">
                              كود: {prop.reference_number}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-xs font-black text-[#001e00] line-clamp-2 leading-relaxed">
                            {ver?.title || 'عقار بدون عنوان'}
                          </h4>

                          {/* Location */}
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold">
                            <MapPin className="w-3.5 h-3.5 text-[#14a800] shrink-0" />
                            <span className="truncate">{city || 'كفر الشيخ'} - {gov || 'كفر الشيخ'}</span>
                          </div>

                          {/* Action Button */}
                          <button
                            type="button"
                            onClick={() => onSelectProperty(prop)}
                            className="w-full py-2 bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>معاينة التفاصيل</span>
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e4ebe4] text-xs">
                
                {/* Price Row */}
                <tr>
                  <td className="p-4 font-black text-[#001e00] bg-slate-50 sticky right-0 z-10 whitespace-nowrap">
                    السعر المطلوب
                  </td>
                  {comparedProperties.map(prop => {
                    const ver = getPropVersion(prop);
                    return (
                      <td key={prop.id} className="p-4 font-black text-[#14a800] text-sm border-r border-[#e4ebe4] whitespace-nowrap">
                        {ver ? ver.price.toLocaleString() : '-'} ج.م
                      </td>
                    );
                  })}
                </tr>

                {/* Area Row */}
                <tr>
                  <td className="p-4 font-black text-[#001e00] bg-slate-50 sticky right-0 z-10 whitespace-nowrap">
                    المساحة الإجمالية
                  </td>
                  {comparedProperties.map(prop => {
                    const ver = getPropVersion(prop);
                    return (
                      <td key={prop.id} className="p-4 font-bold text-slate-800 border-r border-[#e4ebe4] whitespace-nowrap">
                        {ver ? ver.area_sqm : '-'} م²
                      </td>
                    );
                  })}
                </tr>

                {/* Price per m2 */}
                <tr>
                  <td className="p-4 font-black text-[#001e00] bg-slate-50 sticky right-0 z-10 whitespace-nowrap">
                    متوسط سعر المتر
                  </td>
                  {comparedProperties.map(prop => {
                    const ver = getPropVersion(prop);
                    const pricePerM = ver ? Math.round(ver.price / (ver.area_sqm || 1)) : 0;
                    return (
                      <td key={prop.id} className="p-4 font-bold text-slate-700 border-r border-[#e4ebe4] whitespace-nowrap">
                        {pricePerM.toLocaleString()} ج.م / م²
                      </td>
                    );
                  })}
                </tr>

                {/* Property Type */}
                <tr>
                  <td className="p-4 font-black text-[#001e00] bg-slate-50 sticky right-0 z-10 whitespace-nowrap">
                    نوع العقار والمعاملة
                  </td>
                  {comparedProperties.map(prop => {
                    const ptype = propertyTypes.find(t => t.id === prop.property_type_id)?.name_ar || 'عقار';
                    const tx = transactionTypes.find(t => t.id === prop.transaction_type_id)?.name_ar || 'بيع';
                    return (
                      <td key={prop.id} className="p-4 font-bold text-slate-800 border-r border-[#e4ebe4] whitespace-nowrap">
                        {ptype} ({tx})
                      </td>
                    );
                  })}
                </tr>

                {/* Bedrooms & Bathrooms */}
                <tr>
                  <td className="p-4 font-black text-[#001e00] bg-slate-50 sticky right-0 z-10 whitespace-nowrap">
                    الغرف والحمامات
                  </td>
                  {comparedProperties.map(prop => {
                    const ver = getPropVersion(prop);
                    return (
                      <td key={prop.id} className="p-4 font-bold text-slate-800 border-r border-[#e4ebe4] whitespace-nowrap">
                        {ver ? `${ver.bedrooms ?? '-'} غرف نوم • ${ver.bathrooms ?? '-'} حمام` : '-'}
                      </td>
                    );
                  })}
                </tr>

                {/* Floor */}
                <tr>
                  <td className="p-4 font-black text-[#001e00] bg-slate-50 sticky right-0 z-10 whitespace-nowrap">
                    الدور / الطابق
                  </td>
                  {comparedProperties.map(prop => {
                    const ver = getPropVersion(prop);
                    return (
                      <td key={prop.id} className="p-4 font-bold text-slate-800 border-r border-[#e4ebe4] whitespace-nowrap">
                        {ver?.floor || 'غير محدد'}
                      </td>
                    );
                  })}
                </tr>

                {/* Finishing Level */}
                <tr>
                  <td className="p-4 font-black text-[#001e00] bg-slate-50 sticky right-0 z-10 whitespace-nowrap">
                    مستوى التشطيب
                  </td>
                  {comparedProperties.map(prop => {
                    const ver = getPropVersion(prop);
                    return (
                      <td key={prop.id} className="p-4 font-bold text-slate-800 border-r border-[#e4ebe4] whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-[#f2f7f2] text-[#001e00] border border-[#14a800]/30 rounded-lg text-xs">
                          {ver?.finishing || 'سوبر لوكس'}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Location Text */}
                <tr>
                  <td className="p-4 font-black text-[#001e00] bg-slate-50 sticky right-0 z-10 whitespace-nowrap">
                    الموقع العام
                  </td>
                  {comparedProperties.map(prop => {
                    const ver = getPropVersion(prop);
                    return (
                      <td key={prop.id} className="p-4 font-medium text-slate-700 border-r border-[#e4ebe4] leading-relaxed">
                        {ver?.public_location_text || '-'}
                      </td>
                    );
                  })}
                </tr>

                {/* Features Checklist */}
                {allFeatures.map(feat => (
                  <tr key={feat}>
                    <td className="p-4 font-bold text-slate-700 bg-slate-50 sticky right-0 z-10 whitespace-nowrap">
                      {feat}
                    </td>
                    {comparedProperties.map(prop => {
                      const ver = getPropVersion(prop);
                      const hasFeature = ver?.features?.includes(feat);
                      return (
                        <td key={prop.id} className="p-4 border-r border-[#e4ebe4] text-center">
                          {hasFeature ? (
                            <span className="inline-flex items-center gap-1 text-[#14a800] font-black text-xs">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>متوفر</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                              <X className="w-4 h-4" />
                              <span>غير متوفر</span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Direct CTA */}
                <tr>
                  <td className="p-4 font-black text-[#001e00] bg-slate-50 sticky right-0 z-10 whitespace-nowrap">
                    حجز معاينة ميدانية
                  </td>
                  {comparedProperties.map(prop => (
                    <td key={prop.id} className="p-4 border-r border-[#e4ebe4]">
                      <button
                        type="button"
                        onClick={() => onSelectProperty(prop)}
                        className="w-full py-2.5 bg-[#001e00] hover:bg-[#14a800] text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>طلب معاينة العقار</span>
                      </button>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
