import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { PermissionKey, hasPermission, hasAnyPermission } from './permissions';
import { ShieldAlert, LogIn, Home, Lock } from 'lucide-react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAuth?: boolean;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: PermissionKey | PermissionKey[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredAuth = true,
  requiredRole,
  requiredPermission,
  fallbackPath = '/',
}) => {
  const navigate = useNavigate();
  const { currentUser, openAuthModal } = useApp();

  // 1. Authentication Check
  if (requiredAuth && !currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in duration-300 font-sans" dir="rtl">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 shadow-xs">
          <Lock className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#001e00]">يرجى تسجيل الدخول أولاً</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-medium">
            هذه الصفحة محمية وتتطلب تسجيل الدخول للوصول إلى لوحة التحكم والبيانات الخاصة بها.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => openAuthModal('LOGIN')}
            className="px-6 py-3 bg-[#14a800] hover:bg-[#108a00] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(fallbackPath)}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Role Check
  if (requiredRole && currentUser) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRole = currentUser.role === 'SUPER_ADMIN' || roles.includes(currentUser.role);
    
    if (!hasRole) {
      return (
        <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in duration-300 font-sans" dir="rtl">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#001e00]">غير مصرح بالدخول (403)</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-medium">
              حسابك الحالي لا يمتلك الدور المطلوب للوصول إلى هذا القسم من المنصة.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(fallbackPath)}
              className="px-6 py-3 bg-[#14a800] hover:bg-[#108a00] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>العودة للرئيسية</span>
            </button>
          </div>
        </div>
      );
    }
  }

  // 3. Permission Check
  if (requiredPermission && currentUser) {
    const perms = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    const allowed = currentUser.role === 'SUPER_ADMIN' || hasAnyPermission(currentUser, perms);

    if (!allowed) {
      return (
        <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in duration-300 font-sans" dir="rtl">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#001e00]">صلاحيات غير كافية</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-medium">
              يتطلب تنفيذ هذا الإجراء أو عرض هذا المورد صلاحيات أمان إضافية تم تقييدها من قِبل إدارة المنصة.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(fallbackPath)}
              className="px-6 py-3 bg-[#14a800] hover:bg-[#108a00] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>العودة للرئيسية</span>
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
