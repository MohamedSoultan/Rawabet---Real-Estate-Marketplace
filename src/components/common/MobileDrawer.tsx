import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  X, 
  Home, 
  Search, 
  GitCompare, 
  Layers, 
  LayoutDashboard, 
  ShieldCheck, 
  HelpCircle, 
  Info, 
  Phone, 
  Plus, 
  LogIn, 
  LogOut, 
  User, 
  ChevronLeft,
  MessageSquare,
  FileText,
  Compass,
  Sparkles
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab?: 'HOME' | 'START' | 'PROPERTIES' | 'COMPARE' | 'ABOUT' | 'CONTACT' | 'SELLER' | 'ADMIN' | 'PROFILE' | 'HELP';
  onNavigate?: (tab: 'HOME' | 'START' | 'PROPERTIES' | 'COMPARE' | 'ABOUT' | 'CONTACT' | 'SELLER' | 'ADMIN' | 'PROFILE' | 'HELP', subTab?: 'QUEUE' | 'LEADS' | 'USERS' | 'VERIFICATIONS' | 'LOCATIONS' | 'AUDIT' | 'SETTINGS') => void;
  onOpenAddProperty?: () => void;
  onOpenLegal?: (type: 'PRIVACY' | 'TERMS' | 'ABOUT') => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentTab = 'HOME',
  onNavigate,
  onOpenLegal,
}) => {
  const { 
    currentUser, 
    settings, 
    openAuthModal, 
    logout, 
    compareIds, 
    hasPermission 
  } = useApp();

  // State to manage entrance and exit animation smoothly (250-350ms)
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Small timeout to allow DOM mount before triggering CSS transition
      const timer = setTimeout(() => {
        setAnimateIn(true);
      }, 15);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300); // 300ms matches transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted && !isOpen) return null;

  const isInternalUser = currentUser && [
    'SUPER_ADMIN', 
    'PROPERTY_REVIEWER', 
    'SALES_USER', 
    'OPERATIONS_MANAGER', 
    'CONTENT_MANAGER'
  ].includes(currentUser.role);

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const canManageUsers = isSuperAdmin || hasPermission('PERM_MANAGE_USERS');

  const handleLinkClick = (action: () => void) => {
    onClose();
    action();
  };

  const drawerContent = (
    <div 
      className="fixed inset-0 z-60 overflow-hidden font-sans select-none"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="قائمة التنقل الجانبية"
    >
      {/* 1. Backdrop Overlay with smooth fade */}
      <div 
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
          animateIn ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-in Drawer: Slides from the RIGHT side (RTL Start) */}
      <div 
        className={`fixed top-0 bottom-0 right-0 w-[86vw] max-w-sm sm:max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] border-l border-[#e4ebe4] ${
          animateIn ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ willChange: 'transform' }}
      >
        {/* Top Header & Navigation Links */}
        <div className="p-4 sm:p-5">
          
          {/* Drawer Header: Logo on Right, Close Button on Left */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#14a800] flex items-center justify-center text-white shadow-xs shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col text-right">
                <div className="text-lg font-black text-[#001e00] flex items-center gap-1 leading-none font-display">
                  <span>روابط</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14a800]"></span>
                </div>
                <span className="text-[10.5px] font-bold text-slate-500 mt-0.5">
                  عقارات كفر الشيخ المعتمدة
                </span>
              </div>
            </div>

            {/* Accessible 44px Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition cursor-pointer"
              title="إغلاق القائمة"
              aria-label="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account Banner (Logged in vs Guest) */}
          <div className="my-4">
            {currentUser ? (
              <div className="p-3.5 rounded-xl bg-[#f2f7f2] border border-[#14a800]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar stays rounded-full */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0 ${
                    currentUser.role === 'SUPER_ADMIN' ? 'bg-purple-700' : 'bg-[#14a800]'
                  }`}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-[#001e00] flex items-center gap-1.5">
                      <span>{currentUser.name}</span>
                      {currentUser.seller_profile?.verification_status === 'VERIFIED' && (
                        <span className="w-2 h-2 rounded-full bg-[#14a800]" title="موثق"></span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-bold dir-ltr text-right mt-0.5">
                      {currentUser.mobile}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLinkClick(() => onNavigate?.('PROFILE'))}
                  className="p-1.5 rounded-xl text-[#14a800] hover:bg-white transition cursor-pointer"
                  title="عرض الملف الشخصي"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-slate-800">مرحباً بك في روابط</div>
                  <div className="text-[11px] text-slate-500 font-bold">سجّل دخولك للوصول لكامل المزايا</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleLinkClick(() => openAuthModal('LOGIN'))}
                  className="px-3.5 py-1.5 bg-[#001e00] hover:bg-[#14a800] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>دخول</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary Navigation Menu Items */}
          <nav className="space-y-1">
            
            {/* 1. الرئيسية */}
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigate?.('HOME'))}
              className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                currentTab === 'HOME' 
                  ? 'bg-[#001e00] text-white font-black shadow-xs' 
                  : 'text-slate-700 hover:bg-[#f2f7f2] hover:text-[#14a800]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4" />
                <span>الرئيسية</span>
              </div>
            </button>

            {/* البحث الذكي (Smart Search) */}
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigate?.('START'))}
              className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                currentTab === 'START' 
                  ? 'bg-[#14a800] text-white font-black shadow-xs' 
                  : 'text-[#14a800] bg-[#f0faf0] hover:bg-[#e2f5e2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <span>البحث الذكي</span>
              </div>
            </button>

            {/* 2. العقارات */}
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigate?.('PROPERTIES'))}
              className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                currentTab === 'PROPERTIES' 
                  ? 'bg-[#001e00] text-white font-black shadow-xs' 
                  : 'text-slate-700 hover:bg-[#f2f7f2] hover:text-[#14a800]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4" />
                <span>العقارات</span>
              </div>
            </button>

            {/* 3. المقارنة */}
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigate?.('COMPARE'))}
              className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                currentTab === 'COMPARE' 
                  ? 'bg-[#001e00] text-white font-black shadow-xs' 
                  : 'text-slate-700 hover:bg-[#f2f7f2] hover:text-[#14a800]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GitCompare className="w-4 h-4" />
                <span>مقارنة العقارات</span>
              </div>
              {compareIds.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#14a800] text-white text-[10px] font-black">
                  {compareIds.length} عقارات
                </span>
              )}
            </button>

            {/* 4. بوابة الملاك والوسطاء */}
            <button
              type="button"
              onClick={() => handleLinkClick(() => {
                if (!currentUser) {
                  openAuthModal('REGISTER', () => onNavigate?.('SELLER'));
                } else {
                  onNavigate?.('SELLER');
                }
              })}
              className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                currentTab === 'SELLER' 
                  ? 'bg-[#001e00] text-white font-black shadow-xs' 
                  : 'text-slate-700 hover:bg-[#f2f7f2] hover:text-[#14a800]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>بوابة الملاك والوسطاء والمستثمرين</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">إدارة المعروض</span>
            </button>

            {/* 5. لوحة العمليات للموظفين المصرح لهم فقط */}
            {isInternalUser && (
              <button
                type="button"
                onClick={() => handleLinkClick(() => onNavigate?.('ADMIN', 'QUEUE'))}
                className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  currentTab === 'ADMIN' 
                    ? 'bg-[#001e00] text-white font-black shadow-xs' 
                    : 'text-[#14a800] bg-[#f2f7f2] hover:bg-[#e4ebe4]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>لوحة العمليات والمراجعة</span>
                </div>
              </button>
            )}

            {/* 6. إدارة المستخدمين والأدوار */}
            {canManageUsers && isInternalUser && (
              <button
                type="button"
                onClick={() => handleLinkClick(() => onNavigate?.('ADMIN', 'USERS'))}
                className="w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold text-purple-950 bg-purple-50/70 hover:bg-purple-100 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>إدارة المستخدمين والأدوار (RBAC)</span>
                </div>
              </button>
            )}

            {/* Divider */}
            <div className="py-2">
              <div className="border-t border-slate-100"></div>
            </div>

            {/* 7. عن روابط */}
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigate?.('ABOUT'))}
              className={`w-full text-right px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                currentTab === 'ABOUT' 
                  ? 'bg-slate-100 text-[#001e00] font-black' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-slate-400" />
                <span>عن روابط</span>
              </div>
            </button>

            {/* 8. كيف نعمل */}
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigate?.('HELP'))}
              className={`w-full text-right px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                currentTab === 'HELP' 
                  ? 'bg-slate-100 text-[#001e00] font-black' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>كيف نعمل</span>
              </div>
            </button>

            {/* 9. تواصل معنا */}
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigate?.('CONTACT'))}
              className={`w-full text-right px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                currentTab === 'CONTACT' 
                  ? 'bg-slate-100 text-[#001e00] font-black' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>تواصل معنا</span>
              </div>
            </button>

            {/* 10. الشروط وسياسة الخصوصية */}
            <button
              type="button"
              onClick={() => handleLinkClick(() => onOpenLegal?.('TERMS'))}
              className="w-full text-right px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 flex items-center gap-2.5 transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>الشروط وسياسة النشر</span>
            </button>
          </nav>
        </div>

        {/* Bottom Pinned Section: Hotline, Logout */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/60 space-y-3">
          
          {/* Hotline Direct Call */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-3 py-2.5 bg-white rounded-xl border border-slate-200/80">
            <span className="text-slate-500">الخط الساخن:</span>
            <a 
              href={`tel:${settings.primary_phone}`} 
              className="text-[#14a800] font-black dir-ltr flex items-center gap-1.5 hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.primary_phone}</span>
            </a>
          </div>

          {/* Logout button if user logged in */}
          {currentUser && (
            <button
              type="button"
              onClick={() => handleLinkClick(logout)}
              className="w-full py-2 text-center text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};
