import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MobileBottomNav } from '../components/common/MobileBottomNav';
import { FloatingAddPropertyButton } from '../components/common/FloatingAddPropertyButton';
import { AuthModal } from '../components/auth/AuthModal';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Property } from '../types';

// Code split heavy modals - only loaded when requested
const PropertyPreviewModal = lazy(() => import('../components/public/PropertyPreviewModal').then(m => ({ default: m.PropertyPreviewModal })));
const PropertyWizardModal = lazy(() => import('../components/seller/PropertyWizardModal').then(m => ({ default: m.PropertyWizardModal })));
const LegalModal = lazy(() => import('../components/common/LegalModal').then(m => ({ default: m.LegalModal })));

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    currentUser, 
    authModal, 
    closeAuthModal, 
    openAuthModal,
    settings
  } = useApp();

  const [previewProperty, setPreviewProperty] = useState<Property | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'PRIVACY' | 'TERMS' | 'ABOUT' | null>(null);

  // Compute current active tab from pathname
  const path = location.pathname;
  const currentTab: 'HOME' | 'START' | 'PROPERTIES' | 'COMPARE' | 'ABOUT' | 'CONTACT' | 'SELLER' | 'ADMIN' | 'PROFILE' | 'HELP' = (() => {
    if (path.startsWith('/start')) return 'START';
    if (path.startsWith('/properties') || path.startsWith('/property/')) return 'PROPERTIES';
    if (path.startsWith('/compare')) return 'COMPARE';
    if (path.startsWith('/about')) return 'ABOUT';
    if (path.startsWith('/contact')) return 'CONTACT';
    if (path.startsWith('/seller')) return 'SELLER';
    if (path.startsWith('/admin')) return 'ADMIN';
    if (path.startsWith('/profile')) return 'PROFILE';
    if (path.startsWith('/help')) return 'HELP';
    return 'HOME';
  })();

  const handleNavigate = useCallback((
    tab: 'HOME' | 'START' | 'PROPERTIES' | 'COMPARE' | 'ABOUT' | 'CONTACT' | 'SELLER' | 'ADMIN' | 'PROFILE' | 'HELP',
    subTab?: 'QUEUE' | 'LEADS' | 'USERS' | 'VERIFICATIONS' | 'LOCATIONS' | 'AUDIT' | 'SETTINGS'
  ) => {
    setPreviewProperty(null);
    switch (tab) {
      case 'HOME':
        navigate('/');
        break;
      case 'START':
        navigate('/start');
        break;
      case 'PROPERTIES':
        navigate('/properties');
        break;
      case 'COMPARE':
        navigate('/compare');
        break;
      case 'ABOUT':
        navigate('/about');
        break;
      case 'CONTACT':
        navigate('/contact');
        break;
      case 'SELLER':
        navigate('/seller/dashboard');
        break;
      case 'ADMIN':
        if (subTab) {
          navigate(`/admin/${subTab.toLowerCase()}`);
        } else {
          navigate('/admin');
        }
        break;
      case 'PROFILE':
        navigate('/profile');
        break;
      case 'HELP':
        navigate('/help');
        break;
      default:
        navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleOpenAddProperty = useCallback(() => {
    if (!currentUser) {
      openAuthModal('LOGIN');
      return;
    }
    setIsWizardOpen(true);
  }, [currentUser, openAuthModal]);

  const outletContextValue = useMemo(() => ({
    setPreviewProperty,
    handleOpenAddProperty
  }), [handleOpenAddProperty]);

  const isDetailsPage = path.startsWith('/property/');
  const isComparePage = path === '/compare';

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#f9f9f9] text-[#001e00] flex flex-col font-sans antialiased text-right selection:bg-[#14a800] selection:text-white" dir="rtl">
      
      {/* Skip to Main Content link for Screen Readers and Keyboard Navigation */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-[#14a800] focus:text-white focus:font-black focus:text-xs focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14a800]"
      >
        الانتقال إلى المحتوى الرئيسي
      </a>

      {/* Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenAddProperty={handleOpenAddProperty}
        onOpenLegal={(type) => {
          if (type === 'ABOUT') {
            navigate('/about');
          } else {
            setLegalModalType(type);
          }
        }}
        onFilterCategory={(filters) => {
          const params = new URLSearchParams();
          if (filters.property_type_id) params.set('property_type_id', filters.property_type_id);
          if (filters.transaction_type_id) params.set('transaction_type_id', filters.transaction_type_id);
          navigate(`/properties?${params.toString()}`);
        }}
      />

      {/* Main Content View with Error Boundary */}
      <main id="main-content" tabIndex={-1} className="flex-1 w-full pb-20 md:pb-12 outline-none">
        <ErrorBoundary>
          <Outlet context={outletContextValue} />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLegal={(type) => {
          if (type === 'ABOUT') {
            navigate('/about');
          } else {
            setLegalModalType(type);
          }
        }}
      />

      {/* Mobile Bottom Navigation (Hidden on details page for clean mobile view) */}
      {!isDetailsPage && (
        <MobileBottomNav
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onOpenAddProperty={handleOpenAddProperty}
        />
      )}

      {/* Floating Add Property Button */}
      {!isDetailsPage && !isComparePage && !previewProperty && !isWizardOpen && (
        <FloatingAddPropertyButton onClick={handleOpenAddProperty} />
      )}

      {/* Quick Property Preview Modal (Reserved strictly for quick inspection) */}
      {previewProperty && (
        <Suspense fallback={null}>
          <PropertyPreviewModal
            property={previewProperty}
            onClose={() => setPreviewProperty(null)}
            onViewFullDetails={(prop) => {
              setPreviewProperty(null);
              navigate(`/property/${prop.reference_number || prop.id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onFilterByTag={(filterType, value) => {
              setPreviewProperty(null);
              navigate(`/properties?${filterType}=${encodeURIComponent(value)}`);
            }}
          />
        </Suspense>
      )}

      {/* Property Wizard Modal (5 Steps) */}
      {isWizardOpen && (
        <Suspense fallback={null}>
          <PropertyWizardModal
            isOpen={isWizardOpen}
            onClose={() => setIsWizardOpen(false)}
          />
        </Suspense>
      )}

      {/* Auth Modal (Login / Register / OTP / Password Recovery) */}
      <AuthModal />

      {/* Legal Modal */}
      {legalModalType && (
        <Suspense fallback={null}>
          <LegalModal
            type={legalModalType}
            onClose={() => setLegalModalType(null)}
          />
        </Suspense>
      )}
    </div>
  );
};
