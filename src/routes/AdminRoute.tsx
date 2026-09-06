import React, { useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AdminLayout } from '../components/admin/AdminLayout';
import { Property } from '../types';
import { ShieldAlert, LogIn, Home } from 'lucide-react';

interface OutletContextType {
  setPreviewProperty: (property: Property | null) => void;
  handleOpenAddProperty: () => void;
}

type AdminTabKey = 'QUEUE' | 'LEADS' | 'USERS' | 'VERIFICATIONS' | 'LOCATIONS' | 'AUDIT' | 'SETTINGS';

export const AdminRoute: React.FC = () => {
  const { subtab } = useParams<{ subtab?: string }>();
  const navigate = useNavigate();
  const { setPreviewProperty, handleOpenAddProperty } = useOutletContext<OutletContextType>();
  const { currentUser, openAuthModal } = useApp();

  const isInternalStaff = currentUser && currentUser.role !== 'CUSTOMER';

  const currentTab: AdminTabKey = useMemo(() => {
    const raw = (subtab || '').toUpperCase();
    const validTabs: AdminTabKey[] = ['QUEUE', 'LEADS', 'USERS', 'VERIFICATIONS', 'LOCATIONS', 'AUDIT', 'SETTINGS'];
    if (validTabs.includes(raw as AdminTabKey)) {
      return raw as AdminTabKey;
    }
    return 'QUEUE';
  }, [subtab]);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-soft-fade">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#001e00]">يرجى تسجيل الدخول للوصول للإدارة</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            لوحة الإدارة والتحكم مخصصة لمسؤولي المراجعة وفريق المبيعات وإدارة النظام لمتابعة طابور الاعتماد والعملاء المحتملين.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openAuthModal('LOGIN')}
            className="px-6 py-3 bg-[#14a800] hover:bg-[#108a00] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول كمسؤول</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>
    );
  }

  if (!isInternalStaff) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-soft-fade">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#001e00]">غير مصرح بالوصول للإدارة</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            حسابك الحالي ({currentUser.name}) مسجل كحساب عميل. يتطلب الوصول للإدارة صلاحيات موظف مراجعة أو مبيعات أو مدير عام.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#14a800] hover:bg-[#108a00] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-soft-fade">
      <AdminLayout
        initialTab={currentTab}
        onTabChange={(tab) => {
          navigate(`/admin/${tab.toLowerCase()}`);
        }}
        onSelectProperty={(property) => setPreviewProperty(property)}
        onOpenNewPropertyWizard={handleOpenAddProperty}
      />
    </div>
  );
};
