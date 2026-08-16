import React from 'react';
import { PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const { t } = useLanguage();
  const resolvedTitle = title ?? t('common.emptyTitle');
  const resolvedDescription = description ?? t('common.emptyDesc');

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
        {icon || <PackageOpen className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
        {resolvedTitle}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {resolvedDescription}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
