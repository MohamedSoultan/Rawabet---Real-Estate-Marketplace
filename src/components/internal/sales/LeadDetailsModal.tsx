import React, { useState } from 'react';
import { Lead, LeadStatus, Property } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  FileText, 
  Plus, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  Check
} from 'lucide-react';

interface LeadDetailsModalProps {
  lead: Lead;
  onClose: () => void;
  onViewProperty?: (propertyId: string) => void;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({
  lead,
  onClose,
  onViewProperty
}) => {
  const { 
    currentUser, 
    updateLeadStatus, 
    addLeadNote, 
    scheduleFollowUp, 
    markLeadContacted,
    properties 
  } = useApp();

  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead.status);
  const [newNote, setNewNote] = useState('');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNote, setFollowUpNote] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const [showCallForm, setShowCallForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const matchedProperty = properties.find(p => p.id === lead.property_id);

  const handleStatusChange = (status: LeadStatus) => {
    setCurrentStatus(status);
    updateLeadStatus(lead.id, status);
    setToastMessage(`تم تحديث حالة الطلب إلى: ${status}`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addLeadNote(lead.id, newNote.trim());
    setNewNote('');
    setToastMessage('تم إضافة الملاحظة بنجاح');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleLogCall = (e: React.FormEvent) => {
    e.preventDefault();
    markLeadContacted(lead.id, callNotes.trim() || undefined);
    setCallNotes('');
    setShowCallForm(false);
    setCurrentStatus('CONTACTED');
    setToastMessage('تم تسجيل نتيجة الاتصال الهاتفي');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpDate) return;
    scheduleFollowUp(lead.id, followUpDate, followUpNote.trim() || undefined);
    setFollowUpDate('');
    setFollowUpNote('');
    setShowScheduleForm(false);
    setCurrentStatus('FOLLOW_UP');
    setToastMessage('تم جدولة المتابعة بنجاح');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const statusColors: Record<LeadStatus, { label: string; bg: string; text: string }> = {
    NEW: { label: 'طلب جديد', bg: 'bg-emerald-100', text: 'text-emerald-900' },
    WHATSAPP_CONTACT_INITIATED: { label: 'تواصل واتساب', bg: 'bg-green-100', text: 'text-green-900' },
    CALL_CONTACT_INITIATED: { label: 'اتصال هاتفي', bg: 'bg-blue-100', text: 'text-blue-900' },
    CONTACTED: { label: 'تم التواصل', bg: 'bg-cyan-100', text: 'text-cyan-900' },
    INTERESTED: { label: 'مهتم وجاد', bg: 'bg-indigo-100', text: 'text-indigo-900' },
    FOLLOW_UP: { label: 'متابعة لاحقة', bg: 'bg-amber-100', text: 'text-amber-900' },
    VIEWING: { label: 'معاينة ميدانية', bg: 'bg-purple-100', text: 'text-purple-900' },
    WON: { label: 'صفقة ناجحة 🎉', bg: 'bg-emerald-200 font-bold', text: 'text-emerald-950' },
    LOST: { label: 'غير مهتم / ملغي', bg: 'bg-rose-100', text: 'text-rose-900' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-soft-fade text-right font-sans">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">{lead.customer_name}</h3>
                <span className="font-mono text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-md border border-slate-700">
                  {lead.reference_number}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${statusColors[currentStatus]?.bg} ${statusColors[currentStatus]?.text}`}>
                  {statusColors[currentStatus]?.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                تاريخ الطلب: {new Date(lead.created_at).toLocaleDateString('ar-EG')} • المصدر: {lead.source || 'الموقع الإلكتروني'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert if any */}
        {toastMessage && (
          <div className="px-6 py-2.5 bg-emerald-50 text-emerald-900 border-b border-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Top Row: Customer Info + Property Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Customer Contact Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                <span>بيانات العميل</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-400 font-medium">الاسم:</span>
                  <span className="font-bold text-slate-900">{lead.customer_name}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-400 font-medium">الهاتف:</span>
                  <div className="flex items-center gap-2">
                    <a 
                      href={`tel:${lead.customer_mobile}`} 
                      className="font-mono font-bold text-slate-900 hover:text-emerald-600 flex items-center gap-1"
                      dir="ltr"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{lead.customer_mobile}</span>
                    </a>
                  </div>
                </div>

                {lead.customer_email && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-400 font-medium">البريد الإلكتروني:</span>
                    <span className="font-mono text-slate-700">{lead.customer_email}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium">المسؤول عن الطلب:</span>
                  <span className="font-bold text-slate-800">{lead.assigned_user_name || 'غير معين'}</span>
                </div>
              </div>
            </div>

            {/* Requested Property Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>العقار المطلوب</span>
                </h4>
                {lead.property_reference && (
                  <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-slate-700">
                    كود: {lead.property_reference}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-900 line-clamp-2">
                  {lead.property_title || 'عقار عبر منصة روابط'}
                </div>

                {matchedProperty && (
                  <div className="pt-2">
                    {onViewProperty && (
                      <button
                        type="button"
                        onClick={() => onViewProperty(matchedProperty.id)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>معاينة تفاصيل العقار كاملة</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Status Changer Bar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <label className="block text-xs font-black text-slate-900">تحديث مرحلة الطلب (Pipeline Status):</label>
            <div className="flex flex-wrap items-center gap-2">
              {(['NEW', 'CONTACTED', 'INTERESTED', 'FOLLOW_UP', 'VIEWING', 'WON', 'LOST'] as LeadStatus[]).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusChange(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    currentStatus === st
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {statusColors[st]?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setShowCallForm(!showCallForm); setShowScheduleForm(false); }}
              className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>تسجيل مكالمة هاتفية مع العميل</span>
            </button>

            <button
              type="button"
              onClick={() => { setShowScheduleForm(!showScheduleForm); setShowCallForm(false); }}
              className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>جدولة موعد متابعة لاحقة</span>
            </button>
          </div>

          {/* Call Logging Form */}
          {showCallForm && (
            <form onSubmit={handleLogCall} className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3 animate-soft-fade text-xs">
              <h5 className="font-black text-emerald-950">تسجيل نتائج الاتصال الهاتفي</h5>
              <textarea
                rows={2}
                value={callNotes}
                onChange={e => setCallNotes(e.target.value)}
                placeholder="ملخص المكالمة: رغبة العميل، توقيت الاتصال المناسب، أو أي تفاصيل أخرى..."
                className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden resize-none"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowCallForm(false)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700">
                  إلغاء
                </button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold">
                  حفظ نتيجة الاتصال
                </button>
              </div>
            </form>
          )}

          {/* Follow Up Scheduling Form */}
          {showScheduleForm && (
            <form onSubmit={handleScheduleFollowUp} className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3 animate-soft-fade text-xs">
              <h5 className="font-black text-amber-950">جدولة متابعة لاحقة</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">تاريخ المتابعة:</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={followUpDate}
                    onChange={e => setFollowUpDate(e.target.value)}
                    className="w-full p-2 bg-white border border-amber-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">ملاحظة التذكير:</label>
                  <input
                    type="text"
                    value={followUpNote}
                    onChange={e => setFollowUpNote(e.target.value)}
                    placeholder="مثال: الاتصال بعد صلاة العصر للتأكيد"
                    className="w-full p-2 bg-white border border-amber-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowScheduleForm(false)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700">
                  إلغاء
                </button>
                <button type="submit" className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold">
                  تأكيد جدولة المتابعة
                </button>
              </div>
            </form>
          )}

          {/* Internal Notes & History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Notes Section */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>الملاحظات الداخلية ({lead.notes?.length || 0})</span>
              </h4>

              {/* Add Note Input */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="أضف ملاحظة داخلية جديدة حول العميل أو الصفقة..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-emerald-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 mr-auto cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة ملاحظة</span>
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pt-2">
                {!lead.notes || lead.notes.length === 0 ? (
                  <p className="text-[11px] text-slate-400 font-medium py-3 text-center">لا توجد ملاحظات مسجلة بعد</p>
                ) : (
                  lead.notes.map(note => (
                    <div key={note.id} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">{note.user_name}</span>
                        <span className="text-slate-400">{new Date(note.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">{note.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Activities Timeline */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>الملاحظات الداخلية ({lead.notes?.length || 0})</span>
              </h4>

              {/* Add Note Input */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="أضف ملاحظة داخلية جديدة حول العميل أو الصفقة..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-emerald-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 mr-auto cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة ملاحظة</span>
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pt-2">
                {!lead.notes || lead.notes.length === 0 ? (
                  <p className="text-[11px] text-slate-400 font-medium py-3 text-center">لا توجد ملاحظات مسجلة بعد</p>
                ) : (
                  lead.notes.map(note => (
                    <div key={note.id} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">{note.user_name}</span>
                        <span className="text-slate-400">{new Date(note.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">{note.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Activities Timeline */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>سجل النشاط والتفاعل ({lead.activities?.length || 0})</span>
              </h4>

              <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                {!lead.activities || lead.activities.length === 0 ? (
                  <p className="text-[11px] text-slate-400 font-medium py-3 text-center">لا توجد سجلات نشاط سابقة</p>
                ) : (
                  lead.activities.map(act => (
                    <div key={act.id} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">{act.created_by_name}</span>
                        <span className="text-slate-400">{new Date(act.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                      <p className="text-slate-600 font-medium">{act.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
