import React, { useMemo } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { PropertyListingView } from '../components/public/PropertyListingView';
import { Property } from '../types';
import { fromUrlParams, toFilterCriteria } from '../services/filterEngine';

interface OutletContextType {
  setPreviewProperty: (property: Property | null) => void;
  handleOpenAddProperty: () => void;
}

export const PropertiesRoute: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { setPreviewProperty } = useOutletContext<OutletContextType>();

  const initialFilters = useMemo(() => {
    const filterState = fromUrlParams(searchParams);
    return toFilterCriteria(filterState);
  }, [searchParams]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-soft-fade">
      <PropertyListingView
        key={searchParams.toString()}
        initialFilters={initialFilters}
        onSelectProperty={(property) => setPreviewProperty(property)}
      />
    </div>
  );
};
