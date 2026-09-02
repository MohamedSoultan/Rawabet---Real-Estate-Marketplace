import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, FileText, Info } from 'lucide-react';

interface LegalModalProps {
  type: 'PRIVACY' | 'TERMS' | 'ABOUT' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const { settings } = useApp();
  if (!type) return null;

  const contentMap = {
    PRIVACY: {
      title: 'سياسة الخصوصية وسرية البيانات',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      body: settings.privacy_policy_ar
    },
    TERMS: {
      title: 'الشروط والأحكام وسياسة النشر',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      body: settings.terms_ar
    },
    ABOUT: {
      title: 'عن منصة روابط للوساطة العقارية',
      icon: <Info className="w-6 h-6 text-purple-600" />,
      body: settings.about_ar
    }
  };

  const activeContent = contentMap[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              {activeContent.icon}
            </div>
            <h3 className="text-base font-extrabold text-slate-900">{activeContent.title}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
          {activeContent.body}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-5 py-2 rounded-xl transition"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
