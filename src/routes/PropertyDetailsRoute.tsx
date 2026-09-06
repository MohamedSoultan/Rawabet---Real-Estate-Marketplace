import React, { useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PropertyDetailsPage } from '../components/public/PropertyDetailsPage';
import { Building2, ArrowRight } from 'lucide-react';
import { Property } from '../types';

interface OutletContextType {
  setPreviewProperty?: (property: Property | null) => void;
}

interface PropertyDetailsRouteProps {
  onSelectProperty?: (property: Property) => void;
}

export const PropertyDetailsRoute: React.FC<PropertyDetailsRouteProps> = ({ onSelectProperty }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const outletContext = useOutletContext<OutletContextType | null>();
  const { getPublishedProperties } = useApp();

  const published = getPublishedProperties();
  const target = id?.trim().toLowerCase();

  const property = published.find(p => 
    p.id.toLowerCase() === target || 
    p.reference_number.toLowerCase() === target
  );

  useEffect(() => {
    if (property) {
      const activeVersion = property.versions.find(v => v.id === property.current_published_version_id) || property.versions[0];
      const title = activeVersion?.title || property.reference_number;
      document.title = `${title} | منصة روابط كفر الشيخ`;
    } else {
      document.title = 'العقار غير متوفر | روابط';
    }
  }, [property]);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#001e00]">لم نتمكن من العثور على هذا العقار</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          قد يكون هذا العقار تم بيعه أو تأجيره أو أن الرابط غير صحيح. يمكنك استعراض كافة العقارات المتاحة والمعتمدة.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/properties')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#14a800] hover:bg-[#108a00] text-white rounded-xl text-sm font-bold shadow-xs transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>تصفح العقارات المتاحة</span>
          </button>
        </div>
      </div>
    );
  }

  const handleSelectSimilar = (p: Property) => {
    if (onSelectProperty) {
      onSelectProperty(p);
    } else if (outletContext?.setPreviewProperty) {
      outletContext.setPreviewProperty(p);
    } else {
      navigate(`/property/${p.reference_number || p.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <PropertyDetailsPage
      property={property}
      onBack={() => navigate('/properties')}
      onFilterByTag={(filterType, value) => {
        navigate(`/properties?${filterType}=${encodeURIComponent(value)}`);
      }}
      onSelectProperty={handleSelectSimilar}
    />
  );
};
