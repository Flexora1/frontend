import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Order, OrderStatus } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';

interface OrdersTableProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onBatchStatusChange: (ids: string[], status: OrderStatus) => void;
  onBatchDelete: (ids: string[]) => void;
}

export function OrdersTable({
  orders,
  onSelectOrder,
  onBatchStatusChange,
  onBatchDelete,
}: OrdersTableProps) {
  const { t } = useLanguage();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const selectedOrderIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

  const columns: ColumnDef<Order>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-500 cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-500 cursor-pointer"
        />
      ),
    },
    {
      accessorKey: 'orderNumber',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          {t('orders.order')} <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-xs">
          {row.original.orderNumber}
        </span>
      ),
    },
    {
      accessorKey: 'clientName',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          {t('orders.client')} <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <UserAvatar name={row.original.clientName} src={row.original.clientAvatar} size="sm" />
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {row.original.clientName}
            </div>
            <div className="text-xs text-slate-400">{row.original.clientPhone}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'serviceName',
      header: t('orders.service'),
      cell: ({ row }) => (
        <span className="text-slate-700 dark:text-slate-300">{row.original.serviceName}</span>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          {t('orders.amount')} <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-bold text-slate-900 dark:text-slate-100">
          {formatCurrency(row.original.totalAmount)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: t('orders.status'),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'createdAt',
      header: t('orders.date'),
      cell: ({ row }) => (
        <span className="text-xs text-slate-400">{formatDate(row.original.createdAt)}</span>
      ),
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting, rowSelection },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="py-3 px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onSelectOrder(row.original)}
                className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                  row.getIsSelected() ? 'bg-teal-500/5 dark:bg-teal-500/10' : ''
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3.5 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-slate-400 text-sm">
                  {t('orders.notFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 text-xs text-slate-500">
        <div>
          {t('orders.shown', { shown: table.getRowModel().rows.length, total: orders.length })}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>{t('orders.perPage')}</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none"
            >
              {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-900 dark:text-slate-100 px-2">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar for Bulk Selection */}
      {selectedOrderIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500 text-white">
            {t('orders.selected', { count: selectedOrderIds.length })}
          </span>

          <div className="h-4 w-px bg-slate-700 dark:bg-slate-300" />

          {/* Mass Status Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 dark:bg-slate-200 hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                <CheckCircle2 className="w-4 h-4 text-teal-400 dark:text-teal-600" />
                {t('orders.changeStatus')}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="center"
                sideOffset={8}
                className="w-44 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl p-1 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 text-xs"
              >
                {(['NEW', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED'] as OrderStatus[]).map(
                  (st) => (
                    <DropdownMenu.Item
                      key={st}
                      onClick={() => {
                        onBatchStatusChange(selectedOrderIds, st);
                        setRowSelection({});
                      }}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-medium"
                    >
                      <StatusBadge status={st} />
                    </DropdownMenu.Item>
                  )
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Mass Delete Button */}
          <button
            onClick={() => {
              onBatchDelete(selectedOrderIds);
              setRowSelection({});
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            {t('orders.delete')}
          </button>
        </div>
      )}
    </div>
  );
}
