import React from 'react';
import { Sparkles, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

export interface MatchScoreProps {
  /** Future backend value: match_score (0 - 100) */
  score?: number | null;
  /** Visual variant */
  variant?: 'badge' | 'radial' | 'bar' | 'compact';
  /** Sizing */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show descriptive text label */
  showLabel?: boolean;
  /** Custom extra classes */
  className?: string;
}

export const MatchScore: React.FC<MatchScoreProps> = ({
  score,
  variant = 'badge',
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  // If backend score is not provided, do not render or show neutral pending state
  if (score === undefined || score === null) {
    return null;
  }

  // Purely visual mapping based on future backend score value (no calculation)
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));

  const getScoreTheme = (val: number) => {
    if (val >= 90) {
      return {
        label: 'تطابق استثنائي',
        badgeBg: 'bg-[#f0faf0] text-[#14a800] border-[#d7eed7]',
        text: 'text-[#14a800]',
        ring: '#14a800',
        barBg: 'bg-[#14a800]',
        icon: Sparkles,
      };
    }
    if (val >= 75) {
      return {
        label: 'تطابق ممتاز',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        text: 'text-emerald-700',
        ring: '#059669',
        barBg: 'bg-emerald-600',
        icon: CheckCircle2,
      };
    }
    if (val >= 60) {
      return {
        label: 'تطابق جيد',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        text: 'text-amber-700',
        ring: '#d97706',
        barBg: 'bg-amber-500',
        icon: TrendingUp,
      };
    }
    return {
      label: 'تطابق جزئي',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      text: 'text-slate-700',
      ring: '#64748b',
      barBg: 'bg-slate-500',
      icon: AlertCircle,
    };
  };

  const theme = getScoreTheme(clampedScore);
  const IconComponent = theme.icon;

  if (variant === 'radial') {
    const radius = size === 'lg' ? 22 : size === 'sm' ? 14 : 18;
    const stroke = size === 'lg' ? 4 : size === 'sm' ? 2.5 : 3;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clampedScore / 100) * circumference;
    const svgSize = (radius + stroke) * 2;

    return (
      <div className={`inline-flex items-center gap-2 ${className}`} dir="rtl">
        <div className="relative flex items-center justify-center shrink-0" style={{ width: svgSize, height: svgSize }}>
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${svgSize} ${svgSize}`}>
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              className="stroke-slate-100 fill-transparent"
              strokeWidth={stroke}
            />
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              className="fill-transparent transition-all duration-700 ease-out"
              stroke={theme.ring}
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className={`absolute font-black ${size === 'lg' ? 'text-xs' : 'text-[10px]'} ${theme.text}`}>
            {clampedScore}%
          </span>
        </div>
        {showLabel && (
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-bold text-slate-500">درجة المطابقة</span>
            <span className={`text-xs font-black ${theme.text}`}>{theme.label}</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'bar') {
    return (
      <div className={`w-full space-y-1.5 ${className}`} dir="rtl">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 font-bold flex items-center gap-1.5">
            <IconComponent className={`w-3.5 h-3.5 ${theme.text}`} />
            <span>{showLabel ? theme.label : 'مطابقة ذكية'}</span>
          </span>
          <span className={`font-black ${theme.text}`}>{clampedScore}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${theme.barBg} transition-all duration-700 ease-out rounded-full`}
            style={{ width: `${clampedScore}%` }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-black ${theme.text} ${className}`}
        dir="rtl"
      >
        <IconComponent className="w-3.5 h-3.5 shrink-0" />
        <span>{clampedScore}%</span>
        {showLabel && <span className="text-[11px] font-bold text-slate-500">مطابقة</span>}
      </span>
    );
  }

  // Default: 'badge' variant
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-black rounded-full border shadow-2xs whitespace-nowrap select-none ${sizeClasses} ${theme.badgeBg} ${className}`}
      dir="rtl"
    >
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>تطابق {clampedScore}%</span>
      {showLabel && (
        <span className="font-medium text-slate-600 opacity-90 hidden sm:inline">
          ({theme.label})
        </span>
      )}
    </span>
  );
};
