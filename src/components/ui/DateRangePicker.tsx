import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { ru as ruLocale, uz as uzLocale } from 'date-fns/locale';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const locale = language === 'ru' ? ruLocale : language === 'uz' ? uzLocale : undefined;

  const formattedLabel =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, 'd MMM', { locale })} - ${format(
          dateRange.to,
          'd MMM yyyy',
          { locale }
        )}`
      : dateRange?.from
      ? format(dateRange.from, 'd MMM yyyy', { locale })
      : t('common.period');

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn(
            'inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500',
            dateRange?.from && 'border-teal-500/50 text-teal-600 dark:text-teal-400 bg-teal-500/5 dark:bg-teal-500/10',
            className
          )}
        >
          <CalendarIcon className="w-4 h-4 text-slate-400" />
          <span>{formattedLabel}</span>
          {dateRange?.from && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onDateRangeChange(undefined);
              }}
              className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl focus:outline-none"
        >
          <DayPicker
            mode="range"
            defaultMonth={dateRange?.from || new Date()}
            selected={dateRange}
            onSelect={onDateRangeChange}
            locale={locale}
            numberOfMonths={1}
            className="rdp-custom"
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
