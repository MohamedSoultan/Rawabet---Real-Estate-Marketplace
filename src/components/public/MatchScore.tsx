import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';

export interface MatchScoreData {
  score: number;
  reasons: string[];
}

export interface MatchScoreProps {
  data?: MatchScoreData;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showReasons?: boolean;
  variant?: 'badge' | 'card' | 'inline';
}

/**
 * PHASE 7 — SMART MATCHING PREPARATION
 * Pure UI Component for displaying match scores provided by future backend matching service.
 * Does not calculate fake AI scores.
 */
export const MatchScore: React.FC<MatchScoreProps> = ({
  data,
  className = '',
  size = 'md',
  showReasons = true,
  variant = 'badge'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If no match data provided, render nothing
  if (!data || typeof data.score !== 'number' || data.score <= 0) {
    return null;
  }

  const { score, reasons = [] } = data;

  // Determine badge color based on score
  const getBadgeColors = () => {
    if (score >= 85) {
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-800',
        accent: 'text-[#14a800]',
        bar: 'bg-[#14a800]'
      };
    }
    if (score >= 70) {
      return {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        text: 'text-teal-800',
        accent: 'text-teal-600',
        bar: 'bg-teal-600'
      };
    }
    return {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-700',
      accent: 'text-slate-600',
      bar: 'bg-slate-500'
    };
  };

  const colors = getBadgeColors();

  if (variant === 'badge') {
    return (
      <div className={`relative inline-flex flex-col items-start ${className}`} dir="rtl">
        <button
          type="button"
          onClick={() => reasons.length > 0 && setIsExpanded(prev => !prev)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${colors.bg} ${colors.border} ${colors.text} font-bold text-xs shadow-2xs transition hover:brightness-95 cursor-pointer`}
          title={reasons.length > 0 ? 'اضغط لعرض أسباب التطابق' : undefined}
          aria-expanded={isExpanded}
        >
          <Sparkles className={`w-3.5 h-3.5 ${colors.accent}`} />
          <span>تطابق {score}%</span>
          {showReasons && reasons.length > 0 && (
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          )}
        </button>

        {/* Reasons Popover / Collapsible */}
        {showReasons && isExpanded && reasons.length > 0 && (
          <div className="absolute top-full mt-1.5 right-0 z-30 min-w-[200px] p-2.5 bg-white rounded-xl shadow-lg border border-slate-200 text-xs animate-soft-fade">
            <div className="font-bold text-slate-800 mb-1.5 pb-1 border-b border-slate-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#14a800]" />
              <span>أسباب ترشيح هذا العقار:</span>
            </div>
            <ul className="space-y-1">
              {reasons.map((reason, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-[#14a800] shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Card Variant
  return (
    <div className={`p-3.5 rounded-xl border ${colors.bg} ${colors.border} ${className}`} dir="rtl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center shadow-2xs">
            <Sparkles className={`w-4 h-4 ${colors.accent}`} />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900">
              نسبة ملاءمة العقار لاحتياجاتك
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              بناءً على تفضيلاتك في البحث الذكي
            </div>
          </div>
        </div>
        <div className={`text-base font-black ${colors.accent}`}>
          {score}%
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden mb-2.5">
        <div 
          className={`h-full ${colors.bar} rounded-full transition-all duration-500`} 
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }} 
        />
      </div>

      {/* Reasons Chips */}
      {showReasons && reasons.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {reasons.map((reason, idx) => (
            <span 
              key={idx} 
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white border border-slate-200/80 text-[11px] font-bold text-slate-700 shadow-2xs"
            >
              <CheckCircle2 className="w-3 h-3 text-[#14a800]" />
              {reason}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
