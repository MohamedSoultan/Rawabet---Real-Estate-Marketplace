import React, { forwardRef } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  inputSize?: InputSize;
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-3.5 py-2.5 text-sm rounded-xl',
  lg: 'px-4 py-3 text-base rounded-xl',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      leftAddon,
      rightAddon,
      inputSize = 'md',
      className = '',
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const hasError = Boolean(errorMessage);

    return (
      <div className="w-full flex flex-col gap-1.5 text-right">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold text-slate-700 select-none font-sans">
            {label}
            {required && <span className="text-rose-500 mr-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {rightAddon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {rightAddon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            className={`w-full bg-white text-slate-900 border transition placeholder:text-slate-400 focus:outline-hidden focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed font-sans leading-normal ${
              sizeClasses[inputSize]
            } ${
              hasError
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                : 'border-slate-200 focus:border-[#14a800] focus:ring-[#14a800]/10'
            } ${rightAddon ? 'pr-9' : ''} ${leftAddon ? 'pl-9' : ''} ${className}`}
            {...props}
          />
          {leftAddon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftAddon}
            </div>
          )}
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

Input.displayName = 'Input';
