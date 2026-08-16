import {
  Appointment,
  AppointmentStatus,
  Barber,
  BarbershopService,
  Client,
  SupplyItem,
  DailySummary,
  PaymentMethod,
} from '@/types';

// Mock Barbers dataset
const initialBarbers: Barber[] = [
  {
    id: 'bar-1',
    name: 'Master Alisher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    specialty: 'Fade & Soqol masteri',
    isWorkingToday: true,
    status: 'BUSY',
    phone: '+998 90 111 22 33',
    completedTodayCount: 6,
    todayEarnings: 450000,
  },
  {
    id: 'bar-2',
    name: 'Master Rustam',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    specialty: 'Klassik va Zamonaviy sochlarga master',
    isWorkingToday: true,
    status: 'FREE',
    phone: '+998 91 222 33 44',
    completedTodayCount: 4,
    todayEarnings: 320000,
  },
  {
    id: 'bar-3',
    name: 'Master Jahongir',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    specialty: 'Bolalar sochi va Premium Kompleks',
    isWorkingToday: true,
    status: 'FREE',
    phone: '+998 93 333 44 55',
    completedTodayCount: 5,
    todayEarnings: 480000,
  },
];

// Mock Barbershop Services dataset
export const barbershopServices: BarbershopService[] = [
  {
    id: 'srv-1',
    name: 'Soch kesish (Klassik / Fade)',
    price: 60000,
    durationMinutes: 30,
    category: 'HAIR',
    popular: true,
  },
  {
    id: 'srv-2',
    name: 'Soqol olish va forma berish',
    price: 40000,
    durationMinutes: 20,
    category: 'BEARD',
    popular: true,
  },
  {
    id: 'srv-3',
    name: 'VIP Kompleks (Soch + Soqol + Yuz parvarishi)',
    price: 120000,
    durationMinutes: 60,
    category: 'COMBO',
    popular: true,
  },
  {
    id: 'srv-4',
    name: 'Bolalar soch turmagi',
    price: 50000,
    durationMinutes: 30,
    category: 'KIDS',
  },
  {
    id: 'srv-5',
    name: 'Bosh va yuvish SPA parvarishi',
    price: 35000,
    durationMinutes: 15,
    category: 'SPA',
  },
];

// Mock Barbershop Supplies dataset
const initialSupplies: SupplyItem[] = [
  { id: 'sup-1', name: 'Professional Shampun (1L)', currentStock: 2, unit: 'shisha', minRequiredStock: 5, category: 'SHAMPOO', pricePerUnit: 85000 },
  { id: 'sup-2', name: 'Bir martalik pichoqlar (Gillette)', currentStock: 12, unit: 'pachka', minRequiredStock: 15, category: 'RAZOR', pricePerUnit: 25000 },
  { id: 'sup-3', name: 'Soqol moyi va balzam (Organic)', currentStock: 8, unit: 'dona', minRequiredStock: 5, category: 'OIL', pricePerUnit: 60000 },
  { id: 'sup-4', name: 'Bir martalik sochiqlar', currentStock: 45, unit: 'dona', minRequiredStock: 30, category: 'TOWEL', pricePerUnit: 3000 },
];

// Mock Initial Appointments for Today
const initialAppointments: Appointment[] = [
  {
    id: 'app-1',
    appointmentNumber: 'NAV-101',
    clientName: 'Jasur Bekmirzayev',
    clientPhone: '+998 90 123 45 67',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    barberId: 'bar-1',
    barberName: 'Master Alisher',
    serviceId: 'srv-1',
    serviceName: 'Soch kesish (Klassik / Fade)',
    totalAmount: 60000,
    status: 'IN_CHAIR',
    scheduledTime: '11:00',
    durationMinutes: 30,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    paymentMethod: 'CASH',
    notes: 'Fade 2mm yon tomondan',
  },
  {
    id: 'app-2',
    appointmentNumber: 'NAV-102',
    clientName: 'Sardor Rahimiv',
    clientPhone: '+998 91 987 65 43',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    barberId: 'bar-1',
    barberName: 'Master Alisher',
    serviceId: 'srv-3',
    serviceName: 'VIP Kompleks (Soch + Soqol + Yuz parvarishi)',
    totalAmount: 120000,
    status: 'WAITING',
    scheduledTime: '11:45',
    durationMinutes: 60,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    paymentMethod: 'CLICK_PAYME',
  },
  {
    id: 'app-3',
    appointmentNumber: 'NAV-103',
    clientName: 'Bobur Mansurov',
    clientPhone: '+998 93 555 11 22',
    barberId: 'bar-2',
    barberName: 'Master Rustam',
    serviceId: 'srv-2',
    serviceName: 'Soqol olish va forma berish',
    totalAmount: 40000,
    status: 'WAITING',
    scheduledTime: '11:30',
    durationMinutes: 20,
    createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    isWalkIn: true,
  },
  {
    id: 'app-4',
    appointmentNumber: 'NAV-104',
    clientName: 'Sherzod Mahmudov',
    clientPhone: '+998 97 777 88 99',
    barberId: 'bar-3',
    barberName: 'Master Jahongir',
    serviceId: 'srv-4',
    serviceName: 'Bolalar soch turmagi',
    totalAmount: 50000,
    status: 'COMPLETED',
    scheduledTime: '10:15',
    durationMinutes: 30,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    paymentMethod: 'CARD',
  },
  {
    id: 'app-5',
    appointmentNumber: 'NAV-105',
    clientName: 'Farrux Umarov',
    clientPhone: '+998 94 444 33 22',
    barberId: 'bar-2',
    barberName: 'Master Rustam',
    serviceId: 'srv-1',
    serviceName: 'Soch kesish (Klassik / Fade)',
    totalAmount: 60000,
    status: 'NO_SHOW',
    scheduledTime: '10:00',
    durationMinutes: 30,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    notes: "Mijoz qo'ng'iroqqa javob bermadi, kelmadi.",
  },
];

let localAppointmentsStore = [...initialAppointments];
let localBarbersStore = [...initialBarbers];
let localSuppliesStore = [...initialSupplies];

export const staffUsers = [
  {
    id: 'usr-admin',
    name: 'Menejer (Ega)',
    login: 'admin@resto.uz',
    phone: '+998 (90) 000-00-00',
    password: 'admin123',
    role: 'OWNER' as const,
  },
  {
    id: 'bar-1',
    name: 'Usta Alisher',
    login: 'alisher',
    phone: '+998 90 111 22 33',
    password: 'master123',
    role: 'BARBER' as const,
  },
  {
    id: 'bar-2',
    name: 'Usta Rustam',
    login: 'rustam',
    phone: '+998 91 222 33 44',
    password: 'master123',
    role: 'BARBER' as const,
  },
  {
    id: 'bar-3',
    name: 'Usta Jahongir',
    login: 'jahongir',
    phone: '+998 93 333 44 55',
    password: 'master123',
    role: 'BARBER' as const,
  },
];

let listeners: Array<() => void> = [];

export const barbershopApi = {
  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },

  notify: () => {
    listeners.forEach((l) => l());
  },

  // Authenticate Staff (Strict Security Check)
  authenticateStaff: async (login: string, password: string, selectedRole: 'BARBER' | 'OWNER') => {
    const cleanLogin = login.trim().toLowerCase();
    const cleanPass = password.trim();

    const foundUser = staffUsers.find((u) => {
      const matchLogin =
        u.login.toLowerCase() === cleanLogin ||
        u.phone.replace(/[\s()\-]/g, '') === cleanLogin.replace(/[\s()\-]/g, '') ||
        u.name.toLowerCase().includes(cleanLogin);
      const matchPassword = u.password === cleanPass;
      const matchRole = u.role === selectedRole;
      return matchLogin && matchPassword && matchRole;
    });

    if (!foundUser) {
      throw new Error("Noto'g'ri login, parol yoki mos kelmaydigan rol!");
    }

    return foundUser;
  },

  // GET Appointments
  getAppointments: async (): Promise<Appointment[]> => {
    return [...localAppointmentsStore];
  },

  // GET Barbers
  getBarbers: async (): Promise<Barber[]> => {
    return [...localBarbersStore];
  },

  // GET Services
  getServices: async (): Promise<BarbershopService[]> => {
    return [...barbershopServices];
  },

  // GET Supplies Inventory
  getSupplies: async (): Promise<SupplyItem[]> => {
    return [...localSuppliesStore];
  },

  // Update Appointment Status (COMPLETED, NO_SHOW, CANCELLED, IN_CHAIR)
  updateAppointmentStatus: async (
    id: string,
    status: AppointmentStatus,
    paymentMethod?: PaymentMethod,
    notes?: string
  ): Promise<Appointment> => {
    localAppointmentsStore = localAppointmentsStore.map((app) => {
      if (app.id === id) {
        return {
          ...app,
          status,
          paymentMethod: paymentMethod || app.paymentMethod,
          notes: notes || app.notes,
        };
      }
      return app;
    });

    const updated = localAppointmentsStore.find((a) => a.id === id);
    if (!updated) throw new Error('Appointment not found');
    barbershopApi.notify();
    return updated;
  },

  // Fast Walk-In Appointment creation (Ko'chadan kelgan mijoz)
  createWalkInAppointment: async (
    data: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt'>
  ): Promise<Appointment> => {
    const newApp: Appointment = {
      ...data,
      id: `app-${Date.now()}`,
      appointmentNumber: `NAV-${100 + localAppointmentsStore.length + 1}`,
      createdAt: new Date().toISOString(),
      isWalkIn: true,
    };
    localAppointmentsStore = [newApp, ...localAppointmentsStore];
    barbershopApi.notify();
    return newApp;
  },

  // Create Client Online Booking
  createOnlineBooking: async (
    clientName: string,
    clientPhone: string,
    barberId: string,
    serviceId: string,
    scheduledTime: string
  ): Promise<Appointment> => {
    const barber = localBarbersStore.find((b) => b.id === barberId);
    const service = barbershopServices.find((s) => s.id === serviceId);

    if (!barber || !service) throw new Error('Master yoki xizmat topilmadi');

    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      appointmentNumber: `NAV-${100 + localAppointmentsStore.length + 1}`,
      clientName,
      clientPhone,
      barberId: barber.id,
      barberName: barber.name,
      serviceId: service.id,
      serviceName: service.name,
      totalAmount: service.price,
      status: 'WAITING',
      scheduledTime,
      durationMinutes: service.durationMinutes,
      createdAt: new Date().toISOString(),
      isWalkIn: false,
    };

    localAppointmentsStore = [newApp, ...localAppointmentsStore];
    barbershopApi.notify();
    return newApp;
  },

  // GET Clients (Mijozlar) — derived from appointment history
  getClients: async (): Promise<Client[]> => {
    const clientsMap = new Map<string, Client>();

    localAppointmentsStore.forEach((app) => {
      const key = app.clientPhone || app.clientName;
      const existing = clientsMap.get(key);
      const totalAmount = app.status === 'COMPLETED' ? app.totalAmount : 0;

      if (!existing) {
        clientsMap.set(key, {
          id: `cli-${key}`,
          name: app.clientName,
          phone: app.clientPhone,
          avatar: app.clientAvatar,
          totalOrders: 1,
          totalSpent: totalAmount,
          createdAt: app.createdAt,
          lastVisit: app.createdAt,
        });
      } else {
        existing.totalOrders += 1;
        existing.totalSpent += totalAmount;
        if (app.createdAt > existing.lastVisit!) {
          existing.lastVisit = app.createdAt;
        }
      }
    });

    return Array.from(clientsMap.values()).sort(
      (a, b) => b.totalOrders - a.totalOrders
    );
  },

  // GET Daily Financial Summary (Kunlik hisobot)
  getDailySummary: async (): Promise<DailySummary> => {
    const completedApps = localAppointmentsStore.filter((a) => a.status === 'COMPLETED');
    const noShowApps = localAppointmentsStore.filter((a) => a.status === 'NO_SHOW');
    const cancelledApps = localAppointmentsStore.filter((a) => a.status === 'CANCELLED');

    const totalRevenue = completedApps.reduce((acc, a) => acc + a.totalAmount, 0);
    const cashRevenue = completedApps
      .filter((a) => a.paymentMethod === 'CASH')
      .reduce((acc, a) => acc + a.totalAmount, 0);
    const cardRevenue = totalRevenue - cashRevenue;

    const barberPayouts = localBarbersStore.map((barber) => {
      const barberApps = completedApps.filter((a) => a.barberId === barber.id);
      const earnedTotal = barberApps.reduce((acc, a) => acc + a.totalAmount, 0);
      return {
        barberId: barber.id,
        barberName: barber.name,
        earnedTotal,
        barberShare: Math.round(earnedTotal * 0.5), // 50% commission for barber
      };
    });

    return {
      totalRevenue,
      cashRevenue,
      cardRevenue,
      totalAppointments: localAppointmentsStore.length,
      completedCount: completedApps.length,
      noShowCount: noShowApps.length,
      cancelledCount: cancelledApps.length,
      barberPayouts,
    };
  },

  // Manager: Add new Worker / Barber (Добавить нового работника)
  addBarber: async (data: {
    firstName: string;
    lastName: string;
    phone: string;
    specialty: string;
    password?: string;
    commissionPercent?: number;
  }): Promise<Barber> => {
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const newBarber: Barber = {
      id: `bar-${Date.now()}`,
      name: fullName,
      phone: data.phone,
      specialty: data.specialty || 'Master Barber',
      avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80`,
      rating: 5.0,
      isWorkingToday: true,
      status: 'FREE',
      completedTodayCount: 0,
      todayEarnings: 0,
    };

    localBarbersStore.push(newBarber);
    return newBarber;
  },

  // Delete Worker / Barber (Удалить работника)
  deleteBarber: async (id: string): Promise<boolean> => {
    localBarbersStore = localBarbersStore.filter((b) => b.id !== id);
    return true;
  },
};

