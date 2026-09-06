import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PropertyComparisonView } from '../components/public/PropertyComparisonView';
import { Property } from '../types';

interface OutletContextType {
  setPreviewProperty: (property: Property | null) => void;
  handleOpenAddProperty: () => void;
}

export const CompareRoute: React.FC = () => {
  const navigate = useNavigate();
  const { setPreviewProperty } = useOutletContext<OutletContextType>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-soft-fade">
      <PropertyComparisonView
        onSelectProperty={(property) => setPreviewProperty(property)}
        onExploreListings={() => navigate('/properties')}
      />
    </div>
  );
};
