import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  PanelLeft,
  Scissors,
  Wifi,
  WifiOff,
  Languages,
  Check,
  LayoutDashboard,
  ShoppingCart,
  Phone,
  MapPin,
  Save,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useLanguage } from '@/i18n/LanguageContext';
import { Language } from '@/i18n/translations';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TopbarProps {
  isOffline: boolean;
  onToggleOffline: () => void;
  onToggleSidebar: () => void;
}

const navItems: { path: string; labelKey: string; icon: React.ElementType }[] = [
  { path: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { path: '/orders', labelKey: 'nav.orders', icon: ShoppingCart },
];

const languageOptions: { code: Language; label: string }[] = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

const SETTINGS_KEY = 'flexora-barber-settings';

function loadShopInfo(): { phone: string; address: string } {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        phone: data.phone || '+998 90 123 45 67',
        address: data.address || 'Toshkent sh., Chilonzor tumani, 12-uy',
      };
    }
  } catch {
    // ignore
  }
  return { phone: '+998 90 123 45 67', address: 'Toshkent sh., Chilonzor tumani, 12-uy' };
}

export function Topbar({
  isOffline,
  onToggleOffline,
  onToggleSidebar,
}: TopbarProps) {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const [isScrolled, setIsScrolled] = useState(false);
  const [phone, setPhone] = useState(loadShopInfo().phone);
  const [address, setAddress] = useState(loadShopInfo().address);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSaveShopInfo = () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      const data = stored ? JSON.parse(stored) : {};
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...data, phone, address }));
    } catch {
      // ignore
    }
    toast.success(t('topbar.shopInfoSaved'));
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-200',
          isScrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm py-2'
            : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md py-2.5'
        )}
      >
        <div className="flex items-center justify-between px-3 sm:px-6 max-w-[1920px] mx-auto gap-2">
          {/* Left section: Sidebar toggle & Barbershop Brand Logo */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleSidebar}
              aria-label="Toggle Sidebar"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none"
            >
              <PanelLeft className="w-5 h-5" />
            </button>

            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white font-black shadow-md select-none">
                <Scissors className="w-4 h-4" />
              </div>
              <div className="flex flex-col hidden sm:flex">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 leading-none select-none">
                  {t('brand.name')}
                </span>
                <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 tracking-wider uppercase leading-tight select-none">
                  {t('brand.tagline')}
                </span>
              </div>
            </div>
          </div>

          {/* Center section: Router navigation */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    )
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t(item.labelKey)}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right section: Offline toggle, Language, Theme, User profile */}
          <div className="flex items-center gap-2">
            {/* Offline Network Simulation Trigger */}
            <button
              onClick={onToggleOffline}
              title={isOffline ? t('topbar.offlineTitle') : t('topbar.onlineTitle')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none',
                isOffline
                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
              )}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span className="hidden md:inline">{t('topbar.offline')}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="hidden md:inline">{t('topbar.online')}</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  aria-label="Change language"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:shadow-xs transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <Languages className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={6}
                  className="w-44 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-xl border border-slate-200 dark:border-slate-800 z-50 text-xs space-y-0.5"
                >
                  {languageOptions.map((opt) => (
                    <DropdownMenu.Item
                      key={opt.code}
                      onClick={() => setLanguage(opt.code)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                    >
                      <span>{opt.label}</span>
                      {language === opt.code && (
                        <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      )}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Quick shop info editor (phone & address) */}
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  title={t('topbar.editShopInfo')}
                  className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all duration-200 text-xs font-semibold cursor-pointer select-none max-w-[220px]"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span className="truncate">{phone}</span>
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  align="end"
                  sideOffset={6}
                  className="w-72 bg-white dark:bg-slate-900 rounded-xl p-3.5 shadow-xl border border-slate-200 dark:border-slate-800 z-50 space-y-3 text-xs"
                >
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {t('topbar.editShopInfo')}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      {t('settings.phone')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      {t('settings.address')}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveShopInfo}
                    className="w-full py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" /> {t('settings.save')}
                  </button>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </motion.header>
    </>
  );
}
