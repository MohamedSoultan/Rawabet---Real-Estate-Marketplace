import React, { useState } from 'react';
import { Check, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export interface MatchReasonsProps {
  /** Future backend value: match_reasons */
  reasons?: string[] | null;
  /** Maximum number of reasons to show initially */
  maxDisplay?: number;
  /** Visual presentation mode */
  variant?: 'chips' | 'list' | 'compact';
  /** Optional container extra classes */
  className?: string;
  /** Title text above reasons */
  title?: string;
}

export const MatchReasons: React.FC<MatchReasonsProps> = ({
  reasons,
  maxDisplay = 3,
  variant = 'chips',
  className = '',
  title,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If no backend reasons provided, render nothing
  if (!reasons || reasons.length === 0) {
    return null;
  }

  const visibleReasons = isExpanded ? reasons : reasons.slice(0, maxDisplay);
  const hiddenCount = reasons.length - maxDisplay;

  if (variant === 'list') {
    return (
      <div className={`space-y-2 text-right ${className}`} dir="rtl">
        {title && (
          <div className="flex items-center gap-1.5 text-xs font-black text-[#001e00]">
            <Sparkles className="w-3.5 h-3.5 text-[#14a800]" />
            <span>{title}</span>
          </div>
        )}
        <ul className="space-y-1.5">
          {visibleReasons.map((reason, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed font-medium"
            >
              <span className="w-4 h-4 rounded-full bg-[#f0faf0] text-[#14a800] border border-[#d7eed7] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>

        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className="text-[11px] font-bold text-[#14a800] hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
          >
            {isExpanded ? (
              <>
                <span>إخفاء الأسباب الإضافية</span>
                <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>+{hiddenCount} أسباب مطابقة أخرى</span>
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    const topReason = reasons[0];
    return (
      <div className={`flex items-center gap-1.5 text-xs font-bold text-slate-700 ${className}`} dir="rtl">
        <span className="w-4 h-4 rounded-full bg-[#f0faf0] text-[#14a800] flex items-center justify-center shrink-0">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </span>
        <span className="truncate">{topReason}</span>
        {reasons.length > 1 && (
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
            +{reasons.length - 1}
          </span>
        )}
      </div>
    );
  }

  // Default: 'chips' variant
  return (
    <div className={`space-y-2 text-right ${className}`} dir="rtl">
      {title && (
        <div className="flex items-center gap-1.5 text-xs font-black text-[#001e00]">
          <Sparkles className="w-3.5 h-3.5 text-[#14a800]" />
          <span>{title}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 items-center">
        {visibleReasons.map((reason, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#f0faf0] text-[#14a800] border border-[#d7eed7] whitespace-nowrap select-none"
          >
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>{reason}</span>
          </span>
        ))}

        {hiddenCount > 0 && !isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
          >
            <span>+{hiddenCount} مزايا</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        )}

        {isExpanded && hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <span>إخفاء</span>
            <ChevronUp className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
