import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Search, Filter, Clock, User, ArrowRight, ShieldCheck, Download } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.actor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.entity_id && log.entity_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAction = actionFilter === 'ALL' || log.action.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900">سجل التدقيق الأمني والعمليات الحساسة (Audit Logs)</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            سجل غير قابل للتعديل يوثق كافة إجراءات الاعتماد، الرفض، تغيير الأسعار، والصلاحيات
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-900 text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{auditLogs.length} سجل موثق</span>
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="بحث بالمستخدم، نوع العملية، أو الرقم التعريفي..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-right"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        </div>

        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          className="w-full sm:w-56 px-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700"
        >
          <option value="ALL">كافة العمليات الحساسة</option>
          <option value="APPROVE">اعتماد ونشر عقارات</option>
          <option value="REJECT">رفض عقارات</option>
          <option value="STATUS">تغيير حالات</option>
          <option value="VERIF">توثيق الحسابات</option>
          <option value="PERM">تعديل الصلاحيات</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">الوقت والتاريخ</th>
                <th className="p-4">المستخدم (المسؤول)</th>
                <th className="p-4">نوع الإجراء (Action)</th>
                <th className="p-4">الكيان المتأثر</th>
                <th className="p-4">تفاصيل التغيير</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    لا توجد سجلات مطابقة للبحث.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('ar-EG')}
                    </td>
                    <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {log.actor_name.charAt(0)}
                        </div>
                        <span>{log.actor_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({log.actor_role})</span>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-mono font-bold text-[10px] border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-purple-700 font-bold whitespace-nowrap">
                      {log.entity_type} #{log.entity_id}
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">
                      {log.new_value || log.notes || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
