import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Property, PropertyVersion } from '../../types';
import { useApp } from '../../context/AppContext';
import { useModalA11y } from '../../utils/useModalA11y';
import { X, Calendar, Clock, User, Phone, FileText, CheckCircle2, Building2 } from 'lucide-react';

interface RequestViewingModalProps {
  property: Property;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RequestViewingModal: React.FC<RequestViewingModalProps> = ({
  property,
  onClose,
  onSuccess
}) => {
  const { currentUser, createViewingRequest } = useApp();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const { containerRef } = useModalA11y({
    isOpen: true,
    onClose,
    initialFocusRef: closeBtnRef
  });

  const activeVersionId = property.current_published_version_id || property.versions[0]?.id;
  const version: PropertyVersion = property.versions.find(v => v.id === activeVersionId) || property.versions[0];

  // Default dates: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerMobile, setCustomerMobile] = useState(currentUser?.mobile || '');
  const [preferredDate, setPreferredDate] = useState(defaultDateStr);
  const [preferredTime, setPreferredTime] = useState('16:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('يرجى إدخال اسمك الكريم');
      return;
    }
    if (!customerMobile.trim() || customerMobile.length < 10) {
      setError('يرجى إدخال رقم هاتف صحيح للتواصل');
      return;
    }
    if (!preferredDate) {
      setError('يرجى اختيار تاريخ المعاينة المفضل');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = createViewingRequest(property.id, {
      customerName: customerName.trim(),
      customerMobile: customerMobile.trim(),
      preferredDate,
      preferredTime,
      notes: notes.trim() || undefined
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2500);
    } else {
      setError(result.error || 'حدث خطأ أثناء إرسال طلب المعاينة. يرجى المحاولة لاحقاً');
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-soft-fade text-right"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-viewing-title"
        tabIndex={-1}
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 relative z-10 outline-none" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#f2f7f2] text-[#14a800] rounded-xl">
              <Calendar className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="request-viewing-title" className="text-base font-black text-[#001e00]">احجز معاينة للعقار</h3>
              <p className="text-xs text-slate-500 font-semibold">مندوب روابط هيكون معاك خطوة بخطوة</p>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-[#14a800] transition cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Property Brief */}
        <div className="px-5 sm:px-6 py-3 bg-[#f2f7f2]/60 border-b border-[#14a800]/20 flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2 truncate">
            <Building2 className="w-4 h-4 text-[#14a800] shrink-0" />
            <span className="truncate text-[#001e00]">{version.title}</span>
          </div>
          <span className="font-mono bg-white px-2.5 py-0.5 rounded-md border border-slate-200 text-slate-600 shrink-0">
            كود: {property.reference_number}
          </span>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3 animate-soft-fade">
              <div className="w-16 h-16 bg-[#f2f7f2] text-[#14a800] rounded-xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-lg font-black text-[#001e00]">طلبك وصل بنجاح!</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto font-medium leading-relaxed">
                فريق روابط في كفر الشيخ هيكلمك في أقرب وقت لتأكيد الموعد المناسب وترتيب المعاينة.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold">
                  {error}
                </div>
              )}

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسمك الكريم <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="اكتب اسمك هنا"
                    className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Customer Mobile */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الموبايل <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:outline-hidden text-right"
                  />
                </div>
              </div>

              {/* Preferred Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اليوم المناسب ليك <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:outline-hidden cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الوقت المفضل <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#14a800] focus:outline-hidden cursor-pointer"
                    >
                      <option value="11:00">الصبح (11 ص - 1 ظهراً)</option>
                      <option value="14:00">الظهر (2 م - 4 عصراً)</option>
                      <option value="16:00">العصر (4 م - 6 مساءً)</option>
                      <option value="18:00">بالليل (6 م - 8 مساءً)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ملاحظات إضافية (اختياري)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أي ملاحظة تحب توضحها لفريق روابط قبل المعاينة..."
                    className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-[#14a800] focus:outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* Trust disclaimer */}
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                🔒 المعاينة مجانية 100% وبدون أي التزام، وبياناتك في أمان تام.
              </p>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 min-h-[44px] bg-[#14a800] hover:bg-[#108a00] active:bg-[#108a00] text-white text-xs font-black rounded-xl transition shadow-md shadow-[#14a800]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:ring-offset-2"
                >
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span>{isSubmitting ? 'ثواني...' : 'تأكيد حجز المعاينة'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
};
