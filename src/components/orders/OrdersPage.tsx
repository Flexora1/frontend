import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Kanban,
  Table as TableIcon,
  Plus,
  Search,
  RotateCcw,
  Check,
  Filter,
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DateRange } from 'react-day-picker';
import { Order, OrderStatus } from '@/types';
import { useOrders } from '@/hooks/useOrders';
import { KanbanView } from './KanbanView';
import { OrdersTable } from './OrdersTable';
import { OrderDrawer } from './OrderDrawer';
import { NewOrderModal } from './NewOrderModal';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';

export function OrdersPage({
  selectedOrderFromNav,
  onClearSelectedOrderNav,
}: {
  selectedOrderFromNav?: Order | null;
  onClearSelectedOrderNav?: () => void;
}) {
  const { t } = useLanguage();
  const {
    orders,
    loading,
    updateStatus,
    createOrder,
    deleteOrder,
    batchUpdateStatus,
    batchDelete,
  } = useOrders();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    selectedOrderFromNav || null
  );
  const [drawerOpen, setDrawerOpen] = useState<boolean>(!!selectedOrderFromNav);
  const [newModalOpen, setNewModalOpen] = useState<boolean>(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Open drawer if navigation brought an order
  React.useEffect(() => {
    if (selectedOrderFromNav) {
      setSelectedOrder(selectedOrderFromNav);
      setDrawerOpen(true);
    }
  }, [selectedOrderFromNav]);

  const handleOpenDrawer = (order: Order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = (open: boolean) => {
    setDrawerOpen(open);
    if (!open && onClearSelectedOrderNav) {
      onClearSelectedOrderNav();
    }
  };

  // Filter logic
  const isFilterActive =
    searchQuery.trim().length > 0 ||
    selectedStatuses.length > 0 ||
    dateRange?.from !== undefined;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatuses([]);
    setDateRange(undefined);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Search client, order number, service
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          ord.clientName.toLowerCase().includes(q) ||
          ord.orderNumber.toLowerCase().includes(q) ||
          ord.serviceName.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Status multiselect filter
      if (selectedStatuses.length > 0) {
        if (!selectedStatuses.includes(ord.status)) return false;
      }

      // Date range filter
      if (dateRange?.from) {
        const createdAt = new Date(ord.createdAt);
        if (createdAt < dateRange.from) return false;
        if (dateRange.to) {
          const endOfDay = new Date(dateRange.to);
          endOfDay.setHours(23, 59, 59, 999);
          if (createdAt > endOfDay) return false;
        }
      }

      return true;
    });
  }, [orders, searchQuery, selectedStatuses, dateRange]);

  const toggleStatusFilter = (status: OrderStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const allStatuses: { status: OrderStatus; label: string }[] = [
    { status: 'NEW', label: t('status.NEW') },
    { status: 'IN_PROGRESS', label: t('status.IN_PROGRESS') },
    { status: 'READY', label: t('status.READY') },
    { status: 'DELIVERED', label: t('status.DELIVERED') },
    { status: 'CANCELLED', label: t('status.CANCELLED') },
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-[1920px] mx-auto space-y-6">
        <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1920px] mx-auto space-y-6">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('orders.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('orders.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none',
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <Kanban className="w-3.5 h-3.5" /> {t('orders.kanban')}
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none',
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <TableIcon className="w-3.5 h-3.5" /> {t('orders.table')}
            </button>
          </div>

          {/* New Order Button */}
          <button
            onClick={() => setNewModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> {t('orders.newOrder')}
          </button>
        </div>
      </motion.div>

      {/* Filter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Client / Order Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('orders.search')}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Status Multiselect Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {selectedStatuses.length === 0
                    ? t('orders.allStatuses')
                    : t('orders.statuses', { count: selectedStatuses.length })}
                </span>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="start"
                sideOffset={6}
                className="w-48 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-xl border border-slate-200 dark:border-slate-800 z-50 text-xs space-y-0.5"
              >
                {allStatuses.map((st) => {
                  const isChecked = selectedStatuses.includes(st.status);
                  return (
                    <div
                      key={st.status}
                      onClick={() => toggleStatusFilter(st.status)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-medium"
                    >
                      <span className="text-slate-700 dark:text-slate-300">{st.label}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                    </div>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Date Range Picker */}
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>

        {/* Conditional Reset Filters Button */}
        {isFilterActive && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {t('orders.resetFilters')}
          </button>
        )}
      </div>

      {/* Main Content View (Kanban or Table) */}
      {viewMode === 'kanban' ? (
        <KanbanView
          orders={filteredOrders}
          onStatusChange={updateStatus}
          onSelectOrder={handleOpenDrawer}
        />
      ) : (
        <OrdersTable
          orders={filteredOrders}
          onSelectOrder={handleOpenDrawer}
          onBatchStatusChange={batchUpdateStatus}
          onBatchDelete={batchDelete}
        />
      )}

      {/* Order Details Drawer Sheet */}
      <OrderDrawer
        order={selectedOrder}
        open={drawerOpen}
        onOpenChange={handleCloseDrawer}
        onStatusChange={updateStatus}
        onDeleteOrder={deleteOrder}
      />

      {/* New Order Modal Dialog */}
      <NewOrderModal
        open={newModalOpen}
        onOpenChange={setNewModalOpen}
        onCreateOrder={createOrder}
      />
    </div>
  );
}
