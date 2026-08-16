import React from 'react';
import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Dialog from '@radix-ui/react-dialog';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Calendar,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';

export type NavItemKey =
  | 'dashboard'
  | 'orders'
  | 'clients'
  | 'calendar'
  | 'reports'
  | 'settings';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

const navItems: { path: string; key: NavItemKey; labelKey: string; defaultLabel: string; icon: React.ElementType }[] = [
  { path: '/manager', key: 'dashboard', labelKey: 'nav.dashboard', defaultLabel: 'Dashbord', icon: LayoutDashboard },
  { path: '/orders', key: 'orders', labelKey: 'nav.orders', defaultLabel: 'Navbatlar va Buyurtmalar', icon: ShoppingCart },
  { path: '/clients', key: 'clients', labelKey: 'nav.clients', defaultLabel: 'Mijozlar bazasi', icon: Users },
  { path: '/calendar', key: 'calendar', labelKey: 'nav.calendar', defaultLabel: 'Jadval va Yozuvlar', icon: Calendar },
  { path: '/reports', key: 'reports', labelKey: 'nav.reports', defaultLabel: 'Hisobotlar va Tahlil', icon: BarChart3 },
  { path: '/settings', key: 'settings', labelKey: 'nav.settings', defaultLabel: 'Tizim sozlamalari', icon: Settings },
];

export function Sidebar({
  collapsed,
  mobileOpen,
  onMobileOpenChange,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getLabel = (item: typeof navItems[0]) => {
    try {
      const translated = t(item.labelKey);
      return translated && translated !== item.labelKey ? translated : item.defaultLabel;
    } catch {
      return item.defaultLabel;
    }
  };

  const sidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 select-none">
      {/* Navigation Items */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <Tooltip.Provider delayDuration={200}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            const labelText = getLabel(item);

            const buttonEl = (
              <button
                key={item.key}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) onMobileOpenChange(false);
                }}
                className={cn(
                  'relative flex items-center w-full gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer group',
                  isActive
                    ? 'text-teal-700 dark:text-teal-300 bg-teal-500/10 dark:bg-teal-500/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-teal-600 dark:bg-teal-400 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-colors',
                    isActive
                      ? 'text-teal-600 dark:text-teal-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  )}
                />

                {(!collapsed || isMobile) && (
                  <span className="truncate">{labelText}</span>
                )}
              </button>
            );

            if (collapsed && !isMobile) {
              return (
                <Tooltip.Root key={item.key}>
                  <Tooltip.Trigger asChild>{buttonEl}</Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="right"
                      sideOffset={12}
                      className="z-50 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 rounded-lg shadow-lg"
                    >
                      {labelText}
                      <Tooltip.Arrow className="fill-slate-900 dark:fill-slate-800" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              );
            }

            return buttonEl;
          })}
        </Tooltip.Provider>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (fixed left) */}
      <aside
        className={cn(
          'hidden md:block fixed left-0 top-[61px] bottom-0 z-30 transition-all duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile Drawer Sheet (<768px) */}
      <Dialog.Root open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-50 animate-fade-in" />
          <Dialog.Content className="md:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 z-50 shadow-2xl focus:outline-none animate-in slide-in-from-left">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-100">Menyu</span>
              <Dialog.Close className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>
            <div className="h-[calc(100%-60px)]">{sidebarContent(true)}</div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
