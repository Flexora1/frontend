import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, Calendar, DollarSign } from 'lucide-react';
import { Order } from '@/types';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  onSelect: (order: Order) => void;
}

export function OrderCard({ order, onSelect }: OrderCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        // Prevent click when dragging
        if (!isDragging) {
          onSelect(order);
        }
      }}
      className={cn(
        'p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing select-none group',
        isDragging && 'opacity-60 rotate-2 scale-105 z-50 border-teal-500 shadow-xl'
      )}
    >
      {/* Header: Client & Avatar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <UserAvatar name={order.clientName} src={order.clientAvatar} size="sm" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {order.clientName}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{order.orderNumber}</span>
          </div>
        </div>
        <StatusBadge status={order.status} className="text-[10px] py-0.5 px-2" />
      </div>

      {/* Body: Service name */}
      <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-3 line-clamp-2">
        {order.serviceName}
      </div>

      {/* Footer: Price & Date */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
        <span className="font-bold text-slate-900 dark:text-slate-100">
          {formatCurrency(order.totalAmount)}
        </span>
        {order.deadline && (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="w-3 h-3 text-slate-400" />
            {formatDate(order.deadline).split(',')[0]}
          </span>
        )}
      </div>
    </div>
  );
}
