import React, { useState } from 'react';
import { Property, PropertyVersion } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Building2, 
  MapPin, 
  Maximize2, 
  Bed, 
  Bath, 
  Layers, 
  Lock, 
  Phone, 
  User, 
  Calendar, 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  Eye, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';

interface PropertyApprovalModalProps {
  property: Property;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PropertyApprovalModal: React.FC<PropertyApprovalModalProps> = ({
  property,
  onClose,
  onSuccess
}) => {
  const { 
    currentUser,
    users,
    propertyTypes, 
    transactionTypes, 
    cities, 
    areas,
    startPropertyReview,
    requestPropertyModification,
    approvePropertyVersion,
    rejectPropertyVersion
  } = useApp();

  // Active or pending review version
  const pendingVersion = property.versions.find(v => v.version_status === 'PENDING' || v.version_status === 'DRAFT') || 
    property.versions[property.versions.length - 1] || 
    property.versions[0];
  
  const version: PropertyVersion = pendingVersion;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Review states
  const [reviewAction, setReviewAction] = useState<'VIEW' | 'REQUEST_MOD' | 'REJECT'>('VIEW');
  const [modificationNotes, setModificationNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionPreset, setRejectionPreset] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Lookup data
  const pType = propertyTypes.find(pt => pt.id === property.property_type_id);
  const txType = transactionTypes.find(tx => tx.id === property.transaction_type_id);
  const city = cities.find(c => c.id === version.city_id);
  const area = areas.find(a => a.id === version.area_id);
  const ownerUser = users.find(u => u.id === property.seller_id);

  const images = version.media && version.media.length > 0 
    ? version.media.map(m => m.path)
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];

  const rejectionPresets = [
    'صور العقار غير واضحة أو غير مطابقة للواقع',
    'تفاصيل السعر غير واقعية أو مبالغ فيها مقارنة بالسوق',
    'عنوان العقار أو موقعه غير دقيق',
    'نقص في مستندات إثبات ملكية العقار أو بيانات المعلن',
    'الوصف يتضمن أرقام هواتف أو وسائل اتصال خارجية مخالفة',
    'مخالفة لسياسات وشروط النشر على منصة روابط'
  ];

  // Start review handler
  const handleStartReview = () => {
    setIsSubmitting(true);
    const res = startPropertyReview(property.id, version.id);
    setIsSubmitting(false);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: 'تم بدء مراجعة العقار وتثبيت حالة الفحص' });
    } else {
      setFeedbackMessage({ type: 'error', text: res.error || 'فشل بدء المراجعة' });
    }
  };

  // Approve handler
  const handleApprove = () => {
    if (!confirm('هل أنت متأكد من اعتماد ونشر هذا العقار على المنصة للجمهور؟')) return;
    setIsSubmitting(true);
    const res = approvePropertyVersion(property.id, version.id, 'تم التدقيق الهندسي والقانوني واعتماد العقار للنشر');
    setIsSubmitting(false);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: 'تم اعتماد ونشر العقار بنجاح على المنصة!' });
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } else {
      setFeedbackMessage({ type: 'error', text: res.error || 'فشل اعتماد العقار' });
    }
  };

  // Request modification handler
  const handleRequestModification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modificationNotes.trim()) {
      alert('يرجى كتابة الملاحظات والتعديلات المطلوبة من المالك');
      return;
    }
    setIsSubmitting(true);
    const res = requestPropertyModification(property.id, version.id, modificationNotes.trim());
    setIsSubmitting(false);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: 'تم إرسال طلب التعديل إلى المالك وإشعار حسابه' });
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } else {
      setFeedbackMessage({ type: 'error', text: res.error || 'فشل إرسال طلب التعديل' });
    }
  };

  // Reject handler
  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = rejectionPreset 
      ? `${rejectionPreset}${rejectionReason ? ` - ملاحظات إضافية: ${rejectionReason}` : ''}`
      : rejectionReason.trim();

    if (!finalReason) {
      alert('يرجى تحديد أو كتابة سبب الرفض الإلزامي');
      return;
    }
    setIsSubmitting(true);
    const res = rejectPropertyVersion(property.id, version.id, finalReason);
    setIsSubmitting(false);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: 'تم رفض العقار وتسجيل سبب الرفض وإشعار المعلن' });
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } else {
      setFeedbackMessage({ type: 'error', text: res.error || 'فشل رفض العقار' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-soft-fade text-right font-sans">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-5 sm:px-7 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">{version.title}</h3>
                <span className="font-mono text-xs bg-slate-800 text-emerald-400 px-2.5 py-0.5 rounded-md border border-slate-700">
                  كود: {property.reference_number}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                  property.current_status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' :
                  property.current_status === 'REJECTED' ? 'bg-rose-500/20 text-rose-300' :
                  property.current_status === 'NEEDS_MODIFICATION' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-blue-500/20 text-blue-300'
                }`}>
                  {property.current_status === 'APPROVED' ? 'معتمد' :
                   property.current_status === 'REJECTED' ? 'مرفوض' :
                   property.current_status === 'NEEDS_MODIFICATION' ? 'مطلوب تعديل' : 'قيد المراجعة'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                تاريخ الإضافة: {new Date(property.created_at).toLocaleDateString('ar-EG')} • النسخة: v{version.version_number}
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

        {/* Feedback Alert if any */}
        {feedbackMessage && (
          <div className={`px-6 py-3 text-xs font-bold flex items-center gap-2 ${
            feedbackMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border-b border-emerald-200' 
              : 'bg-rose-50 text-rose-900 border-b border-rose-200'
          }`}>
            {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Top Section: Photo Inspector + Summary Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Gallery (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={images[selectedImageIndex]}
                  alt={`صورة العقار ${selectedImageIndex + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  صورة {selectedImageIndex + 1} من {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                        selectedImageIndex === idx ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Pricing & Specs (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Pricing Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500">السعر المطلوب من المالك</span>
                <div className="text-2xl font-black text-slate-900 flex items-baseline gap-1.5">
                  <span>{version.price.toLocaleString('ar-EG')}</span>
                  <span className="text-xs font-bold text-slate-600">جنيه مصري</span>
                </div>
                {txType && (
                  <div className="inline-block px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                    معاملة: {txType.name_ar} {pType ? `(${pType.name_ar})` : ''}
                  </div>
                )}
              </div>

              {/* Location Badge */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{city?.name_ar} {area ? `• ${area.name_ar}` : ''}</span>
                </div>
                {(version.private_address || version.public_location_text) && (
                  <p className="text-slate-500 pr-5 text-[11px] font-medium">
                    {version.private_address || version.public_location_text}
                  </p>
                )}
              </div>

              {/* Core Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[11px] font-bold">المساحة</span>
                  <strong className="text-slate-900 font-black">{version.area_sqm} م²</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[11px] font-bold">الغرف</span>
                  <strong className="text-slate-900 font-black">{version.bedrooms || 0} غرف</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[11px] font-bold">الحمامات</span>
                  <strong className="text-slate-900 font-black">{version.bathrooms || 0} حمام</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[11px] font-bold">الطابق</span>
                  <strong className="text-slate-900 font-black">{version.floor !== undefined ? `الدور ${version.floor}` : 'غير محدد'}</strong>
                </div>
              </div>

            </div>

          </div>

          {/* Description & Features */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
            <h4 className="text-xs font-black text-slate-900">الوصف المنشور والمواصفات</h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
              {version.description || 'لا يوجد وصف تفصيلي مسجل.'}
            </p>

            {version.features && version.features.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5">المميزات الإضافية:</span>
                <div className="flex flex-wrap gap-1.5">
                  {version.features.map((f, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CRITICAL: INTERNAL ONLY OWNER / BROKER INFORMATION */}
          <div className="p-5 rounded-xl bg-amber-50/70 border-2 border-amber-300 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-200 text-amber-900">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-amber-950">بيانات المالك الداخلية — سرية ولا تظهر للجمهور</h4>
                  <p className="text-[11px] text-amber-800 font-medium">مخصصة فقط لفريق العمليات والمبيعات للتواصل والتنسيق الميداني</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900 border border-amber-300">
                Internal Only
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-amber-200">
                <span className="text-slate-400 block text-[11px] font-bold">اسم المعلن / المالك</span>
                <strong className="text-slate-900 font-bold flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>{ownerUser?.name || 'مالك مسجل'}</span>
                </strong>
              </div>

              <div className="bg-white p-3 rounded-xl border border-amber-200">
                <span className="text-slate-400 block text-[11px] font-bold">رقم الهاتف للتواصل الميداني</span>
                <strong className="text-slate-900 font-bold flex items-center gap-1.5 mt-0.5" dir="ltr">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>{ownerUser?.mobile || '010XXXXXXXX'}</span>
                </strong>
              </div>

              <div className="bg-white p-3 rounded-xl border border-amber-200">
                <span className="text-slate-400 block text-[11px] font-bold">نوع الحساب والتوثيق</span>
                <strong className="text-slate-900 font-bold flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{ownerUser?.seller_profile?.seller_type === 'BROKER' || ownerUser?.seller_profile?.seller_type === 'REAL_ESTATE_OFFICE' ? 'وسيط عقاري' : 'مالك مباشر'}</span>
                  {ownerUser?.seller_profile?.verification_status === 'VERIFIED' && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 rounded">موثق</span>
                  )}
                </strong>
              </div>
            </div>
          </div>

          {/* Action Panels: Request Modification Form */}
          {reviewAction === 'REQUEST_MOD' && (
            <form onSubmit={handleRequestModification} className="p-5 rounded-xl bg-amber-50 border border-amber-300 space-y-3 animate-soft-fade">
              <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span>طلب تعديل بيانات العقار من المالك</span>
              </h4>
              <p className="text-xs text-amber-800">
                اكتب التعديلات المطلوبة بدقة (مثل: تحديث الصور لتكون أكثر وضوحاً، توضيح عنوان الشارع، تعديل السعر ليطابق الاتفاق).
              </p>
              <textarea
                required
                rows={3}
                value={modificationNotes}
                onChange={e => setModificationNotes(e.target.value)}
                placeholder="اكتب التعديلات المطلوبة من المالك هنا..."
                className="w-full p-3 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-600 resize-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewAction('VIEW')}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition cursor-pointer disabled:opacity-50"
                >
                  إرسال طلب التعديل للمالك
                </button>
              </div>
            </form>
          )}

          {/* Action Panels: Reject Form */}
          {reviewAction === 'REJECT' && (
            <form onSubmit={handleReject} className="p-5 rounded-xl bg-rose-50 border border-rose-300 space-y-3 animate-soft-fade">
              <h4 className="text-xs font-black text-rose-950 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-700" />
                <span>رفض العقار (سبب الرفض إلزامي)</span>
              </h4>
              
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">اختر سبباً شائعاً للرفض</label>
                <select
                  value={rejectionPreset}
                  onChange={e => setRejectionPreset(e.target.value)}
                  className="w-full p-2.5 bg-white border border-rose-300 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="">-- اختر سبب الرفض --</option>
                  {rejectionPresets.map((preset, idx) => (
                    <option key={idx} value={preset}>{preset}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">تفاصيل وملاحظات إضافية على الرفض</label>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="ملاحظات تفصيلية توضح سبب الرفض للمالك وسجل التدقيق..."
                  className="w-full p-3 bg-white border border-rose-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-rose-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewAction('VIEW')}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition cursor-pointer disabled:opacity-50"
                >
                  تأكيد رفض العقار
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Bottom Review Action Bar */}
        <div className="px-5 sm:px-7 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartReview}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-slate-600" />
              <span>بدء فحص العقار</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Request Modification */}
            <button
              type="button"
              onClick={() => setReviewAction('REQUEST_MOD')}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-amber-700" />
              <span>طلب تعديل من المالك</span>
            </button>

            {/* Reject */}
            <button
              type="button"
              onClick={() => setReviewAction('REJECT')}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4 text-rose-700" />
              <span>رفض العقار</span>
            </button>

            {/* Approve */}
            <button
              type="button"
              onClick={handleApprove}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>اعتماد ونشر العقار للجمهور</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
