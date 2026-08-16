import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { dashboardApi } from '@/api/dashboardApi';
import { ordersApi } from '@/api/ordersApi';
import {
  KPIStats,
  RevenueChartPoint,
  RevenuePeriod,
  StatusDistributionPoint,
  Order,
  UserProfile,
} from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { CardSkeleton, TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DashboardProps {
  onSelectOrder: (order: Order) => void;
  onNavigateToOrders: () => void;
}

export function Dashboard({ onSelectOrder, onNavigateToOrders }: DashboardProps) {
  const [kpi, setKpi] = useState<KPIStats | null>(null);
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>('30d');
  const [revenueChart, setRevenueChart] = useState<RevenueChartPoint[]>([]);
  const [statusChart, setStatusChart] = useState<StatusDistributionPoint[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Доброе утро';
    if (hour >= 12 && hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [kpiRes, chartRes, statusRes, ordersRes, userRes] = await Promise.all([
          dashboardApi.getKPIStats(),
          dashboardApi.getRevenueChart(revenuePeriod),
          dashboardApi.getStatusDistribution(),
          ordersApi.getOrders(),
          dashboardApi.getUserProfile(),
        ]);
        setKpi(kpiRes);
        setRevenueChart(chartRes);
        setStatusChart(statusRes);
        setRecentOrders(ordersRes.slice(0, 5));
        setUser(userRes);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [revenuePeriod]);

  if (loading || !kpi) {
    return (
      <div className="space-y-6 p-4 sm:p-6 max-w-[1920px] mx-auto">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Выручка сегодня',
      value: formatCurrency(kpi.revenueToday),
      change: kpi.revenueTodayChange,
      icon: DollarSign,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-500/20',
    },
    {
      title: 'Активные заказы',
      value: kpi.activeOrders,
      change: kpi.activeOrdersChange,
      icon: ShoppingCart,
      color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-500/20',
    },
    {
      title: 'Новые клиенты',
      value: kpi.newClients,
      change: kpi.newClientsChange,
      icon: Users,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20',
    },
    {
      title: 'Средний чек',
      value: formatCurrency(kpi.avgOrderValue),
      change: kpi.avgOrderValueChange,
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/20',
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-[1920px] mx-auto">
      {/* Top Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {getGreeting()}, {user?.name.split(' ')[0] || 'Александр'}!
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize mt-0.5">
            {formattedDate}
          </p>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          const isPositive = card.change >= 0;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-[2px] group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {card.value}
                </div>
                <div
                  className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isPositive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {Math.abs(card.change)}%
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-400">vs прошлый период</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section: 2/3 Revenue AreaChart + 1/3 Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Динамика выручки
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Общий объём продаж по выбранному периоду
              </p>
            </div>

            {/* Period Filters */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
              {(['7d', '30d', '3m'] as RevenuePeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setRevenuePeriod(period)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    revenuePeriod === period
                      ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {period === '7d' ? '7 дней' : period === '30d' ? '30 дней' : '3 месяца'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as RevenueChartPoint;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs space-y-1">
                          <div className="font-semibold text-slate-300">{data.label}</div>
                          <div className="text-sm font-bold text-teal-400">
                            {formatCurrency(data.revenue)}
                          </div>
                          <div className="text-slate-400">Заказов: {data.orders}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0D9488"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Статусы заказов
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Распределение текущих заказов
            </p>
          </div>

          <div className="h-52 w-full my-2 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {statusChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as StatusDistributionPoint;
                      return (
                        <div className="p-2 bg-slate-900 text-white rounded-lg text-xs font-semibold">
                          {data.label}: {data.count}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {statusChart.map((item) => (
              <div key={item.status} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-100">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Последние заказы
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              5 последних оформленных заказов клиентов
            </p>
          </div>
          <button
            onClick={onNavigateToOrders}
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Смотреть все <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-2">Клиент</th>
                <th className="pb-3 px-2">Услуга / Товар</th>
                <th className="pb-3 px-2">Сумма</th>
                <th className="pb-3 px-2">Статус</th>
                <th className="pb-3 px-2 text-right">Время</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {recentOrders.map((ord) => (
                <tr
                  key={ord.id}
                  onClick={() => onSelectOrder(ord)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={ord.clientName} src={ord.clientAvatar} size="sm" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {ord.clientName}
                        </div>
                        <div className="text-xs text-slate-400">{ord.orderNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-slate-700 dark:text-slate-300">
                    {ord.serviceName}
                  </td>
                  <td className="py-3 px-2 font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(ord.totalAmount)}
                  </td>
                  <td className="py-3 px-2">
                    <StatusBadge status={ord.status} />
                  </td>
                  <td className="py-3 px-2 text-right text-xs text-slate-400">
                    <div className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(ord.createdAt)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
