import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Phone, MessageSquare, Mail, ShieldCheck, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (type: 'PRIVACY' | 'TERMS' | 'ABOUT') => void;
  onNavigate?: (tab: 'HOME' | 'START' | 'PROPERTIES' | 'COMPARE' | 'ABOUT' | 'CONTACT' | 'SELLER' | 'ADMIN' | 'PROFILE' | 'HELP') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onNavigate }) => {
  const { settings, governorates } = useApp();
  const activeGovs = governorates.filter(g => g.is_active);

  return (
    <footer className="bg-[#001700] text-slate-200 pt-12 pb-8 border-t border-[#0d380d] text-right font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          
          {/* Brand & Identity */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#14a800] flex items-center justify-center text-white font-bold shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">روابط</span>
                <span className="block text-xs text-[#22c55e] font-bold">وساطة عقارية مضمونة</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              منصة روابط بتساعدك تشتري وتأجر وتبيع عقارك في كفر الشيخ بأمان، مع فحص ميداني وسرية كاملة للبيانات.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-white font-semibold bg-[#002800] border border-[#14a800]/40 px-3.5 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#22c55e]" />
              <span>فحص ومعاينة وتوثيق لكل عقار</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider">روابط سريعة</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              <li>
                <button type="button" onClick={() => onNavigate?.('HOME')} className="hover:text-[#22c55e] transition cursor-pointer">
                  الرئيسية
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate?.('PROPERTIES')} className="hover:text-[#22c55e] transition cursor-pointer">
                  شوف كل العقارات
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate?.('COMPARE')} className="hover:text-[#22c55e] transition cursor-pointer">
                  مقارنة العقارات
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate?.('ABOUT')} className="hover:text-[#22c55e] transition cursor-pointer">
                  عن روابط
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate?.('CONTACT')} className="hover:text-[#22c55e] transition cursor-pointer">
                  تواصل معنا وحجز المعاينة
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate?.('SELLER')} className="hover:text-[#22c55e] transition cursor-pointer">
                  لوحة أصحاب العقارات
                </button>
              </li>
            </ul>
          </div>

          {/* Coverage & Locations */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider">نطاق التغطية</h4>
            <p className="text-xs text-slate-300 font-normal">
              أماكن تغطيتنا في كفر الشيخ:
            </p>
            <div className="flex flex-wrap gap-2">
              {activeGovs.map(g => (
                <span 
                  key={g.id}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#002800] text-emerald-200 border border-[#14a800]/40 px-3 py-1.5 rounded-xl"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#22c55e]" />
                  {g.name_ar} (متاح بالكامل)
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
              مدينة كفر الشيخ، دسوق، فوه، مطوبس، بيلا، بلطيم ومصيف بلطيم، سيدي سالم، الحامول، الرياض.
            </p>
          </div>

          {/* Direct Communication */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider">خدمة العملاء</h4>
            <p className="text-xs text-slate-300 font-normal">
              فريقنا جاهز كل يوم لمساعدتك وتنسيق المعاينات:
            </p>
            
            <div className="space-y-2.5 text-xs">
              <a 
                href={`tel:${settings.primary_phone}`}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#002800] hover:bg-[#003800] border border-[#14a800]/40 text-white font-bold transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#14a800]/20 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#22c55e]" />
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 font-normal">الخط الساخن:</span>
                  <span className="dir-ltr text-white">{settings.primary_phone}</span>
                </div>
              </a>

              <a 
                href={`https://wa.me/${settings.primary_whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#14a800]/20 hover:bg-[#14a800]/30 border border-[#14a800]/50 text-white font-bold transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#14a800]/40 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-[#22c55e]" />
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-emerald-300 font-normal">واتساب خدمة العملاء:</span>
                  <span className="dir-ltr text-white">{settings.secondary_phone}</span>
                </div>
              </a>

              <div className="flex items-center gap-2 text-slate-300 text-xs pt-1 font-normal">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{settings.support_email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-normal">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} منصة روابط للوساطة العقارية.
          </div>

          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => onOpenLegal('PRIVACY')} 
              className="text-slate-300 hover:text-white transition cursor-pointer"
            >
              سياسة الخصوصية
            </button>
            <span className="text-slate-600">•</span>
            <button 
              type="button"
              onClick={() => onOpenLegal('TERMS')} 
              className="text-slate-300 hover:text-white transition cursor-pointer"
            >
              الشروط والأحكام
            </button>
            <span className="text-slate-600">•</span>
            <button 
              type="button"
              onClick={() => onOpenLegal('ABOUT')} 
              className="text-slate-300 hover:text-white transition cursor-pointer"
            >
              من نحن
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
