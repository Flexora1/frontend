import React, { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, User, ShoppingBag, Package, X, ArrowRight, Loader2 } from 'lucide-react';
import { dashboardApi } from '@/api/dashboardApi';
import { GlobalSearchResult, Order, Client, Product } from '@/types';
import { StatusBadge } from './StatusBadge';
import { formatCurrency } from '@/lib/utils';

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectOrder?: (order: Order) => void;
}

export function CommandDialog({ open, onOpenChange, onSelectOrder }: CommandDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult>({ clients: [], orders: [], products: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults({ clients: [], orders: [], products: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await dashboardApi.globalSearch(query);
        setResults(res);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [open]);

  const hasResults =
    results.clients.length > 0 || results.orders.length > 0 || results.products.length > 0;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-xs z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden focus:outline-none">
          {/* Search Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
            {loading ? (
              <Loader2 className="w-5 h-5 text-teal-600 dark:text-teal-400 animate-spin shrink-0" />
            ) : (
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск клиентов, заказов, товаров… (Esc для закрытия)"
              className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!query.trim() && (
              <div className="p-8 text-center text-sm text-slate-400">
                Начните вводить название клиента, номер заказа или наименование товара...
              </div>
            )}

            {query.trim() && !loading && !hasResults && (
              <div className="p-8 text-center text-sm text-slate-400">
                Ничего не найдено по запросу "{query}"
              </div>
            )}

            {/* Group: Orders */}
            {results.orders.length > 0 && (
              <div className="mb-4">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Заказы ({results.orders.length})
                </div>
                <div className="space-y-1 mt-1">
                  {results.orders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => {
                        onOpenChange(false);
                        if (onSelectOrder) onSelectOrder(ord);
                      }}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold text-xs">
                          {ord.orderNumber.split('-').pop()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {ord.orderNumber} — {ord.clientName}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {ord.serviceName} • {formatCurrency(ord.totalAmount)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={ord.status} />
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Group: Clients */}
            {results.clients.length > 0 && (
              <div className="mb-4">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Клиенты ({results.clients.length})
                </div>
                <div className="space-y-1 mt-1">
                  {results.clients.map((cli) => (
                    <div
                      key={cli.id}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-semibold text-xs text-slate-700 dark:text-slate-200">
                          {cli.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {cli.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {cli.email} • {cli.phone}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-slate-500">
                        {cli.totalOrders} заказов
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Group: Products */}
            {results.products.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  Товары ({results.products.length})
                </div>
                <div className="space-y-1 mt-1">
                  {results.products.map((prd) => (
                    <div
                      key={prd.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center font-semibold text-xs">
                          {prd.category[0]}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {prd.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Артикул: {prd.sku}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrency(prd.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
