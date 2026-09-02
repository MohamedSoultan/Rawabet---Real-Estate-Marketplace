import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  Target, 
  Sparkles, 
  MapPin, 
  PhoneCall, 
  FileCheck2, 
  Award,
  Lock,
  Compass,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AboutUsViewProps {
  onExploreProperties: () => void;
  onContactUs: () => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({
  onExploreProperties,
  onContactUs
}) => {
  const { settings, governorates, cities } = useApp();

  const activeCitiesCount = cities.filter(c => c.is_active).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 font-sans text-right">
      
      {/* Hero Section */}
      <section className="bg-[#001e00] text-white rounded-3xl p-6 sm:p-12 border border-[#003a00] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#14a800]/15 rounded-full blur-3xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002f00] text-[#14a800] border border-[#14a800]/30 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>منصة روابط العقارية المعتمدة</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            نحن نبني المعيار الجديد للسوق العقاري في كفر الشيخ والدلتا
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            تأسست "روابط" لمعالجة التحديات التاريخية في السوق العقاري المحلي: العشوائية في الإعلانات، الاتصالات المزعجة، ونشر أرقام الملاك دون حماية. نحن المنصة الأولى التي تضمن فحص كل عقار هندسياً وتنظيم المعاينات الميدانية الرسمية بدون كشف بيانات المالك.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExploreProperties}
              className="px-6 py-3 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-black rounded-xl transition shadow-2xs flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span>تصفح العقارات المعتمدة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onContactUs}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-black rounded-xl transition cursor-pointer whitespace-nowrap"
            >
              <span>تواصل مع الإدارة</span>
            </button>
          </div>
        </div>
      </section>

      {/* Numbers & Impact */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-[#e4ebe4] shadow-2xs space-y-1">
          <div className="text-2xl sm:text-3xl font-black text-[#14a800]">100%</div>
          <div className="text-xs font-bold text-[#001e00]">عقارات مفحوصة وموثقة</div>
          <p className="text-[11px] text-slate-500 font-medium">كل إعلان يخضع لمراجعة دقيقة قبل اعتماده للنشر</p>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-[#e4ebe4] shadow-2xs space-y-1">
          <div className="text-2xl sm:text-3xl font-black text-[#001e00]">0</div>
          <div className="text-xs font-bold text-[#001e00]">أرقام هواتف منشورة</div>
          <p className="text-[11px] text-slate-500 font-medium">حماية كاملة للملاك من الإزعاج والوسطاء غير المعتمدين</p>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-[#e4ebe4] shadow-2xs space-y-1">
          <div className="text-2xl sm:text-3xl font-black text-[#14a800]">{activeCitiesCount}+</div>
          <div className="text-xs font-bold text-[#001e00]">مراكز ومدن مغطاة</div>
          <p className="text-[11px] text-slate-500 font-medium">تغطية جغرافية شاملة لمحافظة كفر الشيخ والمناطق المجاورة</p>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-[#e4ebe4] shadow-2xs space-y-1">
          <div className="text-2xl sm:text-3xl font-black text-[#001e00]">24/7</div>
          <div className="text-xs font-bold text-[#001e00]">خدمة عملاء ومعاينات</div>
          <p className="text-[11px] text-slate-500 font-medium">مرافقة ميدانية احترافية للمشترين حتى إتمام التعاقد</p>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-[#001e00]">ركائز نموذج عمل "روابط"</h2>
          <p className="text-xs text-slate-500 font-medium">
            قيم راسخة تضمن الشفافية والراحة للمشتري والبائع على حد سواء
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#e4ebe4] shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f2f7f2] text-[#14a800] flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-[#001e00]">السرية التامة وحماية البائع</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              لا نقوم أبداً بنشر رقم هاتف المالك أو عنوانه الدقيق على الإنترنت، مما يحميك تماماً من المكالمات العشوائية والتطفل.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#e4ebe4] shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f2f7f2] text-[#14a800] flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-[#001e00]">الفحص الميداني والهندسي</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              يقوم فريق روابط بمعاينة كل عقار للتأكد من صحة الصور والمساحة وجودة التشطيب وتوفر المرافق الأساسية قبل النشر.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#e4ebe4] shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f2f7f2] text-[#14a800] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-[#001e00]">تنظيم المعاينات الجادة</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              يتولى فريق المبيعات فلترة طلبات الشراء ومرافقة المشترين الجادين في مواعيد محددة بدقة لتوفير وقت وجهد المالك.
            </p>
          </div>
        </div>
      </section>

      {/* Official Address & Geographic Coverage */}
      <section className="bg-[#f2f7f2] p-6 sm:p-8 rounded-3xl border border-[#14a800]/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#14a800]">
            <MapPin className="w-5 h-5" />
            <h3 className="text-sm font-black text-[#001e00]">المقر الرئيسي والتغطية الميدانية</h3>
          </div>
          <p className="text-xs text-slate-700 font-bold">
            {settings.official_address || 'كفر الشيخ، حي المحافظة، أمام ديوان عام المحافظة'}
          </p>
          <p className="text-xs text-slate-500 font-medium">
            نغطي مدينة كفر الشيخ، دسوق، بيلا، بلطيم، مطوبس، الرياض، قلين، سيدي سالم، فوه، وكافة مراكز الدلتا.
          </p>
        </div>

        <button
          type="button"
          onClick={onContactUs}
          className="px-6 py-3 bg-[#001e00] hover:bg-[#14a800] text-white text-xs font-black rounded-xl transition shadow-2xs cursor-pointer whitespace-nowrap"
        >
          طلب اجتماع أو استشارة عقارية
        </button>
      </section>

    </div>
  );
};
