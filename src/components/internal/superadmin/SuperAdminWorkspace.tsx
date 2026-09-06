import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { UsersAndRolesView } from '../../admin/UsersAndRolesView';
import { SystemSettingsView } from '../../admin/SystemSettingsView';
import { LocationsAndTaxonomyView } from '../../admin/LocationsAndTaxonomyView';
import { AuditLogsView } from '../../admin/AuditLogsView';
import { SellerVerificationView } from '../../admin/SellerVerificationView';
import { 
  Users, 
  Settings, 
  MapPin, 
  FileSearch, 
  ShieldCheck, 
  ShieldAlert,
  Layers,
  Database,
  Sliders
} from 'lucide-react';

type SuperAdminTab = 'USERS' | 'VERIFICATIONS' | 'LOCATIONS' | 'SETTINGS' | 'AUDIT';

export const SuperAdminWorkspace: React.FC = () => {
  const { users, auditLogs, properties } = useApp();
  const [activeTab, setActiveTab] = useState<SuperAdminTab>('USERS');

  const pendingSellersCount = users.filter(u => u.seller_profile?.verification_status === 'PENDING').length;

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Super Admin Tabs Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs flex flex-wrap items-center gap-1.5">
        
        {/* Users & Roles */}
        <button
          type="button"
          onClick={() => setActiveTab('USERS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'USERS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>المستخدمون والأدوار ({users.length})</span>
        </button>

        {/* Seller Verifications */}
        <button
          type="button"
          onClick={() => setActiveTab('VERIFICATIONS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'VERIFICATIONS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>توثيق المعلنين</span>
          {pendingSellersCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
              {pendingSellersCount}
            </span>
          )}
        </button>

        {/* Locations & Taxonomy */}
        <button
          type="button"
          onClick={() => setActiveTab('LOCATIONS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'LOCATIONS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>المدن والمناطق والأنواع</span>
        </button>

        {/* System Settings */}
        <button
          type="button"
          onClick={() => setActiveTab('SETTINGS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'SETTINGS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>إعدادات وسياسات المنصة</span>
        </button>

        {/* Audit Logs */}
        <button
          type="button"
          onClick={() => setActiveTab('AUDIT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'AUDIT'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileSearch className="w-4 h-4" />
          <span>سجل التدقيق (Audit Logs)</span>
        </button>

      </div>

      {/* Tab Content Display */}
      <div className="animate-soft-fade">
        {activeTab === 'USERS' && <UsersAndRolesView />}
        {activeTab === 'VERIFICATIONS' && <SellerVerificationView />}
        {activeTab === 'LOCATIONS' && <LocationsAndTaxonomyView />}
        {activeTab === 'SETTINGS' && <SystemSettingsView />}
        {activeTab === 'AUDIT' && <AuditLogsView />}
      </div>

    </div>
  );
};
