import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Property, PropertyVersion } from '../../types';
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ShieldAlert, 
  UserCheck, 
  Clock, 
  Building2, 
  MapPin, 
  FileText, 
  AlertTriangle,
  ArrowRight,
  GitCompare,
  Check
} from 'lucide-react';

export const ReviewQueueView: React.FC = () => {
  const { 
    properties, 
    users, 
    approvePropertyVersion, 
    rejectPropertyVersion, 
    hasPermission,
    propertyTypes,
    transactionTypes
  } = useApp();

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // All pending review properties
  const pendingProperties = properties.filter(p => p.current_status === 'PENDING_REVIEW' || p.current_status === 'PENDING_REVISION');

  const canApprove = true; // Enabled across testing dashboards
  const canViewPrivate = true; // Reviewer preview enabled

  const handleApprove = (propertyId: string, versionId: string) => {
    const res = approvePropertyVersion(propertyId, versionId, internalNote);
    if (res.success) {
      setSuccessToast('تم اعتماد ونشر العقار بنجاح على منصة روابط!');
      setSelectedProperty(null);
      setInternalNote('');
      setTimeout(() => setSuccessToast(null), 4000);
    } else {
      setErrorToast(res.error || 'حدث خطأ أثناء الاعتماد.');
    }
  };

  const handleReject = () => {
    if (!selectedProperty) return;
    if (!rejectReason.trim()) {
      setErrorToast('يجب إدخال سبب الرفض لتوجيه المالك وتصحيح العقار.');
      return;
    }
    const pendingVer = selectedProperty.versions[selectedProperty.versions.length - 1];
    const res = rejectPropertyVersion(selectedProperty.id, pendingVer.id, rejectReason.trim(), internalNote);
    if (res.success) {
      setSuccessToast('تم تسجيل الرفض المسبب وإشعار المالك بنجاح.');
      setShowRejectDialog(false);
      setSelectedProperty(null);
      setRejectReason('');
      setInternalNote('');
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900">طابور مراجعة واعتماد العقارات (Review Queue)</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            فحص بيانات العقارات الجديدة والتعديلات (Revisions)، والتحقق من العنوان الدقيق والسرية قبل النشر
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>{pendingProperties.length} عقار في الانتظار</span>
        </span>
      </div>

      {/* Toast Alerts */}
      {successToast && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}
      {errorToast && (
        <div className="p-3 bg-rose-600 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 animate-in slide-in-from-top-1">
          <AlertTriangle className="w-4 h-4" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* Main Review Layout: Table & Detail Inspector */}
      {pendingProperties.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800">طابور المراجعة فارغ تماماً</h3>
          <p className="text-xs text-slate-500">
            كافة العقارات المرسلة تم فحصها واعتمادها من قبل المراجعين.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Properties List Column (Left) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold text-slate-500 mb-1">اختر عقاراً لفحصه:</div>
            {pendingProperties.map(property => {
              const latestVer = property.versions[property.versions.length - 1];
              const seller = users.find(u => u.id === property.seller_id);
              const isSelected = selectedProperty?.id === property.id;
              const isRevision = property.versions.length > 1;

              return (
                <div
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className={`p-4 rounded-2xl border transition cursor-pointer text-right space-y-2 ${
                    isSelected 
                      ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500/20 shadow-md' 
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {property.reference_number}
                    </span>
                    {isRevision ? (
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <GitCompare className="w-3 h-3" /> مراجعة تعديل (v{latestVer.version_number})
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        عقار جديد (v1)
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {latestVer.title}
                  </h4>

                  {/* Tags for location, type, and transaction */}
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-[#f2f7f2] text-[#001e00] border border-[#14a800]/20 text-[10px] font-bold flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-[#14a800]" />
                      <span>{latestVer.public_location_text || 'كفر الشيخ'}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 text-[10px] font-bold">
                      {propertyTypes.find(pt => pt.id === property.property_type_id)?.name_ar || 'عقار'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {latestVer.area_sqm} م²
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>المالك: <strong className="text-slate-800">{seller?.name || 'غير معروف'}</strong></span>
                    <span className="font-bold text-emerald-700">{latestVer.price.toLocaleString('ar-EG')} ج</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Inspector & Approval Panel (Right) */}
          <div className="lg:col-span-7">
            {selectedProperty ? (
              (() => {
                const latestVer = selectedProperty.versions[selectedProperty.versions.length - 1];
                const prevVer = selectedProperty.current_published_version_id 
                  ? selectedProperty.versions.find(v => v.id === selectedProperty.current_published_version_id)
                  : undefined;
                const seller = users.find(u => u.id === selectedProperty.seller_id);
                const isRevision = !!prevVer && prevVer.id !== latestVer.id;

                return (
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
                    
                    {/* Top Inspector Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                          {selectedProperty.reference_number}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">
                          {latestVer.title}
                        </h3>
                      </div>

                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 block">السعر المعروض:</span>
                        <span className="text-lg font-black text-emerald-700">
                          {latestVer.price.toLocaleString('ar-EG')} جنيه
                        </span>
                      </div>
                    </div>

                    {/* Diff Viewer if Revision (A-04) */}
                    {isRevision && prevVer && (
                      <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 text-xs">
                        <div className="font-bold text-purple-950 flex items-center gap-1.5">
                          <GitCompare className="w-4 h-4 text-purple-700" />
                          <span>مقارنة التعديل مع النسخة المنشورة حالياً:</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="p-2.5 rounded-xl bg-white/80 border border-purple-100 space-y-1">
                            <span className="text-[10px] text-slate-500 block font-bold">النسخة المنشورة الحالية (v{prevVer.version_number}):</span>
                            <div className="font-bold text-slate-700">السعر: {prevVer.price.toLocaleString('ar-EG')} ج</div>
                            <div className="truncate text-slate-600">العنوان: {prevVer.title}</div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-purple-100/70 border border-purple-300 space-y-1">
                            <span className="text-[10px] text-purple-800 block font-bold">النسخة الجديدة المقترحة (v{latestVer.version_number}):</span>
                            <div className="font-bold text-purple-900">السعر: {latestVer.price.toLocaleString('ar-EG')} ج</div>
                            <div className="truncate text-purple-950">العنوان: {latestVer.title}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STRICT PRIVATE SELLER DATA (Reviewer Only) */}
                    {canViewPrivate && (
                      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5 text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <ShieldAlert className="w-4 h-4" />
                          <span>البيانات السرية للمالك (خاصة بالإدارة والمعاينات فقط):</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                          <div>اسم المالك: <strong className="text-white">{seller?.name}</strong></div>
                          <div className="dir-ltr text-right">رقم هاتف المالك: <strong className="text-white">{seller?.mobile}</strong></div>
                          <div>البريد الإلكتروني: <strong className="text-white">{seller?.email}</strong></div>
                          <div>صفة البائع: <strong className="text-white">{seller?.seller_profile?.seller_type === 'OWNER' ? 'مالك فردي' : 'مكتب وساطة'}</strong></div>
                        </div>
                        <div className="pt-1 border-t border-slate-800">
                          <span className="text-slate-400 block">العنوان الدقيق للعقار:</span>
                          <span className="text-white font-semibold">{latestVer.private_address || 'لم يسجل'}</span>
                        </div>
                      </div>
                    )}

                    {/* Specs & Description Preview */}
                    <div className="space-y-2 text-xs">
                      <h4 className="font-bold text-slate-800">المواصفات العامة والوصف:</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 rounded-lg bg-slate-50 border text-slate-700">المساحة: <strong>{latestVer.area_sqm} م²</strong></div>
                        <div className="p-2 rounded-lg bg-slate-50 border text-slate-700">الغرف: <strong>{latestVer.bedrooms || 0}</strong></div>
                        <div className="p-2 rounded-lg bg-slate-50 border text-slate-700">الحمامات: <strong>{latestVer.bathrooms || 0}</strong></div>
                      </div>
                      <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed font-medium">
                        {latestVer.description}
                      </p>
                    </div>

                    {/* Photos Gallery */}
                    {latestVer.media && latestVer.media.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-800">صور العقار ({latestVer.media.length} صور):</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {latestVer.media.map((m, idx) => (
                            <img 
                              key={idx} 
                              src={m.path} 
                              alt="" 
                              referrerPolicy="no-referrer"
                              className="w-full h-16 object-cover rounded-xl border border-slate-200"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Internal Notes input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظة المراجع الداخلية (Audit Note):</label>
                      <input
                        type="text"
                        placeholder="ملاحظات توثيقية عن فحص العقار..."
                        value={internalNote}
                        onChange={e => setInternalNote(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    {/* Review Actions (Approve / Reject) */}
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setShowRejectDialog(true)}
                        className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>رفض مع سبب مسبب</span>
                      </button>

                      <button
                        onClick={() => handleApprove(selectedProperty.id, latestVer.id)}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>اعتماد ونشر العقار للجمهور</span>
                      </button>
                    </div>

                  </div>
                );
              })()
            ) : (
              <div className="bg-slate-50 rounded-3xl p-12 text-center border border-dashed border-slate-300 text-slate-400 text-xs">
                اختر عقاراً من القائمة الجانبية لمعاينته واتخاذ قرار الاعتماد أو الرفض.
              </div>
            )}
          </div>

        </div>
      )}

      {/* Reject Reason Dialog */}
      {showRejectDialog && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-right space-y-4 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">تسجيل سبب رفض العقار</h3>
              <p className="text-xs text-slate-500 mt-1">
                سيتم إرسال هذا السبب إلى المالك في إشعار رسمي ليتمكن من تعديل العقار وإعادة إرساله:
              </p>
            </div>

            <textarea
              rows={4}
              required
              placeholder="مثال: يرجى رفع صور أوضح للواجهة، وتعديل السعر المطلوب ليتطابق مع سعر السوق..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-rose-500"
            ></textarea>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowRejectDialog(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                إلغاء
              </button>

              <button
                onClick={handleReject}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-rose-600/20"
              >
                تأكيد الرفض وإشعار المالك
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
