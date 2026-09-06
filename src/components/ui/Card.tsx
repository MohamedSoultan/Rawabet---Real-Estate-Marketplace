import React, { forwardRef } from 'react';

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'flat';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white border border-[#e4ebe4] shadow-2xs',
  elevated: 'bg-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow duration-200',
  bordered: 'bg-white border-2 border-slate-200',
  flat: 'bg-slate-50 border border-slate-100',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', interactive = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl overflow-hidden transition-all duration-150 ${variantClasses[variant]} ${
          interactive ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-sm' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`p-5 pb-3 flex flex-col gap-1 border-b border-slate-100 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <h3 ref={ref} className={`text-base sm:text-lg font-bold text-[#001e00] ${className}`} {...props}>
        {children}
      </h3>
    );
  }
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <p ref={ref} className={`text-xs sm:text-sm text-slate-500 font-medium ${className}`} {...props}>
        {children}
      </p>
    );
  }
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`p-5 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`p-5 pt-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-3 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';
