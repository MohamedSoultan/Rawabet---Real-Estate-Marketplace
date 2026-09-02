import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  AlertCircle,
  KeyRound,
  RotateCw
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    authModal, 
    closeAuthModal, 
    openAuthModal,
    registerUser, 
    verifyOTP, 
    loginWithEmail, 
    governorates, 
    areas 
  } = useApp();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState(authModal.email || '');
  const [governorateId, setGovernorateId] = useState('gov-kfs');
  const [areaId, setAreaId] = useState('area-101');
  const [consent, setConsent] = useState(true);
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (authModal.email) {
      setEmail(authModal.email);
    }
    setErrorMessage('');
    if (authModal.view === 'OTP') {
      setCountdown(60);
      setCanResend(false);
      setOtp('');
    }
  }, [authModal]);

  // Countdown timer for OTP
  useEffect(() => {
    if (authModal.view === 'OTP' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [authModal.view, countdown]);

  if (!authModal.isOpen) return null;

  const activeGovs = governorates.filter(g => g.is_active);
  const activeAreas = areas.filter(a => a.is_active);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('اكتب اسمك علشان نكمّل.');
      return;
    }
    if (!mobile || !mobile.trim() || !/^01[0125][0-9]{8}$/.test((mobile || '').replace(/\s+/g, ''))) {
      setErrorMessage('رقم الموبايل مش مكتوب بشكل صحيح (يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقماً).');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('البريد الإلكتروني مش صحيح.');
      return;
    }
    if (!consent) {
      setErrorMessage('لازم توافق على سياسة الخصوصية وشروط الاستخدام علشان تكمل.');
      return;
    }

    const res = registerUser({
      name,
      mobile: (mobile || '').replace(/\s+/g, ''),
      email,
      governorate_id: governorateId,
      area_id: areaId
    });

    if (!res.success && res.error) {
      setErrorMessage(res.error);
    } else {
      setCountdown(60);
      setCanResend(false);
    }
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMessage('أدخل كود التأكيد المكون من 6 أرقام (جرّب كود الاختبار: 123456)');
      return;
    }

    const res = verifyOTP(email, otp.trim());
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('أدخل البريد الإلكتروني المسجل لدينا.');
      return;
    }
    const res = loginWithEmail(email);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    } else {
      setCountdown(60);
      setCanResend(false);
    }
  };

  const resendCode = () => {
    if (!canResend) return;
    setCountdown(60);
    setCanResend(false);
    setErrorMessage('');
    setOtp('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-l from-slate-900 via-slate-900 to-emerald-950 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block mb-0.5">
              منصة روابط للوساطة العقارية
            </span>
            <h3 className="text-lg font-black text-white">
              {authModal.view === 'REGISTER' && 'إنشاء حساب جديد للمتابعة'}
              {authModal.view === 'OTP' && 'تأكيد البريد الإلكتروني (OTP)'}
              {authModal.view === 'LOGIN' && 'تسجيل الدخول بروابط'}
            </h3>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* View 1: Quick Register (P-04) */}
        {authModal.view === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 text-right">
            <p className="text-xs text-slate-600 font-bold leading-relaxed">
              سجّل بياناتك في ثوانٍ للاطلاع على تفاصيل العقار الكاملة والتواصل المباشر مع فريق مبيعات روابط.
            </p>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الاسم بالكامل <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد مصطفى"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:border-[#25d366] focus:ring-2 focus:ring-[#25d366]/20 transition"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            {/* Mobile / WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم الموبايل / واتساب <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="010XXXXXXXX"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:border-[#25d366] focus:ring-2 focus:ring-[#25d366]/20 transition dir-ltr text-right"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                تستخدم لمتابعة المعاينات والتواصل عبر واتساب
              </span>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                البريد الإلكتروني <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:border-[#25d366] focus:ring-2 focus:ring-[#25d366]/20 transition dir-ltr text-right"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            {/* Governorate & Area */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المحافظة</label>
                <div className="relative">
                  <select
                    value={governorateId}
                    onChange={e => setGovernorateId(e.target.value)}
                    className="w-full pr-8 pl-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#25d366]"
                  >
                    {activeGovs.map(g => (
                      <option key={g.id} value={g.id}>{g.name_ar}</option>
                    ))}
                  </select>
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المنطقة المفضلة</label>
                <select
                  value={areaId}
                  onChange={e => setAreaId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-[#25d366]"
                >
                  {activeAreas.map(a => (
                    <option key={a.id} value={a.id}>{a.name_ar}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-700 font-bold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#25d366] focus:ring-[#25d366]"
                />
                <span>
                  أوافق على <span className="text-[#128c46] font-black underline">شروط الاستخدام</span> و <span className="text-[#128c46] font-black underline">سياسة الخصوصية</span> لمنصة روابط.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#25d366] hover:bg-[#1eb956] text-slate-950 text-sm font-black rounded-xl transition shadow-md shadow-[#25d366]/20 flex items-center justify-center gap-2 active:scale-98"
              >
                <span>كمّل الخطوة التالية</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>

            {/* Switch to login */}
            <div className="text-center pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => openAuthModal('LOGIN', authModal.pendingAction, email)}
                className="text-xs text-[#128c46] hover:text-[#075e30] font-black hover:underline"
              >
                لديك حساب بالفعل؟ تسجيل الدخول عبر البريد
              </button>
            </div>
          </form>
        )}

        {/* View 2: Email OTP Verification (P-05) */}
        {authModal.view === 'OTP' && (
          <form onSubmit={handleOTPSubmit} className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#128c46] flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900">أدخل كود التحقق (OTP)</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-bold">
                تم إرسال كود تأكيد مكوّن من 6 أرقام إلى:
                <br />
                <span className="font-black text-slate-900 dir-ltr inline-block mt-0.5">{email}</span>
              </p>
              <button
                type="button"
                onClick={() => openAuthModal('LOGIN', authModal.pendingAction, email)}
                className="text-[11px] text-[#128c46] hover:underline font-black mt-1 inline-block"
              >
                تغيير البريد الإلكتروني؟
              </button>
            </div>

            {/* Quick Test Helper Notice */}
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 text-[11px] font-bold flex items-center justify-center gap-1.5">
              <span>💡 للتجربة السريعة، استخدم كود الاختبار:</span>
              <button 
                type="button"
                onClick={() => setOtp('123456')}
                className="px-2 py-0.5 bg-[#25d366] text-slate-950 font-black rounded-md hover:bg-[#1eb956] transition"
              >
                123456
              </button>
            </div>

            {/* 6 Digit Input */}
            <div>
              <input
                type="text"
                maxLength={6}
                autoFocus
                placeholder="1 2 3 4 5 6"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-48 mx-auto text-center tracking-[0.6em] text-2xl font-mono font-bold py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-[#25d366] focus:ring-2 focus:ring-[#25d366]/20 transition"
              />
            </div>

            {/* Countdown & Resend */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-bold">
              {countdown > 0 ? (
                <span>يمكنك إعادة إرسال الكود بعد ({countdown} ثانية)</span>
              ) : (
                <button
                  type="button"
                  onClick={resendCode}
                  className="text-[#128c46] font-black hover:underline inline-flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>إرسال الكود تاني</span>
                </button>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#25d366] hover:bg-[#1eb956] text-slate-950 text-sm font-black rounded-xl transition shadow-md shadow-[#25d366]/20 flex items-center justify-center gap-2 active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تأكيد وتسجيل الدخول</span>
            </button>
          </form>
        )}

        {/* View 3: Direct Email Login */}
        {authModal.view === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-right">
            <p className="text-xs text-slate-600 font-bold leading-relaxed">
              أدخل بريدك الإلكتروني المسجل لاستلام رمز الدخول السريع (بدون كلمة مرور).
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                البريد الإلكتروني <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:border-[#25d366] focus:ring-2 focus:ring-[#25d366]/20 transition dir-ltr text-right"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#25d366] hover:bg-[#1eb956] text-slate-950 text-sm font-black rounded-xl transition shadow-md shadow-[#25d366]/20 flex items-center justify-center gap-2 active:scale-98"
              >
                <span>إرسال كود الدخول</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>

            <div className="text-center pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => openAuthModal('REGISTER', authModal.pendingAction, email)}
                className="text-xs text-[#128c46] hover:text-[#075e30] font-black hover:underline"
              >
                ليس لديك حساب؟ إنشاء حساب جديد
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
