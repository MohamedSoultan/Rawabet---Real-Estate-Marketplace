import React from 'react';
import { useApp } from '../../context/AppContext';
import { OperationsWorkspace } from './operations/OperationsWorkspace';
import { SalesWorkspace } from './sales/SalesWorkspace';
import { SuperAdminWorkspace } from './superadmin/SuperAdminWorkspace';
import { Property } from '../../types';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Globe, 
  LogOut, 
  ChevronDown,
  Layers,
  Sparkles,
  Lock,
  Headphones,
  Sliders
} from 'lucide-react';

export type InternalWorkspaceType = 'OPERATIONS' | 'SALES' | 'SUPER_ADMIN';

interface InternalPortalLayoutProps {
  currentWorkspace: InternalWorkspaceType;
  onWorkspaceChange: (workspace: InternalWorkspaceType) => void;
  onExitToPublic: () => void;
  onSelectProperty?: (property: Property) => void;
}

export const InternalPortalLayout: React.FC<InternalPortalLayoutProps> = ({
  currentWorkspace,
  onWorkspaceChange,
  onExitToPublic,
  onSelectProperty
}) => {
  const { currentUser, logout, properties, leads, users } = useApp();

  // Role permissions checking (Phase 9)
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  
  const canAccessOperations = isSuperAdmin || 
    currentUser?.role === 'OPERATIONS_MANAGER' || 
    currentUser?.role === 'PROPERTY_REVIEWER';

  const canAccessSales = isSuperAdmin || 
    currentUser?.role === 'SALES_USER' || 
    currentUser?.role === 'OPERATIONS_MANAGER';

  const canAccessSuperAdmin = isSuperAdmin;

  // Counts for badge notifications
  const pendingCount = properties.filter(p => 
    p.current_status === 'PENDING_REVIEW' || 
    p.current_status === 'UNDER_REVIEW' || 
    p.current_status === 'PENDING_REVISION'
  ).length;

  const newLeadsCount = leads.filter(l => 
    l.status === 'NEW' || 
    l.status === 'WHATSAPP_CONTACT_INITIATED' || 
    l.status === 'CALL_CONTACT_INITIATED'
  ).length;

  const roleDisplayNames: Record<string, string> = {
    SUPER_ADMIN: 'مدير النظام الشامل',
    OPERATIONS_MANAGER: 'مدير العمليات',
    PROPERTY_REVIEWER: 'مراجع ومراجع عقارات',
    SALES_USER: 'مسؤول مبيعات وعلاقات عملاء',
    CONTENT_MANAGER: 'مدير المحتوى',
    BROKER: 'وسيط عقاري',
    OWNER: 'مالك عقار',
    CUSTOMER: 'عميل'
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-right" dir="rtl">
      
      {/* Top Professional SaaS Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 z-index-50 shadow-md" style={{ zIndex: 50 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-xs shadow-emerald-500/20">
                ر
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black tracking-tight text-white">روابط</span>
                  <span className="text-[10px] uppercase font-black tracking-wider bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                    Operations Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">بوابة إدارة العمليات والمبيعات</p>
              </div>
            </div>

            {/* Breadcrumb / Workspace Switcher for authorized multi-role users */}
            <div className="hidden md:flex items-center gap-1 mr-6 border-r border-slate-800 pr-6">
              {canAccessOperations && (
                <button
                  type="button"
                  onClick={() => onWorkspaceChange('OPERATIONS')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentWorkspace === 'OPERATIONS'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>العمليات والعقارات</span>
                  {pendingCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                      {pendingCount}
                    </span>
                  )}
                </button>
              )}

              {canAccessSales && (
                <button
                  type="button"
                  onClick={() => onWorkspaceChange('SALES')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentWorkspace === 'SALES'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>المبيعات والعملاء (CRM)</span>
                  {newLeadsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
                      {newLeadsCount}
                    </span>
                  )}
                </button>
              )}

              {canAccessSuperAdmin && (
                <button
                  type="button"
                  onClick={() => onWorkspaceChange('SUPER_ADMIN')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentWorkspace === 'SUPER_ADMIN'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>الإدارة العامة للنظام</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Action: User profile pill & Return to public */}
          <div className="flex items-center gap-3">
            
            {/* User Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {currentUser?.name?.[0] || 'U'}
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-200 block leading-tight">{currentUser?.name}</span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  {roleDisplayNames[currentUser?.role || ''] || currentUser?.role}
                </span>
              </div>
            </div>

            {/* Exit to Public Portal */}
            <button
              type="button"
              onClick={onExitToPublic}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700 cursor-pointer"
              title="العودة إلى الواجهة العامة للمنصة"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">عرض الموقع للجمهور</span>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800 px-2 py-1.5 bg-slate-950 text-xs">
          {canAccessOperations && (
            <button
              type="button"
              onClick={() => onWorkspaceChange('OPERATIONS')}
              className={`p-2 font-bold flex items-center gap-1 ${currentWorkspace === 'OPERATIONS' ? 'text-emerald-400' : 'text-slate-400'}`}
            >
              <Building2 className="w-4 h-4" />
              <span>العمليات</span>
            </button>
          )}

          {canAccessSales && (
            <button
              type="button"
              onClick={() => onWorkspaceChange('SALES')}
              className={`p-2 font-bold flex items-center gap-1 ${currentWorkspace === 'SALES' ? 'text-emerald-400' : 'text-slate-400'}`}
            >
              <Users className="w-4 h-4" />
              <span>المبيعات</span>
            </button>
          )}

          {canAccessSuperAdmin && (
            <button
              type="button"
              onClick={() => onWorkspaceChange('SUPER_ADMIN')}
              className={`p-2 font-bold flex items-center gap-1 ${currentWorkspace === 'SUPER_ADMIN' ? 'text-emerald-400' : 'text-slate-400'}`}
            >
              <Sliders className="w-4 h-4" />
              <span>الإدارة العامة</span>
            </button>
          )}
        </div>

      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Workspace Title & Breadcrumb header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentWorkspace === 'OPERATIONS' && 'لوحة العمليات وإدارة العقارات'}
              {currentWorkspace === 'SALES' && 'نظام المبيعات وإدارة علاقات العملاء (CRM)'}
              {currentWorkspace === 'SUPER_ADMIN' && 'لوحة التحكم والإشراف الشامل للنظام'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {currentWorkspace === 'OPERATIONS' && 'فحص وتدقيق العقارات الجديدة واعتمادها ونشرها للجمهور'}
              {currentWorkspace === 'SALES' && 'متابعة وتأهيل طلبات الشراء والإيجار والمعاينات الميدانية'}
              {currentWorkspace === 'SUPER_ADMIN' && 'إدارة المستخدمين والأدوار والسياسات والمناطق وسجل التدقيق'}
            </p>
          </div>
        </div>

        {/* Render Active Workspace */}
        <div className="animate-soft-fade">
          {currentWorkspace === 'OPERATIONS' && <OperationsWorkspace />}
          {currentWorkspace === 'SALES' && <SalesWorkspace onSelectProperty={onSelectProperty} />}
          {currentWorkspace === 'SUPER_ADMIN' && <SuperAdminWorkspace />}
        </div>

      </main>

    </div>
  );
};
