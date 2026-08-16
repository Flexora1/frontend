import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import {
  Scissors,
  PanelLeft,
  Wifi,
  WifiOff,
  User,
  Crown,
  Languages,
  Check,
  Phone,
  MapPin,
  Save,
  LayoutDashboard,
  ShoppingCart,
  Users as UsersIcon,
  BarChart3,
  Settings as SettingsIcon,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AuthModal } from '@/components/auth/AuthModal';
import { cn } from '@/lib/utils';
import { useLanguage, Language } from '@/i18n/LanguageContext';
import { toast } from 'sonner';

interface TopbarProps {
  onToggleSidebar: () => void;
  isOffline?: boolean;
  onToggleOffline?: () => void;
}

const languageOptions: { code: Language; label: string }[] = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

const SETTINGS_KEY = 'flexora_barber_settings';

export function Topbar({
  onToggleSidebar,
  isOffline = false,
  onToggleOffline,
}: TopbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [address, setAddress] = useState('Toshkent sh., Amir Temur shoh ko\'chasi 15');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.address) setAddress(parsed.address);
      }
    } catch {
      // ignore
    }
  }, []);

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
            {!location.pathname.startsWith('/barber') && location.pathname !== '/' && location.pathname !== '/booking' && (
              <button
                onClick={onToggleSidebar}
                aria-label="Toggle Sidebar"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            )}

            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white font-black shadow-md select-none">
                <Scissors className="w-4 h-4" />
              </div>
              <div className="flex flex-col hidden sm:flex">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 leading-none select-none">
                  RestoBarbera
                </span>
                <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 tracking-wider uppercase leading-tight select-none">
                  Barbershop CRM
                </span>
              </div>
            </div>
          </div>

          {/* Center section: Role status indicator if in Manager or Master mode */}
          {location.pathname.startsWith('/manager') ? (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5 rounded-lg">
                <Crown className="w-3.5 h-3.5 text-amber-500" /> Menejer Paneli
              </span>
              <button
                onClick={() => navigate('/')}
                className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
              >
                Chiqish
              </button>
            </div>
          ) : location.pathname.startsWith('/barber') ? (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-500/10 border border-teal-500/30 flex items-center gap-1.5 rounded-lg">
                <Scissors className="w-3.5 h-3.5 text-teal-500" /> Usta Kabineti
              </span>
              <button
                onClick={() => navigate('/')}
                className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
              >
                Chiqish
              </button>
            </div>
          ) : null}

          {/* Right section: Offline toggle, Language, Theme, Worker Auth button */}
          <div className="flex items-center gap-2">
            {/* Offline Network Simulation Trigger */}
            {onToggleOffline && (
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
                    <span className="hidden md:inline">Oflayn</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="hidden md:inline">Onlayn</span>
                  </>
                )}
              </button>
            )}

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

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Worker Login Button */}
            <button
              onClick={() => setAuthOpen(true)}
              className="py-1.5 px-3 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer flex items-center gap-1.5 rounded-xl"
            >
              <User className="w-3.5 h-3.5 text-amber-500" />
              <span>Xodim sifatida kirish</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Global Auth Modal */}
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
