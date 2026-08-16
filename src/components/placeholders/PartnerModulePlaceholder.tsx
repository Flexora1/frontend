import React from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Construction } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface PartnerModulePlaceholderProps {
  title: string;
  description: string;
}

export function PartnerModulePlaceholder({ title, description }: PartnerModulePlaceholderProps) {
  const { t } = useLanguage();
  return (
    <div className="p-4 sm:p-6 max-w-[1920px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('placeholder.inDevelopment')}
        </p>
      </div>

      <EmptyState
        title={title}
        description={description}
        icon={<Construction className="w-6 h-6 text-amber-500" />}
        className="min-h-[400px]"
      />
    </div>
  );
}
