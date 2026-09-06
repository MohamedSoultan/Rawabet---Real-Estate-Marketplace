import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Building2, 
  Tag, 
  ToggleLeft, 
  ToggleRight, 
  Plus, 
  CheckCircle2,
  Layers,
  Sparkles
} from 'lucide-react';

export const LocationsAndTaxonomyView: React.FC = () => {
  const { 
    governorates, 
    cities, 
    areas, 
    propertyTypes, 
    transactionTypes, 
    toggleGovernorateActive,
    toggleCityActive,
    addArea,
    hasPermission
  } = useApp();

  const [activeTab, setActiveTab] = useState<'LOCATIONS' | 'TAXONOMY'>('LOCATIONS');
  const [selectedGovId, setSelectedGovId] = useState('gov-kfs');
  const [selectedCityId, setSelectedCityId] = useState('city-kfs-1');
  const [newAreaNameAr, setNewAreaNameAr] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const canManage = hasPermission('PERM_MANAGE_LOCATIONS');

  const filteredCities = cities.filter(c => c.governorate_id === selectedGovId);
  const filteredAreas = areas.filter(a => a.city_id === selectedCityId);

  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaNameAr.trim()) return;
    addArea(selectedCityId, newAreaNameAr.trim());
    setToastMsg(`تمت إضافة المنطقة الجديدة "${newAreaNameAr}" بنجاح!`);
    setNewAreaNameAr('');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900">المواقع الجغرافية وتصنيفات العقارات (Taxonomy)</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            إدارة تغطية المحافظات، المراكز، الأحياء، وأنواع العقارات والمعاملات
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('LOCATIONS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'LOCATIONS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            المحافظات والمناطق
          </button>
          <button
            onClick={() => setActiveTab('TAXONOMY')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'TAXONOMY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            أنواع العقارات والمعاملات
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Tab 1: Hierarchy of Locations (A-11, A-12) */}
      {activeTab === 'LOCATIONS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. Governorates Column */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>المحافظات ({governorates.length})</span>
            </h3>

            <div className="space-y-2">
              {governorates.map(gov => (
                <div
                  key={gov.id}
                  onClick={() => setSelectedGovId(gov.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    selectedGovId === gov.id ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{gov.name_ar}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{gov.slug}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGovernorateActive(gov.id);
                    }}
                    className={`text-xs font-bold px-2 py-1 rounded-lg transition ${
                      gov.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {gov.is_active ? 'مفعلة' : 'معطلة'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Cities / Centers Column */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>المراكز والمدن ({filteredCities.length})</span>
            </h3>

            <div className="space-y-2">
              {filteredCities.map(city => (
                <div
                  key={city.id}
                  onClick={() => setSelectedCityId(city.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    selectedCityId === city.id ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{city.name_ar}</div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCityActive(city.id);
                    }}
                    className={`text-xs font-bold px-2 py-1 rounded-lg transition ${
                      city.is_active ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {city.is_active ? 'مفعل' : 'معطل'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Areas / Neighborhoods Column + Add Area Form */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>الأحياء والمناطق ({filteredAreas.length})</span>
            </h3>

            {/* Add new area */}
            <form onSubmit={handleAddArea} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-[11px] font-bold text-slate-700">إضافة حي / منطقة جديدة:</label>
              <input
                type="text"
                required
                placeholder="اسم الحي بالعربية (مثال: حي سخا)"
                value={newAreaNameAr}
                onChange={e => setNewAreaNameAr(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <button
                type="submit"
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة المنطقة</span>
              </button>
            </form>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              <div className="flex flex-wrap gap-1.5 p-1">
                {filteredAreas.map(area => (
                  <div
                    key={area.id}
                    className="px-3 py-1.5 rounded-full bg-[#f2f7f2] border border-[#14a800]/30 flex items-center gap-2 text-xs font-bold text-[#001e00]"
                  >
                    <MapPin className="w-3 h-3 text-[#14a800]" />
                    <span>{area.name_ar}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#14a800]"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Property Types & Transaction Types (A-13) */}
      {activeTab === 'TAXONOMY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Property Types */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>أنواع العقارات (Property Types)</span>
            </h3>

            <div className="space-y-2.5">
              {propertyTypes.map(pt => (
                <div key={pt.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{pt.name_ar}</div>
                    <span className="text-[11px] text-slate-400 font-mono">slug: {pt.slug} • صور: {pt.min_images}-{pt.max_images}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg">
                    نشط ومتاح
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Types */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              <span>أنواع المعاملات (Transaction Types)</span>
            </h3>

            <div className="space-y-2.5">
              {transactionTypes.map(tx => (
                <div key={tx.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{tx.name_ar}</div>
                    <span className="text-[11px] text-slate-400 font-mono">slug: {tx.slug}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-lg">
                    نشط ومتاح
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
