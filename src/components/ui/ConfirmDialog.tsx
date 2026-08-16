import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Удалить',
  cancelText = 'Отмена',
  variant = 'danger',
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-xs z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 focus:outline-none">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                variant === 'danger' && 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
                variant === 'warning' && 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
                variant === 'primary' && 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400'
              )}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none"
            >
              {cancelText}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-xl text-white shadow-sm transition-all cursor-pointer select-none flex items-center gap-2',
                variant === 'danger' && 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500',
                variant === 'warning' && 'bg-amber-600 hover:bg-amber-700',
                variant === 'primary' && 'bg-teal-600 hover:bg-teal-700'
              )}
            >
              {loading ? 'Обработка...' : confirmText}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
