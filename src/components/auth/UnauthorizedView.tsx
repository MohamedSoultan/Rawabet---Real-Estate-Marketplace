import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  LogIn, 
  Home, 
  UserCheck, 
  AlertTriangle
} from 'lucide-react';
import { UserRole } from '../../types';

interface UnauthorizedViewProps {
  requiredRoleLabel?: string;
  onNavigateHome: () => void;
  onNavigateAllowedDashboard?: () => void;
  onOpenLogin: () => void;
}

export const UnauthorizedView: React.FC<UnauthorizedViewProps> = ({
  requiredRoleLabel = 'إدارة النظام أو العمليات المصرحة',
  onNavigateHome,
  onNavigateAllowedDashboard,
  onOpenLogin
}) => {
  const { currentUser } = useApp();

  const roleNameMap: Record<UserRole, { label: string; badgeColor: string }> = {
    SUPER_ADMIN: { label: 'مدير النظام الأعلى (Super Admin)', badgeColor: 'bg-purple-100 text-purple-900 border-purple-200' },
    PROPERTY_REVIEWER: { label: 'مراجع هندسي وعقاري (Reviewer)', badgeColor: 'bg-blue-100 text-blue-900 border-blue-200' },
    SALES_USER: { label: 'مسؤول مبيعات ومعاينات (Sales CRM)', badgeColor: 'bg-amber-100 text-amber-900 border-amber-200' },
    OPERATIONS_MANAGER: { label: 'مدير العمليات المركزية (Operations)', badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
    CONTENT_MANAGER: { label: 'مدير المحتوى والتصنيفات (Content)', badgeColor: 'bg-teal-100 text-teal-900 border-teal-200' },
    CUSTOMER: { 
      label: currentUser?.seller_profile ? (currentUser.seller_profile.seller_type === 'BROKER' ? 'وسيط عقاري معتمد' : 'مالك عقار موثق') : 'عميل مشتري',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200' 
    }
  };

  const currentRoleInfo = currentUser ? roleNameMap[currentUser.role] : null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 text-right font-sans">
      <div className="max-w-xl w-full bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-slate-900 p-6 text-white text-center relative border-b border-slate-800">
          <div className="w-14 h-14 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto mb-3 text-rose-400">
            <Lock className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            غير مصرح لك بالوصول إلى هذه الصفحة
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            You do not have permission to access this page
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Status Message */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4.5 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>سبب تقييد الوصول:</span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentUser ? (
                <>
                  أنت مسجل حالياً بحساب: <strong className="text-slate-900 font-bold">{currentUser.name}</strong>.
                  <br />
                  الدور النشط لحسابك هو: 
                  <span className={`inline-block mr-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentRoleInfo?.badgeColor}`}>
                    {currentRoleInfo?.label}
                  </span>
                  . لا يمتلك هذا الدور الصلاحيات الكافية للوصول إلى: <strong className="text-slate-900">{requiredRoleLabel}</strong>.
                </>
              ) : (
                'هذه الصفحة محمية بنظام الصلاحيات (RBAC) ومخصصة للحسابات المصرحة فقط. يرجى تسجيل الدخول بحساب معتمد للوصول.'
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {currentUser && onNavigateAllowedDashboard && (
              <button
                type="button"
                onClick={onNavigateAllowedDashboard}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#14a800] hover:bg-[#108a00] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>الذهاب إلى لوحتي المصرحة</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenLogin}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl border-2 border-[#001e00] text-[#001e00] hover:bg-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-slate-700" />
              <span>{currentUser ? 'تسجيل الدخول بحساب آخر' : 'تسجيل الدخول الآن'}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateHome}
              className="w-full sm:w-auto py-3 px-4 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Home className="w-4 h-4 text-slate-400" />
              <span>الرئيسية</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
