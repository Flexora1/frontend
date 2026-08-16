import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, User, Phone, Mail, FileText, DollarSign } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';

const newOrderSchema = z.object({
  clientName: z.string().min(2, 'Mijoz ismi kamida 2 ta belgidan iborat bo\'lishi kerak'),
  clientPhone: z.string().min(6, 'Telefon raqamini to\'g\'ri kiriting'),
  clientEmail: z.string().email('Noto\'g\'ri e-mail').optional().or(z.literal('')),
  serviceName: z.string().min(2, 'Xizmat yoki mahsulot nomini kiriting'),
  totalAmount: z.number().min(100, 'Summa kamida 100 so\'m bo\'lishi kerak'),
  status: z.enum(['NEW', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED']),
  notes: z.string().optional(),
});

type NewOrderFormData = z.infer<typeof newOrderSchema>;

interface NewOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateOrder: (data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Promise<any>;
}

export function NewOrderModal({ open, onOpenChange, onCreateOrder }: NewOrderModalProps) {
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewOrderFormData>({
    resolver: zodResolver(newOrderSchema),
    defaultValues: {
      clientName: '',
      clientPhone: '+7 ',
      clientEmail: '',
      serviceName: '',
      totalAmount: 50000,
      status: 'NEW',
      notes: '',
    },
  });

  const onSubmit = async (data: NewOrderFormData) => {
    try {
      await onCreateOrder({
        clientId: `cli-${Date.now()}`,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail || undefined,
        serviceName: data.serviceName,
        items: [{ id: 'i1', name: data.serviceName, quantity: 1, unitPrice: data.totalAmount, totalPrice: data.totalAmount }],
        totalAmount: data.totalAmount,
        status: data.status as OrderStatus,
        notes: data.notes || undefined,
      });
      reset();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-xs z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden focus:outline-none">
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
            <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              {t('modal.newOrder')}
            </Dialog.Title>
            <Dialog.Close className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Client Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('modal.clientName')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  {...register('clientName')}
                  type="text"
                  placeholder="Ism Familiya"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {errors.clientName && (
                <span className="text-xs text-rose-500 mt-1">{errors.clientName.message}</span>
              )}
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('modal.phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    {...register('clientPhone')}
                    type="text"
                    placeholder="+7 (999) 000-00-00"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                {errors.clientPhone && (
                  <span className="text-xs text-rose-500 mt-1">{errors.clientPhone.message}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('modal.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    {...register('clientEmail')}
                    type="email"
                    placeholder="client@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Service & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('modal.serviceName')}
                </label>
                <input
                  {...register('serviceName')}
                  type="text"
                  placeholder="Soch kesish (Fade)"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.serviceName && (
                  <span className="text-xs text-rose-500 mt-1">{errors.serviceName.message}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('modal.amount')}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    {...register('totalAmount', { valueAsNumber: true })}
                    type="number"
                    placeholder="50000"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                {errors.totalAmount && (
                  <span className="text-xs text-rose-500 mt-1">{errors.totalAmount.message}</span>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('modal.status')}
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="NEW">{t('status.NEW')}</option>
                <option value="IN_PROGRESS">{t('status.IN_PROGRESS')}</option>
                <option value="READY">{t('status.READY')}</option>
                <option value="DELIVERED">{t('status.DELIVERED')}</option>
                <option value="CANCELLED">{t('status.CANCELLED')}</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('modal.notes')}
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder={t('modal.notesPlaceholder')}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {t('modal.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                {isSubmitting ? t('modal.creating') : t('modal.create')}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
