import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  FileSpreadsheet,
  Download,
  CreditCard,
  Wallet,
  Users,
  Scissors,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

// Weekly Daily Data (Oxirgi hafta kunlik ko'rsatkichlari)
const weeklyData = [
  { day: 'Dush (11 Avg)', revenue: 580000, orders: 9, cash: 320000, card: 260000, barberPayout: 290000, netProfit: 290000 },
  { day: 'Sesh (12 Avg)', revenue: 640000, orders: 11, cash: 400000, card: 240000, barberPayout: 320000, netProfit: 320000 },
  { day: 'Chor (13 Avg)', revenue: 710000, orders: 12, cash: 450000, card: 260000, barberPayout: 355000, netProfit: 355000 },
  { day: 'Pay (14 Avg)', revenue: 690000, orders: 10, cash: 390000, card: 300000, barberPayout: 345000, netProfit: 345000 },
  { day: 'Jum (15 Avg)', revenue: 950000, orders: 15, cash: 520000, card: 430000, barberPayout: 475000, netProfit: 475000 },
  { day: 'Shan (16 Avg)', revenue: 1280000, orders: 19, cash: 700000, card: 580000, barberPayout: 640000, netProfit: 640000 },
  { day: 'Yak (17 Avg)', revenue: 1100000, orders: 16, cash: 600000, card: 500000, barberPayout: 550000, netProfit: 550000 },
];

// Monthly Data (Oxirgi 4 hafta natijalari)
const monthlyWeeks = [
  { week: '1-Hafta (1–7 Avg)', revenue: 4200000, orders: 65, cash: 2300000, card: 1900000 },
  { week: '2-Hafta (8–14 Avg)', revenue: 4750000, orders: 72, cash: 2600000, card: 2150000 },
  { week: '3-Hafta (15–21 Avg)', revenue: 5950000, orders: 91, cash: 3380000, card: 2570000 },
  { week: '4-Hafta (22–31 Avg)', revenue: 5200000, orders: 78, cash: 2900000, card: 2300000 },
];

export function ReportsView() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('week');

  const totalWeeklyRevenue = weeklyData.reduce((acc, d) => acc + d.revenue, 0);
  const totalWeeklyOrders = weeklyData.reduce((acc, d) => acc + d.orders, 0);
  const totalWeeklyCash = weeklyData.reduce((acc, d) => acc + d.cash, 0);
  const totalWeeklyCard = weeklyData.reduce((acc, d) => acc + d.card, 0);
  const totalWeeklyBarberPayout = weeklyData.reduce((acc, d) => acc + d.barberPayout, 0);

  const totalMonthlyRevenue = monthlyWeeks.reduce((acc, w) => acc + w.revenue, 0);

  const handleExportCSV = () => {
    toast.success('Moliya hisoboti Excel (CSV) formatida yuklab olindi!');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Period Filter Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Hisobot davri:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setPeriod('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                period === 'week'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Haftalik (7 kun)
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                period === 'month'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Oylik (30 kun)
            </button>
            <button
              onClick={() => setPeriod('quarter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                period === 'quarter'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              3 Oylik
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Excel yuklab olish
          </button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue for Period */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Umumiy tushum</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatCurrency(period === 'week' ? totalWeeklyRevenue : totalMonthlyRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" /> +16.4% o'tgan davrga nisbatan
          </div>
        </div>

        {/* Card 2: Cash vs Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Naqd vs Karta</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(totalWeeklyCash)} <span className="text-xs text-slate-400 font-normal">naqd</span>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {formatCurrency(totalWeeklyCard)} (karta / Click)
          </div>
        </div>

        {/* Card 3: Master Commission Payouts */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Ustalarga maosh</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatCurrency(totalWeeklyBarberPayout)}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold">
            50% ustalar ulushi
          </div>
        </div>

        {/* Card 4: Net Salon Profit */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Sof foyda</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">
            {formatCurrency(period === 'week' ? totalWeeklyRevenue - totalWeeklyBarberPayout : totalMonthlyRevenue * 0.5)}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">
            To'lovlardan keyingi sof daromad
          </div>
        </div>
      </div>

      {/* Visual Daily Revenue Chart Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {period === 'week' ? 'Hafta kunlari bo\'yicha tushum (Dush–Yak)' : 'Haftalar bo\'yicha dinamika'}
            </h2>
            <p className="text-xs text-slate-400">Har bir kun uchun daromad statistikasi</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 font-bold text-xs">
            {period === 'week' ? '7 Kun' : 'Oylik'}
          </span>
        </div>

        {/* Daily Bar Chart Visualizer */}
        <div className="pt-4 pb-2 grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 border-b border-slate-200/80 dark:border-slate-800">
          {weeklyData.map((d, index) => {
            const maxRevenue = 1300000;
            const heightPercent = Math.min(100, Math.round((d.revenue / maxRevenue) * 100));

            return (
              <div key={index} className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatCurrency(d.revenue)}
                </div>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full max-w-[40px] bg-gradient-to-t from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 rounded-t-lg transition-all duration-300 shadow-xs relative"
                />
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate">
                  {d.day.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Daily Breakdown Financial Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Kunlik moliya jurnali va batafsil hisobot
            </h2>
            <p className="text-xs text-slate-400">
              Buyurtmalar, naqd pul, plasti k/Click va ustalar maoshi
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Kun / Sana</th>
                <th className="py-3 px-4 text-center">Buyurtmalar</th>
                <th className="py-3 px-4 text-right">Naqd pul</th>
                <th className="py-3 px-4 text-right">Karta / Click</th>
                <th className="py-3 px-4 text-right">Jami Tushum</th>
                <th className="py-3 px-4 text-right">Ustalar Maoshi</th>
                <th className="py-3 px-4 text-right">Sof Foyda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {weeklyData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    {row.day}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                    {row.orders}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                    {formatCurrency(row.cash)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                    {formatCurrency(row.card)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-teal-600 dark:text-teal-400">
                    {formatCurrency(row.revenue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-purple-600 font-semibold">
                    {formatCurrency(row.barberPayout)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(row.netProfit)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 font-bold text-xs">
                <td className="py-4 px-4 text-slate-900 dark:text-slate-100">
                  HAFTALIK JAMI
                </td>
                <td className="py-4 px-4 text-center font-mono text-slate-900 dark:text-slate-100">
                  {totalWeeklyOrders}
                </td>
                <td className="py-4 px-4 text-right font-mono text-slate-900 dark:text-slate-100">
                  {formatCurrency(totalWeeklyCash)}
                </td>
                <td className="py-4 px-4 text-right font-mono text-slate-900 dark:text-slate-100">
                  {formatCurrency(totalWeeklyCard)}
                </td>
                <td className="py-4 px-4 text-right font-mono text-teal-600 text-sm">
                  {formatCurrency(totalWeeklyRevenue)}
                </td>
                <td className="py-4 px-4 text-right font-mono text-purple-600">
                  {formatCurrency(totalWeeklyBarberPayout)}
                </td>
                <td className="py-4 px-4 text-right font-mono text-emerald-600 text-sm">
                  {formatCurrency(totalWeeklyRevenue - totalWeeklyBarberPayout)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
