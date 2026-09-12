import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyCard } from './PropertyCard';
import { PropertySlider } from './PropertySlider';
import { Property } from '../../types';
import { RequestPropertyModal } from './RequestPropertyModal';
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
  ArrowRight,
  MessageSquare,
  FileText,
  Coins,
  ExternalLink,
  Plus
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
    leads,
    propertyRequests,
    governorates, 
    areas,
    settings 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'FAVORITES' | 'CONTACTED' | 'REQUESTS' | 'PROFILE' | 'SELLER_UPGRADE'>('FAVORITES');
  const [name, setName] = useState(currentUser?.name || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [govId, setGovId] = useState(userProfile?.governorate_id || 'gov-kfs');
  const [areaId, setAreaId] = useState(userProfile?.area_id || 'area-101');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Seller activation form
  const [sellerType, setSellerType] = useState<'INDIVIDUAL_OWNER' | 'REAL_ESTATE_OFFICE'>('INDIVIDUAL_OWNER');
  const [agencyName, setAgencyName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');

  if (!currentUser) return null;

  const activeGovs = governorates.filter(g => g.is_active);
  const activeAreas = areas.filter(a => a.is_active);

  // 1. Favorited properties (filter out expired favorites)
  const favoritedProperties = properties.filter(p => 
    favorites.some(f => 
      f.user_id === currentUser.id && 
      f.property_id === p.id && 
      (!f.expires_at || new Date(f.expires_at).getTime() > Date.now())
    )
  );

  // 2. Contacted properties (leads generated from user interaction)
  const contactedLeads = leads.filter(l => 
    l.customer_id === currentUser.id || 
    (currentUser.mobile && l.customer_mobile === currentUser.mobile)
  );

  // 3. User submitted requests
  const myRequests = propertyRequests.filter(r => 
    r.customer_id === currentUser.id || 
    (currentUser.mobile && r.whatsapp_number === currentUser.mobile)
  );

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Profile Header Box */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#001e00] text-white flex items-center justify-center text-2xl font-black shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#001e00]">{currentUser.name}</h1>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-[#f2f7f2] text-[#14a800] border border-[#14a800]/30 px-2.5 py-0.5 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#14a800]" />
                  موثق من روابط
                </span>
              ) : isPending ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  طلب التوثيق قيد المراجعة
                </span>
              ) : sellerProfile ? (
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg">
                  حساب مالك / وسيط
                </span>
              ) : (
                <span className="text-xs font-bold bg-[#f2f7f2] text-[#14a800] border border-[#14a800]/20 px-2.5 py-0.5 rounded-lg">
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

        {/* Quick Action: Request Property */}
        <button
          type="button"
          onClick={() => setIsRequestModalOpen(true)}
          className="px-5 py-2.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs flex items-center gap-2 self-stretch md:self-auto justify-center cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>طلب عقار بمواصفات خاصة</span>
        </button>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-200/70 p-1.5 rounded-xl overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('FAVORITES')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'FAVORITES' 
              ? 'bg-white text-[#001e00] shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
          <span>المفضلة ({favoritedProperties.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('CONTACTED')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'CONTACTED' 
              ? 'bg-white text-[#001e00] shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#14a800]" />
          <span>عقارات تواصلت بشأنها ({contactedLeads.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('REQUESTS')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'REQUESTS' 
              ? 'bg-white text-[#001e00] shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-600" />
          <span>طلباتي العقارية ({myRequests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PROFILE')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'PROFILE' 
              ? 'bg-white text-[#001e00] shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4 text-slate-600" />
          <span>البيانات الشخصية</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SELLER_UPGRADE')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'SELLER_UPGRADE' 
              ? 'bg-[#001e00] text-white shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{sellerProfile ? 'بيانات المالك والتوثيق' : 'تفعيل حساب مالك/وسيط'}</span>
        </button>
      </div>

      {/* Success / Error Banners */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-[#f2f7f2] border border-[#14a800]/30 text-[#14a800] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#14a800] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: FAVORITES (with 30-day expiration badge & handling) */}
      {activeTab === 'FAVORITES' && (
        <div className="space-y-6 text-right">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-[#001e00]">العقارات المحفوظة في المفضلة</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                يمكنك الرجوع إلى عقاراتك المفضلة للمقارنة والتواصل في أي وقت.
              </p>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>صلاحية الحفظ 30 يوماً</span>
            </span>
          </div>

          {favoritedProperties.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center border border-slate-200 shadow-xs space-y-2">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">مفيش عقارات في المفضلة</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                دوس على علامة القلب على أي عقار عشان تحفظه هنا وترجعله بسهولة.
              </p>
            </div>
          ) : favoritedProperties.length > 3 ? (
            <PropertySlider
              properties={favoritedProperties}
              onSelectProperty={onSelectProperty}
              hideHeader={true}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-full">
              {favoritedProperties.map(prop => (
                <div key={prop.id} className="w-full min-w-0 max-w-full h-full flex flex-col overflow-hidden">
                  <PropertyCard
                    property={prop}
                    onSelect={onSelectProperty}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONTACTED PROPERTIES (Leads history for the customer) */}
      {activeTab === 'CONTACTED' && (
        <div className="space-y-6 text-right">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-[#001e00]">عقارات تواصلت بشأنها</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                سجل العقارات التي قمت بطلب الاستفسار أو المعاينة لها عبر واتساب أو الاتصال الهاتفي.
              </p>
            </div>
            <span className="px-3 py-1 bg-[#f2f7f2] text-[#14a800] border border-[#14a800]/20 text-xs font-bold rounded-xl">
              {contactedLeads.length} تفاعل مسجل
            </span>
          </div>

          {contactedLeads.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">لم تقم بالتواصل بخصوص أي عقار بعد</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                عند النقر على زر واتساب أو اتصال على أي عقار، سيتم حفظ العقار هنا تلقائياً لسهولة المتابعة مع وسيطك المعتمد.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {contactedLeads.map(lead => {
                const targetProp = properties.find(p => p.id === lead.property_id);
                return (
                  <div 
                    key={lead.id}
                    className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-[#14a800]/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                          {lead.reference_number}
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(lead.created_at).toLocaleDateString('ar-EG', { dateStyle: 'medium' })}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                          {lead.contact_channel === 'WHATSAPP' ? 'تواصل عبر واتساب' : 'اتصال هاتفي'}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-[#001e00]">
                        {lead.property_title}
                      </h4>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>المسؤول المعين: <strong className="text-slate-700">{lead.assigned_user_name}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {targetProp && (
                        <button
                          type="button"
                          onClick={() => onSelectProperty(targetProp)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          عرض العقار
                        </button>
                      )}

                      <a
                        href={`https://wa.me/201021469032?text=${encodeURIComponent(
                          `مرحباً روابط، أرغب في متابعة طلبي بخصوص العقار (${lead.property_reference}): ${lead.property_title}. كود الطلب: ${lead.reference_number}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>متابعة على واتساب</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SUBMITTED REQUESTS (Customer property requests / Demand capture) */}
      {activeTab === 'REQUESTS' && (
        <div className="space-y-6 text-right">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-[#001e00]">طلباتي العقارية بمواصفات خاصة</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                الطلبات المسجلة لدى فريق مستشاري روابط للبحث والتفاوض عنها نيابة عنك.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(true)}
              className="px-5 py-2.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل طلب عقار جديد</span>
            </button>
          </div>

          {myRequests.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">لا توجد طلبات خاصة مسجلة حتى الآن</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                إذا كنت تبحث عن عقار بمواصفات أو ميزانية محددة في كفر الشيخ أو أي محافظة أخرى ولم تجده، سجل طلبك وسيقوم فريقنا بالبحث والتفاوض لتوفيره.
              </p>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="px-6 py-2.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
              >
                تسجيل طلب عقار الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRequests.map(req => (
                <div 
                  key={req.id}
                  className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded-lg border border-slate-200">
                      {req.reference_number}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${
                      req.status === 'MATCHED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'SEARCHING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {req.status === 'MATCHED' ? 'تم توفير عروض مطابقة' : req.status === 'SEARCHING' ? 'فريق روابط يبحث عن طلبك' : 'قيد المراجعة الأولية'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-[#001e00]">
                      {req.property_type} ({req.transaction_type === 'BUY' ? 'شراء' : 'إيجار'})
                    </h4>
                    <div className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.city_or_area} - {req.governorate}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">الميزانية:</span>
                      <strong className="text-[#14a800]">{new Intl.NumberFormat('ar-EG').format(req.budget)} جنيه</strong>
                    </div>
                    {req.area_sqm && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">المساحة:</span>
                        <strong>{req.area_sqm} م²</strong>
                      </div>
                    )}
                    {req.bedrooms && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">الغرف:</span>
                        <strong>{req.bedrooms} غرف نوم</strong>
                      </div>
                    )}
                    {req.additional_notes && (
                      <div className="border-t border-slate-200 pt-1.5 text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-700">ملاحظات:</span> {req.additional_notes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      {new Date(req.created_at).toLocaleDateString('ar-EG')}
                    </span>

                    <a
                      href={`https://wa.me/201021469032?text=${encodeURIComponent(
                        `أهلاً روابط، أريد الاستفسار عن مستجدات طلبي العقاري رقم: ${req.reference_number} (${req.property_type} في ${req.city_or_area}).`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>متابعة على واتساب</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PROFILE FORM */}
      {activeTab === 'PROFILE' && (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs text-right">
          <h2 className="text-base font-black text-[#001e00] mb-2">تحديث بيانات الحساب</h2>
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:border-[#14a800]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الموبايل / واتساب</label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:border-[#14a800] dir-ltr text-right"
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
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800]"
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
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800]"
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
                className="px-6 py-2.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs cursor-pointer"
              >
                حفظ التعديلات
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: SELLER UPGRADE */}
      {activeTab === 'SELLER_UPGRADE' && (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs text-right space-y-6">
          
          <div>
            <h2 className="text-base font-black text-[#001e00]">ترقية الحساب إلى بائع / وسيط عقاري معتمد</h2>
            <p className="text-xs text-slate-500 mt-1">
              إضافة العقارات مخصصة لأصحاب الملكيات والمكاتب والشركات العقارية بعد تدقيق بياناتهم.
            </p>
          </div>

          {/* If already a seller */}
          {sellerProfile ? (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-[#f2f7f2] border border-[#14a800]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#001e00]">نوع الحساب الحالي:</span>
                  <span className="px-3 py-1 bg-[#14a800] text-white rounded-lg text-xs font-bold">
                    {sellerProfile.seller_type === 'INDIVIDUAL_OWNER' ? 'مالك عقار فردي' : 'مكتب / وسيط عقاري'}
                  </span>
                </div>
                {sellerProfile.agency_name && (
                  <div className="text-xs font-medium text-slate-800">
                    <strong>اسم المكتب / الوكالة:</strong> {sellerProfile.agency_name}
                  </div>
                )}
                <div className="text-xs font-medium text-slate-800 flex items-center justify-between">
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
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-900">طلب التوثيق المعتمد</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    التوثيق يمنح عقاراتك شارة "موثق من روابط" وأولوية أعلى في نتائج البحث، ويثبت ملكيتك أو صفتك القانونية.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      requestSellerVerification('طلب توثيق الحساب من صفحة الملف الشخصي');
                      setSuccessMsg('تم إرسال طلب التوثيق إلى الإدارة بنجاح!');
                      setTimeout(() => setSuccessMsg(''), 4000);
                    }}
                    className="px-5 py-2.5 bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>إرسال طلب التوثيق الآن</span>
                  </button>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNavigateToSeller}
                  className="px-6 py-3 bg-[#001e00] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
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
                    className={`p-4 rounded-xl border text-right transition cursor-pointer ${
                      sellerType === 'INDIVIDUAL_OWNER'
                        ? 'border-[#14a800] bg-[#f2f7f2] text-[#001e00] font-bold ring-2 ring-[#14a800]/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#14a800] mb-2" />
                    <div className="text-xs font-extrabold">مالك عقار فردي</div>
                    <p className="text-[11px] text-slate-500 mt-1 font-normal">
                      أرغب في عرض عقاري الخاص للبيع أو الإيجار
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSellerType('REAL_ESTATE_OFFICE')}
                    className={`p-4 rounded-xl border text-right transition cursor-pointer ${
                      sellerType === 'REAL_ESTATE_OFFICE'
                        ? 'border-[#14a800] bg-[#f2f7f2] text-[#001e00] font-bold ring-2 ring-[#14a800]/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Briefcase className="w-5 h-5 text-[#14a800] mb-2" />
                    <div className="text-xs font-extrabold">مكتب / وسيط عقاري</div>
                    <p className="text-[11px] text-slate-500 mt-1 font-normal">
                      مكتب وساطة أو شركة تسويق عقاري مرخصة
                    </p>
                  </button>
                </div>
              </div>

              {sellerType === 'REAL_ESTATE_OFFICE' && (
                <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">اسم المكتب أو الشركة <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: مكتب النخبة للتسويق العقاري"
                      value={agencyName}
                      onChange={e => setAgencyName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#14a800]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">السجل التجاري أو البطاقة الضريبية (اختياري)</label>
                    <input
                      type="text"
                      placeholder="رقم السجل التجاري"
                      value={taxNumber}
                      onChange={e => setTaxNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-[#14a800]"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-extrabold rounded-xl transition shadow-xs cursor-pointer"
                >
                  تفعيل حساب البائع والبدء بإضافة العقارات
                </button>
              </div>
            </form>
          )}

        </div>
      )}

      {/* Demand Capture Modal */}
      <RequestPropertyModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onViewMyRequests={() => setActiveTab('REQUESTS')}
      />

    </div>
  );
};
