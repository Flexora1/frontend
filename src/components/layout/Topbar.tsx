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
import { CommandDialog } from '@/components/ui/CommandDialog';
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

          {/* Center section: Role Switcher Segment (Ega / Usta / Mijoz) */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <button
              onClick={() => handleRoleSelect('OWNER')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
                currentRole === 'OWNER'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Ega</span>
            </button>

            <button
              onClick={() => handleRoleSelect('BARBER')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
                currentRole === 'BARBER'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <Scissors className="w-3.5 h-3.5 text-teal-500" />
              <span>Usta</span>
            </button>

            <button
              onClick={() => handleRoleSelect('CLIENT')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
                currentRole === 'CLIENT'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-500" />
              <span>Mijoz</span>
            </button>
          </div>

          {/* Right section: Offline toggle, Theme toggle, User profile */}
          <div className="flex items-center gap-2">
            {/* Offline Network Simulation Trigger */}
            <button
              onClick={onToggleOffline}
              title={isOffline ? 'Internet uzilgan (Oflayn)' : 'Internet ulangan (Onlayn)'}
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

            {/* Theme Toggle */}
            <ThemeToggle />

            <UserAvatar
              name={
                currentRole === 'OWNER'
                  ? 'Alisher Xo\'ja (Ega)'
                  : currentRole === 'BARBER'
                  ? 'Usta Alisher'
                  : 'Murod Ergashev'
              }
              size="md"
            />
          </div>
        </div>
      </motion.header>

      {/* Global Search Dialog Modal */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
