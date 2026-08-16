import {
  KPIStats,
  RevenueChartPoint,
  RevenuePeriod,
  StatusDistributionPoint,
  GlobalSearchResult,
  UserProfile,
  NotificationItem,
  OrderStatus,
} from '@/types';
import { apiFetch } from './client';

export const dashboardApi = {
  // GET /api/v1/dashboard/kpi
  // TODO: Swagger OpenAPI endpoint needed for real-time aggregated metrics calculation
  getKPIStats: async (): Promise<KPIStats> => {
    try {
      return await apiFetch<KPIStats>('/dashboard/kpi');
    } catch {
      return {
        revenueToday: 550000,
        revenueTodayChange: 14.8,
        activeOrders: 28,
        activeOrdersChange: 8.4,
        newClients: 12,
        newClientsChange: 22.5,
        avgOrderValue: 87500,
        avgOrderValueChange: -2.1,
      };
    }
  },

  // GET /api/v1/dashboard/revenue-chart?period=7d|30d|3m
  // TODO: Swagger OpenAPI endpoint needed for revenue timeline chart
  getRevenueChart: async (period: RevenuePeriod = '30d'): Promise<RevenueChartPoint[]> => {
    try {
      return await apiFetch<RevenueChartPoint[]>(`/dashboard/revenue-chart?period=${period}`);
    } catch {
      if (period === '7d') {
        return [
          { date: '2026-08-10', label: 'Пн', revenue: 120000, orders: 4 },
          { date: '2026-08-11', label: 'Вт', revenue: 180000, orders: 6 },
          { date: '2026-08-12', label: 'Ср', revenue: 140000, orders: 5 },
          { date: '2026-08-13', label: 'Чт', revenue: 260000, orders: 9 },
          { date: '2026-08-14', label: 'Пт', revenue: 310000, orders: 11 },
          { date: '2026-08-15', label: 'Сб', revenue: 210000, orders: 7 },
          { date: '2026-08-16', label: 'Вс', revenue: 550000, orders: 14 },
        ];
      }
      if (period === '3m') {
        return [
          { date: '2026-06-01', label: 'Июнь', revenue: 4200000, orders: 120 },
          { date: '2026-07-01', label: 'Июль', revenue: 5800000, orders: 165 },
          { date: '2026-08-01', label: 'Август', revenue: 7100000, orders: 198 },
        ];
      }
      // default 30d (weekly buckets)
      return [
        { date: '2026-07-20', label: 'Нед 1', revenue: 1150000, orders: 38 },
        { date: '2026-07-27', label: 'Нед 2', revenue: 1420000, orders: 46 },
        { date: '2026-08-03', label: 'Нед 3', revenue: 1890000, orders: 59 },
        { date: '2026-08-10', label: 'Нед 4', revenue: 2640000, orders: 75 },
      ];
    }
  },

  // GET /api/v1/dashboard/status-distribution
  // TODO: Swagger OpenAPI endpoint needed for status donut chart
  getStatusDistribution: async (): Promise<StatusDistributionPoint[]> => {
    try {
      return await apiFetch<StatusDistributionPoint[]>('/dashboard/status-distribution');
    } catch {
      return [
        { status: 'NEW', label: 'Новый', count: 12, color: '#38BDF8' }, // sky blue
        { status: 'IN_PROGRESS', label: 'В работе', count: 18, color: '#0D9488' }, // primary teal
        { status: 'READY', label: 'Готов', count: 9, color: '#8B5CF6' }, // purple
        { status: 'DELIVERED', label: 'Выдан', count: 42, color: '#10B981' }, // green
        { status: 'CANCELLED', label: 'Отменён', count: 5, color: '#F43F5E' }, // red
      ];
    }
  },

  // GET /api/v1/search?query=...
  globalSearch: async (query: string): Promise<GlobalSearchResult> => {
    if (!query || query.trim().length < 2) {
      return { clients: [], orders: [], products: [] };
    }
    try {
      return await apiFetch<GlobalSearchResult>(`/search?query=${encodeURIComponent(query)}`);
    } catch {
      const q = query.toLowerCase();
      return {
        clients: [
          { id: 'cli-1', name: 'Алексей Смирнов', email: 'alex@example.com', phone: '+7 (999) 123-45-67', totalOrders: 5, totalSpent: 350000, createdAt: '2026-01-15' },
          { id: 'cli-2', name: 'Елена Васильева', email: 'elena@example.com', phone: '+7 (916) 987-65-43', totalOrders: 2, totalSpent: 120000, createdAt: '2026-03-20' },
        ].filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)),
        orders: [
          { id: 'ord-101', orderNumber: 'ORD-2026-001', clientId: 'cli-1', clientName: 'Алексей Смирнов', serviceName: 'Разработка CRM-модуля', items: [], totalAmount: 120000, status: 'IN_PROGRESS' as OrderStatus, createdAt: '2026-08-16', updatedAt: '2026-08-16' },
          { id: 'ord-102', orderNumber: 'ORD-2026-002', clientId: 'cli-2', clientName: 'Елена Васильева', serviceName: 'Аудит интерфейса SaaS', items: [], totalAmount: 65000, status: 'NEW' as OrderStatus, createdAt: '2026-08-16', updatedAt: '2026-08-16' },
        ].filter((o) => o.orderNumber.toLowerCase().includes(q) || o.clientName.toLowerCase().includes(q) || o.serviceName.toLowerCase().includes(q)),
        products: [
          { id: 'prd-1', name: 'Лицензия Flexora Pro (1 год)', category: 'SaaS', price: 49000, stockQuantity: 999, sku: 'SKU-FLX-PRO' },
          { id: 'prd-2', name: 'Модуль Аналитики & Отчётов', category: 'Add-on', price: 19000, stockQuantity: 999, sku: 'SKU-FLX-ANL' },
        ].filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)),
      };
    }
  },

  // GET /api/v1/user/profile
  getUserProfile: async (): Promise<UserProfile> => {
    try {
      return await apiFetch<UserProfile>('/user/profile');
    } catch {
      return {
        id: 'usr-1',
        name: 'Александр Белов',
        email: 'a.belov@flexora.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'ADMIN',
        companyName: 'Flexora SaaS Studio',
        subscriptionPlan: {
          name: 'Pro Plan',
          status: 'ACTIVE',
          daysLeft: 24,
        },
      };
    }
  },

  // GET /api/v1/notifications
  getNotifications: async (): Promise<NotificationItem[]> => {
    try {
      return await apiFetch<NotificationItem[]>('/notifications');
    } catch {
      return [
        {
          id: 'n-1',
          title: 'Новый заказ #ORD-2026-002',
          message: 'Елена Васильева оформила заказ на "Аудит интерфейса SaaS"',
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          read: false,
          type: 'ORDER',
          linkId: 'ord-102',
        },
        {
          id: 'n-2',
          title: 'Заказ завершён #ORD-2026-004',
          message: 'Статус заказа изменен на "Выдан"',
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          read: false,
          type: 'ORDER',
          linkId: 'ord-104',
        },
        {
          id: 'n-3',
          title: 'Системное обновление',
          message: 'Модуль Канбан обновлен до версии 2.4',
          createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
          read: true,
          type: 'SYSTEM',
        },
      ];
    }
  },
};
