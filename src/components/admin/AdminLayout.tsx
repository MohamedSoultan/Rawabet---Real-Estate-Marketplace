import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ReviewQueueView } from './ReviewQueueView';
import { LeadsCRMView } from './LeadsCRMView';
import { UsersAndRolesView } from './UsersAndRolesView';
import { SellerVerificationView } from './SellerVerificationView';
import { LocationsAndTaxonomyView } from './LocationsAndTaxonomyView';
import { AuditLogsView } from './AuditLogsView';
import { SystemSettingsView } from './SystemSettingsView';
import { SellerDashboard } from '../seller/SellerDashboard';
import { Property, UserRole } from '../../types';
import { 
  ClipboardCheck, 
  Headphones, 
  BadgeCheck, 
  MapPin, 
  Users, 
  FileSearch, 
  Settings, 
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  Heart,
  Calendar,
  Building2,
  ArrowRight,
  Shield,
  ChevronDown,
  UserCheck
} from 'lucide-react';

interface AdminLayoutProps {
  initialTab?: 'QUEUE' | 'LEADS' | 'USERS' | 'VERIFICATIONS' | 'LOCATIONS' | 'AUDIT' | 'SETTINGS' | 'SELLER_VIEW' | 'CUSTOMER_VIEW';
  onSelectProperty?: (property: Property) => void;
  onOpenNewPropertyWizard?: () => void;
  onTabChange?: (tab: AdminTabKey) => void;
}

type AdminTabKey = 'QUEUE' | 'LEADS' | 'USERS' | 'VERIFICATIONS' | 'LOCATIONS' | 'AUDIT' | 'SETTINGS' | 'SELLER_VIEW' | 'CUSTOMER_VIEW';

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  initialTab = 'QUEUE',
  onSelectProperty,
  onOpenNewPropertyWizard,
  onTabChange
}) => {
  const { 
    currentUser, 
    properties, 
    leads, 
    users, 
    hasPermission, 
    favorites
  } = useApp();

  const isInternalStaff = currentUser && [
    'SUPER_ADMIN', 
    'PROPERTY_REVIEWER', 
    'SALES_USER', 
    'OPERATIONS_MANAGER', 
    'CONTENT_MANAGER'
  ].includes(currentUser.role);

  const pendingCount = properties.filter(p => p.current_status === 'PENDING_REVIEW' || p.current_status === 'PENDING_REVISION').length;
  const newLeadsCount = leads.filter(l => l.status === 'NEW').length;
  const pendingVerificationsCount = users.filter(u => u.seller_profile?.verification_status === 'PENDING').length;
  const isSeller = currentUser && currentUser.seller_profile;

  // Build list of all available tabs filtered by strict RBAC permissions
  const authorizedTabs = useMemo(() => {
    const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

    // Permission criteria for each tab
    const canAccessQueue = isSuperAdmin || 
      currentUser?.role === 'PROPERTY_REVIEWER' || 
      currentUser?.role === 'OPERATIONS_MANAGER' || 
      hasPermission('PERM_APPROVE_PROPERTIES') || 
      hasPermission('property.view_pending');

    const canAccessLeads = isSuperAdmin || 
      currentUser?.role === 'SALES_USER' || 
      currentUser?.role === 'OPERATIONS_MANAGER' || 
      hasPermission('PERM_MANAGE_LEADS') || 
      hasPermission('lead.view');

    const canAccessVerifications = isSuperAdmin || 
      currentUser?.role === 'PROPERTY_REVIEWER' || 
      currentUser?.role === 'OPERATIONS_MANAGER' || 
      hasPermission('PERM_VERIFY_SELLERS') || 
      hasPermission('seller.verify');

    const canAccessLocations = isSuperAdmin || 
      currentUser?.role === 'CONTENT_MANAGER' || 
      currentUser?.role === 'OPERATIONS_MANAGER' || 
      hasPermission('PERM_MANAGE_LOCATIONS') ||
      hasPermission('PERM_MANAGE_TAXONOMY') ||
      hasPermission('locations.manage');

    const canAccessUsers = isSuperAdmin || 
      hasPermission('PERM_MANAGE_USERS') ||
      hasPermission('users.manage');

    const canAccessAudit = isSuperAdmin || 
      currentUser?.role === 'OPERATIONS_MANAGER' || 
      hasPermission('PERM_VIEW_AUDIT_LOGS') ||
      hasPermission('audit.view');

    const canAccessSettings = isSuperAdmin || 
      currentUser?.role === 'CONTENT_MANAGER' ||
      hasPermission('PERM_MANAGE_SYSTEM_SETTINGS') ||
      hasPermission('PERM_MANAGE_SETTINGS') ||
      hasPermission('settings.manage');

    const canAccessSellerView = isSuperAdmin || (currentUser?.role === 'CUSTOMER' && !!currentUser?.seller_profile);
    const canAccessCustomerView = isSuperAdmin || currentUser?.role === 'CUSTOMER' || !isInternalStaff;

    const allTabs: {
      id: AdminTabKey;
      label: string;
      icon: React.ReactNode;
      badge?: number;
      description: string;
      allowed: boolean;
    }[] = [
      {
        id: 'QUEUE',
        label: 'طابور المراجعة',
        icon: <ClipboardCheck className="w-4 h-4" />,
        badge: pendingCount,
        description: 'مراجعة وتدقيق إعلانات العقارات الجديدة قبل النشر',
        allowed: canAccessQueue
      },
      {
        id: 'LEADS',
        label: 'طلبات المعاينة (CRM)',
        icon: <Headphones className="w-4 h-4" />,
        badge: newLeadsCount,
        description: 'متابعة العملاء والاتصالات ومواعيد المعاينات الميدانية',
        allowed: canAccessLeads
      },
      {
        id: 'VERIFICATIONS',
        label: 'توثيق البائعين',
        icon: <BadgeCheck className="w-4 h-4" />,
        badge: pendingVerificationsCount,
        description: 'فحص وتوثيق حسابات الملاك والمكاتب والوسطاء العقاريين',
        allowed: canAccessVerifications
      },
      {
        id: 'LOCATIONS',
        label: 'المواقع والتصنيفات',
        icon: <MapPin className="w-4 h-4" />,
        description: 'إدارة المحافظات والمدن والمناطق وأنواع العقارات',
        allowed: canAccessLocations
      },
      {
        id: 'USERS',
        label: 'المستخدمين والأدوار (RBAC)',
        icon: <Users className="w-4 h-4" />,
        description: 'إدارة حسابات فريق العمل وتعيين الصلاحيات الدقيقة',
        allowed: canAccessUsers
      },
      {
        id: 'AUDIT',
        label: 'سجل التدقيق',
        icon: <FileSearch className="w-4 h-4" />,
        description: 'سجل تتبع كافة العمليات الإدارية الحساسة والتغييرات',
        allowed: canAccessAudit
      },
      {
        id: 'SETTINGS',
        label: 'إعدادات المنصة',
        icon: <Settings className="w-4 h-4" />,
        description: 'أرقام الاتصال الرسمية والشروط والإعدادات العامة',
        allowed: canAccessSettings
      },
      {
        id: 'SELLER_VIEW',
        label: 'عقاراتي وإدارتها',
        icon: <Layers className="w-4 h-4" />,
        description: 'إدارة وتحديث عقاراتك وطلبات المراجعة ونظام النسخ (Revisions)',
        allowed: canAccessSellerView
      },
      {
        id: 'CUSTOMER_VIEW',
        label: 'طلباتي والمفضلة',
        icon: <UserCheck className="w-4 h-4" />,
        description: 'متابعة المعاينات، المفضلة، وسجل التواصل',
        allowed: canAccessCustomerView
      }
    ];

    // Filter strictly to allowed tabs for the current authenticated user
    return allTabs.filter(t => t.allowed);
  }, [currentUser, hasPermission, pendingCount, newLeadsCount, pendingVerificationsCount, isInternalStaff]);

  const [activeTab, setActiveTab] = useState<AdminTabKey>(() => {
    if (authorizedTabs.some(t => t.id === initialTab)) {
      return initialTab;
    }
    return authorizedTabs[0]?.id || (isInternalStaff ? 'QUEUE' : 'SELLER_VIEW');
  });

  const prevInitialTabRef = React.useRef(initialTab);

  // Sync ONLY when external initialTab prop actually changes
  useEffect(() => {
    if (prevInitialTabRef.current !== initialTab) {
      prevInitialTabRef.current = initialTab;
      if (initialTab && authorizedTabs.some(t => t.id === initialTab)) {
        setActiveTab(initialTab);
      }
    } else if (authorizedTabs.length > 0 && !authorizedTabs.some(t => t.id === activeTab)) {
      setActiveTab(authorizedTabs[0].id);
    }
  }, [initialTab, authorizedTabs, activeTab]);

  const handleTabClick = (tabId: AdminTabKey) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };


  const activeTabMeta = authorizedTabs.find(t => t.id === activeTab);

  // Role Humanized Presentation
  const roleNameMap: Record<string, string> = {
    SUPER_ADMIN: 'مدير النظام الأعلى (Super Admin)',
    PROPERTY_REVIEWER: 'مراجع ومقيّم عقاري (Reviewer)',
    SALES_USER: 'مسؤول مبيعات ومعاينات (Sales CRM)',
    OPERATIONS_MANAGER: 'مدير العمليات الميدانية (Operations)',
    CONTENT_MANAGER: 'مدير المحتوى والتصنيفات (Content)',
    CUSTOMER: isSeller ? 'مالك / وسيط عقاري' : 'عميل / مشتري'
  };

  const roleBadge = currentUser ? (roleNameMap[currentUser.role] || currentUser.role) : 'زائر عام';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 text-right font-sans">
      
      {/* Top Header Card with Smart Role Context (Upwork Style) */}
      <div className="bg-[#001e00] text-white rounded-xl p-5 sm:p-7 border border-[#003a00] shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#14a800]/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#14a800] animate-pulse"></span>
              <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight font-display">
                {isInternalStaff ? 'لوحة الإدارة والعمليات المركزية' : 'لوحة التحكم وإدارة الحساب'}
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#002f00] text-[#14a800] border border-[#14a800]/30 hidden sm:inline-block">
                {isInternalStaff ? 'مساحة العمل المصرحة' : 'لوحة المستخدم'}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-semibold pt-0.5">
              <span>المستخدم: <strong className="text-white font-black">{currentUser?.name || 'زائر'}</strong></span>
              <span className="text-slate-600">•</span>
              <span>الدور النشط: <strong className="text-[#14a800] font-black">{roleBadge}</strong></span>
              {currentUser?.role === 'SUPER_ADMIN' ? (
                <span className="text-[10.5px] bg-purple-900/60 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded-md font-bold">
                  صلاحيات كاملة غير مقيدة
                </span>
              ) : (
                <span className="text-[10.5px] bg-[#002f00] text-emerald-200 border border-[#14a800]/30 px-2 py-0.5 rounded-md font-bold">
                  {authorizedTabs.length} أقسام متاحة
                </span>
              )}
            </div>
          </div>

          {/* Quick Staff KPI Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            {pendingCount > 0 && (hasPermission('PERM_APPROVE_PROPERTIES') || currentUser?.role === 'SUPER_ADMIN') && (
              <button
                onClick={() => handleTabClick('QUEUE')}
                className="px-3.5 py-2 rounded-full bg-[#002f00] hover:bg-[#003d00] text-emerald-200 border border-[#14a800]/40 flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#14a800] animate-ping"></span>
                <span>{pendingCount} عقار بانتظار المراجعة</span>
              </button>
            )}

            {newLeadsCount > 0 && (hasPermission('PERM_MANAGE_LEADS') || currentUser?.role === 'SUPER_ADMIN') && (
              <button
                onClick={() => handleTabClick('LEADS')}
                className="px-3.5 py-2 rounded-full bg-[#002f00] hover:bg-[#003d00] text-emerald-200 border border-[#14a800]/40 flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#14a800]"></span>
                <span>{newLeadsCount} طلبات معاينة جديدة</span>
              </button>
            )}

            {pendingVerificationsCount > 0 && (hasPermission('PERM_VERIFY_SELLERS') || currentUser?.role === 'SUPER_ADMIN') && (
              <button
                onClick={() => handleTabClick('VERIFICATIONS')}
                className="px-3.5 py-2 rounded-full bg-[#002f00] hover:bg-[#003d00] text-amber-300 border border-amber-500/40 flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <span>{pendingVerificationsCount} طلبات توثيق</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="space-y-2">
        <div className="bg-white rounded-xl p-1.5 border border-[#e4ebe4] shadow-2xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {authorizedTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                  isActive 
                    ? 'bg-[#14a800] text-white shadow-xs scale-[1.01]' 
                    : 'text-slate-700 hover:bg-[#f2f7f2] hover:text-[#001e00]'
                }`}
                title={tab.description}
              >
                <span className={isActive ? 'text-white' : 'text-slate-500'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                    isActive ? 'bg-white text-[#14a800]' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab Subtitle Info */}
        {activeTabMeta && (
          <div className="px-2 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>{activeTabMeta.description}</span>
            <span className="text-[11px] text-slate-400">
              القسم النشط: <strong className="text-slate-700 font-bold">{activeTabMeta.label}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {/* Staff Operational Panels */}
        {activeTab === 'QUEUE' && <ReviewQueueView />}
        {activeTab === 'LEADS' && <LeadsCRMView />}
        {activeTab === 'VERIFICATIONS' && <SellerVerificationView />}
        {activeTab === 'LOCATIONS' && <LocationsAndTaxonomyView />}
        {activeTab === 'USERS' && <UsersAndRolesView />}
        {activeTab === 'AUDIT' && <AuditLogsView />}
        {activeTab === 'SETTINGS' && <SystemSettingsView />}

        {/* Seller & Customer Views */}
        {activeTab === 'SELLER_VIEW' && (
          <SellerDashboard 
            onSelectProperty={onSelectProperty || (() => {})} 
            onOpenNewPropertyWizard={onOpenNewPropertyWizard || (() => {})} 
          />
        )}

        {activeTab === 'CUSTOMER_VIEW' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-[#e4ebe4] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#001e00]">طلبات المعاينة والمحادثات المفتوحة</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    متابعة حالة العقارات التي طلبت معاينتها والتواصل مع مستشاري روابط
                  </p>
                </div>
                <span className="px-3 py-1 bg-[#f2f7f2] text-[#14a800] text-xs font-bold rounded-full border border-[#14a800]/20">
                  {leads.filter(l => l.customer_id === currentUser?.id).length} طلبات
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {leads.filter(l => l.customer_id === currentUser?.id).length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 font-semibold space-y-2">
                    <p>لم تقم بإرسال أي طلبات معاينة حتى الآن.</p>
                    <p className="text-slate-400">تصفح العقارات واضغط "حجز معاينة" لبدء التنسيق المباشر.</p>
                  </div>
                ) : (
                  leads.filter(l => l.customer_id === currentUser?.id).map(lead => {
                    const prop = properties.find(p => p.id === lead.property_id);
                    const ver = prop?.versions[0];
                    return (
                      <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-[#001e00]">{ver?.title || 'عقار بروابط'}</h4>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>كود: {prop?.reference_number}</span>
                            <span>•</span>
                            <span>{new Date(lead.created_at).toLocaleDateString('ar-EG')}</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-[#f2f7f2] text-[#14a800] text-xs font-bold rounded-full border border-[#14a800]/20">
                          {lead.status === 'NEW' ? 'طلب جديد قيد التنسيق' : 'جاري المتابعة'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Favorite Properties Box */}
            <div className="bg-white rounded-xl p-6 border border-[#e4ebe4] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#001e00]">العقارات المحفوظة في المفضلة</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    الوصول السريع للعقارات التي أضفتها لقائمة اهتماماتك
                  </p>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                  {favorites.length} عقارات
                </span>
              </div>

              {favorites.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500 font-semibold">
                  لا توجد عقارات في المفضلة بعد.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {favorites.map(fav => {
                    const prop = properties.find(p => p.id === fav.property_id);
                    if (!prop) return null;
                    const ver = prop.versions[0];
                    return (
                      <div 
                        key={fav.id} 
                        onClick={() => onSelectProperty?.(prop)}
                        className="p-3.5 rounded-lg bg-[#f9f9f9] border border-[#e4ebe4] hover:border-[#14a800] transition cursor-pointer space-y-1.5"
                      >
                        <h5 className="text-xs font-bold text-[#001e00] line-clamp-1">{ver.title}</h5>
                        <div className="text-[11px] text-[#14a800] font-black">{ver.price.toLocaleString('ar-EG')} جنيه</div>
                        <div className="text-[10px] text-slate-400 font-bold">كود: {prop.reference_number}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
