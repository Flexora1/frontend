import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '@/types';
import { ordersApi } from '@/api/ordersApi';
import { toast } from 'sonner';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getOrders();
      setOrders(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Не удалось загрузить заказы';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: OrderStatus, note?: string) => {
    // Optimistic update
    const previousOrders = [...orders];
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    try {
      const updatedOrder = await ordersApi.updateOrderStatus(orderId, newStatus, note);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
      toast.success(`Статус заказа изменён на "${newStatus}"`);
    } catch (err) {
      setOrders(previousOrders);
      toast.error('Не удалось обновить статус заказа');
    }
  };

  const createOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const created = await ordersApi.createOrder(orderData);
      setOrders((prev) => [created, ...prev]);
      toast.success(`Заказ ${created.orderNumber} успешно создан`);
      return created;
    } catch (err) {
      toast.error('Ошибка при создании заказа');
      throw err;
    }
  };

  const deleteOrder = async (orderId: string) => {
    const previousOrders = [...orders];
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    try {
      await ordersApi.deleteOrder(orderId);
      toast.success('Заказ успешно удалён');
    } catch (err) {
      setOrders(previousOrders);
      toast.error('Не удалось удалить заказ');
    }
  };

  const batchUpdateStatus = async (orderIds: string[], status: OrderStatus) => {
    const previousOrders = [...orders];
    setOrders((prev) =>
      prev.map((o) => (orderIds.includes(o.id) ? { ...o, status } : o))
    );

    try {
      await ordersApi.batchUpdateStatus(orderIds, status);
      toast.success(`Изменён статус для ${orderIds.length} заказов`);
    } catch (err) {
      setOrders(previousOrders);
      toast.error('Ошибка при массовой смене статуса');
    }
  };

  const batchDelete = async (orderIds: string[]) => {
    const previousOrders = [...orders];
    setOrders((prev) => prev.filter((o) => !orderIds.includes(o.id)));

    try {
      await ordersApi.batchDeleteOrders(orderIds);
      toast.success(`Удалено заказов: ${orderIds.length}`);
    } catch (err) {
      setOrders(previousOrders);
      toast.error('Ошибка при массовом удалении');
    }
  };

  return {
    orders,
    loading,
    error,
    refreshOrders: fetchOrders,
    updateStatus,
    createOrder,
    deleteOrder,
    batchUpdateStatus,
    batchDelete,
  };
}
