import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyCard } from './PropertyCard';
import { Property } from '../../types';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileCheck2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CustomerProfileViewProps {
  onSelectProperty: (property: Property) => void;
  onNavigateToSeller: () => void;
}

export const CustomerProfileView: React.FC<CustomerProfileViewProps> = ({ 
  onSelectProperty, 
  onNavigateToSeller 
}) => {
  const { 
    currentUser, 
    userProfile, 
    sellerProfile, 
    updateProfile, 
    enableSellerRole, 
    requestSellerVerification,
    properties, 
    favorites, 
    governorates, 
    areas 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'FAVORITES' | 'SELLER_UPGRADE'>('PROFILE');
  const [name, setName] = useState(currentUser?.name || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [govId, setGovId] = useState(userProfile?.governorate_id || 'gov-kfs');
  const [areaId, setAreaId] = useState(userProfile?.area_id || 'area-101');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Seller activation form
  const [sellerType, setSellerType] = useState<'INDIVIDUAL_OWNER' | 'REAL_ESTATE_OFFICE'>('INDIVIDUAL_OWNER');
  const [agencyName, setAgencyName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');

  if (!currentUser) return null;

  const activeGovs = governorates.filter(g => g.is_active);
  const activeAreas = areas.filter(a => a.is_active);

  // Favorited properties
  const favoritedProperties = properties.filter(p => favorites.some(f => f.property_id === p.id));

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('الاسم مطلوب.');
      return;
    }
    if (!mobile || !mobile.trim() || !/^01[0125][0-9]{8}$/.test((mobile || '').replace(/\s+/g, ''))) {
      setErrorMsg('رقم الموبايل غير صحيح.');
      return;
    }

    const res = updateProfile({
      name,
      mobile: (mobile || '').replace(/\s+/g, ''),
      governorate_id: govId,
      area_id: areaId
    });

    if (res.success) {
      setSuccessMsg('تم حفظ وتحديث بيانات الملف الشخصي بنجاح.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleSellerActivation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = enableSellerRole(sellerType, agencyName, taxNumber);
    if (res.success) {
      setSuccessMsg('تم تفعيل صفة المالك / الوسيط بحسابك بنجاح! يمكنك الآن إدارة وإضافة عقاراتك.');
      setTimeout(() => {
        setSuccessMsg('');
        onNavigateToSeller();
      }, 1500);
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  const isVerified = sellerProfile?.verification_status === 'VERIFIED';
  const isPending = sellerProfile?.verification_status === 'PENDING';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-emerald-700/20">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{currentUser.name}</h1>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  موثق من روابط
                </span>
              ) : isPending ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  طلب التوثيق قيد المراجعة
                </span>
              ) : sellerProfile ? (
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                  حساب مالك / وسيط (غير موثق)
                </span>
              ) : (
                <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                  عميل مسجل
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {currentUser.email}</span>
              <span>•</span>
              <span className="flex items-center gap-1 dir-ltr"><Phone className="w-3.5 h-3.5 text-slate-400" /> {currentUser.mobile}</span>
            </div>
          </div>
        </div>

        {/* Quick Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'PROFILE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            بيانات الحساب
          </button>
          <button
            onClick={() => setActiveTab('FAVORITES')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
              activeTab === 'FAVORITES' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-emerald-600" />
            <span>المفضلة ({favoritedProperties.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('SELLER_UPGRADE')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
              activeTab === 'SELLER_UPGRADE' ? 'bg-[#128c46] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{sellerProfile ? 'بيانات المالك والتوثيق' : 'تفعيل حساب مالك/وسيط'}</span>
          </button>
        </div>

      </div>

      {/* Success / Error Banners */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-1">
          <AlertCircle className="w-5 h-5 text-slate-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tab 1: Profile Form (P-06) */}
      {activeTab === 'PROFILE' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-right">
          <h3 className="text-base font-extrabold text-slate-900 mb-2">تحديث بيانات الحساب</h3>
          <p className="text-xs text-slate-500 mb-6">
            بياناتك الشخصية محفوظة ومحمية بسياسة الخصوصية لمنصة روابط ولا تظهر علناً في أي مكان.
          </p>

          <form onSubmit={handleProfileSave} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الاسم بالكامل</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الموبايل / واتساب</label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:border-emerald-500 dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني (غير قابل للتعديل)</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-500 dir-ltr text-right cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المحافظة</label>
                <select
                  value={govId}
                  onChange={e => setGovId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-emerald-500"
                >
                  {activeGovs.map(g => (
                    <option key={g.id} value={g.id}>{g.name_ar}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المنطقة</label>
                <select
                  value={areaId}
                  onChange={e => setAreaId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-emerald-500"
                >
                  {activeAreas.map(a => (
                    <option key={a.id} value={a.id}>{a.name_ar}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md shadow-emerald-600/20"
              >
                حفظ التعديلات
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Favorites with 30-day expiration tag (P-06) */}
      {activeTab === 'FAVORITES' && (
        <div className="space-y-6 text-right">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">العقارات المحفوظة في المفضلة</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                يتم الاحتفاظ بالعقارات في قائمتك لمدة 30 يوماً للرجوع إليها سريعاً.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>صلاحية 30 يوماً</span>
            </span>
          </div>

          {favoritedProperties.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">لا توجد عقارات في المفضلة بعد</h4>
              <p className="text-xs text-slate-500">
                يمكنك الضغط على أيقونة حفظ أثناء تصفح العقارات لحفظها هنا.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritedProperties.map(prop => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onSelect={onSelectProperty}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Seller Upgrade & Verification Request */}
      {activeTab === 'SELLER_UPGRADE' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-right space-y-6">
          
          <div>
            <h3 className="text-base font-extrabold text-slate-900">ترقية الحساب إلى بائع / وسيط عقاري معتمد</h3>
            <p className="text-xs text-slate-500 mt-1">
              إضافة العقارات مخصصة لأصحاب الملكيات والمكاتب والشركات العقارية بعد تدقيق بياناتهم.
            </p>
          </div>

          {/* If already a seller */}
          {sellerProfile ? (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">نوع الحساب الحالي:</span>
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                    {sellerProfile.seller_type === 'INDIVIDUAL_OWNER' ? 'مالك عقار فردي' : 'مكتب / وسيط عقاري'}
                  </span>
                </div>
                {sellerProfile.agency_name && (
                  <div className="text-xs font-medium text-emerald-950">
                    <strong>اسم المكتب / الوكالة:</strong> {sellerProfile.agency_name}
                  </div>
                )}
                <div className="text-xs font-medium text-emerald-950 flex items-center justify-between">
                  <span><strong>حالة التوثيق:</strong></span>
                  <span className="font-bold">
                    {sellerProfile.verification_status === 'VERIFIED' && 'موثق ومعتمد رسمياً من روابط ✅'}
                    {sellerProfile.verification_status === 'PENDING' && 'طلب التوثيق تحت مراجعة الإدارة ⏳'}
                    {sellerProfile.verification_status === 'UNVERIFIED' && 'غير موثق بعد'}
                    {sellerProfile.verification_status === 'REJECTED' && 'تم رفض طلب التوثيق'}
                  </span>
                </div>
              </div>

              {sellerProfile.verification_status === 'UNVERIFIED' && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900">طلب التوثيق المعتمد</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    التوثيق يمنح عقاراتك شارة "موثق من روابط" وأولوية أعلى في نتائج البحث، ويثبت ملكيتك أو صفتك القانونية.
                  </p>
                  <button
                    onClick={() => {
                      requestSellerVerification('طلب توثيق الحساب من صفحة الملف الشخصي');
                      setSuccessMsg('تم إرسال طلب التوثيق إلى الإدارة بنجاح!');
                      setTimeout(() => setSuccessMsg(''), 4000);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>إرسال طلب التوثيق الآن</span>
                  </button>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={onNavigateToSeller}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-2xl transition flex items-center gap-2"
                >
                  <span>الانتقال إلى لوحة إدارة عقاراتي</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSellerActivation} className="space-y-5 max-w-xl">
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">اختر نوع الحساب:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSellerType('INDIVIDUAL_OWNER')}
                    className={`p-4 rounded-2xl border text-right transition ${
                      sellerType === 'INDIVIDUAL_OWNER'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-emerald-600 mb-2" />
                    <div className="text-xs font-extrabold">مالك عقار فردي</div>
                    <p className="text-[11px] text-slate-500 mt-1 font-normal">
                      أرغب في عرض عقاري الخاص للبيع أو الإيجار
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSellerType('REAL_ESTATE_OFFICE')}
                    className={`p-4 rounded-2xl border text-right transition ${
                      sellerType === 'REAL_ESTATE_OFFICE'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Briefcase className="w-5 h-5 text-emerald-600 mb-2" />
                    <div className="text-xs font-extrabold">مكتب / وسيط عقاري</div>
                    <p className="text-[11px] text-slate-500 mt-1 font-normal">
                      مكتب وساطة أو شركة تسويق عقاري مرخصة
                    </p>
                  </button>
                </div>
              </div>

              {sellerType === 'REAL_ESTATE_OFFICE' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">اسم المكتب أو الشركة <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: مكتب النخبة للتسويق العقاري"
                      value={agencyName}
                      onChange={e => setAgencyName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">السجل التجاري أو البطاقة الضريبية (اختياري)</label>
                    <input
                      type="text"
                      placeholder="رقم السجل التجاري"
                      value={taxNumber}
                      onChange={e => setTaxNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold rounded-xl transition shadow-md shadow-emerald-600/20"
                >
                  تفعيل حساب البائع والبدء بإضافة العقارات
                </button>
              </div>
            </form>
          )}

        </div>
      )}

    </div>
  );
};
