import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  options?: SelectOption[];
  selectSize?: SelectSize;
}

const sizeClasses: Record<SelectSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-3.5 py-2.5 text-sm rounded-xl',
  lg: 'px-4 py-3 text-base rounded-xl',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      options,
      selectSize = 'md',
      className = '',
      id,
      children,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? `select-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const hasError = Boolean(errorMessage);

    return (
      <div className="w-full flex flex-col gap-1.5 text-right">
        {label && (
          <label htmlFor={selectId} className="text-xs font-bold text-slate-700 select-none">
            {label}
            {required && <span className="text-rose-500 mr-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            className={`w-full bg-white text-slate-900 border appearance-none transition focus:outline-hidden focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed pl-9 pr-3.5 ${
              sizeClasses[selectSize]
            } ${
              hasError
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                : 'border-slate-200 focus:border-[#14a800] focus:ring-[#14a800]/10'
            } ${className}`}
            {...props}
          >
            {options
              ? options.map(opt => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {errorMessage ? (
          <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
