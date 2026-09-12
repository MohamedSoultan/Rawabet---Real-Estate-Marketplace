import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  FileText, 
  Video, 
  ShieldCheck, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';

interface HelpGuideViewProps {
  onOpenAddProperty: () => void;
}

export const HelpGuideView: React.FC<HelpGuideViewProps> = ({ onOpenAddProperty }) => {
  const { helpResources, settings } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'لماذا لا تظهر أرقام هواتف الملاك أو عناوينهم الدقيقة على الموقع العام؟',
      a: 'تلتزم منصة روابط بحماية سرية وخصوصية أصحاب العقارات والوسطاء، وتجنبهم الاتصالات المزعجة والسماسرة العشوائيين. تتم كافة الاستفسارات وترتيب المعاينات الميدانية عبر فريق روابط الرسمي وممثلي المبيعات المعتمدين.'
    },
    {
      q: 'كم يستغرق فحص ومراجعة العقار بعد إرساله؟',
      a: 'يتم فحص العقار والتحقق من صحة الصور والبيانات السعرية عبر مراجعي روابط خلال فترة تتراوح بين ساعتين إلى 24 ساعة كحد أقصى.'
    },
    {
      q: 'كيف يعمل نظام النسخ (Revisions) عند تعديل عقار معتمد ومنشور؟',
      a: 'عند قيامك بتعديل السعر أو المواصفات لعقار منشور، يظل العقار الأصلي معروضاً للجمهور بدون انقطاع، بينما تنشأ نسخة جديدة تخضع لفحص سريع من الإدارة ثم تُنشر فور اعتمادها لتحل محل النسخة السابقة.'
    },
    {
      q: 'ما هي مميزات الحصول على شارة "موثق من روابط" للبائعين والمكاتب؟',
      a: 'توثيق الحساب يمنح عقاراتك شارة التوثيق الذهبية، وأولوية الظهور في نتائج البحث المتقدمة، وسرعة في إتمام المعاينات مع المشترين الجادين.'
    },
    {
      q: 'هل توجد رسوم على إضافة العقار؟',
      a: 'إضافة العقار وفحصه مجاني تماماً على منصة روابط. تُستحق عمولة الوساطة المتفق عليها فقط عند إتمام صفقة البيع أو التأجير بنجاح.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-right">
      
      {/* Hero Guide Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-xl p-8 sm:p-10 border border-emerald-800/40 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
          <HelpCircle className="w-4 h-4" />
          <span>مركز المساعدة وإرشادات روابط</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">
          دليل الملاك والوسطاء والمشترين
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
          اعرف إزاي تعرض عقارك بأعلى جودة، وشروط نشر العروض، وإزاي بنحمي بياناتك وسريتك من أي إزعاج.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAddProperty}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold rounded-xl transition shadow-lg shadow-emerald-600/30"
          >
            + أضف عقارك
          </button>

          <a
            href={`tel:${settings.primary_phone}`}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl transition border border-white/20 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>كلمنا مباشرة: {settings.primary_phone}</span>
          </a>
        </div>
      </div>

      {/* 4-Step How Rawabet Works Workflow */}
      <div className="space-y-6">
        <div className="text-right space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">كيف تعمل منصة روابط؟</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl leading-relaxed">
            يقوم فريق روابط بمراجعة الطلبات وتنظيم المعاينات ومرافقة العميل وتنسيق المواعيد لتوفير الوقت والجهد والوصول إلى القرار المناسب.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-[#f2f7f2] text-[#14a800] font-black flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">ابحث واكتشف العقارات المناسبة</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              استعراض خيارات متنوعة وموثقة تناسب متطلباتك وميزانيتك بدقة ووضوح.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-[#f2f7f2] text-[#14a800] font-black flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">قارن الخيارات المتاحة</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              مقارنة الأسعار والمواصفات والمواقع لاختيار الأنسب لك بكل سهولة وشفافية.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-[#f2f7f2] text-[#14a800] font-black flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">تواصل مع فريق روابط</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              تواصل مباشر مع فريقنا للإجابة على استفساراتك وتوضيح كافة التفاصيل.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-[#14a800] text-white font-black flex items-center justify-center text-sm">
              4
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">نظم المعاينة واتخذ قرارك بثقة</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              تنسيق موعد معاينة ميدانية بمرافقة فريق روابط للتحقق الميداني والاطمئنان.
            </p>
          </div>

        </div>

        {/* Customer Service Message */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#f2f7f2] border border-[#14a800]/20 flex items-center gap-3">
          <div className="p-2.5 bg-[#14a800] text-white rounded-xl shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#001e00]">
            يتواصل معك فريق خدمة عملاء روابط لمساعدتك والإجابة على استفساراتك وتنظيم خطواتك القادمة.
          </p>
        </div>
      </div>

      {/* Downloadable Guides and Video Resources (U-11) */}
      <div className="space-y-6">
        <div className="text-right">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">الموارد التعليمية والكتيبات الإرشادية</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">كتيبات PDF وفيديوهات تدريبية لكيفية تصوير العقارات وتجهيز المستندات</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">دليل تصوير العقارات الاحترافي</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                كتيب إرشادي شامل من 12 صفحة يشرح زوايا التصوير والإضاءة لزيادة جاذبية عقارك.
              </p>
            </div>
            <button 
              onClick={() => alert('جاري تجهيز وتحميل ملف الدليل بصيغة PDF...')}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span>تحميل دليل التصوير (PDF)</span>
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">دليل توثيق الملكية والأوراق القانونية</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                شرح للمستندات المطلوبة (عقد مسجل، صحة توقيع، تراخيص البناء، شهادة البيانات).
              </p>
            </div>
            <button 
              onClick={() => alert('جاري تجهيز وتحميل ملف الأوراق القانونية بصيغة PDF...')}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span>تحميل المستندات القانونية (PDF)</span>
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">شرح فيديو: كيفية إضافة عقار وتعديله</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                فيديو قصير يوضح خطوات استخدام المنصة ونظام النسخ للمبتدئين.
              </p>
            </div>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>مشاهدة الفيديو على يوتيوب</span>
            </a>
          </div>

        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-xl font-black text-slate-900">الأسئلة الأكثر شيوعاً (FAQ)</h2>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-right flex items-center justify-between gap-4 font-extrabold text-sm text-slate-900 hover:text-emerald-700 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>

                {isOpen && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed font-medium animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
