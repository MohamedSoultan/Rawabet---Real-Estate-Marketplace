import React, { useState } from 'react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, Archive, Check } from 'lucide-react';

interface PropertyStatusModalProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onStatusChanged?: (status: 'SOLD' | 'RENTED' | 'ARCHIVED') => void;
}

export const PropertyStatusModal: React.FC<PropertyStatusModalProps> = ({ 
  isOpen, 
  property, 
  onClose,
  onStatusChanged 
}) => {
  const { markPropertyStatus } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<'SOLD' | 'RENTED' | 'ARCHIVED'>('SOLD');

  if (!isOpen || !property) return null;

  const handleSave = () => {
    markPropertyStatus(property.id, selectedStatus);
    if (onStatusChanged) {
      onStatusChanged(selectedStatus);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in text-right">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold">تغيير حالة العقار</h3>
            <span className="text-xs text-emerald-400 font-mono">{property.reference_number}</span>
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
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            اختر الحالة الجديدة للعقار لتحديث ظهوره في المنصة:
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setSelectedStatus('SOLD')}
              className={`w-full p-3 rounded-2xl border text-right transition flex items-center justify-between ${
                selectedStatus === 'SOLD' ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="text-xs font-bold">تم البيع بنجاح 🎉</div>
                <div className="text-[11px] text-slate-500 font-normal">إيقاف استقبال طلبات جديدة وتوثيق إتمام البيع</div>
              </div>
              {selectedStatus === 'SOLD' && <Check className="w-4 h-4 text-blue-600" />}
            </button>

            <button
              type="button"
              onClick={() => setSelectedStatus('RENTED')}
              className={`w-full p-3 rounded-2xl border text-right transition flex items-center justify-between ${
                selectedStatus === 'RENTED' ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="text-xs font-bold">تم التأجير بنجاح 🔑</div>
                <div className="text-[11px] text-slate-500 font-normal">إيقاف استقبال طلبات جديدة وتوثيق إتمام الإيجار</div>
              </div>
              {selectedStatus === 'RENTED' && <Check className="w-4 h-4 text-emerald-600" />}
            </button>

            <button
              type="button"
              onClick={() => setSelectedStatus('ARCHIVED')}
              className={`w-full p-3 rounded-2xl border text-right transition flex items-center justify-between ${
                selectedStatus === 'ARCHIVED' ? 'border-slate-600 bg-slate-100 text-slate-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="text-xs font-bold">أرشفة وإيقاف مؤقت (Archived)</div>
                <div className="text-[11px] text-slate-500 font-normal">إخفاء العقار مؤقتاً من الموقع العام</div>
              </div>
              {selectedStatus === 'ARCHIVED' && <Check className="w-4 h-4 text-slate-800" />}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            إلغاء
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/20"
          >
            حفظ الحالة
          </button>
        </div>

      </div>
    </div>
  );
};
