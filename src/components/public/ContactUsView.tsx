import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  Building2, 
  HelpCircle,
  PhoneCall,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ContactUsViewProps {
  onExploreProperties?: () => void;
}

export const ContactUsView: React.FC<ContactUsViewProps> = ({ onExploreProperties }) => {
  const { settings, submitContactInquiry, currentUser } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'BUYER_INQUIRY' | 'SELLER_SUPPORT' | 'GENERAL' | 'PARTNERSHIP' | 'COMPLAINT'>('BUYER_INQUIRY');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !mobile.trim() || !message.trim() || !subject.trim()) {
      setErrorMsg('يرجى ملء جميع الحقول المطلوبة للتواصل.');
      return;
    }

    submitContactInquiry({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
      category
    });

    setIsSubmitted(true);
    setSubject('');
    setMessage('');
    setTimeout(() => {
      setIsSubmitted(false);
    }, 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 font-sans text-right">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#f2f7f2] text-[#14a800] border border-[#14a800]/30 text-xs font-black">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>خدمة عملاء ومعاينات روابط</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#001e00]">
          تواصل مع فريق روابط
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          فريقنا معاك خطوة بخطوة عشان يجاوب على كل استفساراتك وينسق معاك المعاينات في أي وقت.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main Channels Card */}
          <div className="bg-[#001e00] text-white p-6 rounded-xl border border-[#003a00] shadow-xl space-y-5">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#14a800]" />
              <span>قنوات الاتصال المباشرة</span>
            </h3>

            <div className="space-y-4 text-xs">
              <a 
                href={`tel:${settings?.primary_phone || '01000920759'}`}
                className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#14a800] text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-slate-400 font-medium text-[11px]">الخط الساخن للمبيعات والمعاينات</div>
                  <div className="text-white font-black text-sm dir-ltr text-right">{settings?.primary_phone || '01000920759'}</div>
                </div>
              </a>

              <a 
                href={`https://wa.me/${(settings?.primary_whatsapp || settings?.whatsapp_phone || '201000920759').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#25d366] text-slate-950 flex items-center justify-center shrink-0 font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-slate-400 font-medium text-[11px]">خدمة وتساب الفورية</div>
                  <div className="text-white font-black text-sm dir-ltr text-right">{settings?.primary_whatsapp || settings?.whatsapp_phone || settings?.primary_phone || '01000920759'}</div>
                </div>
              </a>

              <a 
                href={`mailto:${settings?.support_email || 'contact@rawabet-eg.com'}`}
                className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-slate-400 font-medium text-[11px]">البريد الإلكتروني الرسمي</div>
                  <div className="text-white font-bold text-xs">{settings?.support_email || 'contact@rawabet-eg.com'}</div>
                </div>
              </a>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-[#14a800] shrink-0 mt-0.5" />
                <span>{settings?.official_address || 'كفر الشيخ، حي المحافظة، أمام ديوان عام المحافظة'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Clock className="w-4 h-4 text-[#14a800] shrink-0" />
                <span>مواعيد العمل: يومياً من 9:00 ص حتى 10:00 م</span>
              </div>
            </div>
          </div>

          {/* Assurance Note */}
          <div className="p-5 bg-white rounded-xl border border-[#e4ebe4] shadow-2xs space-y-2 text-xs">
            <div className="flex items-center gap-2 font-black text-[#001e00]">
              <ShieldCheck className="w-4 h-4 text-[#14a800]" />
              <span>ضمان الرد السريع</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              يتواصل معك أحد مستشارينا العقاريين خلال أقل من ساعتين عمل لترتيب موعد المعاينة أو الإجابة على أي استفسار.
            </p>
          </div>

        </div>

        {/* Right Side: Interactive Inquiry Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-[#e4ebe4] shadow-2xs space-y-5">
          <div className="border-b border-[#e4ebe4] pb-3">
            <h3 className="text-lg font-black text-[#001e00]">أرسل استفسارك مباشرة</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              سيتم تسجيل رسالتك في نظام الدعم الفني والمبيعات للتواصل معك هاتفياً
            </p>
          </div>

          {isSubmitted && (
            <div className="p-4 bg-[#f2f7f2] border border-[#14a800]/30 rounded-xl text-xs font-bold text-[#001e00] flex items-center gap-3 animate-soft-fade">
              <CheckCircle2 className="w-5 h-5 text-[#14a800] shrink-0" />
              <div>
                <div className="font-black text-sm">تم إرسال رسالتك بنجاح!</div>
                <div className="text-slate-600 font-normal mt-0.5">
                  شكراً لتواصلك معنا، سيقوم فريق خدمة عملاء روابط بالاتصال بك قريباً.
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Category Select */}
            <div>
              <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">
                نوع الاستفسار أو الطلب <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    { id: 'BUYER_INQUIRY', label: 'حجز معاينة عقار' },
                    { id: 'SELLER_SUPPORT', label: 'إضافة ودعم عقار' },
                    { id: 'PARTNERSHIP', label: 'شراكة ووسطاء' },
                    { id: 'GENERAL', label: 'استفسار عام' }
                  ] as const
                ).map(cat => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center cursor-pointer whitespace-nowrap ${
                      category === cat.id
                        ? 'bg-[#14a800] text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">
                  الاسم الكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: م. أحمد الشناوي"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">
                  رقم الهاتف للتواصل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="010XXXXXXXX"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800] dir-ltr text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">
                  موضوع الرسالة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: استفسار عن مواعيد المعاينات في كفر الشيخ"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#001e00] mb-1.5 whitespace-nowrap">
                نص الرسالة أو الاستفسار بالتفصيل <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="اكتب تفاصيل طلبك، كود العقار إن وجد، أو الوقت المفضل للاتصال بك..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#14a800]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-black rounded-xl transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              <span>ابعت رسالتك لفريق روابط</span>
            </button>

          </form>
        </div>

      </div>

    </div>
  );
};
