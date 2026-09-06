import React from 'react';
import { Property } from '../../types';
import { X, AlertCircle, Edit, ShieldAlert } from 'lucide-react';

interface RejectedPropertyModalProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onEditToFix?: (property: Property) => void;
  onFixAndResubmit?: () => void;
}

export const RejectedPropertyModal: React.FC<RejectedPropertyModalProps> = ({ 
  isOpen,
  property, 
  onClose, 
  onEditToFix,
  onFixAndResubmit 
}) => {
  if (!isOpen || !property) return null;

  const latestVersion = property.versions[property.versions.length - 1];

  const handleFix = () => {
    onClose();
    if (onEditToFix) onEditToFix(property);
    if (onFixAndResubmit) onFixAndResubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in text-right">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-rose-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
            <div>
              <h3 className="text-sm font-extrabold">تفاصيل وأسباب رفض نشر العقار</h3>
              <span className="text-[11px] text-rose-200">{property.reference_number}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
            <div className="text-xs font-bold flex items-center gap-1.5 text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>سبب الرفض المسجل من المراجع:</span>
            </div>
            <p className="text-xs leading-relaxed font-semibold">
              {latestVersion?.rejection_reason || 'بيانات العقار أو الصور تحتاج إلى تصحيح لمطابقة معايير النشر.'}
            </p>
          </div>

          <div className="space-y-1 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900">كيفية إعادة العقار للنشر:</h4>
            <p className="leading-relaxed">
              يمكنك الضغط على زر <strong>"تعديل وتصحيح العقار"</strong> بالأسفل، لتعديل التفاصيل المذكورة وإعادة إرسال العقار لطابور المراجعة مرة أخرى.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            إغلاق
          </button>

          <button
            onClick={handleFix}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <Edit className="w-4 h-4" />
            <span>تعديل وتصحيح العقار الآن</span>
          </button>
        </div>

      </div>
    </div>
  );
};
