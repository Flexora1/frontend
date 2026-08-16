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
      const msg = err instanceof Error ? err.message : "Navbatlarni yuklab bo'lmadi";
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
      toast.success(`Buyurtma holati "${newStatus}" ga o'zgartirildi`);
    } catch (err) {
      setOrders(previousOrders);
      toast.error("Buyurtma holatini yangilab bo'lmadi");
    }
  };

  const createOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const created = await ordersApi.createOrder(orderData);
      setOrders((prev) => [created, ...prev]);
      toast.success(`${created.orderNumber} buyurtmasi muvaffaqiyatli yaratildi`);
      return created;
    } catch (err) {
      toast.error("Buyurtma yaratishda xatolik");
      throw err;
    }
  };

  const deleteOrder = async (orderId: string) => {
    const previousOrders = [...orders];
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    try {
      await ordersApi.deleteOrder(orderId);
      toast.success("Buyurtma muvaffaqiyatli o'chirildi");
    } catch (err) {
      setOrders(previousOrders);
      toast.error("Buyurtmani o'chirib bo'lmadi");
    }
  };

  const batchUpdateStatus = async (orderIds: string[], status: OrderStatus) => {
    const previousOrders = [...orders];
    setOrders((prev) =>
      prev.map((o) => (orderIds.includes(o.id) ? { ...o, status } : o))
    );

    try {
      await ordersApi.batchUpdateStatus(orderIds, status);
      toast.success(`${orderIds.length} ta buyurtma holati o'zgartirildi`);
    } catch (err) {
      setOrders(previousOrders);
      toast.error("Holatni ommaviy o'zgartirishda xatolik");
    }
  };

  const batchDelete = async (orderIds: string[]) => {
    const previousOrders = [...orders];
    setOrders((prev) => prev.filter((o) => !orderIds.includes(o.id)));

    try {
      await ordersApi.batchDeleteOrders(orderIds);
      toast.success(`O'chirilgan buyurtmalar: ${orderIds.length}`);
    } catch (err) {
      setOrders(previousOrders);
      toast.error("Ommaviy o'chirishda xatolik");
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
