import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Property, PropertyStatus } from '../../types';
import { 
  Building2, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Archive, 
  Layers, 
  Edit, 
  Trash2, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  SlidersHorizontal,
  FileCheck2,
  PhoneCall,
  Eye,
  GitCompare,
  Check,
  MapPin
} from 'lucide-react';
import { PropertyWizardModal } from './PropertyWizardModal';
import { RejectedPropertyModal } from './RejectedPropertyModal';
import { PropertyStatusModal } from './PropertyStatusModal';

interface SellerDashboardProps {
  onSelectProperty: (property: Property) => void;
  onOpenNewPropertyWizard: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ 
  onSelectProperty,
  onOpenNewPropertyWizard
}) => {
  const { 
    currentUser, 
    getMyProperties, 
    requestSellerVerification, 
    submitPropertyForReview, 
    editPublishedPropertyAsRevision,
    markPropertyStatus,
    leads,
    settings,
    propertyTypes,
    transactionTypes
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | PropertyStatus | 'DRAFT'>('ALL');
  const [selectedPropertyForEdit, setSelectedPropertyForEdit] = useState<Property | null>(null);
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [rejectedPropertyToView, setRejectedPropertyToView] = useState<Property | null>(null);
  const [statusPropertyToChange, setStatusPropertyToChange] = useState<Property | null>(null);
  const [showRevisionNoticeModal, setShowRevisionNoticeModal] = useState<Property | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const userProperties = getMyProperties();
  const sellerProfile = currentUser?.seller_profile;

  const isVerified = sellerProfile?.verification_status === 'VERIFIED';
  const isPendingVerification = sellerProfile?.verification_status === 'PENDING';

  // Stats calculation
  const totalCount = userProperties.length;
  const publishedCount = userProperties.filter(p => p.current_status === 'PUBLISHED' || p.current_status === 'PENDING_REVISION').length;
  const pendingCount = userProperties.filter(p => p.current_status === 'PENDING_REVIEW' || p.current_status === 'PENDING_REVISION').length;
  const rejectedCount = userProperties.filter(p => p.current_status === 'REJECTED').length;
  const draftCount = userProperties.filter(p => p.current_status === 'DRAFT').length;

  const filteredProperties = userProperties.filter(p => {
    if (statusFilter === 'ALL') return true;
    return p.current_status === statusFilter;
  });

  const handleEditPublishedProperty = (property: Property) => {
    setShowRevisionNoticeModal(property);
  };

  const proceedWithRevision = (property: Property) => {
    setShowRevisionNoticeModal(null);
    setSelectedPropertyForEdit(property);
    setIsRevisionMode(true);
    setShowWizardModal(true);
  };

  const handleOpenNewWizard = () => {
    setSelectedPropertyForEdit(null);
    setIsRevisionMode(false);
    setShowWizardModal(true);
  };

  const handleSubmitDraft = (property: Property) => {
    const latestVer = property.versions[property.versions.length - 1];
    const res = submitPropertyForReview(property.id, latestVer);
    if (res.success) {
      setToastMessage('تم إرسال العقار لطابور المراجعة بنجاح! سيتم إخطارك فور اعتماده.');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleRequestVerificationClick = () => {
    requestSellerVerification();
    setToastMessage('تم إرسال طلب التوثيق إلى إدارة روابط بنجاح!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right font-sans">
      
      {/* Dashboard Top Header (Upwork Style) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#e4ebe4]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#001e00] font-display">لوحة تحكم أصحاب العقارات والوسطاء</h1>
            {isVerified && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f2f7f2] text-[#14a800] border border-[#14a800]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#14a800]" /> حساب موثق
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
            إدارة عقاراتك، متابعة المراجعة، ونظام التعديل بالنسخ (Revisions) لضمان استمرار ظهور إعلاناتك
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenNewWizard}
            className="shrink-0 flex items-center gap-1.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>إضافة عقار جديد</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-[#14a800] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 animate-soft-fade shadow-md">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Verification Promotion Banner for Unverified Sellers (Upwork Green Style) */}
      {!isVerified && (
        <div className="bg-[#001e00] text-white rounded-xl p-6 sm:p-7 border border-[#14a800]/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#14a800]" />
              <h3 className="text-base font-bold text-white">
                احصل على شارة "بائع موثق" وأولوية النشر
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-normal">
              توثيق الحساب يمنح عقاراتك شارة التوثيق المعتمدة، ظهوراً مميزاً في نتائج البحث، وثقة مضاعفة لدى المشترين في كفر الشيخ.
            </p>
          </div>

          {isPendingVerification ? (
            <span className="px-4 py-2 bg-[#002f00] text-[#14a800] border border-[#14a800]/40 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0">
              <Clock className="w-4 h-4" />
              <span>طلب التوثيق قيد المراجعة</span>
            </span>
          ) : (
            <button
              onClick={handleRequestVerificationClick}
              className="px-5 py-2.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold rounded-full transition shadow-xs shrink-0 cursor-pointer"
            >
              تقديم طلب التوثيق الآن
            </button>
          )}
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl p-4 border border-[#e4ebe4] shadow-xs">
          <div className="text-xs font-bold text-slate-500">إجمالي العقارات</div>
          <div className="text-2xl font-black text-[#001e00] mt-1 font-display tabular-nums">{totalCount}</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e4ebe4] shadow-xs">
          <div className="text-xs font-bold text-[#14a800]">منشورة ومتاحة للجمهور</div>
          <div className="text-2xl font-black text-[#14a800] mt-1 font-display tabular-nums">{publishedCount}</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e4ebe4] shadow-xs">
          <div className="text-xs font-bold text-amber-600">قيد المراجعة والفحص</div>
          <div className="text-2xl font-black text-amber-700 mt-1 font-display tabular-nums">{pendingCount}</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e4ebe4] shadow-xs">
          <div className="text-xs font-bold text-rose-600">مرفوضة وتحتاج تعديل</div>
          <div className="text-2xl font-black text-rose-700 mt-1 font-display tabular-nums">{rejectedCount}</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e4ebe4] shadow-xs col-span-2 sm:col-span-1">
          <div className="text-xs font-bold text-slate-600">المسودات المحفوظة</div>
          <div className="text-2xl font-black text-slate-800 mt-1 font-display tabular-nums">{draftCount}</div>
        </div>
      </div>

      {/* Status Filter Tabs (Upwork Pills) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-[#e4ebe4]">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            statusFilter === 'ALL' ? 'bg-[#001e00] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-[#f2f7f2]'
          }`}
        >
          كافة العقارات ({totalCount})
        </button>

        <button
          onClick={() => setStatusFilter('PUBLISHED')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            statusFilter === 'PUBLISHED' ? 'bg-[#14a800] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-[#f2f7f2]'
          }`}
        >
          المنشورة ({publishedCount})
        </button>

        <button
          onClick={() => setStatusFilter('PENDING_REVIEW')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            statusFilter === 'PENDING_REVIEW' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-[#f2f7f2]'
          }`}
        >
          قيد الفحص ({pendingCount})
        </button>

        <button
          onClick={() => setStatusFilter('REJECTED')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            statusFilter === 'REJECTED' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-[#f2f7f2]'
          }`}
        >
          المرفوضة ({rejectedCount})
        </button>

        <button
          onClick={() => setStatusFilter('DRAFT')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            statusFilter === 'DRAFT' ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-[#f2f7f2]'
          }`}
        >
          المسودات ({draftCount})
        </button>
      </div>

      {/* Properties List */}
      <div className="space-y-4 w-full">
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-xl p-8 sm:p-12 text-center border border-[#e4ebe4] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#f2f7f2] text-[#14a800] flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#001e00]">لا توجد عقارات مطابقة لهذا التصنيف</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal">
              يمكنك إضافة عقارك الأول في كفر الشيخ بسهولة وتتبع مراجعته خطوة بخطوة.
            </p>
            <button
              onClick={handleOpenNewWizard}
              className="px-6 py-2.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold rounded-full transition shadow-xs cursor-pointer"
            >
              + إضافة عقار جديد الآن
            </button>
          </div>
        ) : (
          filteredProperties.map(property => {
            const latestVer = property.versions[property.versions.length - 1];
            const coverImage = latestVer.media?.find(m => m.is_cover)?.path || latestVer.media?.[0]?.path || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80';
            const isPublished = property.current_status === 'PUBLISHED' || property.current_status === 'PENDING_REVISION';
            const isPending = property.current_status === 'PENDING_REVIEW' || property.current_status === 'PENDING_REVISION';
            const isRejected = property.current_status === 'REJECTED';
            const isDraft = property.current_status === 'DRAFT';
            const propTypeObj = propertyTypes.find(pt => pt.id === property.property_type_id);
            const txTypeObj = transactionTypes.find(t => t.id === property.transaction_type_id);

            return (
              <div 
                key={property.id}
                className="bg-white rounded-xl p-4 sm:p-5 border border-[#e4ebe4] hover:border-[#14a800]/50 shadow-xs hover:shadow-md transition flex flex-col space-y-3.5 overflow-hidden w-full"
              >
                {/* 1. TOP BAR: Reference Code + Status Badges + Interactive Filter Tags directly above Image */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Code Badge */}
                    <span className="text-xs font-mono font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      كود: {property.reference_number}
                    </span>

                    {/* Status Badges */}
                    {isPublished && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#f2f7f2] text-[#14a800] border border-[#14a800]/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#14a800]" /> منشور ومعتمد
                      </span>
                    )}

                    {property.current_status === 'PENDING_REVISION' && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                        <GitCompare className="w-3 h-3" /> تعديل قيد الفحص
                      </span>
                    )}

                    {property.current_status === 'PENDING_REVIEW' && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> قيد الفحص الأولي
                      </span>
                    )}

                    {isRejected && (
                      <button
                        type="button"
                        onClick={() => setRejectedPropertyToView(property)}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 hover:bg-rose-200 transition flex items-center gap-1 cursor-pointer"
                      >
                        <AlertCircle className="w-3 h-3" /> مرفوض (عرض السبب)
                      </button>
                    )}

                    {isDraft && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        مسودة غير مرسلة
                      </span>
                    )}
                  </div>

                  {/* Filterable Tags Bar */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* District Tag */}
                    <button
                      type="button"
                      onClick={() => {
                        setToastMessage(`تم تصفية عقارات: ${latestVer.public_location_text || 'كفر الشيخ'}`);
                        setTimeout(() => setToastMessage(null), 2500);
                      }}
                      className="px-2.5 py-0.5 rounded-full bg-[#f2f7f2] hover:bg-[#e4ebe4] text-[#001e00] border border-[#14a800]/25 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer max-w-[130px] sm:max-w-none truncate"
                      title="تصفية حسب المنطقة"
                    >
                      <MapPin className="w-3 h-3 text-[#14a800] shrink-0" />
                      <span className="truncate">{latestVer.public_location_text || 'كفر الشيخ'}</span>
                    </button>

                    {/* Property Type Tag */}
                    <button
                      type="button"
                      onClick={() => {
                        setToastMessage(`تم تصفية نوع: ${propTypeObj?.name_ar || 'عقار'}`);
                        setTimeout(() => setToastMessage(null), 2500);
                      }}
                      className="px-2.5 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-100 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                      title="تصفية حسب نوع العقار"
                    >
                      <Building2 className="w-3 h-3 text-blue-600 shrink-0" />
                      <span>{propTypeObj?.name_ar || 'عقار'}</span>
                    </button>

                    {/* Transaction Type Tag */}
                    <button
                      type="button"
                      onClick={() => {
                        setToastMessage(`تم تصفية معاملات: ${txTypeObj?.name_ar || 'للبيع'}`);
                        setTimeout(() => setToastMessage(null), 2500);
                      }}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                        txTypeObj?.slug === 'rent'
                          ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                      }`}
                      title="تصفية حسب نوع المعاملة"
                    >
                      {txTypeObj?.name_ar || 'للبيع'}
                    </button>

                    {/* Area */}
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                      {latestVer.area_sqm} م²
                    </span>
                  </div>
                </div>

                {/* 2. MIDDLE CONTENT: Thumbnail, Title, Price & Action Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Thumbnail & Title/Price */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                    <img
                      src={coverImage}
                      alt={latestVer.title}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-[#e4ebe4] shrink-0 shadow-2xs"
                    />

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-[#001e00] leading-snug line-clamp-2">
                        {latestVer.title}
                      </h3>

                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-black text-[#14a800]">
                          {latestVer.price.toLocaleString('ar-EG')} جنيه
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          v{latestVer.version_number}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                    {/* Draft Actions */}
                    {isDraft && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPropertyForEdit(property);
                            setIsRevisionMode(false);
                            setShowWizardModal(true);
                          }}
                          className="flex-1 sm:flex-none justify-center px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-full transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>تعديل المسودة</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSubmitDraft(property)}
                          className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold rounded-full transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>إرسال للمراجعة</span>
                        </button>
                      </>
                    )}

                    {/* Published Actions */}
                    {isPublished && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEditPublishedProperty(property)}
                          className="flex-1 sm:flex-none justify-center px-3.5 py-2.5 bg-[#f2f7f2] hover:bg-[#e4ebe4] text-[#14a800] border border-[#14a800]/30 text-xs font-bold rounded-full transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <GitCompare className="w-3.5 h-3.5 text-[#14a800]" />
                          <span>تعديل السعر / المواصفات</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setStatusPropertyToChange(property)}
                          className="flex-1 sm:flex-none justify-center px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition cursor-pointer text-center"
                        >
                          تغيير الحالة (تم البيع/التأجير)
                        </button>
                      </>
                    )}

                    {/* Rejected Action */}
                    {isRejected && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPropertyForEdit(property);
                          setIsRevisionMode(false);
                          setShowWizardModal(true);
                        }}
                        className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-full transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>تصحيح العقار وإعادة الإرسال</span>
                      </button>
                    )}

                    {/* View Details Button */}
                    <button
                      type="button"
                      onClick={() => onSelectProperty(property)}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full transition border border-[#e4ebe4] cursor-pointer shrink-0"
                      title="معاينة كارت العقار"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Property Status Modal */}
      {statusPropertyToChange && (
        <PropertyStatusModal
          isOpen={true}
          property={statusPropertyToChange}
          onClose={() => setStatusPropertyToChange(null)}
          onStatusChanged={(status) => {
            markPropertyStatus(statusPropertyToChange.id, status);
            setStatusPropertyToChange(null);
            setToastMessage('تم تحديث حالة العقار بنجاح!');
            setTimeout(() => setToastMessage(null), 3000);
          }}
        />
      )}

      {/* Rejected Property Modal */}
      {rejectedPropertyToView && (
        <RejectedPropertyModal
          isOpen={true}
          property={rejectedPropertyToView}
          onClose={() => setRejectedPropertyToView(null)}
          onFixAndResubmit={() => {
            const prop = rejectedPropertyToView;
            setRejectedPropertyToView(null);
            setSelectedPropertyForEdit(prop);
            setIsRevisionMode(false);
            setShowWizardModal(true);
          }}
        />
      )}

      {/* Revision Notice Modal */}
      {showRevisionNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-soft-fade">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-right space-y-4 border border-[#e4ebe4]">
            <div className="w-10 h-10 rounded-full bg-[#f2f7f2] text-[#14a800] flex items-center justify-center">
              <GitCompare className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-[#001e00]">
              كيف يعمل تعديل العقارات المنشورة في روابط؟
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              عند تعديل أي سعر أو مواصفات لعقار معتمد، <strong>يظل إعلانك الأصلي معروضاً للجمهور</strong> بدون توقف، وتنشأ نسخة جديدة تخضع لفحص سريع من فريق المراجعة ثم تُحدث تلقائياً فور اعتمادها.
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowRevisionNoticeModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                إلغاء
              </button>

              <button
                onClick={() => proceedWithRevision(showRevisionNoticeModal)}
                className="px-5 py-2.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold rounded-full transition shadow-xs cursor-pointer"
              >
                متابعة إنشاء التعديل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Modal */}
      {showWizardModal && (
        <PropertyWizardModal
          isOpen={showWizardModal}
          onClose={() => {
            setShowWizardModal(false);
            setSelectedPropertyForEdit(null);
            setIsRevisionMode(false);
          }}
          existingProperty={selectedPropertyForEdit}
          isRevision={isRevisionMode}
        />
      )}

    </div>
  );
};
