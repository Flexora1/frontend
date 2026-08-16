import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { Topbar } from '@/components/layout/Topbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { OfflineBanner } from '@/components/barbershop/OfflineBanner';
import { OwnerDashboard } from '@/components/barbershop/OwnerDashboard';
import { BarberView } from '@/components/barbershop/BarberView';
import { ClientBookingView } from '@/components/barbershop/ClientBookingView';
import { OrdersPage } from '@/components/orders/OrdersPage';
import { ClientsView } from '@/components/clients/ClientsView';
import { CalendarView } from '@/components/calendar/CalendarView';
import { ReportsView } from '@/components/reports/ReportsView';
import { SettingsView } from '@/components/settings/SettingsView';
import { PartnerModulePlaceholder } from '@/components/placeholders/PartnerModulePlaceholder';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function AppContent() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const isClientPage = location.pathname === '/' || location.pathname === '/booking';

  const handleToggleOffline = () => {
    setIsOffline((prev) => {
      const nextState = !prev;
      if (nextState) {
        toast.warning('Oflayn rejim yoqildi. Internet uzilgan deb simulyatsiya qilinmoqda.');
      } else {
        toast.success('Internet tiklandi! Oflayn saqlangan navbatlar sinxronlandi.');
      }
      return nextState;
    });
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0B0F17] text-[#1E2022] dark:text-slate-100 transition-colors duration-200">
      {/* Offline Connection Warning Banner */}
      <OfflineBanner isOffline={isOffline} onToggleOffline={handleToggleOffline} />

      {/* Topbar Header */}
      <Topbar
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Sidebar Navigation (Shown only for Manager & Worker views) */}
      {!isClientPage && (
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onMobileOpenChange={setMobileSidebarOpen}
        />
      )}

      {/* Main Workspace Content with React Router Routes */}
      <main
        className={cn(
          'transition-all duration-300 min-h-[calc(100vh-61px)] pb-12',
          isClientPage
            ? 'pl-0 max-w-5xl mx-auto px-4'
            : sidebarCollapsed
            ? 'md:pl-[72px]'
            : 'md:pl-[260px]'
        )}
      >
        <Routes>
          {/* Default Home route is Client Booking */}
          <Route path="/" element={<ClientBookingView />} />
          <Route path="/booking" element={<ClientBookingView />} />

          {/* Manager & Admin Route */}
          <Route path="/manager" element={<OwnerDashboard />} />

          {/* Barber / Master Route */}
          <Route path="/barber" element={<BarberView />} />

          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/clients" element={<ClientsView />} />
          <Route path="/calendar" element={<CalendarView />} />

          <Route path="/reports" element={<ReportsView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </main>

      {/* Toast Notifications */}
      <Toaster position="bottom-right" richColors theme="system" />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="flexora-barber-theme">
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
