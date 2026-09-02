import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  PhoneCall, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Save, 
  HelpCircle,
  Clock,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const SystemSettingsView: React.FC = () => {
  const { settings, updateSettings, helpResources, addHelpResource, hasPermission } = useApp();

  const [primaryPhone, setPrimaryPhone] = useState(settings.primary_phone || '01099887766');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsapp_number || '01099887766');
  const [supportEmail, setSupportEmail] = useState(settings.support_email || 'support@rawabet.com');
  const [reviewHours, setReviewHours] = useState<string>(String(settings.property_review_sla_hours || 24));
  const [termsArabic, setTermsArabic] = useState(settings.terms_and_conditions_ar || '');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New help resource
  const [newHelpTitle, setNewHelpTitle] = useState('');
  const [newHelpUrl, setNewHelpUrl] = useState('');
  const [newHelpType, setNewHelpType] = useState<'PDF' | 'VIDEO' | 'GUIDE'>('GUIDE');

  const canEditSettings = true;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      primary_phone: primaryPhone.trim(),
      whatsapp_number: whatsappNumber.trim(),
      support_email: supportEmail.trim(),
      property_review_sla_hours: Number(reviewHours) || 24,
      terms_and_conditions_ar: termsArabic
    });

    setToastMsg('تم حفظ إعدادات النظام بنجاح!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddHelp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHelpTitle.trim()) return;

    addHelpResource({
      title: newHelpTitle.trim(),
      type: newHelpType,
      url: newHelpUrl.trim() || 'https://rawabet.com/guide',
      category: 'SELLER'
    });

    setToastMsg('تمت إضافة المورد التعليمي بنجاح!');
    setNewHelpTitle('');
    setNewHelpUrl('');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-8 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900">إعدادات النظام وأرقام التواصل الرسمية (Settings)</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            التحكم بأرقام الهواتف الرسمية الظاهرة للعملاء، فترة المراجعة المستهدفة (SLA)، والنصوص القانونية
          </p>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-600" />
          <span>قنوات الاتصال الرسمية لمنصة روابط</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الخط الساخن الرسمي (للاتصالات)</label>
            <div className="relative">
              <input
                type="tel"
                required
                value={primaryPhone}
                onChange={e => setPrimaryPhone(e.target.value)}
                className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold dir-ltr text-right"
              />
              <PhoneCall className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">رقم الواتساب الرسمي (للرسائل)</label>
            <div className="relative">
              <input
                type="tel"
                required
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
                className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold dir-ltr text-right"
              />
              <PhoneCall className="w-4 h-4 text-emerald-500 absolute right-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني للدعم</label>
            <div className="relative">
              <input
                type="email"
                required
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold dir-ltr text-right"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">المدة المستهدفة لمراجعة العقارات (SLA Hours)</label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={72}
                value={reviewHours}
                onChange={e => setReviewHours(e.target.value)}
                className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
              <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">الشروط والأحكام وسياسة الخصوصية (Arabic Legal Terms)</label>
          <textarea
            rows={4}
            value={termsArabic}
            onChange={e => setTermsArabic(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
          ></textarea>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>حفظ الإعدادات المحدثة</span>
          </button>
        </div>
      </form>

      {/* Help Resources Management (A-14) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <span>إدارة دليل المالك والموارد الإرشادية (Help Resources)</span>
        </h3>

        {/* Add Help Resource Form */}
        <form onSubmit={handleAddHelp} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              required
              placeholder="عنوان المورد (مثال: دليل فحص تراخيص البناء)"
              value={newHelpTitle}
              onChange={e => setNewHelpTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>

          <div>
            <select
              value={newHelpType}
              onChange={e => setNewHelpType(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
            >
              <option value="GUIDE">مقال إرشادي</option>
              <option value="PDF">كتيب PDF قابل للتحميل</option>
              <option value="VIDEO">فيديو توضيحي (YouTube)</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة المورد</span>
            </button>
          </div>
        </form>

        {/* Existing Resources List */}
        <div className="space-y-2">
          {helpResources.map(hr => (
            <div key={hr.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                  {hr.type}
                </span>
                <span className="font-bold text-slate-800">{hr.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{hr.url}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
