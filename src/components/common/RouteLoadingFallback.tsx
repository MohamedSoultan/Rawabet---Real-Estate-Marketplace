import React from 'react';
import { Loader2 } from 'lucide-react';

export const RouteLoadingFallback: React.FC = () => {
  return (
    <div className="w-full min-h-[40vh] flex flex-col items-center justify-center gap-3 py-16 text-slate-500 animate-soft-fade">
      <div className="w-10 h-10 rounded-xl bg-[#f0faf0] border border-[#d7eed7] flex items-center justify-center text-[#14a800]">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
      <span className="text-xs font-bold text-slate-600">جارٍ تحميل الصفحة...</span>
    </div>
  );
};
