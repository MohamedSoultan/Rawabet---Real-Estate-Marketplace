import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { HelpGuideView } from '../components/public/HelpGuideView';
import { Property } from '../types';

interface OutletContextType {
  setPreviewProperty: (property: Property | null) => void;
  handleOpenAddProperty: () => void;
}

export const HelpRoute: React.FC = () => {
  const { handleOpenAddProperty } = useOutletContext<OutletContextType>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-soft-fade">
      <HelpGuideView
        onOpenAddProperty={handleOpenAddProperty}
      />
    </div>
  );
};
