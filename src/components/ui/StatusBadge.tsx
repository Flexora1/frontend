import React from 'react';
import { OrderStatus } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: OrderStatus | string;
  className?: string;
}

const statusConfig: Record<
  string,
  { labelKey: string; bg: string; text: string; dot: string }
> = {
  NEW: {
    labelKey: 'status.NEW',
    bg: 'bg-sky-500/10 dark:bg-sky-500/20 border-sky-200 dark:border-sky-800',
    text: 'text-sky-700 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  IN_PROGRESS: {
    labelKey: 'status.IN_PROGRESS',
    bg: 'bg-teal-500/10 dark:bg-teal-500/20 border-teal-200 dark:border-teal-800',
    text: 'text-teal-700 dark:text-teal-300',
    dot: 'bg-teal-500',
  },
  READY: {
    labelKey: 'status.READY',
    bg: 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-200 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-300',
    dot: 'bg-purple-500',
  },
  DELIVERED: {
    labelKey: 'status.DELIVERED',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  CANCELLED: {
    labelKey: 'status.CANCELLED',
    bg: 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-200 dark:border-rose-800',
    text: 'text-rose-700 dark:text-rose-300',
    dot: 'bg-rose-500',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useLanguage();
  const config = statusConfig[status] || {
    labelKey: status,
    bg: 'bg-slate-500/10 dark:bg-slate-500/20 border-slate-200 dark:border-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition-colors select-none',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', config.dot)} />
      {t(config.labelKey)}
    </span>
  );
}
