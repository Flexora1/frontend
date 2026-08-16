import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  X,
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  Trash2,
  Edit,
  History,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatCurrency, formatDate } from '@/lib/utils';

interface OrderDrawerProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onDeleteOrder: (id: string) => void;
}

export function OrderDrawer({
  order,
  open,
  onOpenChange,
  onStatusChange,
  onDeleteOrder,
}: OrderDrawerProps) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  if (!order) return null;

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-xs z-50 animate-fade-in" />
          <Dialog.Content className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-white dark:bg-slate-900 z-50 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col focus:outline-none animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200/80 dark:border-slate-800/80">
              <div>
                <div className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  Детали заказа
                </div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                  {order.orderNumber}
                </div>
              </div>
              <Dialog.Close className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Status & Quick Switcher */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-1">Текущий статус</div>
                  <StatusBadge status={order.status} />
                </div>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs">
                      Изменить статус <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="end"
                      sideOffset={4}
                      className="w-40 bg-white dark:bg-slate-900 rounded-xl p-1 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 text-xs"
                    >
                      {(['NEW', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED'] as OrderStatus[]).map(
                        (st) => (
                          <DropdownMenu.Item
                            key={st}
                            onClick={() => onStatusChange(order.id, st)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <StatusBadge status={st} />
                          </DropdownMenu.Item>
                        )
                      )}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>

              {/* Client Info Card */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Информация о клиенте
                </div>
                <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={order.clientName} src={order.clientAvatar} size="md" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {order.clientName}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">ID: {order.clientId}</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    {order.clientPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.clientPhone}</span>
                      </div>
                    )}
                    {order.clientEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.clientEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Services Breakdown */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Состав заказа
                </div>
                <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-3">
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {order.serviceName}
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs py-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between py-2">
                          <span className="text-slate-600 dark:text-slate-300">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {formatCurrency(item.totalPrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-500">Итоговая сумма</span>
                    <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamps & Deadline */}
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Дата создания
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                {order.deadline && (
                  <div className="flex items-center justify-between text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Дедлайн
                    </span>
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      {formatDate(order.deadline)}
                    </span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs">
                  <div className="font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Заметки к заказу
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {order.notes}
                  </p>
                </div>
              )}

              {/* Status Timeline History */}
              {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" /> История статусов
                  </div>
                  <div className="pl-3 border-l-2 border-slate-200 dark:border-slate-800 space-y-4 text-xs">
                    {order.statusHistory.map((h) => (
                      <div key={h.id} className="relative pl-3">
                        <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-teal-500 ring-4 ring-white dark:ring-slate-900" />
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {h.status}
                        </div>
                        <div className="text-[11px] text-slate-400">{formatDate(h.changedAt)}</div>
                        {h.note && (
                          <div className="text-[11px] text-slate-500 mt-0.5">{h.note}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteOpen(true)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Удалить
              </button>

              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Edit className="w-4 h-4" /> Редактировать
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Confirmation Dialog for Delete */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Удалить заказ?"
        description={`Вы действительно хотите безвозвратно удалить заказ ${order.orderNumber}?`}
        confirmText="Да, удалить"
        variant="danger"
        onConfirm={() => {
          onDeleteOrder(order.id);
          onOpenChange(false);
        }}
      />
    </>
  );
}
