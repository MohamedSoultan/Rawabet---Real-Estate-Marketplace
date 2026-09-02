import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Search, 
  GitCompare, 
  Layers, 
  User, 
  ShieldCheck 
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'HOME' | 'PROPERTIES' | 'COMPARE' | 'ABOUT' | 'CONTACT' | 'SELLER' | 'ADMIN' | 'PROFILE' | 'HELP';
  onNavigate: (tab: 'HOME' | 'PROPERTIES' | 'COMPARE' | 'ABOUT' | 'CONTACT' | 'SELLER' | 'ADMIN' | 'PROFILE' | 'HELP', subTab?: 'QUEUE' | 'LEADS' | 'USERS' | 'VERIFICATIONS' | 'LOCATIONS' | 'AUDIT' | 'SETTINGS') => void;
  onOpenAddProperty?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onNavigate
}) => {
  const { currentUser, openAuthModal, compareIds } = useApp();

  const isInternalUser = currentUser && [
    'SUPER_ADMIN', 
    'PROPERTY_REVIEWER', 
    'SALES_USER', 
    'OPERATIONS_MANAGER', 
    'CONTENT_MANAGER'
  ].includes(currentUser.role);

  return (
    <nav 
      aria-label="شريط التنقل السفلي للهواتف" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg px-2 py-1.5 flex items-center justify-around safe-area-pb"
    >
      {/* 1. الرئيسية */}
      <button
        onClick={() => onNavigate('HOME')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition active:scale-95 ${
          currentTab === 'HOME' ? 'text-[#14a800]' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home className={`w-5 h-5 ${currentTab === 'HOME' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className={`text-[10px] mt-0.5 whitespace-nowrap ${currentTab === 'HOME' ? 'font-black text-[#14a800]' : 'font-bold'}`}>
          الرئيسية
        </span>
      </button>

      {/* 2. تصفح العقارات */}
      <button
        onClick={() => onNavigate('PROPERTIES')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition active:scale-95 ${
          currentTab === 'PROPERTIES' ? 'text-[#14a800]' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Search className={`w-5 h-5 ${currentTab === 'PROPERTIES' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className={`text-[10px] mt-0.5 whitespace-nowrap ${currentTab === 'PROPERTIES' ? 'font-black text-[#14a800]' : 'font-bold'}`}>
          العقارات
        </span>
      </button>

      {/* 3. المقارنة */}
      <button
        onClick={() => onNavigate('COMPARE')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition relative active:scale-95 ${
          currentTab === 'COMPARE' ? 'text-[#14a800]' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className="relative">
          <GitCompare className={`w-5 h-5 ${currentTab === 'COMPARE' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          {compareIds.length > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#14a800] text-white font-black text-[9px] flex items-center justify-center">
              {compareIds.length}
            </span>
          )}
        </div>
        <span className={`text-[10px] mt-0.5 whitespace-nowrap ${currentTab === 'COMPARE' ? 'font-black text-[#14a800]' : 'font-bold'}`}>
          المقارنة
        </span>
      </button>

      {/* 4. بوابة الملاك / الإدارة */}
      {isInternalUser ? (
        <button
          onClick={() => onNavigate('ADMIN', 'QUEUE')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition active:scale-95 ${
            currentTab === 'ADMIN' ? 'text-[#14a800]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className={`w-5 h-5 ${currentTab === 'ADMIN' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-0.5 whitespace-nowrap ${currentTab === 'ADMIN' ? 'font-black text-[#14a800]' : 'font-bold'}`}>
            الإدارة
          </span>
        </button>
      ) : (
        <button
          onClick={() => {
            if (!currentUser) {
              openAuthModal('REGISTER', () => onNavigate('SELLER'));
            } else {
              onNavigate('SELLER');
            }
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition active:scale-95 ${
            currentTab === 'SELLER' ? 'text-[#14a800]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className={`w-5 h-5 ${currentTab === 'SELLER' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-0.5 whitespace-nowrap ${currentTab === 'SELLER' ? 'font-black text-[#14a800]' : 'font-bold'}`}>
            عقاراتي
          </span>
        </button>
      )}

      {/* 5. حسابي / دخول */}
      {currentUser ? (
        <button
          onClick={() => onNavigate('PROFILE')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition active:scale-95 ${
            currentTab === 'PROFILE' ? 'text-[#14a800]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className={`w-5 h-5 ${currentTab === 'PROFILE' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-0.5 whitespace-nowrap ${currentTab === 'PROFILE' ? 'font-black text-[#14a800]' : 'font-bold'}`}>
            حسابي
          </span>
        </button>
      ) : (
        <button
          onClick={() => openAuthModal('LOGIN')}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-slate-800 transition active:scale-95"
        >
          <User className="w-5 h-5 stroke-2" />
          <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap">
            دخول
          </span>
        </button>
      )}
    </nav>
  );
};
