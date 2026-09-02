import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { PersonaSwitcher } from './components/common/PersonaSwitcher';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { FloatingAddPropertyButton } from './components/common/FloatingAddPropertyButton';
import { LegalModal } from './components/common/LegalModal';
import { AuthModal } from './components/auth/AuthModal';
import { HeroSection } from './components/public/HeroSection';
import { PropertyListingView } from './components/public/PropertyListingView';
import { PropertyDetailsModal } from './components/public/PropertyDetailsModal';
import { PropertyComparisonView } from './components/public/PropertyComparisonView';
import { AboutUsView } from './components/public/AboutUsView';
import { ContactUsView } from './components/public/ContactUsView';
import { CustomerProfileView } from './components/public/CustomerProfileView';
import { HelpGuideView } from './components/public/HelpGuideView';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { PropertyWizardModal } from './components/seller/PropertyWizardModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { UATVerificationSuite } from './components/testing/UATVerificationSuite';
import { Property } from './types';
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

type AppNavTab = 'HOME' | 'PROPERTIES' | 'COMPARE' | 'ABOUT' | 'CONTACT' | 'SELLER' | 'ADMIN' | 'PROFILE' | 'HELP';
type AppView = 'HOME' | 'LISTINGS' | 'COMPARE' | 'ABOUT' | 'CONTACT' | 'SELLER_DASHBOARD' | 'ADMIN' | 'PROFILE' | 'HELP';

const MainAppContent: React.FC = () => {
  const { 
    currentUser, 
    isAuthModalOpen, 
    closeAuthModal, 
    openAuthModal,
    getPublishedProperties,
    settings,
    sellerProfile,
    compareIds
  } = useApp();

  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [adminSubTab, setAdminSubTab] = useState<
    'QUEUE' | 'LEADS' | 'USERS' | 'VERIFICATIONS' | 'LOCATIONS' | 'AUDIT' | 'SETTINGS'
  >('QUEUE');
  const [searchFilters, setSearchFilters] = useState<{
    governorate_id?: string;
    city_id?: string;
    area_id?: string;
    property_type_id?: string;
    transaction_type_id?: string;
    max_price?: number;
  }>({});

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'PRIVACY' | 'TERMS' | 'ABOUT' | null>(null);
  const [isUATSuiteOpen, setIsUATSuiteOpen] = useState(false);

  const publishedProperties = getPublishedProperties();
  const featuredProperties = publishedProperties.slice(0, 6);

  const handleOpenAddProperty = () => {
    if (!currentUser) {
      openAuthModal('LOGIN');
      return;
    }
    setIsWizardOpen(true);
  };

  const handleNavigate = (
    tab: AppNavTab, 
    subTab?: 'QUEUE' | 'LEADS' | 'USERS' | 'VERIFICATIONS' | 'LOCATIONS' | 'AUDIT' | 'SETTINGS'
  ) => {
    if (tab === 'HOME') {
      setCurrentView('HOME');
    } else if (tab === 'PROPERTIES') {
      setSearchFilters({});
      setCurrentView('LISTINGS');
    } else if (tab === 'COMPARE') {
      setCurrentView('COMPARE');
    } else if (tab === 'ABOUT') {
      setCurrentView('ABOUT');
    } else if (tab === 'CONTACT') {
      setCurrentView('CONTACT');
    } else if (tab === 'SELLER') {
      setCurrentView('SELLER_DASHBOARD');
    } else if (tab === 'ADMIN') {
      setCurrentView('ADMIN');
      if (subTab) {
        setAdminSubTab(subTab);
      }
    } else if (tab === 'PROFILE') {
      setCurrentView('PROFILE');
    } else if (tab === 'HELP') {
      setCurrentView('HELP');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentTab: AppNavTab = (() => {
    if (currentView === 'LISTINGS') return 'PROPERTIES';
    if (currentView === 'COMPARE') return 'COMPARE';
    if (currentView === 'ABOUT') return 'ABOUT';
    if (currentView === 'CONTACT') return 'CONTACT';
    if (currentView === 'SELLER_DASHBOARD') return 'SELLER';
    if (currentView === 'ADMIN') return 'ADMIN';
    if (currentView === 'PROFILE') return 'PROFILE';
    if (currentView === 'HELP') return 'HELP';
    return 'HOME';
  })();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#14a800] selection:text-white text-right w-full max-w-full overflow-x-hidden relative">
      
      {/* Combined Sticky Top Navigation Container */}
      <div className="sticky top-0 z-40 w-full bg-white shadow-2xs">
        {/* Top QA Persona Switcher & UAT Bar */}
        <PersonaSwitcher 
          onOpenUAT={() => setIsUATSuiteOpen(true)} 
          onNavigateToAdmin={(subTab) => handleNavigate('ADMIN', subTab)}
          onNavigateToSeller={() => handleNavigate('SELLER')}
        />

        {/* Main App Navigation Bar */}
        <Header
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onOpenAddProperty={handleOpenAddProperty}
          onOpenLegal={(type) => {
            if (type === 'ABOUT') {
              setCurrentView('ABOUT');
            } else {
              setLegalModalType(type);
            }
          }}
        />
      </div>

      {/* Main Content Body */}
      <main className="flex-1 pb-20 md:pb-0 w-full max-w-full overflow-x-hidden">
        
        {/* VIEW: HOME */}
        {currentView === 'HOME' && (
          <div>
            {/* Hero Search Section */}
            <HeroSection
              onSearch={(filters) => {
                setSearchFilters(filters);
                setCurrentView('LISTINGS');
              }}
              onExploreAll={() => {
                setSearchFilters({});
                setCurrentView('LISTINGS');
              }}
            />

            {/* Value Proposition Highlights */}
            <section className="py-10 sm:py-14 bg-white border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-right">
                  
                  <div className="p-5 sm:p-6 rounded-3xl bg-[#f2f7f2] border border-[#14a800]/20 flex items-start gap-4 shadow-2xs">
                    <div className="p-3 bg-[#14a800] text-white rounded-2xl shrink-0 shadow-md shadow-[#14a800]/20">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-black text-[#001e00]">حماية وسرية تامة لبيانات المالك</h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        لا ننشر رقم هاتفك أو عنوانك الدقيق أبداً على الإنترنت. تتم جميع المعاينات والاتصالات عبر فريق روابط الرسمي.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-start gap-4 shadow-2xs">
                    <div className="p-3 bg-[#001e00] text-white rounded-2xl shrink-0 shadow-md">
                      <CheckCircle2 className="w-6 h-6 text-[#14a800]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-black text-[#001e00]">عقارات مفحوصة ومراجعة بدقة</h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        كل عقار يخضع لطابور مراجعة هندسي وقانوني قبل النشر للتحقق من سلامة الأوراق والمواصفات الواقعية.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 rounded-3xl bg-[#f2f7f2] border border-[#14a800]/20 flex items-start gap-4 shadow-2xs">
                    <div className="p-3 bg-[#001e00] text-white rounded-2xl shrink-0 shadow-md">
                      <PhoneCall className="w-6 h-6 text-[#14a800]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-black text-[#001e00]">معاينات ميدانية منظمة</h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        فريق مبيعات متخصص يرافق المشترين والمهتمين بالمعاينة الميدانية ويضمن جدية الأطراف في كفر الشيخ.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Featured Properties Section */}
            <section className="py-10 sm:py-14 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#001e00]">أحدث العقارات المعتمدة في كفر الشيخ</h2>
                    <p className="text-xs text-slate-500 font-bold mt-1">
                      شقق، فيلات، أراضي، ومحلات تجارية معتمدة ومفحوصة بواسطة فريق روابط
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSearchFilters({});
                      setCurrentView('LISTINGS');
                    }}
                    className="hidden sm:flex items-center gap-2 text-xs font-black text-[#14a800] hover:text-[#108a00] transition cursor-pointer"
                  >
                    <span>عرض كافة العقارات ({publishedProperties.length})</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Property Cards in Home */}
                <PropertyListingView hideHeader={true} onSelectProperty={(p) => setSelectedProperty(p)} />
              </div>
            </section>

            {/* Seller CTA Banner */}
            <section className="py-12 sm:py-16 bg-[#001e00] text-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-right">
                <div className="space-y-3 max-w-xl">
                  <span className="text-xs font-black text-[#14a800] bg-[#002f00] px-3 py-1 rounded-full border border-[#14a800]/30 inline-block">
                    خدمة أصحاب العقارات والوسطاء
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black leading-snug">
                    هل لديك عقار تريد بيعه أو تأجيره بأعلى سعر وبدون إزعاج؟
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                    أضف عقارك الآن في دقائق، وسيتم فحصه ومراجعته وتسويقه للمشترين الجادين دون كشف بياناتك الشخصية على الملأ.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={handleOpenAddProperty}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-black rounded-2xl transition shadow-xl shadow-[#14a800]/25 flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    <Building2 className="w-5 h-5 text-white" />
                    <span>أضف عقارك الآن مجاناً</span>
                  </button>

                  <a
                    href={`tel:${settings.primary_phone}`}
                    className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-black rounded-2xl transition border border-white/20 flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
                  >
                    <PhoneCall className="w-5 h-5 text-[#14a800]" />
                    <span>الخط الساخن: {settings.primary_phone}</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW: LISTINGS */}
        {currentView === 'LISTINGS' && (
          <div className="w-full">
            <PropertyListingView 
              initialFilters={searchFilters}
              onSelectProperty={(p) => setSelectedProperty(p)} 
            />
          </div>
        )}

        {/* VIEW: COMPARE */}
        {currentView === 'COMPARE' && (
          <div className="w-full">
            <PropertyComparisonView 
              onSelectProperty={(p) => setSelectedProperty(p)}
              onExploreListings={() => setCurrentView('LISTINGS')}
            />
          </div>
        )}

        {/* VIEW: ABOUT US */}
        {currentView === 'ABOUT' && (
          <div className="w-full">
            <AboutUsView 
              onExploreProperties={() => setCurrentView('LISTINGS')}
              onContactUs={() => setCurrentView('CONTACT')}
            />
          </div>
        )}

        {/* VIEW: CONTACT US */}
        {currentView === 'CONTACT' && (
          <div className="w-full">
            <ContactUsView 
              onExploreProperties={() => setCurrentView('LISTINGS')}
            />
          </div>
        )}

        {/* VIEW: SELLER DASHBOARD */}
        {currentView === 'SELLER_DASHBOARD' && (
          <SellerDashboard
            onSelectProperty={(p) => setSelectedProperty(p)}
            onOpenNewPropertyWizard={() => setIsWizardOpen(true)}
          />
        )}

        {/* VIEW: ADMIN BACKOFFICE */}
        {currentView === 'ADMIN' && (
          <AdminLayout 
            initialTab={adminSubTab} 
            onSelectProperty={(p) => setSelectedProperty(p)}
            onOpenNewPropertyWizard={() => setIsWizardOpen(true)}
          />
        )}

        {/* VIEW: PROFILE */}
        {currentView === 'PROFILE' && (
          <CustomerProfileView
            onSelectProperty={(p) => setSelectedProperty(p)}
            onNavigateToSeller={() => setCurrentView('SELLER_DASHBOARD')}
          />
        )}

        {/* VIEW: HELP GUIDE */}
        {currentView === 'HELP' && (
          <HelpGuideView
            onOpenAddProperty={handleOpenAddProperty}
          />
        )}

      </main>

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate}
        onOpenLegal={(type) => {
          if (type === 'ABOUT') {
            setCurrentView('ABOUT');
          } else {
            setLegalModalType(type);
          }
        }} 
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenAddProperty={handleOpenAddProperty}
      />

      {/* Persistent Floating Add Property Button (Right-aligned on mobile and desktop) */}
      <FloatingAddPropertyButton 
        onClick={handleOpenAddProperty} 
      />

      {/* Universal Property Details Modal */}
      <PropertyDetailsModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onFilterByTag={(filterType, value) => {
          setSearchFilters({ [filterType]: value });
          setCurrentView('LISTINGS');
          setSelectedProperty(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Auth Modal (Login / Register / OTP) */}
      <AuthModal />

      {/* Property Creation & Revision Wizard Modal */}
      <PropertyWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />

      {/* Legal & Policy Modal */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* UAT Verification Suite Modal (15 Scenarios) */}
      <UATVerificationSuite
        isOpen={isUATSuiteOpen}
        onClose={() => setIsUATSuiteOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
