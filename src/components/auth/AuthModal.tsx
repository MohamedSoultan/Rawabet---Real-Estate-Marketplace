import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useModalA11y } from '../../utils/useModalA11y';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Phone, 
  User as UserIcon, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  AlertCircle,
  KeyRound,
  RotateCw,
  Lock,
  Building2,
  Briefcase,
  Eye,
  EyeOff,
  HelpCircle,
  Check
} from 'lucide-react';
import { SellerType } from '../../types';

export const AuthModal: React.FC = () => {
  const { 
    authModal, 
    closeAuthModal, 
    openAuthModal,
    login,
    registerUser, 
    verifyOTP, 
    forgotPassword,
    governorates, 
    areas 
  } = useApp();

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const { containerRef } = useModalA11y({
    isOpen: authModal.isOpen,
    onClose: closeAuthModal,
    initialFocusRef: closeBtnRef
  });

  // Active Tab: 'LOGIN' | 'REGISTER' | 'OTP' | 'FORGOT_PASSWORD'
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER' | 'OTP' | 'FORGOT_PASSWORD'>('LOGIN');

  // Form inputs
  const [identifier, setIdentifier] = useState(''); // Email or Mobile for login
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sellerType, setSellerType] = useState<SellerType | 'BUYER'>('BUYER');
  const [agencyName, setAgencyName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [governorateId, setGovernorateId] = useState('gov-kfs');
  const [areaId, setAreaId] = useState('area-101');
  const [consent, setConsent] = useState(true);

  // OTP states
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync with authModal config
  useEffect(() => {
    if (authModal.isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      if (authModal.view === 'OTP') {
        setActiveTab('OTP');
        setEmail(authModal.email || '');
        setCountdown(60);
        setCanResend(false);
        setOtp('');
      } else if (authModal.view === 'REGISTER') {
        setActiveTab('REGISTER');
      } else {
        setActiveTab('LOGIN');
      }
    }
  }, [authModal]);

  // Countdown timer for OTP
  useEffect(() => {
    if (activeTab === 'OTP' && countdown > 0) {
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
  }, [activeTab, countdown]);

  if (!authModal.isOpen) return null;

  const activeGovs = governorates.filter(g => g.is_active);
  const activeAreas = areas.filter(a => a.is_active);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني أو رقم الموبايل.');
      return;
    }
    if (!password) {
      setErrorMessage('يرجى إدخال كلمة المرور.');
      return;
    }

    const res = login(identifier.trim(), password);
    if (!res.success) {
      setErrorMessage(res.error || 'فشل تسجيل الدخول. يرجى التحقق من البيانات.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('يرجى كتابة الاسم بالكامل.');
      return;
    }
    if (!mobile.trim() || !/^01[0125][0-9]{8}$/.test(mobile.replace(/[\s-]+/g, ''))) {
      setErrorMessage('يرجى إدخال رقم موبايل مصري صحيح مكون من 11 رقماً (010, 011, 012, 015).');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }
    if (registerPassword && registerPassword.length < 6) {
      setErrorMessage('يجب ألا تقل كلمة المرور عن 6 أحرف أو أرقام.');
      return;
    }
    if (registerPassword && confirmPassword && registerPassword !== confirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين.');
      return;
    }
    if (!consent) {
      setErrorMessage('يجب الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة.');
      return;
    }

    const res = registerUser({
      name: name.trim(),
      mobile: mobile.replace(/[\s-]+/g, ''),
      email: email.trim(),
      password: registerPassword || 'User@12345',
      sellerType: sellerType !== 'BUYER' ? sellerType : undefined,
      agencyName: sellerType === 'BROKER' ? agencyName : undefined,
      taxNumber: sellerType === 'BROKER' ? taxNumber : undefined,
      governorate_id: governorateId,
      area_id: areaId
    });

    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMessage('أدخل كود التأكيد المكون من 6 أرقام');
      return;
    }

    const res = verifyOTP(email, otp.trim());
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني أو رقم الهاتف.');
      return;
    }

    const res = forgotPassword(identifier.trim());
    if (!res.success) {
      setErrorMessage(res.error || 'تعذر استعادة كلمة المرور');
    } else {
      setSuccessMessage(res.message);
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div 
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        tabIndex={-1}
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-auto text-right font-sans outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#001e00] text-white flex items-center justify-between border-b border-[#003a00]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14a800]/20 flex items-center justify-center border border-[#14a800]/30">
              <ShieldCheck className="w-6 h-6 text-[#14a800]" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#14a800] block mb-0.5">
                منصة روابط
              </span>
              <h3 id="auth-modal-title" className="text-base sm:text-lg font-black text-white">
                {activeTab === 'LOGIN' && 'تسجيل الدخول'}
                {activeTab === 'REGISTER' && 'حساب جديد'}
                {activeTab === 'OTP' && 'كود التأكيد (OTP)'}
                {activeTab === 'FORGOT_PASSWORD' && 'نسيت كلمة السر'}
              </h3>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={closeAuthModal}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white transition cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Tab Navigation (Login vs Register) */}
        {activeTab !== 'OTP' && activeTab !== 'FORGOT_PASSWORD' && (
          <div className="flex border-b border-slate-100 bg-slate-50/50 p-1.5 gap-1.5">
            <button
              type="button"
              onClick={() => { setActiveTab('LOGIN'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'LOGIN' 
                  ? 'bg-white text-[#001e00] shadow-xs border border-slate-200/80 font-black' 
                  : 'text-slate-500 hover:text-slate-900 font-bold'
              }`}
            >
              <KeyRound className="w-4 h-4 text-[#14a800]" />
              <span>تسجيل الدخول</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('REGISTER'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'REGISTER' 
                  ? 'bg-white text-[#001e00] shadow-xs border border-slate-200/80 font-black' 
                  : 'text-slate-500 hover:text-slate-900 font-bold'
              }`}
            >
              <UserIcon className="w-4 h-4 text-[#14a800]" />
              <span>حساب جديد</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab 1: Password Login */}
        {activeTab === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            
            {/* Identifier */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                البريد الإلكتروني أو رقم الموبايل <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="user@example.com أو 010XXXXXXXX"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:border-[#14a800] focus:ring-2 focus:ring-[#14a800]/20 transition dir-ltr text-right"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  كلمة المرور <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => { setActiveTab('FORGOT_PASSWORD'); setErrorMessage(''); setSuccessMessage(''); }}
                  className="text-[11px] text-[#14a800] hover:text-[#108a00] font-bold hover:underline cursor-pointer"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:border-[#14a800] focus:ring-2 focus:ring-[#14a800]/20 transition dir-ltr text-right"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#14a800] hover:bg-[#108a00] text-white text-sm font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>تسجيل الدخول</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Registration */}
        {activeTab === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
            
            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                نوع الحساب المطلوب <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSellerType('BUYER')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    sellerType === 'BUYER'
                      ? 'border-[#14a800] bg-[#14a800]/5 text-[#001e00] font-black'
                      : 'border-slate-200 bg-slate-50 text-slate-600 font-bold hover:bg-slate-100'
                  }`}
                >
                  <UserIcon className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                  <span className="text-xs block">مشتري / مستأجر</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSellerType('OWNER')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    sellerType === 'OWNER'
                      ? 'border-[#14a800] bg-[#14a800]/5 text-[#001e00] font-black'
                      : 'border-slate-200 bg-slate-50 text-slate-600 font-bold hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                  <span className="text-xs block">مالك عقار</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSellerType('BROKER')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    sellerType === 'BROKER'
                      ? 'border-[#14a800] bg-[#14a800]/5 text-[#001e00] font-black'
                      : 'border-slate-200 bg-slate-50 text-slate-600 font-bold hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                  <span className="text-xs block">وسيط / مكتب</span>
                </button>
              </div>
            </div>

            {/* Broker Fields */}
            {sellerType === 'BROKER' && (
              <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2.5">
                <div>
                  <label className="block text-xs font-bold text-indigo-950 mb-1">اسم المكتب أو الوكالة</label>
                  <input
                    type="text"
                    placeholder="مثال: مكتب النخبة للوساطة العقارية"
                    value={agencyName}
                    onChange={e => setAgencyName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-bold focus:border-[#14a800]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-indigo-950 mb-1">السجل التجاري أو الرقم الضريبي (اختياري)</label>
                  <input
                    type="text"
                    placeholder="رقم السجل التجاري"
                    value={taxNumber}
                    onChange={e => setTaxNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-bold focus:border-[#14a800]"
                  />
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الاسم بالكامل <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: م. أحمد الشناوي"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:border-[#14a800] transition"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            {/* Mobile & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                    className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800] dir-ltr text-right"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

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
                    className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800] dir-ltr text-right"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  كلمة المرور <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={e => setRegisterPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800] dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تأكيد كلمة المرور <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800] dir-ltr text-right"
                />
              </div>
            </div>

            {/* Governorate & Area */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المحافظة</label>
                <select
                  value={governorateId}
                  onChange={e => setGovernorateId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800]"
                >
                  {activeGovs.map(g => (
                    <option key={g.id} value={g.id}>{g.name_ar}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المنطقة المفضلة</label>
                <select
                  value={areaId}
                  onChange={e => setAreaId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs font-bold focus:bg-white focus:border-[#14a800]"
                >
                  {activeAreas.map(a => (
                    <option key={a.id} value={a.id}>{a.name_ar}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Consent */}
            <div className="pt-1">
              <label className="flex items-start gap-2 text-xs text-slate-700 font-bold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#14a800] focus:ring-[#14a800]"
                />
                <span>
                  أوافق على <span className="text-[#14a800] font-black underline">شروط الاستخدام</span> و <span className="text-[#14a800] font-black underline">سياسة الخصوصية</span> لمنصة روابط.
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#14a800] hover:bg-[#108a00] text-white text-sm font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>إنشاء الحساب</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Forgot Password */}
        {activeTab === 'FORGOT_PASSWORD' && (
          <form onSubmit={handleForgotPasswordSubmit} className="p-6 space-y-4">
            <p className="text-xs text-slate-600 font-bold leading-relaxed">
              اكتب إيميلك أو رقم موبايلك المسجل وهنبعتلك رابط لعمل كلمة سر جديدة في ثواني.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                البريد الإلكتروني أو رقم الهاتف <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="user@example.com أو 010XXXXXXXX"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-[#e4ebe4] rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:border-[#14a800] dir-ltr text-right"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-[#14a800] hover:bg-[#108a00] text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>إرسال الرابط</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('LOGIN'); setErrorMessage(''); setSuccessMessage(''); }}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
              >
                <span>رجوع</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: OTP Verification */}
        {activeTab === 'OTP' && (
          <form onSubmit={handleOTPSubmit} className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-xl bg-[#f2f7f2] text-[#14a800] flex items-center justify-center mx-auto border border-[#14a800]/20 shadow-xs">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900">كود التحقق (OTP)</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-bold">
                بعتنا كود تأكيد 6 أرقام إلى:
                <br />
                <span className="font-black text-slate-900 dir-ltr inline-block mt-0.5">{email}</span>
              </p>
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
                className="w-48 mx-auto text-center tracking-[0.6em] text-2xl font-mono font-bold py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-[#14a800] transition"
              />
            </div>

            {/* Countdown & Resend */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-bold">
              {countdown > 0 ? (
                <span>إعادة الإرسال بعد ({countdown} ثانية)</span>
              ) : (
                <button
                  type="button"
                  onClick={resendCode}
                  className="text-[#14a800] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>إرسال الكود تاني</span>
                </button>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#14a800] hover:bg-[#108a00] text-white text-sm font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تأكيد ودخول</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
