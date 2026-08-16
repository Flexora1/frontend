import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { Topbar } from '@/components/layout/Topbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { OfflineBanner } from '@/components/barbershop/OfflineBanner';
import { OwnerDashboard } from '@/components/barbershop/OwnerDashboard';
import { ReportsPage } from '@/components/barbershop/ReportsPage';
import { ClientsPage } from '@/components/barbershop/ClientsPage';
import { OrdersPage } from '@/components/orders/OrdersPage';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);

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

      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
      />

      {/* Main Workspace Content with React Router Routes */}
      <main
        className={cn(
          'transition-all duration-300 min-h-[calc(100vh-61px)] pb-12',
          sidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-[260px]'
        )}
      >
        <Routes>
          <Route path="/" element={<OwnerDashboard />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
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
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
