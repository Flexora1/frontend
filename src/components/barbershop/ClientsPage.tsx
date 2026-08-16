import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Phone, Scissors } from 'lucide-react';
import { barbershopApi } from '@/api/barbershopApi';
import { Client } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';
import { UserAvatar } from '@/components/ui/UserAvatar';

export function ClientsPage() {
  const { t } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    barbershopApi
      .getClients()
      .then(setClients)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
    );
  }, [clients, query]);

  if (loading) {
    return <div className="p-6 text-center text-sm text-slate-400">{t('common.loading')}</div>;
  }

  const totalSpent = clients.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalVisits = clients.reduce((acc, c) => acc + c.totalOrders, 0);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs">
            {t('nav.clients')}
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('clients.search')}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Users className="w-4 h-4" /> {t('clients.totalClients')}
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {clients.length} ta
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Scissors className="w-4 h-4" /> {t('clients.totalVisits')}
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {totalVisits} ta
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            {t('clients.totalSpent')}: {formatCurrency(totalSpent)}
          </div>
        </div>
      </div>

      {/* Clients list */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-400">{t('clients.empty')}</div>
          )}
          {filtered.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <UserAvatar name={client.name} src={client.avatar} size="md" />
                <div className="min-w-0">
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {client.name}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {client.phone}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-extrabold text-teal-600 dark:text-teal-400">
                  {formatCurrency(client.totalSpent)}
                </div>
                <div className="text-[11px] text-slate-400">
                  {client.totalOrders} {t('clients.visits')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
