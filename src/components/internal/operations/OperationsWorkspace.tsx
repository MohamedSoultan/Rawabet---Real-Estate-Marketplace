import React, { useState, useMemo } from 'react';
import { Property, PropertyStatus } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { PropertyApprovalModal } from './PropertyApprovalModal';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Eye, 
  RotateCcw,
  Sparkles,
  MapPin,
  Tag,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

export const OperationsWorkspace: React.FC = () => {
  const { 
    properties, 
    propertyTypes, 
    transactionTypes, 
    cities,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'QUEUE' | 'INVENTORY'>('QUEUE');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [selectedPropertyForReview, setSelectedPropertyForReview] = useState<Property | null>(null);

  // Stats
  const pendingProperties = useMemo(() => {
    return properties.filter(p => 
      p.current_status === 'PENDING_REVIEW' || 
      p.current_status === 'UNDER_REVIEW' || 
      p.current_status === 'PENDING_REVISION'
    );
  }, [properties]);

  const approvedProperties = useMemo(() => {
    return properties.filter(p => p.current_status === 'APPROVED' || p.current_status === 'PUBLISHED');
  }, [properties]);

  const needsModProperties = useMemo(() => {
    return properties.filter(p => p.current_status === 'NEEDS_MODIFICATION');
  }, [properties]);

  const rejectedProperties = useMemo(() => {
    return properties.filter(p => p.current_status === 'REJECTED');
  }, [properties]);

  // Active list filtered
  const displayedProperties = useMemo(() => {
    let list = activeTab === 'QUEUE' ? pendingProperties : properties;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(p => {
        const ver = p.versions.find(v => v.id === p.current_published_version_id) || p.versions[0];
        return p.reference_number.toLowerCase().includes(q) ||
               ver?.title.toLowerCase().includes(q) ||
               ver?.public_location_text?.toLowerCase().includes(q) ||
               ver?.private_address?.toLowerCase().includes(q);
      });
    }

    if (activeTab === 'INVENTORY' && statusFilter !== 'ALL') {
      list = list.filter(p => p.current_status === statusFilter);
    }

    if (typeFilter !== 'ALL') {
      list = list.filter(p => p.property_type_id === typeFilter);
    }

    if (cityFilter !== 'ALL') {
      list = list.filter(p => {
        const ver = p.versions.find(v => v.id === p.current_published_version_id) || p.versions[0];
        return ver?.city_id === cityFilter;
      });
    }

    return list;
  }, [activeTab, pendingProperties, properties, searchQuery, statusFilter, typeFilter, cityFilter]);

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Overview Stat Cards (Phase 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pending Card */}
        <div 
          onClick={() => { setActiveTab('QUEUE'); setStatusFilter('ALL'); }}
          className={`p-5 rounded-xl border transition cursor-pointer shadow-xs ${
            activeTab === 'QUEUE' 
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20' 
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">بانتظار المراجعة</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{pendingProperties.length}</div>
          <p className="text-[11px] text-amber-800 font-bold mt-1">تتطلب تدقيق ومراجعة بيانات</p>
        </div>

        {/* Approved Card */}
        <div 
          onClick={() => { setActiveTab('INVENTORY'); setStatusFilter('APPROVED'); }}
          className={`p-5 rounded-xl border transition cursor-pointer shadow-xs ${
            activeTab === 'INVENTORY' && statusFilter === 'APPROVED' 
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20' 
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">عقارات معتمدة ومنشورة</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{approvedProperties.length}</div>
          <p className="text-[11px] text-emerald-800 font-bold mt-1">متاحة حالياً للجمهور</p>
        </div>

        {/* Needs Modification Card */}
        <div 
          onClick={() => { setActiveTab('INVENTORY'); setStatusFilter('NEEDS_MODIFICATION'); }}
          className={`p-5 rounded-xl border transition cursor-pointer shadow-xs ${
            activeTab === 'INVENTORY' && statusFilter === 'NEEDS_MODIFICATION' 
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400/20' 
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">مطلوب تعديلها من المالك</span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{needsModProperties.length}</div>
          <p className="text-[11px] text-blue-800 font-bold mt-1">بانتظار تصحيح الملاحظات</p>
        </div>

        {/* Rejected Card */}
        <div 
          onClick={() => { setActiveTab('INVENTORY'); setStatusFilter('REJECTED'); }}
          className={`p-5 rounded-xl border transition cursor-pointer shadow-xs ${
            activeTab === 'INVENTORY' && statusFilter === 'REJECTED' 
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20' 
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">عقارات مرفوضة</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{rejectedProperties.length}</div>
          <p className="text-[11px] text-rose-800 font-bold mt-1">بسبب عدم مطابقة الشروط</p>
        </div>

      </div>

      {/* Main Workspace Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Workspace Sub-Tabs */}
        <div className="px-6 pt-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab('QUEUE'); setStatusFilter('ALL'); }}
              className={`pb-3 px-3 text-xs font-bold transition border-b-2 cursor-pointer ${
                activeTab === 'QUEUE'
                  ? 'border-emerald-600 text-emerald-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>طابور المراجعة والتدقيق</span>
              {pendingProperties.length > 0 && (
                <span className="mr-1.5 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-black">
                  {pendingProperties.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('INVENTORY'); setStatusFilter('ALL'); }}
              className={`pb-3 px-3 text-xs font-bold transition border-b-2 cursor-pointer ${
                activeTab === 'INVENTORY'
                  ? 'border-emerald-600 text-emerald-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>كافة عقارات المنصة (المخزون)</span>
              <span className="mr-1.5 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold">
                {properties.length}
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-medium pb-3 hidden sm:block">
            إدارة تدفق واعتماد العقارات طبقاً لمعايير روابط
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث بالكود، العنوان، أو اسم العقار..."
              className="w-full pr-9 pl-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Status Filter (Only in Inventory tab) */}
          {activeTab === 'INVENTORY' && (
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-hidden focus:border-emerald-500"
            >
              <option value="ALL">كافة الحالات</option>
              <option value="PENDING_REVIEW">بانتظار المراجعة</option>
              <option value="APPROVED">معتمد / منشور</option>
              <option value="NEEDS_MODIFICATION">مطلوب تعديل</option>
              <option value="REJECTED">مرفوض</option>
            </select>
          )}

          {/* City Filter */}
          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-hidden focus:border-emerald-500"
          >
            <option value="ALL">كافة المدن</option>
            {cities.map(c => (
              <option key={c.id} value={c.id}>{c.name_ar}</option>
            ))}
          </select>

          {/* Property Type Filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-hidden focus:border-emerald-500"
          >
            <option value="ALL">كافة الأنواع</option>
            {propertyTypes.map(pt => (
              <option key={pt.id} value={pt.id}>{pt.name_ar}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {(searchQuery || statusFilter !== 'ALL' || typeFilter !== 'ALL' || cityFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setTypeFilter('ALL');
                setCityFilter('ALL');
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
            >
              مسح الفلاتر
            </button>
          )}

        </div>

        {/* Properties Table List */}
        <div className="overflow-x-auto">
          {displayedProperties.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">لا توجد عقارات مطابقة للبحث حالياً</h4>
              <p className="text-xs text-slate-500 font-medium">جرب تغيير معايير البحث أو تصفية الحالات</p>
            </div>
          ) : (
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5 pr-6">العقار</th>
                  <th className="p-3.5">الكود</th>
                  <th className="p-3.5">النوع والمعاملة</th>
                  <th className="p-3.5">السعر</th>
                  <th className="p-3.5">المدينة</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5">تاريخ التقديم</th>
                  <th className="p-3.5 pl-6 text-left">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {displayedProperties.map(property => {
                  const ver = property.versions.find(v => v.id === property.current_published_version_id) || property.versions[0];
                  const pType = propertyTypes.find(t => t.id === property.property_type_id);
                  const txType = transactionTypes.find(t => t.id === property.transaction_type_id);
                  const city = cities.find(c => c.id === ver?.city_id);

                  return (
                    <tr key={property.id} className="hover:bg-slate-50/80 transition">
                      
                      {/* Property Title & Image */}
                      <td className="p-3.5 pr-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            <img
                              src={ver?.media?.[0]?.path || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-slate-900 truncate" title={ver?.title}>
                              {ver?.title}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">
                              المساحة: {ver?.area_sqm} م² • {ver?.bedrooms || 0} غرف
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Reference Number */}
                      <td className="p-3.5 font-mono text-slate-700 font-bold">
                        {property.reference_number}
                      </td>

                      {/* Type & Tx */}
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{pType?.name_ar || 'عقار'}</span>
                        <span className="text-[11px] text-slate-500">{txType?.name_ar}</span>
                      </td>

                      {/* Price */}
                      <td className="p-3.5 font-black text-slate-900">
                        {ver?.price.toLocaleString('ar-EG')} ج.م
                      </td>

                      {/* City */}
                      <td className="p-3.5 text-slate-600 font-bold">
                        {city?.name_ar}
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          property.current_status === 'APPROVED' || property.current_status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                          property.current_status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-900 border border-rose-200' :
                          property.current_status === 'NEEDS_MODIFICATION'
                            ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                            'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {property.current_status === 'APPROVED' || property.current_status === 'PUBLISHED' ? 'معتمد ومنشور' :
                           property.current_status === 'REJECTED' ? 'مرفوض' :
                           property.current_status === 'NEEDS_MODIFICATION' ? 'مطلوب تعديل' : 'قيد المراجعة'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-3.5 text-slate-500 text-[11px]">
                        {new Date(property.created_at).toLocaleDateString('ar-EG')}
                      </td>

                      {/* Action */}
                      <td className="p-3.5 pl-6 text-left">
                        <button
                          type="button"
                          onClick={() => setSelectedPropertyForReview(property)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>فحص واعتماد</span>
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

      {/* Property Approval Modal Drawer */}
      {selectedPropertyForReview && (
        <PropertyApprovalModal
          property={selectedPropertyForReview}
          onClose={() => setSelectedPropertyForReview(null)}
          onSuccess={() => {
            setSelectedPropertyForReview(null);
          }}
        />
      )}

    </div>
  );
};
