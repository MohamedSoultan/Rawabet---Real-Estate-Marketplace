import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { VerificationStatus } from '../../types';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Search,
  Filter,
  Phone, 
  Mail, 
  Check, 
  X,
  FileCheck2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const SellerVerificationView: React.FC = () => {
  const { 
    users, 
    reviewSellerVerification 
  } = useApp();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingUserId, setRejectingUserId] = useState<string | null>(null);
  const [customNote, setCustomNote] = useState('');

  // Filter users who requested seller verification or are sellers
  const sellerUsers = useMemo(() => {
    return users.filter(u => u.seller_profile && u.seller_profile.verification_status !== 'NOT_REQUESTED');
  }, [users]);

  const pendingCount = sellerUsers.filter(u => u.seller_profile?.verification_status === 'PENDING').length;
  const verifiedCount = sellerUsers.filter(u => u.seller_profile?.verification_status === 'VERIFIED').length;
  const rejectedCount = sellerUsers.filter(u => u.seller_profile?.verification_status === 'REJECTED').length;

  const filteredUsers = useMemo(() => {
    return sellerUsers.filter(user => {
      const seller = user.seller_profile;
      if (!seller) return false;

      // Status filter
      if (filterStatus !== 'ALL' && seller.verification_status !== filterStatus) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = user.name.toLowerCase().includes(query);
        const matchEmail = user.email.toLowerCase().includes(query);
        const matchMobile = user.mobile.includes(query);
        const matchAgency = seller.agency_name?.toLowerCase().includes(query) || false;
        return matchName || matchEmail || matchMobile || matchAgency;
      }

      return true;
    });
  }, [sellerUsers, filterStatus, searchQuery]);

  const handleReview = (userId: string, decision: 'VERIFIED' | 'REJECTED', note?: string) => {
    reviewSellerVerification(userId, decision, note);
    setToastMsg(decision === 'VERIFIED' ? 'تم توثيق حساب البائع ومنحه شارة روابط بنجاح' : 'تم رفض طلب التوثيق وتحديث الحالة.');
    setRejectingUserId(null);
    setCustomNote('');
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e4ebe4]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#001e00]">طلبات توثيق الملاك والمكاتب العقارية</h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#f2f7f2] text-[#14a800] border border-[#14a800]/30">
              قسم التوثيق الميداني
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            فحص ومراجعة طلبات التوثيق الصادرة من الملاك والمكاتب لمنحهم شارة "موثق من روابط"
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-[#f2f7f2] text-[#001e00] border border-[#14a800]/30 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-2xs">
            <FileCheck2 className="w-4 h-4 text-[#14a800]" />
            <span>{pendingCount} طلبات قيد الانتظار</span>
          </span>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 bg-[#14a800] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 animate-soft-fade shadow-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#e4ebe4] shadow-2xs">
        
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'ALL'
                ? 'bg-[#14a800] text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>جميع الطلبات</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{sellerUsers.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('PENDING')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'PENDING'
                ? 'bg-[#14a800] text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>قيد الفحص</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-black">{pendingCount}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('VERIFIED')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'VERIFIED'
                ? 'bg-[#14a800] text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>الموثقون</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{verifiedCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('REJECTED')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'REJECTED'
                ? 'bg-[#14a800] text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>المرفوضة</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{rejectedCount}</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم، رقم الهاتف، أو اسم المكتب..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3.5">
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e4ebe4] text-slate-500 space-y-2">
            <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-black text-slate-700">لا توجد طلبات توثيق مطابقة للفلاتر الحالية</h3>
            <p className="text-xs text-slate-400">يمكنك تعديل خيارات التصفية أو البحث أعلاه لعرض النتائج.</p>
          </div>
        ) : (
          filteredUsers.map(user => {
            const seller = user.seller_profile;
            if (!seller) return null;

            return (
              <div
                key={user.id}
                className="bg-white rounded-2xl p-5 border border-[#e4ebe4] hover:border-[#14a800] shadow-2xs transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                
                {/* Info Block */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-black text-[#001e00]">{user.name}</h3>
                    
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {seller.seller_type === 'OWNER' ? 'مالك عقارات فردي' : seller.agency_name ? `مكتب: ${seller.agency_name}` : 'مكتب وسيط عقاري'}
                    </span>

                    {seller.verification_status === 'PENDING' && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> قيد الفحص والاعتماد
                      </span>
                    )}
                    {seller.verification_status === 'VERIFIED' && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#f2f7f2] text-[#14a800] border border-[#14a800]/30 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#14a800]" /> تم التوثيق ومنح الشارة
                      </span>
                    )}
                    {seller.verification_status === 'REJECTED' && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-600" /> تم رفض الطلب
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-4 pt-1">
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}</span>
                    <span className="flex items-center gap-1.5 dir-ltr"><Phone className="w-3.5 h-3.5 text-slate-400" /> {user.mobile}</span>
                    {seller.tax_number && (
                      <span className="text-[11px] font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                        سجل/رقم ضريبي: {seller.tax_number}
                      </span>
                    )}
                  </div>

                  {seller.verification_note && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                      <strong className="text-slate-800 font-bold">ملاحظة المراجع: </strong>
                      {seller.verification_note}
                    </p>
                  )}
                </div>

                {/* Actions Block */}
                <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                  {seller.verification_status === 'PENDING' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setRejectingUserId(user.id)}
                        className="flex-1 md:flex-initial px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        رفض الطلب
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReview(user.id, 'VERIFIED', 'تم التحقق من هوية المالك بنجاح وتوثيقه')}
                        className="flex-1 md:flex-initial px-5 py-2 bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold rounded-xl transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>اعتماد ومنح التوثيق</span>
                      </button>
                    </>
                  ) : seller.verification_status === 'VERIFIED' ? (
                    <button
                      type="button"
                      onClick={() => handleReview(user.id, 'REJECTED', 'إلغاء التوثيق بناءً على طلب الإدارة أو تحديث بيانات')}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      إلغاء شارة التوثيق
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleReview(user.id, 'VERIFIED', 'إعادة الفحص والتوثيق بعد استيفاء الأوراق')}
                      className="px-4 py-2 bg-[#f2f7f2] hover:bg-[#14a800] text-[#14a800] hover:text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      إعادة التوثيق والاعتماد
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Reject Modal */}
      {rejectingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 text-right animate-soft-fade">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-black">رفض طلب توثيق البائع</h3>
            </div>
            
            <p className="text-xs text-slate-600">
              يرجى تدوين سبب الرفض لإشعار المالك وتوضيح المطلوب لاستيفاء شروط التوثيق:
            </p>

            <textarea
              rows={3}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="مثال: يرجى إرسال صورة بطاقة الرقم القومي سارية أو السجل التجاري للمكتب..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#14a800]"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingUserId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => handleReview(rejectingUserId, 'REJECTED', customNote.trim() || 'عدم استيفاء المستندات')}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
