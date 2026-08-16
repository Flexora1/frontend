import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineBannerProps {
  isOffline: boolean;
  onToggleOffline: () => void;
}

export function OfflineBanner({ isOffline, onToggleOffline }: OfflineBannerProps) {
  if (!isOffline) return null;

  return (
    <div className="bg-amber-500 text-slate-950 font-medium px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm animate-in slide-in-from-top duration-300 z-50">
      <div className="flex items-center gap-2.5">
        <WifiOff className="w-4 h-4 text-slate-950 animate-pulse shrink-0" />
        <div>
          <span className="font-bold">Internet uzildi (Oflayn rejim): </span>
          <span>Barcha yangi navbatlar qurilma xotirasida saqlanadi. Internet tiqilishi bilan avto-sinxronlanadi.</span>
        </div>
      </div>
      <button
        onClick={onToggleOffline}
        className="px-3 py-1 rounded-lg bg-slate-950 text-amber-400 font-bold hover:bg-slate-900 transition-colors flex items-center gap-1 shrink-0 ml-2"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Qayta ulanish
      </button>
    </div>
  );
}
