import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus, LeadChannel } from '../../types';
import { 
  PhoneCall, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  Building2, 
  Plus, 
  ArrowRight,
  Filter,
  Check,
  Send,
  HelpCircle
} from 'lucide-react';

export const LeadsCRMView: React.FC = () => {
  const { leads, updateLeadStatus, addLeadNote, properties, users, assignLead } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | LeadStatus>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);

  // New note form state
  const [noteBody, setNoteBody] = useState('');
  const [newStatus, setNewStatus] = useState<LeadStatus>('NEW');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');

  const filteredLeads = leads.filter(l => {
    if (statusFilter === 'ALL') return true;
    return l.status === statusFilter;
  });

  const salesUsers = users.filter(u => ['SALES_USER', 'SUPER_ADMIN', 'OPERATIONS_MANAGER'].includes(u.role));

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !noteBody.trim()) return;

    addLeadNote(selectedLead.id, noteBody.trim());
    if (newStatus !== selectedLead.status) {
      updateLeadStatus(selectedLead.id, newStatus, `تحديث الحالة: ${noteBody.trim()}`);
    }
    if (selectedAssignee && selectedAssignee !== selectedLead.assigned_to) {
      assignLead(selectedLead.id, selectedAssignee);
    }

    // Refresh selected lead
    const updated = leads.find(l => l.id === selectedLead.id);
    if (updated) setSelectedLead(updated);
    setNoteBody('');
  };

  const statusLabels: Record<LeadStatus, { label: string; color: string }> = {
    NEW: { label: 'طلب جديد', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    WHATSAPP_CONTACT_INITIATED: { label: 'تواصل واتساب', color: 'bg-green-100 text-green-900 border-green-300' },
    CALL_CONTACT_INITIATED: { label: 'اتصال هاتفي', color: 'bg-blue-100 text-blue-900 border-blue-300' },
    CONTACTED: { label: 'تم التواصل الأولي', color: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
    FOLLOW_UP: { label: 'متابعة وتجهيز', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    VIEWING: { label: 'معاينة ميدانية', color: 'bg-purple-100 text-purple-900 border-purple-300' },
    WON: { label: 'تمت الصفقة بنجاح 🎉', color: 'bg-emerald-200 text-emerald-950 border-emerald-400 font-bold' },
    LOST: { label: 'غير مهتم / ملغي', color: 'bg-rose-100 text-rose-900 border-rose-300' }
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900">إدارة طلبات المعاينة والاستفسارات (Leads CRM)</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            متابعة العملاء المهتمين، تسجيل المعاينات الميدانية، ومكالمات فريق المبيعات (منع تكرار الـ Leads)
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              statusFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            الكل ({leads.length})
          </button>
          <button
            onClick={() => setStatusFilter('NEW')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              statusFilter === 'NEW' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            جديد
          </button>
          <button
            onClick={() => setStatusFilter('CONTACTED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              statusFilter === 'CONTACTED' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            تم التواصل
          </button>
          <button
            onClick={() => setStatusFilter('VIEWING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              statusFilter === 'VIEWING' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            معاينات
          </button>
          <button
            onClick={() => setStatusFilter('WON')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              statusFilter === 'WON' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ناجح
          </button>
        </div>
      </div>

      {/* Main Grid: Leads Table + Lead Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Leads Table (Left) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredLeads.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 text-xs">
              لا توجد طلبات في هذا التصنيف حالياً.
            </div>
          ) : (
            filteredLeads.map(lead => {
              const prop = properties.find(p => p.id === lead.property_id);
              const isSelected = selectedLead?.id === lead.id;

              return (
                <div
                  key={lead.id}
                  onClick={() => {
                    setSelectedLead(lead);
                    setNewStatus(lead.status);
                    setSelectedAssignee(lead.assigned_to || '');
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 text-right ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                        {lead.customer_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">{lead.customer_name}</h4>
                        <span className="text-[11px] text-slate-500 dir-ltr inline-block">{lead.customer_mobile}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusLabels[lead.status]?.color || 'bg-slate-100 text-slate-700'}`}>
                      {statusLabels[lead.status]?.label || lead.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
                    <span className="font-mono font-bold text-emerald-700">
                      {lead.property_reference || prop?.reference_number || 'عقار عام'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      القناة: <strong>{lead.contact_channel === 'WHATSAPP' ? 'واتساب' : 'اتصال هاتفي'}</strong>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lead.notes?.length || 0} ملاحظات • {lead.activities?.length || 0} أنشطة
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Lead Activity Inspector & Status Changer (Right) */}
        <div className="lg:col-span-5">
          {selectedLead ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-6 text-right animate-in fade-in">
              
              {/* Lead Top Details */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {selectedLead.reference_number}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">{selectedLead.customer_name}</h3>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusLabels[selectedLead.status]?.color || 'bg-slate-100 text-slate-700'}`}>
                    {statusLabels[selectedLead.status]?.label || selectedLead.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <span>الهاتف:</span>
                    <a href={`tel:${selectedLead.customer_mobile}`} className="font-bold text-emerald-700 dir-ltr hover:underline">
                      {selectedLead.customer_mobile}
                    </a>
                  </div>
                  {selectedLead.customer_email && (
                    <div>البريد: <span className="dir-ltr text-slate-800">{selectedLead.customer_email}</span></div>
                  )}
                  <div>
                    العقار المهتم به: <strong className="text-slate-800">{selectedLead.property_title} ({selectedLead.property_reference})</strong>
                  </div>
                  <div>
                    مسؤول المبيعات المعين: <strong className="text-purple-700">{selectedLead.assigned_user_name || 'غير معين'}</strong>
                  </div>
                </div>

                {/* Direct Action triggers */}
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={`https://wa.me/${(selectedLead.customer_mobile || '').replace(/^0/, '20')}?text=${encodeURIComponent(`مرحباً أستاذ ${selectedLead.customer_name}، بخصوص استفسارك عن العقار ${selectedLead.property_reference} على منصة روابط كفر الشيخ.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>مراسلة واتساب</span>
                  </a>

                  <a
                    href={`tel:${selectedLead.customer_mobile}`}
                    className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>اتصال بالعميل</span>
                  </a>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900">سجل الأنشطة والمتابعات ({selectedLead.activities?.length || 0})</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {selectedLead.activities?.map(act => (
                    <div key={act.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{act.activity_type}</span>
                        <span className="text-slate-400">{new Date(act.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-medium">{act.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes History */}
              {selectedLead.notes && selectedLead.notes.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-extrabold text-slate-900">ملاحظات فريق المبيعات ({selectedLead.notes.length})</h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {selectedLead.notes.map(n => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950">
                        <div className="flex items-center justify-between text-[10px] text-amber-800 font-bold mb-1">
                          <span>{n.user_name}</span>
                          <span>{new Date(n.created_at).toLocaleString('ar-EG')}</span>
                        </div>
                        <p>{n.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Note & Status update form */}
              <form onSubmit={handleAddNoteSubmit} className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-900">تسجيل متابعة أو تغيير حالة</h4>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">تحديث الحالة إلى</label>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      <option value="NEW">طلب جديد</option>
                      <option value="CONTACTED">تم التواصل</option>
                      <option value="FOLLOW_UP">متابعة وتجهيز</option>
                      <option value="VIEWING">تحديد موعد معاينة</option>
                      <option value="WON">تمت الصفقة بنجاح 🎉</option>
                      <option value="LOST">غير مهتم / ملغي</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">تعيين الموظف</label>
                    <select
                      value={selectedAssignee}
                      onChange={e => setSelectedAssignee(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      <option value="">بدون تعيين</option>
                      {salesUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    required
                    placeholder="اكتب ملاحظات المكالمة، تفاصيل المعاينة، أو سبب إغلاق الطلب..."
                    value={noteBody}
                    onChange={e => setNoteBody(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>حفظ الملاحظة وتحديث الطلب</span>
                </button>
              </form>

            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-12 text-center border border-dashed border-slate-300 text-slate-400 text-xs">
              اختر طلباً من القائمة للاطلاع على سجله وتسجيل الأنشطة والمعاينات.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
