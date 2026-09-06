import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AboutUsView } from '../components/public/AboutUsView';

export const AboutRoute: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-soft-fade">
      <AboutUsView
        onExploreProperties={() => navigate('/properties')}
        onContactUs={() => navigate('/contact')}
      />
    </div>
  );
};
