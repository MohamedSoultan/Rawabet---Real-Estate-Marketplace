import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Users, 
  Shield, 
  UserCheck, 
  Building2, 
  Briefcase, 
  Headphones, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2,
  ChevronDown,
  X
} from 'lucide-react';

interface PersonaSwitcherProps {
  onOpenUAT: () => void;
  onNavigateToAdmin?: (subTab?: 'QUEUE' | 'LEADS' | 'USERS' | 'VERIFICATIONS' | 'LOCATIONS' | 'AUDIT' | 'SETTINGS') => void;
  onNavigateToSeller?: () => void;
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ 
  onOpenUAT, 
  onNavigateToAdmin,
  onNavigateToSeller 
}) => {
  const { currentUser, switchPersona, resetToDefaultData } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [switchToast, setSwitchToast] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close persona menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const personas: { 
    role: 'GUEST' | UserRole; 
    userId?: string; 
    label: string; 
    subLabel: string; 
    icon: React.ReactNode; 
    badge: string;
    targetTab?: 'ADMIN' | 'SELLER' | 'HOME';
    adminSubTab?: 'QUEUE' | 'LEADS' | 'USERS' | 'VERIFICATIONS' | 'LOCATIONS' | 'AUDIT' | 'SETTINGS';
  }[] = [
    {
      role: 'GUEST',
      label: 'زائر بدون تسجيل (Guest)',
      subLabel: 'تصفح كروت العقارات العامة ومحرك البحث بدون صلاحيات داخلية',
      icon: <Users className="w-4 h-4 text-slate-400" />,
      badge: 'زائر عام',
      targetTab: 'HOME'
    },
    {
      role: 'CUSTOMER',
      userId: 'user-cust-1',
      label: 'أحمد مصطفى (عميل / مشتري)',
      subLabel: 'تصفح التفاصيل، حفظ المفضلة، إرسال طلبات المعاينة وإنشاء Leads',
      icon: <UserCheck className="w-4 h-4 text-[#14a800]" />,
      badge: 'عميل مشتري',
      targetTab: 'HOME'
    },
    {
      role: 'CUSTOMER',
      userId: 'user-owner-1',
      label: 'محمد الدسوقي (مالك موثق)',
      subLabel: 'إضافة ومتابعة عقارات وتعديل المنشور بنظام النسخ وحساب المالك',
      icon: <Building2 className="w-4 h-4 text-[#14a800]" />,
      badge: 'مالك موثق',
      targetTab: 'SELLER'
    },
    {
      role: 'CUSTOMER',
      userId: 'user-broker-1',
      label: 'مكتب النخبة (وسيط عقاري)',
      subLabel: 'إدارة وتنزيل عقارات متعددة وطلب توثيق المكتب العقاري',
      icon: <Briefcase className="w-4 h-4 text-[#14a800]" />,
      badge: 'مكتب وسيط',
      targetTab: 'SELLER'
    },
    {
      role: 'PROPERTY_REVIEWER',
      userId: 'user-reviewer-1',
      label: 'م. كريم عادل (مراجع هندسي)',
      subLabel: 'طابور المراجعة، التحقق من العناوين وسندات الملكية، الموافقة والرفض المسبب',
      icon: <Shield className="w-4 h-4 text-[#14a800]" />,
      badge: 'مراجع هندسي',
      targetTab: 'ADMIN',
      adminSubTab: 'QUEUE'
    },
    {
      role: 'SALES_USER',
      userId: 'user-sales-1',
      label: 'سارة يوسف (مسؤول مبيعات)',
      subLabel: 'متابعة طلبات Leads، إدارة مواعيد المعاينة، وتدوين الملاحظات',
      icon: <Headphones className="w-4 h-4 text-[#14a800]" />,
      badge: 'مسؤول مبيعات',
      targetTab: 'ADMIN',
      adminSubTab: 'LEADS'
    },
    {
      role: 'SUPER_ADMIN',
      userId: 'user-admin-1',
      label: 'إدارة روابط (Super Admin)',
      subLabel: 'تحكم شامل بكافة الصلاحيات (RBAC)، المحافظات والمناطق، وسجل التدقيق',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      badge: 'مدير النظام',
      targetTab: 'ADMIN',
      adminSubTab: 'USERS'
    }
  ];

  const currentPersona = personas.find(p => {
    if (!currentUser && p.role === 'GUEST') return true;
    if (currentUser && p.userId && currentUser.id === p.userId) return true;
    if (currentUser && p.role === currentUser.role && !p.userId) return true;
    return false;
  }) || (currentUser ? {
    role: currentUser.role,
    userId: currentUser.id,
    label: currentUser.name,
    subLabel: `الحساب الحالي: ${currentUser.role}`,
    icon: <UserCheck className="w-4 h-4 text-[#14a800]" />,
    badge: currentUser.role
  } : personas[0]);

  const handleSelectPersona = (p: typeof personas[0]) => {
    switchPersona(p.role, p.userId);
    setIsOpen(false);

    setSwitchToast(`تم التبديل بنجاح إلى: ${p.label}`);
    setTimeout(() => setSwitchToast(null), 3000);

    // Auto-navigate to appropriate view
    if (p.targetTab === 'ADMIN') {
      onNavigateToAdmin?.(p.adminSubTab || 'USERS');
    } else if (p.targetTab === 'SELLER') {
      onNavigateToSeller?.();
    }
  };

  return (
    <aside 
      aria-label="شريط المعاينة وتغيير الحسابات" 
      className="bg-[#001e00] text-white border-b border-[#003a00] text-[11px] sm:text-xs py-1.5 px-3 relative z-50 select-none font-sans"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left Section: Role switcher & RBAC shortcut */}
        <div className="flex items-center gap-2 relative">
          
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#002f00] text-[#14a800] border border-[#14a800]/40 font-bold whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14a800] animate-pulse"></span>
            بيئة المعاينة
          </span>
          
          {/* Persona selector dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1.5 bg-[#002f00] hover:bg-[#003d00] text-white font-bold px-3 py-1 rounded-full border border-[#14a800]/30 transition active:scale-95 whitespace-nowrap cursor-pointer shadow-xs"
              title="اضغط للتغيير الفوري لأي حساب لاختبار كافة الصلاحيات"
            >
              <div className="text-[#14a800]">
                {currentPersona.icon}
              </div>
              <span className="max-w-[140px] sm:max-w-none truncate font-bold text-slate-100">
                {currentPersona.label}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#14a800]' : ''}`} />
            </button>

            {/* Dropdown Menu floating outside with high z-index */}
            {isOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-76 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white text-slate-900 rounded-2xl shadow-2xl border border-[#e4ebe4] py-1.5 z-[100] animate-soft-fade text-right"
              >
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#14a800]" />
                    <span className="text-xs font-bold text-[#001e00]">تغيير الحساب والصلاحيات:</span>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="max-h-84 overflow-y-auto divide-y divide-slate-100 py-1">
                  {personas.map((p, idx) => {
                    const isSelected = (!currentUser && p.role === 'GUEST') || (currentUser && p.userId === currentUser.id);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPersona(p)}
                        className={`w-full text-right px-3.5 py-2.5 flex items-start gap-2.5 hover:bg-[#f2f7f2] transition cursor-pointer ${
                          isSelected ? 'bg-[#f2f7f2] text-[#001e00] font-bold' : ''
                        }`}
                      >
                        <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${isSelected ? 'bg-[#14a800] text-white' : 'bg-slate-100 text-slate-700'}`}>
                          {p.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold truncate">{p.label}</span>
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-[#14a800] shrink-0" />
                            ) : (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10.5px] text-slate-500 font-normal leading-relaxed mt-0.5 line-clamp-2">
                            {p.subLabel}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-2.5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between text-[11px] text-slate-600">
                  <span className="font-bold">هل ترغب بتخصيص الأدوار؟</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
                        switchPersona('SUPER_ADMIN', 'user-admin-1');
                      }
                      setIsOpen(false);
                      onNavigateToAdmin?.('USERS');
                    }}
                    className="text-[#14a800] hover:underline font-bold cursor-pointer"
                  >
                    فتح لوحة RBAC
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Direct Link to Roles Management (RBAC) */}
          <button
            type="button"
            onClick={() => {
              if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
                switchPersona('SUPER_ADMIN', 'user-admin-1');
              }
              onNavigateToAdmin?.('USERS');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002f00] hover:bg-[#003d00] text-emerald-200 border border-[#14a800]/40 font-bold transition active:scale-95 whitespace-nowrap text-[11px] cursor-pointer"
            title="فتح صفحة إدارة الأدوار والمستخدمين مباشرة"
          >
            <Shield className="w-3.5 h-3.5 text-[#14a800]" />
            <span>إدارة الأدوار (RBAC)</span>
          </button>
        </div>

        {/* Right Section: UAT Suite & Reset Data */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenUAT}
            className="inline-flex items-center gap-1 bg-[#14a800] hover:bg-[#108a00] text-white font-bold px-3 py-1 rounded-full transition shadow-xs whitespace-nowrap cursor-pointer active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">لوحة فحص الجودة (15 سيناريو)</span>
            <span className="sm:hidden">فحص UAT</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('هل تريد إعادة تعيين كافة البيانات إلى الحالة الأولية؟')) {
                resetToDefaultData();
              }
            }}
            className="inline-flex items-center gap-1 bg-[#002f00] hover:bg-[#003d00] text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-white/10 transition whitespace-nowrap cursor-pointer"
            title="إعادة ضبط البيانات الأولية"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline font-bold">إعادة ضبط</span>
          </button>
        </div>
      </div>

      {/* Floating toast notification when switching */}
      {switchToast && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-[#001e00] text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl border border-[#14a800]/40 flex items-center gap-2 animate-soft-fade">
          <span className="w-2 h-2 rounded-full bg-[#14a800]"></span>
          <span>{switchToast}</span>
        </div>
      )}
    </aside>
  );
};
