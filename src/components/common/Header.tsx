import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { MobileDrawer } from './MobileDrawer';
import { 
  Building2, 
  Plus, 
  Bell, 
  User as UserIcon, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  PhoneCall, 
  Layers, 
  Heart,
  LayoutDashboard, 
  Menu, 
  FileText, 
  HelpCircle, 
  Info, 
  Shield, 
  Sparkles, 
  ChevronDown, 
  CheckCircle2, 
  GitCompare, 
  MessageSquare,
  Compass
} from 'lucide-react';

interface HeaderProps {
  currentTab?: 'HOME' | 'START' | 'PROPERTIES' | 'COMPARE' | 'ABOUT' | 'CONTACT' | 'SELLER' | 'ADMIN' | 'PROFILE' | 'HELP';
  onNavigate?: (tab: 'HOME' | 'START' | 'PROPERTIES' | 'COMPARE' | 'ABOUT' | 'CONTACT' | 'SELLER' | 'ADMIN' | 'PROFILE' | 'HELP', subTab?: 'QUEUE' | 'LEADS' | 'USERS' | 'VERIFICATIONS' | 'LOCATIONS' | 'AUDIT' | 'SETTINGS') => void;
  onOpenAddProperty?: () => void;
  onOpenLegal?: (type: 'PRIVACY' | 'TERMS' | 'ABOUT') => void;
  onFilterCategory?: (filters: { property_type_id?: string; transaction_type_id?: string }) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentTab = 'HOME', 
  onNavigate, 
  onOpenAddProperty,
  onOpenLegal,
  onFilterCategory
}) => {
  const { 
    currentUser, 
    settings, 
    notifications, 
    unreadNotificationsCount, 
    markAllNotificationsAsRead, 
    markNotificationAsRead, 
    openAuthModal, 
    logout,
    hasPermission,
    properties,
    compareIds
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Smart Header Scroll Effect for shadow state
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop);
      setIsScrolled(currentScrollY > 15);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close open dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(target)) {
        setShowMoreMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
        setShowUserMenu(false);
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isInternalUser = currentUser && [
    'SUPER_ADMIN', 
    'PROPERTY_REVIEWER', 
    'SALES_USER', 
    'OPERATIONS_MANAGER', 
    'CONTENT_MANAGER'
  ].includes(currentUser.role);

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const canManageUsers = isSuperAdmin || hasPermission('PERM_MANAGE_USERS');
  const isSeller = currentUser && currentUser.seller_profile;
  const isVerifiedSeller = isSeller && currentUser.seller_profile?.verification_status === 'VERIFIED';

  const pendingReviewCount = properties.filter(
    p => p.current_status === 'PENDING_REVIEW' || p.current_status === 'PENDING_REVISION'
  ).length;

  const userNotifications = notifications.filter(n => {
    if (!currentUser) return false;
    return n.user_id === currentUser.id || currentUser.role === 'SUPER_ADMIN';
  });

  const getRolePresentation = () => {
    if (!currentUser) return null;
    if (currentUser.role === 'SUPER_ADMIN') {
      return { label: 'مدير النظام', style: 'bg-purple-100 text-purple-900 border-purple-200' };
    }
    if (currentUser.role === 'PROPERTY_REVIEWER') {
      return { label: 'مراجع هندسي', style: 'bg-blue-100 text-blue-900 border-blue-200' };
    }
    if (currentUser.role === 'SALES_USER') {
      return { label: 'مبيعات CRM', style: 'bg-amber-100 text-amber-900 border-amber-200' };
    }
    if (currentUser.role === 'OPERATIONS_MANAGER') {
      return { label: 'مدير عمليات', style: 'bg-emerald-100 text-emerald-900 border-emerald-200' };
    }
    if (currentUser.role === 'CONTENT_MANAGER') {
      return { label: 'مدير محتوى', style: 'bg-teal-100 text-teal-900 border-teal-200' };
    }
    if (isVerifiedSeller) {
      return { label: 'موثق', style: 'bg-[#f2f7f2] text-[#14a800] border-[#14a800]/30' };
    }
    if (isSeller) {
      return { label: 'بوابة المالك', style: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
    return { label: 'عميل مسجل', style: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  const roleMeta = getRolePresentation();

  const handleCategoryClick = useCallback((filters: { property_type_id?: string; transaction_type_id?: string }) => {
    if (onFilterCategory) {
      onFilterCategory(filters);
    } else if (onNavigate) {
      onNavigate('PROPERTIES');
    }
  }, [onFilterCategory, onNavigate]);

  return (
    <>
      {/* 1. Production Fixed Smart Navigation Bar */}
      <header 
        id="main-navigation-header"
        className={`fixed top-0 inset-x-0 z-50 bg-white border-b border-[#e4ebe4] font-sans select-none transition-shadow duration-200 ${
          isScrolled ? 'shadow-md' : 'shadow-xs'
        }`}
        dir="rtl"
        style={{ zIndex: 50 }}
      >
        {/* Top Primary Navigation Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
            
            {/* Right Side (RTL Start): Logo + Desktop Navigation Links */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 min-w-0">
              
              {/* Brand Logo - Stable, non-shrinking, elegant */}
              <button 
                type="button"
                onClick={() => onNavigate?.('HOME')}
                className="flex items-center gap-2 sm:gap-2.5 text-right group focus:outline-hidden cursor-pointer shrink-0 select-none"
                title="منصة روابط العقارية بكفر الشيخ"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#14a800] flex items-center justify-center text-white shadow-xs group-hover:bg-[#108a00] transition shrink-0">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col text-right">
                  <div className="text-xl sm:text-2xl font-black text-[#001e00] tracking-tight flex items-center gap-1 leading-none font-display">
                    <span>روابط</span>
                    <span className="w-2 h-2 rounded-full bg-[#14a800]"></span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 mt-0.5 whitespace-nowrap hidden sm:inline">
                    عقارات كفر الشيخ المعتمدة
                  </span>
                </div>
              </button>

              {/* Desktop Navigation Links (Visible on lg+ : 1024px+) */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0" aria-label="التنقل الرئيسي">
                
                {/* 1. الرئيسية */}
                <button
                  type="button"
                  onClick={() => onNavigate?.('HOME')}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                    currentTab === 'HOME' 
                      ? 'bg-[#001e00] text-white font-black' 
                      : 'text-[#001e00] hover:text-[#14a800] hover:bg-[#f2f7f2]'
                  }`}
                >
                  الرئيسية
                </button>

                {/* البحث الذكي (Smart Search) */}
                <button
                  type="button"
                  onClick={() => onNavigate?.('START')}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'START' 
                      ? 'bg-[#14a800] text-white font-black shadow-xs' 
                      : 'text-[#14a800] bg-[#f0faf0] hover:bg-[#e2f5e2]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>البحث الذكي</span>
                </button>

                {/* 2. العقارات */}
                <button
                  type="button"
                  onClick={() => onNavigate?.('PROPERTIES')}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                    currentTab === 'PROPERTIES' 
                      ? 'bg-[#001e00] text-white font-black' 
                      : 'text-[#001e00] hover:text-[#14a800] hover:bg-[#f2f7f2]'
                  }`}
                >
                  العقارات
                </button>

                {/* 3. عن روابط */}
                <button
                  type="button"
                  onClick={() => onNavigate?.('ABOUT')}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                    currentTab === 'ABOUT' 
                      ? 'bg-[#001e00] text-white font-black' 
                      : 'text-[#001e00] hover:text-[#14a800] hover:bg-[#f2f7f2]'
                  }`}
                >
                  عن روابط
                </button>

                {/* 4. كيف نعمل */}
                <button
                  type="button"
                  onClick={() => onNavigate?.('HELP')}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                    currentTab === 'HELP' 
                      ? 'bg-[#001e00] text-white font-black' 
                      : 'text-[#001e00] hover:text-[#14a800] hover:bg-[#f2f7f2]'
                  }`}
                >
                  كيف نعمل
                </button>

                {/* 5. تواصل معنا */}
                <button
                  type="button"
                  onClick={() => onNavigate?.('CONTACT')}
                  className={`hidden xl:inline-flex px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                    currentTab === 'CONTACT' 
                      ? 'bg-[#001e00] text-white font-black' 
                      : 'text-[#001e00] hover:text-[#14a800] hover:bg-[#f2f7f2]'
                  }`}
                >
                  تواصل معنا
                </button>

                {/* مقارنة العقارات */}
                <button
                  type="button"
                  onClick={() => onNavigate?.('COMPARE')}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'COMPARE' 
                      ? 'bg-[#001e00] text-white font-black' 
                      : 'text-[#001e00] hover:text-[#14a800] hover:bg-[#f2f7f2]'
                  }`}
                >
                  <GitCompare className="w-3.5 h-3.5 text-[#14a800]" />
                  <span>المقارنة</span>
                  {compareIds.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-lg text-[10px] font-black bg-[#14a800] text-white">
                      {compareIds.length}
                    </span>
                  )}
                </button>

                {/* 6. بوابة الملاك - On 2xl+ displays in main nav */}
                <button
                  type="button"
                  onClick={() => {
                    if (!currentUser) {
                      openAuthModal('REGISTER', () => onNavigate?.('SELLER'));
                    } else {
                      onNavigate?.('SELLER');
                    }
                  }}
                  className={`hidden 2xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                    currentTab === 'SELLER' 
                      ? 'bg-[#001e00] text-white font-black' 
                      : 'text-[#001e00] hover:text-[#14a800] hover:bg-[#f2f7f2]'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#14a800]" />
                  <span>بوابة الملاك والوسطاء والمستثمرين</span>
                </button>

                {/* 7. لوحة العمليات للموظفين المصرح لهم فقط */}
                {isInternalUser && (
                  <button
                    type="button"
                    onClick={() => onNavigate?.('ADMIN', 'QUEUE')}
                    className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      currentTab === 'ADMIN' 
                        ? 'bg-[#001e00] text-white font-black shadow-xs' 
                        : 'text-[#14a800] bg-[#f2f7f2] hover:bg-[#e4ebe4]'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#14a800]" />
                    <span>لوحة العمليات</span>
                    {pendingReviewCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-[#14a800] animate-pulse"></span>
                    )}
                  </button>
                )}

                {/* 8. قائمة «المزيد» المنسدلة */}
                <div className="relative" ref={moreMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                      showMoreMenu || currentTab === 'HELP'
                        ? 'bg-slate-100 text-[#001e00]'
                        : 'text-slate-600 hover:text-[#001e00] hover:bg-[#f2f7f2]'
                    }`}
                    title="المزيد من الأقسام والخدمات"
                    aria-expanded={showMoreMenu}
                  >
                    <span>المزيد</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${showMoreMenu ? 'rotate-180 text-[#14a800]' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showMoreMenu && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#e4ebe4] py-2 z-50 animate-soft-fade text-right">
                      <div className="px-3.5 py-1.5 text-[11px] font-black text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
                        <span>خدمات منصة روابط</span>
                        <Sparkles className="w-3 h-3 text-[#14a800]" />
                      </div>

                      {/* تواصل معنا for lg screens */}
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate?.('CONTACT');
                          setShowMoreMenu(false);
                        }}
                        className="xl:hidden w-full text-right px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:bg-[#f2f7f2] hover:text-[#14a800] flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4 text-[#14a800] shrink-0" />
                        <div>
                          <div className="font-bold">تواصل معنا</div>
                          <div className="text-[10px] text-slate-500 font-normal">استفسارات العملاء وحجز المعاينات</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!currentUser) {
                            openAuthModal('REGISTER', () => onNavigate?.('SELLER'));
                          } else {
                            onNavigate?.('SELLER');
                          }
                          setShowMoreMenu(false);
                        }}
                        className="w-full text-right px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:bg-[#f2f7f2] hover:text-[#14a800] flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <Layers className="w-4 h-4 text-[#14a800] shrink-0" />
                        <div>
                          <div className="font-bold">بوابة الملاك والوسطاء</div>
                          <div className="text-[10px] text-slate-500 font-normal">إدارة العقارات وتحديث الأسعار ومتابعة الحالات</div>
                        </div>
                      </button>

                      {canManageUsers && (
                        <button
                          type="button"
                          onClick={() => {
                            onNavigate?.('ADMIN', 'USERS');
                            setShowMoreMenu(false);
                          }}
                          className="w-full text-right px-3.5 py-2.5 text-xs font-bold text-purple-950 bg-purple-50/60 hover:bg-purple-100 flex items-center gap-2.5 transition cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-purple-700 shrink-0" />
                          <div>
                            <div className="font-bold">إدارة المستخدمين والأدوار (RBAC)</div>
                            <div className="text-[10px] text-purple-700 font-normal">صلاحيات الموظفين والمراجعين</div>
                          </div>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          onNavigate?.('HELP');
                          setShowMoreMenu(false);
                        }}
                        className="w-full text-right px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#14a800] flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-[#14a800] shrink-0" />
                        <div>
                          <div className="font-bold">دليل التصوير والرفع للمالك</div>
                          <div className="text-[10px] text-slate-500 font-normal">إرشادات قبول العقارات وتجنب الرفض</div>
                        </div>
                      </button>

                      <div className="pt-1 mt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            onOpenLegal?.('ABOUT');
                            setShowMoreMenu(false);
                          }}
                          className="w-full text-right px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>عن منصة روابط العقارية</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onOpenLegal?.('TERMS');
                            setShowMoreMenu(false);
                          }}
                          className="w-full text-right px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>الشروط وسياسة النشر</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onOpenLegal?.('PRIVACY');
                            setShowMoreMenu(false);
                          }}
                          className="w-full text-right px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>سياسة الخصوصية والأمان</span>
                        </button>
                      </div>

                      <div className="pt-2 mt-1.5 border-t border-slate-100 px-3.5 py-1.5 flex items-center justify-between text-[11px] bg-slate-50 rounded-b-2xl">
                        <span className="text-slate-600 font-bold">الخط المباشر:</span>
                        <a href={`tel:${settings.primary_phone}`} className="text-[#14a800] font-black dir-ltr hover:underline">
                          {settings.primary_phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

              </nav>
            </div>

            {/* Left Side (RTL End): Action Controls & Burger Menu */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Notifications Popover (Logged In) */}
              {currentUser && (
                <div className="relative shrink-0" ref={notificationsRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                      setShowMoreMenu(false);
                    }}
                    className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-[#001e00] hover:bg-[#f2f7f2] relative transition active:scale-95 cursor-pointer"
                    title="الإشعارات"
                    aria-expanded={showNotifications}
                    aria-label="الإشعارات"
                  >
                    <Bell className="w-5 h-5 text-slate-700" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="fixed sm:absolute inset-x-4 sm:inset-x-auto sm:left-0 top-20 sm:top-full mt-1.5 w-auto sm:w-96 bg-white rounded-xl shadow-2xl border border-[#e4ebe4] py-3 z-50 animate-soft-fade text-right">
                      <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-[#14a800]" />
                          <span className="font-bold text-sm text-[#001e00]">الإشعارات والتنبيهات</span>
                          {unreadNotificationsCount > 0 && (
                            <span className="bg-[#f2f7f2] text-[#14a800] text-[10.5px] font-bold px-2 py-0.5 rounded-lg border border-[#14a800]/20">
                              {unreadNotificationsCount} جديدة
                            </span>
                          )}
                        </div>
                        {unreadNotificationsCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllNotificationsAsRead}
                            className="text-xs text-[#14a800] hover:underline font-bold cursor-pointer"
                          >
                            تحديد الكل كمقروء
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {userNotifications.length === 0 ? (
                          <div className="py-8 text-center text-xs text-slate-500 font-semibold">
                            لا توجد إشعارات جديدة في الوقت الحالي
                          </div>
                        ) : (
                          userNotifications.map(n => (
                            <div 
                              key={n.id}
                              onClick={() => markNotificationAsRead(n.id)}
                              className={`p-3.5 text-right transition cursor-pointer hover:bg-[#f2f7f2] ${
                                !n.read_at ? 'bg-emerald-50/40' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <h5 className="text-xs font-bold text-slate-900">{n.title}</h5>
                                {!n.read_at && (
                                  <span className="w-2 h-2 rounded-full bg-[#14a800] shrink-0 mt-1"></span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.body}</p>
                              <span className="text-[10px] text-slate-400 mt-1.5 block font-bold">
                                {new Date(n.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Account / Profile Menu */}
              {currentUser ? (
                <div className="relative shrink-0" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                      setShowMoreMenu(false);
                    }}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-xl hover:bg-[#f2f7f2] border border-[#e4ebe4] transition text-right active:scale-95 cursor-pointer"
                    title="حسابي"
                    aria-expanded={showUserMenu}
                  >
                    {/* User Avatar - Kept rounded-full as authorized exception for avatars */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                      currentUser.role === 'SUPER_ADMIN' ? 'bg-purple-700' : 'bg-[#14a800]'
                    }`}>
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="hidden sm:block text-right pr-1">
                      <div className="text-xs font-bold text-[#001e00] truncate max-w-[100px] flex items-center gap-1">
                        <span>{currentUser.name}</span>
                        {isVerifiedSeller && (
                          <span title="بائع موثق" className="inline-flex">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#14a800] shrink-0" />
                          </span>
                        )}
                      </div>
                      {roleMeta && !isVerifiedSeller && (
                        <div className="text-[10px] font-bold text-slate-500">
                          <span className={`px-1.5 py-0.2 rounded-lg border ${roleMeta.style}`}>
                            {roleMeta.label}
                          </span>
                        </div>
                      )}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block ml-1" />
                  </button>

                  {showUserMenu && (
                    <div 
                      className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-[#e4ebe4] py-2 z-50 animate-soft-fade text-right"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="font-bold text-sm text-[#001e00] flex items-center gap-1.5">
                          <span>{currentUser.name}</span>
                          {isVerifiedSeller && (
                            <div className="w-4 h-4 rounded-full bg-[#f2f7f2] text-[#14a800] flex items-center justify-center" title="حساب موثق">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#14a800]" />
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                        <div className="text-xs text-slate-600 font-bold dir-ltr text-right mt-0.5">{currentUser.mobile}</div>
                        {roleMeta && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-lg border ${roleMeta.style}`}>
                              {roleMeta.label}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => onNavigate?.('PROFILE')}
                          className="w-full text-right px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#f2f7f2] flex items-center gap-2 cursor-pointer"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          <span>الملف الشخصي والتوثيق</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onNavigate?.('SELLER')}
                          className="w-full text-right px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#f2f7f2] flex items-center gap-2 cursor-pointer"
                        >
                          <Layers className="w-4 h-4 text-[#14a800]" />
                          <span>لوحة عقاراتي وإدارتها</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onNavigate?.('PROFILE')}
                          className="w-full text-right px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#f2f7f2] flex items-center gap-2 cursor-pointer"
                        >
                          <Heart className="w-4 h-4 text-[#14a800]" />
                          <span>العقارات المفضلة</span>
                        </button>

                        {/* Internal Operations Dashboard Link */}
                        {isInternalUser && (
                          <button
                            type="button"
                            onClick={() => onNavigate?.('ADMIN', 'QUEUE')}
                            className="w-full text-right px-4 py-2.5 text-xs font-bold text-[#001e00] bg-[#f2f7f2] hover:bg-[#e4ebe4] flex items-center gap-2 border-t border-slate-100 cursor-pointer"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#14a800]" />
                            <span>لوحة الإدارة والعمليات</span>
                          </button>
                        )}

                        {canManageUsers && isInternalUser && (
                          <button
                            type="button"
                            onClick={() => onNavigate?.('ADMIN', 'USERS')}
                            className="w-full text-right px-4 py-2.5 text-xs font-bold text-purple-950 bg-purple-50/60 hover:bg-purple-100 flex items-center gap-2 cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-700" />
                            <span>إدارة الأدوار والمستخدمين (RBAC)</span>
                          </button>
                        )}

                        <div className="border-t border-slate-100 my-1"></div>

                        <button
                          type="button"
                          onClick={logout}
                          className="w-full text-right px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-slate-500" />
                          <span>تسجيل الخروج</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('LOGIN')}
                  className="inline-flex items-center gap-1 sm:gap-1.5 border border-[#001e00] text-[#001e00] hover:bg-[#f2f7f2] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 min-h-[44px] rounded-xl transition whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#14a800]"
                >
                  <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" aria-hidden="true" />
                  <span>دخول</span>
                </button>
              )}

              {/* Mobile / Tablet Burger Menu Button (44px Accessible Touch Target) */}
              <button
                type="button"
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden w-11 h-11 min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition shrink-0 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#14a800]"
                aria-label="فتح القائمة الجانبية"
                title="القائمة"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>

            </div>

          </div>
        </div>

        {/* Sub-Navigation Categories Bar (Desktop only: lg+) */}
        <div className="hidden lg:block bg-[#f9f9f9] border-t border-[#e4ebe4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 text-xs font-bold text-[#001e00]">
              <span className="text-slate-400 font-semibold ml-1 shrink-0">التصنيفات الشائعة:</span>
              
              <button
                type="button"
                onClick={() => handleCategoryClick({ property_type_id: 'type-apt', transaction_type_id: 'trans-sale' })}
                className="px-3 py-1 rounded-xl bg-white hover:bg-[#f2f7f2] hover:text-[#14a800] border border-[#e4ebe4] transition whitespace-nowrap cursor-pointer active:scale-95"
              >
                🏢 شقق سكنية للبيع
              </button>
              <button
                type="button"
                onClick={() => handleCategoryClick({ property_type_id: 'type-apt', transaction_type_id: 'trans-rent' })}
                className="px-3 py-1 rounded-xl bg-white hover:bg-[#f2f7f2] hover:text-[#14a800] border border-[#e4ebe4] transition whitespace-nowrap cursor-pointer active:scale-95"
              >
                🔑 شقق للإيجار بكفر الشيخ
              </button>
              <button
                type="button"
                onClick={() => handleCategoryClick({ property_type_id: 'type-comm' })}
                className="px-3 py-1 rounded-xl bg-white hover:bg-[#f2f7f2] hover:text-[#14a800] border border-[#e4ebe4] transition whitespace-nowrap cursor-pointer active:scale-95"
              >
                🏪 محلات ومقرات تجارية
              </button>
              <button
                type="button"
                onClick={() => handleCategoryClick({ property_type_id: 'type-land' })}
                className="px-3 py-1 rounded-xl bg-white hover:bg-[#f2f7f2] hover:text-[#14a800] border border-[#e4ebe4] transition whitespace-nowrap cursor-pointer active:scale-95"
              >
                🌾 أراضي بناء وزراعية
              </button>
              <button
                type="button"
                onClick={() => handleCategoryClick({ property_type_id: 'type-villa' })}
                className="px-3 py-1 rounded-xl bg-white hover:bg-[#f2f7f2] hover:text-[#14a800] border border-[#e4ebe4] transition whitespace-nowrap cursor-pointer active:scale-95"
              >
                🏡 فلل ودوبلكس
              </button>
              <button
                type="button"
                onClick={() => handleCategoryClick({ property_type_id: 'type-building' })}
                className="px-3 py-1 rounded-xl bg-white hover:bg-[#f2f7f2] hover:text-[#14a800] border border-[#e4ebe4] transition whitespace-nowrap cursor-pointer active:scale-95"
              >
                🏗️ عمارات وأبراج استثمارية
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Permanent Document-Flow Spacer: Eliminates layout jumps when header slides out */}
      <div 
        className="h-16 sm:h-18 lg:h-[105px] w-full shrink-0 pointer-events-none" 
        aria-hidden="true" 
      />

      {/* 3. Mobile Burger Menu Drawer (Rendered into document.body via Portal) */}
      <MobileDrawer
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        currentTab={currentTab}
        onNavigate={onNavigate}
        onOpenAddProperty={onOpenAddProperty || (() => {})}
        onOpenLegal={onOpenLegal}
      />
    </>
  );
};
