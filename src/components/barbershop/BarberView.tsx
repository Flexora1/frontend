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
  Calendar,
} from 'lucide-react';
import { barbershopApi } from '@/api/barbershopApi';
import { Appointment, Barber } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export function BarberView() {
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
  }, []);

  const activeBarber = barbers.find((b) => b.id === selectedBarberId) || barbers[0];
  const barberApps = appointments.filter((a) => a.barberId === selectedBarberId);
  const inChairApp = barberApps.find((a) => a.status === 'IN_CHAIR');
  const waitingApps = barberApps.filter((a) => a.status === 'WAITING');
  const completedApps = barberApps.filter((a) => a.status === 'COMPLETED');

  const handleFinishService = async (appId: string) => {
    try {
      await barbershopApi.updateAppointmentStatus(appId, 'COMPLETED', 'CASH');
      toast.success('Xizmat muvaffaqiyatli yakunlandi! Baraka topsin.');
      loadData();
    } catch (err) {
      toast.error('Xatolik');
    }
  };

  const handleStartService = async (appId: string) => {
    try {
      await barbershopApi.updateAppointmentStatus(appId, 'IN_CHAIR');
      toast.success('Mijoz kresloga o\'tqazildi.');
      loadData();
    } catch (err) {
      toast.error('Xatolik');
    }
  };

  const handleNoShow = async (appId: string) => {
    try {
      await barbershopApi.updateAppointmentStatus(appId, 'NO_SHOW');
      toast.success('Mijoz kelmadi deb belgilandi.');
      loadData();
    } catch (err) {
      toast.error('Xatolik');
    }
  };

  if (loading || !activeBarber) {
    return <div className="p-6 text-center text-sm text-slate-400">Yuklanmoqda...</div>;
  }

  const todayEarnings = completedApps.reduce((acc, a) => acc + a.totalAmount, 0);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Barber Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center gap-3">
          <img
            src={activeBarber.avatar}
            alt={activeBarber.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {activeBarber.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 font-bold text-xs">
                Usta Ekrani
              </span>
            </div>
            <p className="text-xs text-slate-500">{activeBarber.specialty}</p>
          </div>
        </div>

        {/* Switch Barber dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Usta profilini tanlash:</span>
          <select
            value={selectedBarberId}
            onChange={(e) => setSelectedBarberId(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            {barbers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Today Barber Earnings Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md space-y-1">
          <div className="text-xs font-semibold opacity-90">Bugungi Tushumingiz</div>
          <div className="text-2xl font-extrabold">{formatCurrency(todayEarnings)}</div>
          <div className="text-[11px] opacity-80">
            Sizning ulushingiz (50%): <strong className="underline">{formatCurrency(todayEarnings * 0.5)}</strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Bugungi Mijozlar</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {completedApps.length} ta xizmat
            </div>
            <div className="text-[11px] text-teal-600 font-semibold">
              Kutayotganlar: {waitingApps.length} ta
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Focus: Active Client in Chair */}
      <div className="space-y-3">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Scissors className="w-5 h-5 text-teal-600" />
          Hozir Kresloda O'tirgan Mijoz
        </h2>

        {inChairApp ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-teal-500 shadow-lg space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-700 flex items-center justify-center font-bold text-lg">
                  {inChairApp.clientName[0]}
                </div>
                <div>
                  <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    {inChairApp.clientName}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {inChairApp.clientPhone}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono text-slate-400">Vaqti: {inChairApp.scheduledTime}</div>
                <div className="text-lg font-extrabold text-teal-600 dark:text-teal-400">
                  {formatCurrency(inChairApp.totalAmount)}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-500 uppercase tracking-wider">Xizmat turi</div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                {inChairApp.serviceName}
              </div>
              {inChairApp.notes && (
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 font-medium">
                  Заметка: {inChairApp.notes}
                </div>
              )}
            </div>

            {/* Complete Button */}
            <button
              onClick={() => handleFinishService(inChairApp.id)}
              className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              Xizmatni Yakunlash (Tugatildi & Navbatdagi)
            </button>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Scissors className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Hozircha kresloda hech kim yo'q
            </div>
            <p className="text-xs text-slate-400">
              Quyidagi navbatdagi mijozlardan birini kresloga taklif qiling.
            </p>
          </div>
        )}
      </div>

      {/* Waiting List */}
      <div className="space-y-3">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
          Navbatda Kutayotganlar ({waitingApps.length} ta mijoz)
        </h2>

        <div className="space-y-3">
          {waitingApps.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600">
                    {app.scheduledTime}
                  </span>
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {app.clientName}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {app.serviceName} • <strong className="text-slate-900 dark:text-slate-100">{formatCurrency(app.totalAmount)}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartService(app.id)}
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors cursor-pointer"
                >
                  Kresloga o'tqazish
                </button>
                <button
                  onClick={() => handleNoShow(app.id)}
                  title="Mijoz kelmadi"
                  className="px-3 py-2 rounded-xl bg-amber-500/10 text-amber-600 font-bold text-xs hover:bg-amber-500/20 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <UserX className="w-3.5 h-3.5" /> Kelmadi
                </button>
              </div>
            </div>
          ))}

          {waitingApps.length === 0 && (
            <div className="p-6 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              Navbatda kutayotgan mijozlar yo'q
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
