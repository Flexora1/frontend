import { Order, OrderStatus } from '@/types';
import { apiFetch } from './client';

// Initial OpenAPI-compliant mock orders dataset for development & testing
const initialOrders: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-2026-001',
    clientId: 'cli-1',
    clientName: 'Алексей Смирнов',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    clientPhone: '+7 (999) 123-45-67',
    clientEmail: 'alex.smirnov@example.com',
    serviceName: 'Разработка CRM-модуля',
    items: [
      { id: 'it-1', name: 'UI Design System', quantity: 1, unitPrice: 45000, totalPrice: 45000 },
      { id: 'it-2', name: 'Frontend React Dev', quantity: 1, unitPrice: 75000, totalPrice: 75000 },
    ],
    totalAmount: 120000,
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    notes: 'Клиент просил сдать первый этап до конца недели.',
    statusHistory: [
      { id: 'h1', status: 'NEW', changedAt: new Date(Date.now() - 3600000 * 24).toISOString(), note: 'Заказ создан' },
      { id: 'h2', status: 'IN_PROGRESS', changedAt: new Date(Date.now() - 3600000 * 4).toISOString(), note: 'Взято в работу' },
    ],
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-2026-002',
    clientId: 'cli-2',
    clientName: 'Елена Васильева',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    clientPhone: '+7 (916) 987-65-43',
    clientEmail: 'elena.v@example.com',
    serviceName: 'Аудит интерфейса SaaS',
    items: [
      { id: 'it-3', name: 'UX Audit & Report', quantity: 1, unitPrice: 65000, totalPrice: 65000 },
    ],
    totalAmount: 65000,
    status: 'NEW',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    notes: 'Требуется фокус на конверсию мобильной версии.',
    statusHistory: [
      { id: 'h3', status: 'NEW', changedAt: new Date(Date.now() - 3600000 * 12).toISOString(), note: 'Новая заявка с сайта' },
    ],
  },
  {
    id: 'ord-103',
    orderNumber: 'ORD-2026-003',
    clientId: 'cli-3',
    clientName: 'Михаил Соколов',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    clientPhone: '+7 (903) 555-01-99',
    clientEmail: 'm.sokolov@techcorp.ru',
    serviceName: 'Настройка интеграции API',
    items: [
      { id: 'it-4', name: 'REST API Setup', quantity: 1, unitPrice: 90000, totalPrice: 90000 },
    ],
    totalAmount: 90000,
    status: 'READY',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 1).toISOString(),
    notes: 'Тестирование на стейджинге успешно проведено.',
    statusHistory: [
      { id: 'h4', status: 'NEW', changedAt: new Date(Date.now() - 3600000 * 48).toISOString() },
      { id: 'h5', status: 'IN_PROGRESS', changedAt: new Date(Date.now() - 3600000 * 24).toISOString() },
      { id: 'h6', status: 'READY', changedAt: new Date(Date.now() - 3600000 * 6).toISOString(), note: 'Готов к сдаче' },
    ],
  },
  {
    id: 'ord-104',
    orderNumber: 'ORD-2026-004',
    clientId: 'cli-4',
    clientName: 'Анна Кравцова',
    clientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    clientPhone: '+7 (926) 333-22-11',
    clientEmail: 'kravtsova@designstudio.io',
    serviceName: 'Брендинг и дизайн карточек',
    items: [
      { id: 'it-5', name: 'Brand Guide', quantity: 1, unitPrice: 150000, totalPrice: 150000 },
    ],
    totalAmount: 150000,
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    deadline: new Date(Date.now() - 86400000 * 1).toISOString(),
    notes: 'Оплата получена в полном объёме.',
    statusHistory: [
      { id: 'h7', status: 'NEW', changedAt: new Date(Date.now() - 3600000 * 96).toISOString() },
      { id: 'h8', status: 'IN_PROGRESS', changedAt: new Date(Date.now() - 3600000 * 72).toISOString() },
      { id: 'h9', status: 'READY', changedAt: new Date(Date.now() - 3600000 * 36).toISOString() },
      { id: 'h10', status: 'DELIVERED', changedAt: new Date(Date.now() - 3600000 * 24).toISOString(), note: 'Выдан клиенту' },
    ],
  },
  {
    id: 'ord-105',
    orderNumber: 'ORD-2026-005',
    clientId: 'cli-5',
    clientName: 'Дмитрий Морозов',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    clientPhone: '+7 (977) 444-55-66',
    clientEmail: 'd.morozov@inbox.ru',
    serviceName: 'Консультация по архитектуре',
    items: [
      { id: 'it-6', name: 'Tech Consulting', quantity: 2, unitPrice: 20000, totalPrice: 40000 },
    ],
    totalAmount: 40000,
    status: 'CANCELLED',
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 80).toISOString(),
    notes: 'Клиент перенес проект на следующий квартал.',
    statusHistory: [
      { id: 'h11', status: 'NEW', changedAt: new Date(Date.now() - 3600000 * 120).toISOString() },
      { id: 'h12', status: 'CANCELLED', changedAt: new Date(Date.now() - 3600000 * 80).toISOString(), note: 'Отменено по просьбе заказчика' },
    ],
  },
  {
    id: 'ord-106',
    orderNumber: 'ORD-2026-006',
    clientId: 'cli-6',
    clientName: 'Ольга Романова',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    clientPhone: '+7 (985) 111-99-88',
    clientEmail: 'olga.r@startup.co',
    serviceName: 'Оптимизация производительности',
    items: [
      { id: 'it-7', name: 'Speed Optimization', quantity: 1, unitPrice: 85000, totalPrice: 85000 },
    ],
    totalAmount: 85000,
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    notes: 'Lighthouse score с 45 до 95+.',
    statusHistory: [
      { id: 'h13', status: 'NEW', changedAt: new Date(Date.now() - 3600000 * 18).toISOString() },
      { id: 'h14', status: 'IN_PROGRESS', changedAt: new Date(Date.now() - 3600000 * 10).toISOString() },
    ],
  },
];

let localOrdersStore = [...initialOrders];

export const ordersApi = {
  // GET /api/v1/orders
  getOrders: async (): Promise<Order[]> => {
    try {
      return await apiFetch<Order[]>('/orders');
    } catch {
      // TODO: Swagger OpenAPI live endpoint fallback for local dev
      return [...localOrdersStore];
    }
  },

  // GET /api/v1/orders/:id
  getOrderById: async (id: string): Promise<Order | null> => {
    try {
      return await apiFetch<Order>(`/orders/${id}`);
    } catch {
      return localOrdersStore.find((o) => o.id === id) || null;
    }
  },

  // POST /api/v1/orders
  createOrder: async (data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    try {
      return await apiFetch<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const newOrder: Order = {
        ...data,
        id: `ord-${Date.now()}`,
        orderNumber: `ORD-2026-0${localOrdersStore.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [
          {
            id: `h-${Date.now()}`,
            status: data.status,
            changedAt: new Date().toISOString(),
            note: 'Заказ успешно создан',
          },
        ],
      };
      localOrdersStore = [newOrder, ...localOrdersStore];
      return newOrder;
    }
  },

  // PATCH /api/v1/orders/:id/status
  updateOrderStatus: async (id: string, status: OrderStatus, note?: string): Promise<Order> => {
    try {
      return await apiFetch<Order>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      });
    } catch {
      localOrdersStore = localOrdersStore.map((ord) => {
        if (ord.id === id) {
          const updatedHistory = [
            ...(ord.statusHistory || []),
            {
              id: `h-${Date.now()}`,
              status,
              changedAt: new Date().toISOString(),
              note: note || `Статус изменён на ${status}`,
            },
          ];
          return {
            ...ord,
            status,
            updatedAt: new Date().toISOString(),
            statusHistory: updatedHistory,
          };
        }
        return ord;
      });
      const updated = localOrdersStore.find((o) => o.id === id);
      if (!updated) throw new Error('Order not found');
      return updated;
    }
  },

  // DELETE /api/v1/orders/:id
  deleteOrder: async (id: string): Promise<boolean> => {
    try {
      await apiFetch<boolean>(`/orders/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      localOrdersStore = localOrdersStore.filter((o) => o.id !== id);
      return true;
    }
  },

  // POST /api/v1/orders/batch-delete
  batchDeleteOrders: async (ids: string[]): Promise<boolean> => {
    try {
      await apiFetch('/orders/batch-delete', {
        method: 'POST',
        body: JSON.stringify({ ids }),
      });
      return true;
    } catch {
      localOrdersStore = localOrdersStore.filter((o) => !ids.includes(o.id));
      return true;
    }
  },

  // POST /api/v1/orders/batch-status
  batchUpdateStatus: async (ids: string[], status: OrderStatus): Promise<boolean> => {
    try {
      await apiFetch('/orders/batch-status', {
        method: 'POST',
        body: JSON.stringify({ ids, status }),
      });
      return true;
    } catch {
      localOrdersStore = localOrdersStore.map((o) =>
        ids.includes(o.id)
          ? {
              ...o,
              status,
              updatedAt: new Date().toISOString(),
              statusHistory: [
                ...(o.statusHistory || []),
                {
                  id: `h-${Date.now()}`,
                  status,
                  changedAt: new Date().toISOString(),
                  note: 'Массовое обновление статуса',
                },
              ],
            }
          : o
      );
      return true;
    }
  },
};
