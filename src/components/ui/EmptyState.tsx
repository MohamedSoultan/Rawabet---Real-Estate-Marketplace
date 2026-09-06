import React from 'react';
import { Search } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionNode?: React.ReactNode;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionNode,
  compact = false,
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center text-center rounded-2xl bg-white border border-dashed border-slate-200 ${
        compact ? 'py-8 px-4' : 'py-16 px-6'
      }`}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#f0faf0] text-[#14a800] flex items-center justify-center mb-3 shadow-2xs">
        {icon || <Search className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-bold text-[#001e00] mb-1">{title}</h3>
      {description && <p className="text-xs text-slate-500 max-w-sm font-medium mb-4">{description}</p>}
      {actionNode ? (
        actionNode
      ) : actionLabel && onAction ? (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
