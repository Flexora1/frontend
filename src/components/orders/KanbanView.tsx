import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Order, OrderStatus } from '@/types';
import { OrderCard } from './OrderCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';

interface KanbanViewProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onSelectOrder: (order: Order) => void;
}

const columns: { status: OrderStatus; labelKey: string; dotColor: string }[] = [
  { status: 'NEW', labelKey: 'status.NEW', dotColor: 'bg-sky-500' },
  { status: 'IN_PROGRESS', labelKey: 'status.IN_PROGRESS', dotColor: 'bg-teal-500' },
  { status: 'READY', labelKey: 'status.READY', dotColor: 'bg-purple-500' },
  { status: 'DELIVERED', labelKey: 'status.DELIVERED', dotColor: 'bg-emerald-500' },
  { status: 'CANCELLED', labelKey: 'status.CANCELLED', dotColor: 'bg-rose-500' },
];

function KanbanColumn({
  column,
  orders,
  onSelectOrder,
}: {
  column: { status: OrderStatus; labelKey: string; dotColor: string };
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}) {
  const { t } = useLanguage();
  const { isOver, setNodeRef } = useDroppable({
    id: column.status,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col h-full min-w-[280px] w-full bg-slate-100/60 dark:bg-slate-900/60 rounded-2xl p-3 border transition-colors',
        isOver
          ? 'border-2 border-dashed border-teal-500 bg-teal-500/5 dark:bg-teal-500/10'
          : 'border-slate-200/80 dark:border-slate-800/80'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/60 dark:border-slate-800/60 mb-3">
        <div className="flex items-center gap-2">
          <span className={cn('w-2.5 h-2.5 rounded-full', column.dotColor)} />
          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {t(column.labelKey)}
          </span>
        </div>
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-2xs">
          {orders.length}
        </span>
      </div>

      {/* Column Cards */}
      <SortableContext
        items={orders.map((o) => o.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
          {orders.map((ord) => (
            <OrderCard key={ord.id} order={ord} onSelect={onSelectOrder} />
          ))}
          {orders.length === 0 && (
            <div className="h-24 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              {t('orders.dragHere')}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanView({ orders, onStatusChange, onSelectOrder }: KanbanViewProps) {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const found = orders.find((o) => o.id === event.active.id);
    if (found) setActiveOrder(found);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveOrder(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // If over a column status directly
    const targetStatus = columns.find((c) => c.status === overId)?.status;

    if (targetStatus) {
      const currentOrder = orders.find((o) => o.id === activeId);
      if (currentOrder && currentOrder.status !== targetStatus) {
        onStatusChange(activeId, targetStatus);
      }
      return;
    }

    // If over another card in a column
    const overOrder = orders.find((o) => o.id === overId);
    if (overOrder) {
      const currentOrder = orders.find((o) => o.id === activeId);
      if (currentOrder && currentOrder.status !== overOrder.status) {
        onStatusChange(activeId, overOrder.status);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 h-[calc(100vh-260px)] min-h-[500px] overflow-x-auto pb-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            column={col}
            orders={orders.filter((o) => o.status === col.status)}
            onSelectOrder={onSelectOrder}
          />
        ))}
      </div>

      <DragOverlay>
        {activeOrder ? (
          <div className="rotate-3 scale-105 opacity-90 shadow-2xl">
            <OrderCard order={activeOrder} onSelect={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
