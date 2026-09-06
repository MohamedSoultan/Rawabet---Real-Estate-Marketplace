import React, { useState, useMemo } from 'react';
import { Lead, LeadStatus, Property } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { LeadDetailsModal } from './LeadDetailsModal';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  Building2, 
  Clock, 
  CheckCircle2, 
  ChevronLeft, 
  Filter,
  Sparkles,
  TrendingUp,
  Award,
  Eye
} from 'lucide-react';

interface SalesWorkspaceProps {
  onSelectProperty?: (property: Property) => void;
}

export const SalesWorkspace: React.FC<SalesWorkspaceProps> = ({ onSelectProperty }) => {
  const { leads, properties, users } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Grouped stats for KPI cards
  const stats = useMemo(() => {
    const newLeads = leads.filter(l => l.status === 'NEW' || l.status === 'WHATSAPP_CONTACT_INITIATED' || l.status === 'CALL_CONTACT_INITIATED');
    const contacted = leads.filter(l => l.status === 'CONTACTED');
    const interested = leads.filter(l => l.status === 'INTERESTED');
    const followUp = leads.filter(l => l.status === 'FOLLOW_UP');
    const viewing = leads.filter(l => l.status === 'VIEWING');
    const won = leads.filter(l => l.status === 'WON');
    const lost = leads.filter(l => l.status === 'LOST');

    return {
      newCount: newLeads.length,
      contactedCount: contacted.length,
      interestedCount: interested.length,
      followUpCount: followUp.length,
      viewingCount: viewing.length,
      wonCount: won.length,
      lostCount: lost.length,
      total: leads.length
    };
  }, [leads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = lead.customer_name?.toLowerCase().includes(q);
        const matchesPhone = lead.customer_mobile?.includes(q);
        const matchesRef = lead.reference_number?.toLowerCase().includes(q);
        const matchesProp = lead.property_title?.toLowerCase().includes(q) || lead.property_reference?.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesRef && !matchesProp) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'NEW_GROUP') {
          return lead.status === 'NEW' || lead.status === 'WHATSAPP_CONTACT_INITIATED' || lead.status === 'CALL_CONTACT_INITIATED';
        }
        return lead.status === statusFilter;
      }

      return true;
    });
  }, [leads, searchQuery, statusFilter]);

  const statusBadgeInfo: Record<LeadStatus, { label: string; bg: string; text: string }> = {
    NEW: { label: 'طلب جديد', bg: 'bg-emerald-100', text: 'text-emerald-900' },
    WHATSAPP_CONTACT_INITIATED: { label: 'واتساب', bg: 'bg-green-100', text: 'text-green-900' },
    CALL_CONTACT_INITIATED: { label: 'اتصال هاتفي', bg: 'bg-blue-100', text: 'text-blue-900' },
    CONTACTED: { label: 'تم الاتصال', bg: 'bg-cyan-100', text: 'text-cyan-900' },
    INTERESTED: { label: 'مهتم وجاد', bg: 'bg-indigo-100', text: 'text-indigo-900' },
    FOLLOW_UP: { label: 'متابعة لاحقة', bg: 'bg-amber-100', text: 'text-amber-900' },
    VIEWING: { label: 'معاينة ميدانية', bg: 'bg-purple-100', text: 'text-purple-900' },
    WON: { label: 'صفقة ناجحة', bg: 'bg-emerald-200 font-bold', text: 'text-emerald-950' },
    LOST: { label: 'ملغي / غير مهتم', bg: 'bg-rose-100', text: 'text-rose-900' }
  };

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Overview KPI Cards (Phase 6) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* New Leads */}
        <div 
          onClick={() => setStatusFilter('NEW_GROUP')}
          className={`p-4 rounded-xl border transition cursor-pointer shadow-xs ${
            statusFilter === 'NEW_GROUP' 
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20' 
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 block">طلبات جديدة</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.newCount}</div>
          <span className="text-[10px] text-emerald-700 font-bold">بحاجة لمتابعة سريعة</span>
        </div>

        {/* Contacted */}
        <div 
          onClick={() => setStatusFilter('CONTACTED')}
          className={`p-4 rounded-xl border transition cursor-pointer shadow-xs ${
            statusFilter === 'CONTACTED' 
              ? 'bg-cyan-50 border-cyan-300 ring-2 ring-cyan-400/20' 
              : 'bg-white border-slate-200 hover:border-cyan-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 block">تم التواصل</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.contactedCount}</div>
          <span className="text-[10px] text-cyan-700 font-bold">بانتظار الرد</span>
        </div>

        {/* Interested */}
        <div 
          onClick={() => setStatusFilter('INTERESTED')}
          className={`p-4 rounded-xl border transition cursor-pointer shadow-xs ${
            statusFilter === 'INTERESTED' 
              ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-400/20' 
              : 'bg-white border-slate-200 hover:border-indigo-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 block">عملاء مهتمون</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.interestedCount}</div>
          <span className="text-[10px] text-indigo-700 font-bold">جاهزية عالية للشراء</span>
        </div>

        {/* Follow Up */}
        <div 
          onClick={() => setStatusFilter('FOLLOW_UP')}
          className={`p-4 rounded-xl border transition cursor-pointer shadow-xs ${
            statusFilter === 'FOLLOW_UP' 
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20' 
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 block">متابعة مجدولة</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.followUpCount}</div>
          <span className="text-[10px] text-amber-700 font-bold">تذكيرات معلقة</span>
        </div>

        {/* Viewing */}
        <div 
          onClick={() => setStatusFilter('VIEWING')}
          className={`p-4 rounded-xl border transition cursor-pointer shadow-xs ${
            statusFilter === 'VIEWING' 
              ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400/20' 
              : 'bg-white border-slate-200 hover:border-purple-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 block">معاينات ميدانية</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.viewingCount}</div>
          <span className="text-[10px] text-purple-700 font-bold">زيارات العقارات</span>
        </div>

        {/* Won */}
        <div 
          onClick={() => setStatusFilter('WON')}
          className={`p-4 rounded-xl border transition cursor-pointer shadow-xs ${
            statusFilter === 'WON' 
              ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-500/20' 
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 block">صفقات منتهية 🎉</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">{stats.wonCount}</div>
          <span className="text-[10px] text-emerald-800 font-bold">تم إتمام التعاقد</span>
        </div>

      </div>

      {/* Main CRM Workspace Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Header & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم العميل، الهاتف، أو كود العقار..."
              className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:bg-white focus:outline-hidden focus:border-emerald-500"
          >
            <option value="ALL">كافة المراحل والطلبات ({stats.total})</option>
            <option value="NEW_GROUP">الطلبات الجديدة ({stats.newCount})</option>
            <option value="CONTACTED">تم التواصل ({stats.contactedCount})</option>
            <option value="INTERESTED">عملاء مهتمون ({stats.interestedCount})</option>
            <option value="FOLLOW_UP">متابعات لاحقة ({stats.followUpCount})</option>
            <option value="VIEWING">معاينات ميدانية ({stats.viewingCount})</option>
            <option value="WON">صفقات رابحة ({stats.wonCount})</option>
            <option value="LOST">ملغية / غير مهتم ({stats.lostCount})</option>
          </select>

          {/* Reset Filters */}
          {(searchQuery || statusFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
            >
              مسح الفلاتر
            </button>
          )}

        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          {filteredLeads.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">لا توجد طلبات عملاء مطابقة للبحث</h4>
              <p className="text-xs text-slate-500 font-medium">جرب تغيير معايير البحث أو تصفية الحالات</p>
            </div>
          ) : (
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5 pr-6">العميل</th>
                  <th className="p-3.5">الهاتف</th>
                  <th className="p-3.5">العقار المطلوب</th>
                  <th className="p-3.5">المرحلة الحالية</th>
                  <th className="p-3.5">تاريخ الطلب</th>
                  <th className="p-3.5">المسؤول</th>
                  <th className="p-3.5 pl-6 text-left">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredLeads.map(lead => {
                  const badge = statusBadgeInfo[lead.status] || { label: lead.status, bg: 'bg-slate-100', text: 'text-slate-800' };

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                      
                      {/* Customer Name */}
                      <td className="p-3.5 pr-6">
                        <div className="font-bold text-slate-900">{lead.customer_name}</div>
                        <span className="text-[10px] text-slate-400 font-mono">كود: {lead.reference_number}</span>
                      </td>

                      {/* Phone */}
                      <td className="p-3.5">
                        <a 
                          href={`tel:${lead.customer_mobile}`} 
                          dir="ltr" 
                          className="font-mono text-slate-700 hover:text-emerald-600 font-bold flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{lead.customer_mobile}</span>
                        </a>
                      </td>

                      {/* Property */}
                      <td className="p-3.5 max-w-xs truncate">
                        <div className="font-bold text-slate-900 truncate" title={lead.property_title}>
                          {lead.property_title || 'طلب عام بدون عقار محدد'}
                        </div>
                        {lead.property_reference && (
                          <span className="text-[10px] font-mono text-slate-400">
                            كود العقار: {lead.property_reference}
                          </span>
                        )}
                      </td>

                      {/* Stage Badge */}
                      <td className="p-3.5">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-3.5 text-slate-500 text-[11px]">
                        {new Date(lead.created_at).toLocaleDateString('ar-EG')}
                      </td>

                      {/* Assigned */}
                      <td className="p-3.5 text-slate-600">
                        {lead.assigned_user_name || 'غير معين'}
                      </td>

                      {/* Action */}
                      <td className="p-3.5 pl-6 text-left">
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>تفاصيل ومتابعة</span>
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* Lead Details Drawer */}
      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onViewProperty={(propId) => {
            const p = properties.find(item => item.id === propId);
            if (p && onSelectProperty) {
              onSelectProperty(p);
            }
          }}
        />
      )}

    </div>
  );
};
