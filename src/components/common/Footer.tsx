import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Phone, MessageSquare, Mail, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (type: 'PRIVACY' | 'TERMS' | 'ABOUT') => void;
  onNavigate?: (tab: 'HOME' | 'PROPERTIES' | 'COMPARE' | 'ABOUT' | 'CONTACT' | 'SELLER' | 'ADMIN' | 'PROFILE' | 'HELP') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onNavigate }) => {
  const { settings, governorates } = useApp();
  const activeGovs = governorates.filter(g => g.is_active);

  return (
    <footer className="bg-[#001e00] text-slate-300 pt-14 pb-8 border-t border-[#003a00] text-right font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#14a800] flex items-center justify-center text-white font-bold shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-white">روابط</span>
                <span className="block text-xs text-[#14a800] font-bold">وساطة عقارية رقمية موثوقة</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              منصة روابط هي البوابة العقارية المعتمدة بمحافظة كفر الشيخ. نعمل كوسيط رقمي محترف يضمن الخصوصية ويدقق بيانات كافة العقارات قبل النشر لحماية المشتري والبائع.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#14a800] font-bold bg-[#002f00] border border-[#14a800]/30 px-3.5 py-2 rounded-full">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#14a800]" />
              <span>سرية تامة لبيانات اتصال الملاك</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider">روابط سريعة</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              <li>
                <button onClick={() => onNavigate?.('HOME')} className="hover:text-[#14a800] transition cursor-pointer">
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('PROPERTIES')} className="hover:text-[#14a800] transition cursor-pointer">
                  تصفح جميع العقارات المعتمدة
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('COMPARE')} className="hover:text-[#14a800] transition cursor-pointer">
                  مقارنة العقارات المباشرة
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('ABOUT')} className="hover:text-[#14a800] transition cursor-pointer">
                  عن شركة روابط ورؤيتنا
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('CONTACT')} className="hover:text-[#14a800] transition cursor-pointer">
                  تواصل معنا وحجز المعاينات
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('SELLER')} className="hover:text-[#14a800] transition cursor-pointer">
                  بوابة أصحاب العقارات والوسطاء
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('HELP')} className="hover:text-[#14a800] transition cursor-pointer">
                  دليل التصوير والرفع الصحيح
                </button>
              </li>
            </ul>
          </div>

          {/* Coverage & Locations */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider">التغطية الجغرافية</h4>
            <p className="text-xs text-slate-400 font-normal">
              المحافظات المفعلة حالياً في الإصدار الأول:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {activeGovs.map(g => (
                <span 
                  key={g.id}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-[#002f00] text-emerald-300 border border-[#14a800]/30 px-3 py-1 rounded-full"
                >
                  <MapPin className="w-3 h-3 text-[#14a800]" />
                  {g.name_ar} (مفعل)
                </span>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 pt-1 leading-relaxed font-normal">
              المراكز المغطاة: كفر الشيخ، دسوق، فوه، مطوبس، بيلا، بلطيم، سيدي سالم، الحامول، الرياض، قلين.
            </div>
          </div>

          {/* Official Contact info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider">تواصل مع روابط</h4>
            <p className="text-xs text-slate-400 font-normal">
              فريق المبيعات والمعاينات جاهز للرد على استفساراتكم:
            </p>
            
            <div className="space-y-2 text-xs">
              <a 
                href={`tel:${settings.primary_phone}`}
                className="flex items-center gap-2.5 p-2.5 rounded-full bg-[#002f00] hover:bg-[#003d00] border border-[#14a800]/30 text-white font-bold transition cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#14a800] shrink-0" />
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 font-normal">الخط الساخن:</span>
                  <span className="dir-ltr">{settings.primary_phone}</span>
                </div>
              </a>

              <a 
                href={`https://wa.me/${settings.primary_whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-full bg-[#14a800]/20 hover:bg-[#14a800]/30 border border-[#14a800]/50 text-emerald-200 font-bold transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#14a800] shrink-0" />
                <div className="text-right">
                  <span className="block text-[10px] text-emerald-400 font-normal">واتساب خدمة العملاء:</span>
                  <span className="dir-ltr">{settings.secondary_phone}</span>
                </div>
              </a>

              <div className="flex items-center gap-2 text-slate-400 text-xs pt-1 font-normal">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{settings.support_email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-semibold">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} منصة روابط للوساطة العقارية (Rawabet Real Estate).
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => onOpenLegal('PRIVACY')} 
              className="hover:text-[#14a800] transition underline underline-offset-4 cursor-pointer"
            >
              سياسة الخصوصية
            </button>
            <button 
              onClick={() => onOpenLegal('TERMS')} 
              className="hover:text-[#14a800] transition underline underline-offset-4 cursor-pointer"
            >
              الشروط والأحكام
            </button>
            <button 
              onClick={() => onOpenLegal('ABOUT')} 
              className="hover:text-[#14a800] transition underline underline-offset-4 cursor-pointer"
            >
              من نحن
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
