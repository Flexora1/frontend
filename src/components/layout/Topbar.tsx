import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  PanelLeft,
  Search,
  Bell,
  User,
  Settings,
  Scissors,
  Smartphone,
  Crown,
  Wifi,
  WifiOff,
  Sparkles,
  Check,
} from 'lucide-react';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AuthModal } from '@/components/auth/AuthModal';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

interface TopbarProps {
  isOffline: boolean;
  onToggleOffline: () => void;
  onToggleSidebar: () => void;
}

export function Topbar({
  isOffline,
  onToggleOffline,
  onToggleSidebar,
}: TopbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentRole: UserRole = location.pathname.startsWith('/barber')
    ? 'BARBER'
    : location.pathname.startsWith('/booking')
    ? 'CLIENT'
    : 'OWNER';

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'OWNER') navigate('/');
    if (role === 'BARBER') navigate('/barber');
    if (role === 'CLIENT') navigate('/booking');
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
                  FLEXORA BARBER
                </span>
                <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 tracking-wider uppercase leading-tight select-none">
                  Mahalla Sartaroshxonasi
                </span>
              </div>
            </div>
          </div>

          {/* Center section: Role status indicator if in Manager or Master mode */}
          {location.pathname.startsWith('/manager') ? (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5">
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
              <span className="px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-500/10 border border-teal-500/30 flex items-center gap-1.5">
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

          {/* Right section: Theme toggle and Auth button */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Worker Login Button */}
            <button
              onClick={() => setAuthOpen(true)}
              className="py-1.5 px-3 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
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
