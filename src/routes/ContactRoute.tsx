import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ContactUsView } from '../components/public/ContactUsView';

export const ContactRoute: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-soft-fade">
      <ContactUsView
        onExploreProperties={() => navigate('/properties')}
      />
    </div>
  );
};
