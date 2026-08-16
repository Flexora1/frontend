import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Scissors,
  Clock,
  CheckCircle2,
  UserX,
  Phone,
  DollarSign,
  User,
  Sparkles,
} from 'lucide-react';
import { barbershopApi } from '@/api/barbershopApi';
import { Appointment, Barber } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';
import { toast } from 'sonner';

export function BarberView() {
  const { t } = useLanguage();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState<string>('bar-1');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [barData, appData] = await Promise.all([
        barbershopApi.getBarbers(),
        barbershopApi.getAppointments(),
      ]);
      setBarbers(barData);
      setAppointments(appData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = barbershopApi.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  const activeBarber = barbers.find((b) => b.id === selectedBarberId) || barbers[0];
  const barberApps = appointments.filter((a) => a.barberId === selectedBarberId);
  const inChairApp = barberApps.find((a) => a.status === 'IN_CHAIR');
  const waitingApps = barberApps.filter((a) => a.status === 'WAITING');
  const completedApps = barberApps.filter((a) => a.status === 'COMPLETED');

  const totalEarningsToday = completedApps.reduce((acc, a) => acc + a.totalAmount, 0);
  const barberShareToday = Math.round(totalEarningsToday * 0.5); // 50% commission

  const handleStatusChange = async (id: string, status: 'IN_CHAIR' | 'COMPLETED' | 'NO_SHOW') => {
    try {
      await barbershopApi.updateAppointmentStatus(id, status);
      if (status === 'IN_CHAIR') toast.info("Mijoz kresloga taklif qilindi!");
      if (status === 'COMPLETED') toast.success("Xizmat bajarildi va to'lov qabul qilindi!");
      if (status === 'NO_SHOW') toast.warning("Mijoz kelmadi belgilandi.");
    } catch {
      toast.error("Statusni o'zgartirishda xatolik");
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-bold text-slate-400">
        Usta kabineti yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Banner & Barber Selector */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs backdrop-blur-xs flex items-center gap-1">
                <Scissors className="w-3.5 h-3.5" /> {t('barberView.badge')}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">{t('barberView.title')}</h1>
            <p className="text-xs opacity-90">{t('barberView.subtitle')}</p>
          </div>

          {/* Master Profile Switcher */}
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 space-y-1">
            <div className="text-[11px] font-bold text-teal-200">{t('barberView.selectBarber')}</div>
            <select
              value={selectedBarberId}
              onChange={(e) => setSelectedBarberId(e.target.value)}
              className="w-full bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
            >
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.specialty})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Master Daily Financial Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
          <div>
            <div className="opacity-75">Master Name</div>
            <div className="font-extrabold text-sm">{activeBarber?.name}</div>
          </div>
          <div>
            <div className="opacity-75">Bugungi tushum</div>
            <div className="font-extrabold text-sm text-emerald-300">
              {formatCurrency(totalEarningsToday)}
            </div>
          </div>
          <div>
            <div className="opacity-75">Sizning ulushingiz (50%)</div>
            <div className="font-extrabold text-sm text-amber-300">
              {formatCurrency(barberShareToday)}
            </div>
          </div>
          <div>
            <div className="opacity-75">Bajarildi</div>
            <div className="font-extrabold text-sm">{completedApps.length} ta xizmat</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: CLIENT IN CHAIR (HOZIR KRESLODA) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {t('barberView.inChairTitle')}
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            Kresloda
          </span>
        </div>

        {inChairApp ? (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-2 border-emerald-500/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-black text-lg">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    {inChairApp.clientName}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="font-mono">{inChairApp.clientPhone}</span>
                    <span>•</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">
                      {inChairApp.serviceName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Xizmat narxi</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(inChairApp.totalAmount)}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-500" />
                Reja: <strong>{inChairApp.scheduledTime}</strong> ({inChairApp.durationMinutes} daq)
              </div>

              <button
                onClick={() => handleStatusChange(inChairApp.id, 'COMPLETED')}
                className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> {t('barberView.finishBtn')}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-medium">
            Hozircha kresloda hech kim yo'q. Quyidagi navbatdan mijozni taklif qiling.
          </div>
        )}
      </div>

      {/* SECTION 2: WAITING QUEUE */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {t('barberView.waitingTitle')} ({waitingApps.length})
          </h2>
        </div>

        {waitingApps.length > 0 ? (
          <div className="space-y-3">
            {waitingApps.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      {app.clientName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 font-mono text-[10px] font-bold">
                      {app.appointmentNumber}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {app.serviceName} • <strong className="text-slate-700 dark:text-slate-300">{app.scheduledTime}</strong> • {formatCurrency(app.totalAmount)}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleStatusChange(app.id, 'IN_CHAIR')}
                    className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Scissors className="w-3.5 h-3.5" /> {t('barberView.toChairBtn')}
                  </button>
                  <button
                    onClick={() => handleStatusChange(app.id, 'NO_SHOW')}
                    className="py-1.5 px-2.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <UserX className="w-3.5 h-3.5" /> {t('dashboard.noShowBtn')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 font-medium">
            Navbatda kutayotgan mijozlar yo'q
          </div>
        )}
      </div>

      {/* SECTION 3: COMPLETED TODAY */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {t('barberView.completedTitle')} ({completedApps.length})
          </h2>
          <span className="text-xs font-bold text-emerald-600 font-mono">
            Jami: {formatCurrency(totalEarningsToday)}
          </span>
        </div>

        {completedApps.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {completedApps.map((app) => (
              <div key={app.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {app.clientName}
                  </div>
                  <div className="text-slate-400">{app.serviceName}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(app.totalAmount)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    50% Ulush: {formatCurrency(app.totalAmount * 0.5)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 font-medium">
            Bugun bajarilgan xizmatlar xali yo'q
          </div>
        )}
      </div>
    </div>
  );
}
