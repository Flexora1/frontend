/**
 * Flexora CRM & Sartaroshxona (Barbershop) OpenAPI Data Models
 */

// Barbershop Specific Models
export type UserRole = 'OWNER' | 'BARBER' | 'CLIENT';

export type AppointmentStatus =
  | 'WAITING'     // Navbatda kutmoqda
  | 'IN_CHAIR'    // Hozir креслода
  | 'COMPLETED'   // Xizmat ko'rsatildi
  | 'NO_SHOW'     // Mijoz kelmadi
  | 'CANCELLED';  // Bekor qilindi

export type PaymentMethod = 'CASH' | 'CARD' | 'CLICK_PAYME';

export interface Barber {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  specialty: string;
  isWorkingToday: boolean;
  status: 'BUSY' | 'FREE' | 'BREAK';
  phone: string;
  completedTodayCount: number;
  todayEarnings: number;
}

export interface BarbershopService {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  category: 'HAIR' | 'BEARD' | 'COMBO' | 'KIDS' | 'SPA';
  popular?: boolean;
}

export interface Appointment {
  id: string;
  appointmentNumber: string;
  clientName: string;
  clientPhone: string;
  clientAvatar?: string;
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  totalAmount: number;
  status: AppointmentStatus;
  scheduledTime: string;
  createdAt: string;
  durationMinutes: number;
  paymentMethod?: PaymentMethod;
  notes?: string;
  isWalkIn?: boolean;
}

export interface SupplyItem {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
  minRequiredStock: number;
  category: 'SHAMPOO' | 'RAZOR' | 'OIL' | 'TOWEL' | 'CREAM';
  pricePerUnit: number;
}

export interface DailySummary {
  totalRevenue: number;
  cashRevenue: number;
  cardRevenue: number;
  totalAppointments: number;
  completedCount: number;
  noShowCount: number;
  cancelledCount: number;
  barberPayouts: {
    barberId: string;
    barberName: string;
    earnedTotal: number;
    barberShare: number;
  }[];
}

// General OpenAPI CRM Data Models for complete backwards compatibility
export type OrderStatus = 'NEW' | 'IN_PROGRESS' | 'READY' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderStatusHistory {
  id: string;
  status: OrderStatus;
  changedAt: string;
  changedBy?: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  clientPhone?: string;
  clientEmail?: string;
  serviceName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  notes?: string;
  statusHistory?: OrderStatusHistory[];
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone: string;
  avatar?: string;
  company?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  lastVisit?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  sku: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  companyName: string;
  subscriptionPlan: {
    name: string;
    status: 'ACTIVE' | 'TRIAL' | 'EXPIRED';
    daysLeft: number;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'ORDER' | 'SYSTEM' | 'CLIENT';
  linkId?: string;
}

export interface KPIStats {
  revenueToday: number;
  revenueTodayChange: number;
  activeOrders: number;
  activeOrdersChange: number;
  newClients: number;
  newClientsChange: number;
  avgOrderValue: number;
  avgOrderValueChange: number;
}

export interface RevenueChartPoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
}

export type RevenuePeriod = '7d' | '30d' | '3m';

export interface StatusDistributionPoint {
  status: OrderStatus;
  label: string;
  count: number;
  color: string;
}

export interface GlobalSearchResult {
  clients: Client[];
  orders: Order[];
  products: Product[];
}
