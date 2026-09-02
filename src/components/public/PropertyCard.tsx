import React from 'react';
import { Property, PropertyVersion } from '../../types';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Bookmark, MapPin, Building2, Eye, ShieldCheck, GitCompare } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onFilterTag?: (filterType: 'property_type_id' | 'transaction_type_id' | 'city_id' | 'area_id', value: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect, onFilterTag }) => {
  const { 
    propertyTypes, 
    transactionTypes, 
    isFavorite, 
    toggleFavorite,
    isInCompare,
    addToCompare,
    removeFromCompare 
  } = useApp();

  // Find approved active version to display to public
  const activeVersionId = property.current_published_version_id || property.versions[0]?.id;
  const version: PropertyVersion = property.versions.find(v => v.id === activeVersionId) || property.versions[0];

  const pType = propertyTypes.find(pt => pt.id === property.property_type_id) || propertyTypes[0];
  const txType = transactionTypes.find(tx => tx.id === property.transaction_type_id) || transactionTypes[0];

  const coverMedia = version?.media?.find(m => m.is_cover) || version?.media?.[0];
  const coverImage = coverMedia?.path || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const favorited = isFavorite(property.id);
  const inCompare = isInCompare(property.id);

  const formattedPrice = new Intl.NumberFormat('ar-EG', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(version?.price || 0);

  const handleTagClick = (e: React.MouseEvent, type: 'property_type_id' | 'transaction_type_id' | 'city_id' | 'area_id', value: string) => {
    e.stopPropagation();
    if (onFilterTag) {
      onFilterTag(type, value);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(property.id);
    } else {
      addToCompare(property.id);
    }
  };

  return (
    <div 
      onClick={() => onSelect(property)}
      className="bg-white rounded-2xl border border-[#e4ebe4] hover:border-[#14a800] hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group cursor-pointer text-right"
    >
      
      {/* Media Container */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={version?.title || 'عقار'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges (Upwork Style Pills) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => handleTagClick(e, 'transaction_type_id', txType?.id || '')}
            className="px-3 py-1 rounded-full text-xs font-bold bg-[#14a800] hover:bg-[#108a00] text-white shadow-xs transition hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            title={`تصفية عقارات ${txType?.name_ar}`}
          >
            {txType?.name_ar}
          </button>
          <button
            type="button"
            onClick={(e) => handleTagClick(e, 'property_type_id', pType?.id || '')}
            className="px-3 py-1 rounded-full text-xs font-bold bg-[#001e00]/80 hover:bg-[#001e00] text-white backdrop-blur-xs transition hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            title={`تصفية عقارات ${pType?.name_ar}`}
          >
            {pType?.name_ar}
          </button>
        </div>

        {/* Top Left: Favorite & Compare Actions */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCompareClick}
            className={`p-2 rounded-full backdrop-blur-md transition active:scale-90 cursor-pointer shadow-xs ${
              inCompare 
                ? 'bg-[#001e00] text-[#14a800] ring-2 ring-[#14a800]' 
                : 'bg-white/90 hover:bg-white text-slate-700 hover:text-[#14a800]'
            }`}
            title={inCompare ? "إزالة من المقارنة" : "إضافة إلى المقارنة"}
          >
            <GitCompare className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(property.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition active:scale-90 cursor-pointer shadow-xs ${
              favorited 
                ? 'bg-[#14a800] text-white' 
                : 'bg-white/90 hover:bg-white text-slate-700'
            }`}
            title="حفظ في المفضلة"
          >
            <Bookmark className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Trust Tag: Clean Green Verification Icon Only */}
        <div 
          className="absolute bottom-2.5 right-3 z-10 w-7 h-7 rounded-full bg-white/95 text-[#14a800] border border-[#14a800]/30 shadow-xs flex items-center justify-center backdrop-blur-xs hover:scale-110 transition-transform" 
          title="عقار مفحوص ومعتمد 100% من إدارة روابط"
        >
          <CheckCircle2 className="w-4 h-4 text-[#14a800] shrink-0" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Price & Ref Badge */}
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-lg sm:text-xl font-black text-[#001e00] flex items-baseline gap-1">
              <span className="text-[#14a800] font-black">{formattedPrice}</span>
              <span className="text-xs sm:text-sm font-bold text-slate-600">جنيه</span>
              {txType?.slug === 'rent' && <span className="text-xs font-bold text-slate-500"> / شهرياً</span>}
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 border border-[#e4ebe4] px-2 py-0.5 rounded-md">
              {property.reference_number}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-[#001e00] line-clamp-2 mt-1.5 leading-snug group-hover:text-[#14a800] transition">
            {version?.title}
          </h3>

          {/* Upwork-Style Tags / Pills (District, Property Type, Transaction Type) */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {/* District / Location Tag */}
            {version?.city_id ? (
              <button
                type="button"
                onClick={(e) => handleTagClick(e, 'city_id', version.city_id || '')}
                className="px-2.5 py-1 rounded-full bg-[#f2f7f2] hover:bg-[#e4ebe4] text-[#001e00] border border-[#14a800]/25 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer hover:scale-105 active:scale-95"
                title={`تصفية عقارات ${version?.public_location_text || 'هذه المنطقة'}`}
              >
                <MapPin className="w-3 h-3 text-[#14a800] shrink-0" />
                <span>{version?.public_location_text || 'كفر الشيخ'}</span>
              </button>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-[#f2f7f2] text-[#001e00] border border-[#14a800]/25 text-[11px] font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#14a800] shrink-0" />
                <span>{version?.public_location_text || 'كفر الشيخ'}</span>
              </span>
            )}

            {/* Property Type Tag */}
            <button
              type="button"
              onClick={(e) => handleTagClick(e, 'property_type_id', pType?.id || '')}
              className="px-2.5 py-1 rounded-full bg-[#f2f7f2] hover:bg-[#e4ebe4] text-[#001e00] border border-[#14a800]/25 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer hover:scale-105 active:scale-95"
              title={`تصفية عقارات ${pType?.name_ar}`}
            >
              <Building2 className="w-3 h-3 text-[#14a800] shrink-0" />
              <span>{pType?.name_ar || 'شقة سكنية'}</span>
            </button>

            {/* Transaction Type Tag */}
            <button
              type="button"
              onClick={(e) => handleTagClick(e, 'transaction_type_id', txType?.id || '')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer hover:scale-105 active:scale-95 ${
                txType?.slug === 'rent'
                  ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  : 'bg-[#f2f7f2] text-[#001e00] border-[#14a800]/30 hover:bg-[#e4ebe4]'
              }`}
              title={`تصفية عقارات ${txType?.name_ar}`}
            >
              {txType?.name_ar || 'للبيع'}
            </button>

            {/* Area Tag */}
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
              {version?.area_sqm} م²
            </span>
          </div>
        </div>

        {/* Upwork-Style Additional Specs Pills */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            {version?.area_sqm} م²
          </span>

          {version?.bedrooms !== undefined && version.bedrooms > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {version.bedrooms} غرف
            </span>
          )}

          {version?.bathrooms !== undefined && version.bathrooms > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {version.bathrooms} حمام
            </span>
          )}

          {version?.floor && (
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {version.floor}
            </span>
          )}
        </div>

        {/* Action Button: View Details & Quick Compare */}
        <div className="pt-1 flex items-center gap-2">
          <button
            type="button"
            className="flex-1 py-2.5 px-4 bg-[#f2f7f2] group-hover:bg-[#14a800] text-[#14a800] group-hover:text-white text-xs sm:text-sm font-bold rounded-xl transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Eye className="w-4 h-4" />
            <span>التفاصيل وحجز معاينة</span>
          </button>
        </div>

      </div>

    </div>
  );
};

