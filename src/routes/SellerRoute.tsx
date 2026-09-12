import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SellerDashboard } from '../components/seller/SellerDashboard';
import { Property } from '../types';
import { ShieldAlert, LogIn, Home } from 'lucide-react';

interface OutletContextType {
  setPreviewProperty: (property: Property | null) => void;
  handleOpenAddProperty: () => void;
}

export const SellerRoute: React.FC = () => {
  const navigate = useNavigate();
  const { setPreviewProperty, handleOpenAddProperty } = useOutletContext<OutletContextType>();
  const { currentUser, openAuthModal } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-soft-fade">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#001e00]">سجل دخولك عشان تتابع عقاراتك</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            من هنا تقدر تدير كل عقاراتك المعروضة للبيع أو الإيجار، وتتابع طلبات المعاينة وتعدل الأسعار بسهولة.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openAuthModal('LOGIN')}
            className="px-6 py-3 bg-[#14a800] hover:bg-[#108a00] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول / حساب جديد</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-soft-fade">
      <SellerDashboard
        onSelectProperty={(property) => setPreviewProperty(property)}
        onOpenNewPropertyWizard={handleOpenAddProperty}
      />
    </div>
  );
};
