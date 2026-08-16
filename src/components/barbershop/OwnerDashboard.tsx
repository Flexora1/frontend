import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Scissors,
  DollarSign,
  Users,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  UserX,
  XCircle,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { barbershopApi, barbershopServices } from '@/api/barbershopApi';
import {
  Appointment,
  AppointmentStatus,
  Barber,
  DailySummary,
  PaymentMethod,
} from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';
import { toast } from 'sonner';

export function OwnerDashboard() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Walk-In Fast Modal State
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [walkInClientName, setWalkInClientName] = useState('');
  const [walkInClientPhone, setWalkInClientPhone] = useState('+998 ');
  const [walkInBarberId, setWalkInBarberId] = useState('bar-1');
  const [walkInServiceId, setWalkInServiceId] = useState('srv-1');

  // Daily Summary Modal State
  const [summaryOpen, setSummaryOpen] = useState(false);

  const loadData = async () => {
    try {
      const [appData, barData, sumData] = await Promise.all([
        barbershopApi.getAppointments(),
        barbershopApi.getBarbers(),
        barbershopApi.getDailySummary(),
      ]);
      setAppointments(appData);
      setBarbers(barData);
      setDailySummary(sumData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (
    appId: string,
    newStatus: AppointmentStatus,
    paymentMethod: PaymentMethod = 'CASH'
  ) => {
    try {
      await barbershopApi.updateAppointmentStatus(appId, newStatus, paymentMethod);
      toast.success(
        newStatus === 'COMPLETED'
          ? 'Xizmat muvaffaqiyatli yakunlandi!'
          : newStatus === 'NO_SHOW'
          ? 'Mijoz kelmadi deb belgilandi. Navbat vaqti bo\'shatildi.'
          : newStatus === 'CANCELLED'
          ? 'Navbat bekor qilindi.'
          : 'Navbat holati yangilandi.'
      );
      loadData();
    } catch (err) {
      toast.error('Xatolik yuz berdi');
    }
  };

  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInClientName.trim()) {
      toast.error('Mijoz ismini kiriting!');
      return;
    }
    const barber = barbers.find((b) => b.id === walkInBarberId);
    const service = barbershopServices.find((s) => s.id === walkInServiceId);

    if (!barber || !service) return;

    try {
      await barbershopApi.createWalkInAppointment({
        clientName: walkInClientName,
        clientPhone: walkInClientPhone,
        barberId: barber.id,
        barberName: barber.name,
        serviceId: service.id,
        serviceName: service.name,
        totalAmount: service.price,
        status: 'WAITING',
        scheduledTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        durationMinutes: service.durationMinutes,
      });
      toast.success('Tezkor navbat yaratildi!');
      setWalkInClientName('');
      setWalkInOpen(false);
      loadData();
    } catch (err) {
      toast.error('Navbat yaratishda xatolik');
    }
  };

  if (loading || !dailySummary) {
    return <div className="p-6 text-center text-sm text-slate-400">{t('common.loading')}</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1920px] mx-auto space-y-6">
      {/* Top Header: "Bugun menda nima bor?" */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs">
              {t('dashboard.badge')}
            </span>
            <span className="text-xs text-slate-400">{t('dashboard.today')} {new Date().toLocaleDateString('ru-RU')}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Daily Report Button */}
          <button
            onClick={() => setSummaryOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            {t('dashboard.dailyReport')}
          </button>

          {/* Fast Walk-In Button */}
          <button
            onClick={() => setWalkInOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" /> {t('dashboard.walkIn')}
          </button>
        </div>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('dashboard.revenue')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatCurrency(dailySummary.totalRevenue)}
          </div>
          <div className="text-[11px] text-slate-400">
            {t('dashboard.cashCard', { cash: formatCurrency(dailySummary.cashRevenue), card: formatCurrency(dailySummary.cardRevenue) })}
          </div>
        </div>

        {/* Total Appointments */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('dashboard.appointments')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
              <Scissors className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {dailySummary.totalAppointments} ta
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            {t('dashboard.completed', { count: dailySummary.completedCount })}
          </div>
        </div>

        {/* No-Shows */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('dashboard.noShow')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {dailySummary.noShowCount} ta
          </div>
          <div className="text-[11px] text-slate-400">{t('dashboard.noShowHint')}</div>
        </div>

        {/* Active Barbers */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('dashboard.activeBarbers')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {t('dashboard.barbersCount', { count: barbers.filter((b) => b.isWorkingToday).length })}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold">
            {t('dashboard.busyCount', { count: barbers.filter((b) => b.status === 'BUSY').length })}
          </div>
        </div>
      </div>

      {/* Main Queue Timeline Grouped by Barber */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {t('dashboard.queueTitle')}
          </h2>
          <span className="text-xs text-slate-400">{t('dashboard.queueSubtitle')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {barbers.map((barber) => {
            const barberApps = appointments.filter((a) => a.barberId === barber.id);
            const inChairApp = barberApps.find((a) => a.status === 'IN_CHAIR');
            const waitingApps = barberApps.filter((a) => a.status === 'WAITING');
            const completedApps = barberApps.filter((a) => a.status === 'COMPLETED');

            return (
              <div
                key={barber.id}
                className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden"
              >
                {/* Barber Header Card */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={barber.avatar}
                      alt={barber.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {barber.name}
                      </div>
                      <div className="text-[11px] text-slate-500">{barber.specialty}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      barber.status === 'BUSY'
                        ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    }`}
                  >
                    {barber.status === 'BUSY' ? t('dashboard.busy') : t('dashboard.free')}
                  </span>
                </div>

                {/* Barber Appointments List */}
                <div className="p-4 flex-1 space-y-4 max-h-[600px] overflow-y-auto">
                  {/* Current Active in Chair */}
                  {inChairApp && (
                    <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-300">
                        <span className="flex items-center gap-1">
                          <Scissors className="w-3.5 h-3.5 animate-bounce" /> {t('dashboard.inChair')}
                        </span>
                        <span className="font-mono">{inChairApp.scheduledTime}</span>
                      </div>

                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {inChairApp.clientName}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          {inChairApp.serviceName} • {formatCurrency(inChairApp.totalAmount)}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-teal-500/20">
                        <button
                          onClick={() => handleStatusChange(inChairApp.id, 'COMPLETED')}
                          className="w-full py-1.5 px-2 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t('dashboard.done')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Waiting Queue */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                      <span>{t('dashboard.waiting', { count: waitingApps.length })}</span>
                    </div>

                    {waitingApps.map((app) => (
                      <div
                        key={app.id}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 hover:border-slate-300 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {app.clientName} {app.isWalkIn && <span className="text-[10px] text-teal-600 font-normal">(Walk-In)</span>}
                          </div>
                          <span className="text-xs font-mono text-slate-500 font-bold">
                            {app.scheduledTime}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 flex justify-between">
                          <span>{app.serviceName}</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(app.totalAmount)}
                          </span>
                        </div>

                        {/* Edge Case Buttons */}
                        <div className="pt-2 flex items-center gap-1.5 border-t border-slate-200/60 dark:border-slate-800/60">
                          <button
                            onClick={() => handleStatusChange(app.id, 'IN_CHAIR')}
                            className="flex-1 py-1 text-[11px] font-bold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors cursor-pointer"
                          >
                            {t('dashboard.toChair')}
                          </button>
                          <button
                            onClick={() => handleStatusChange(app.id, 'NO_SHOW')}
                            title="Mijoz kelmadi deb belgilash"
                            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors cursor-pointer flex items-center gap-0.5"
                          >
                            <UserX className="w-3 h-3" /> {t('dashboard.noShowBtn')}
                          </button>
                          <button
                            onClick={() => handleStatusChange(app.id, 'CANCELLED')}
                            title="Bekor qilish"
                            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {waitingApps.length === 0 && !inChairApp && (
                      <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        {t('dashboard.noQueue')}
                      </div>
                    )}
                  </div>

                  {/* Completed Today */}
                  {completedApps.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                      {t('dashboard.completedToday', { count: completedApps.length })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fast Walk-In Modal */}
      <Dialog.Root open={walkInOpen} onOpenChange={setWalkInOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-xs z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 z-50">
            <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-teal-600" />
              {t('walkin.title')}
            </Dialog.Title>
            <Dialog.Description className="text-xs text-slate-500 mt-1 mb-4">
              {t('walkin.desc')}
            </Dialog.Description>

            <form onSubmit={handleCreateWalkIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('walkin.clientName')}
                </label>
                <input
                  type="text"
                  value={walkInClientName}
                  onChange={(e) => setWalkInClientName(e.target.value)}
                  placeholder="Masalan: Sardor"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('walkin.phone')}
                </label>
                <input
                  type="text"
                  value={walkInClientPhone}
                  onChange={(e) => setWalkInClientPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('walkin.barber')}
                </label>
                <select
                  value={walkInBarberId}
                  onChange={(e) => setWalkInBarberId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.status === 'BUSY' ? 'Kresloda band' : 'Bo\'sh'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('walkin.service')}
                </label>
                <select
                  value={walkInServiceId}
                  onChange={(e) => setWalkInServiceId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {barbershopServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {formatCurrency(s.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWalkInOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  {t('walkin.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 text-white hover:bg-teal-700"
                >
                  {t('walkin.add')}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Daily Summary Financial Report Modal */}
      <Dialog.Root open={summaryOpen} onOpenChange={setSummaryOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-xs z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 z-50 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-teal-600" />
                  {t('summary.title')}
                </Dialog.Title>
                <div className="text-xs text-slate-400">{t('summary.subtitle')}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800/60">
                <div className="text-slate-400">{t('summary.total')}</div>
                <div className="text-base font-extrabold text-teal-600 dark:text-teal-400 mt-0.5">
                  {formatCurrency(dailySummary.totalRevenue)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800/60">
                <div className="text-slate-400">{t('summary.cashCard')}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {t('summary.cash', { value: formatCurrency(dailySummary.cashRevenue) })}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {t('summary.card', { value: formatCurrency(dailySummary.cardRevenue) })}
                </div>
              </div>
            </div>

            {/* Barber Commissions Table */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('summary.mastersShare')}
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {dailySummary.barberPayouts.map((bp) => (
                  <div key={bp.barberId} className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {bp.barberName}
                    </span>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {t('summary.salary', { value: formatCurrency(bp.barberShare) })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {t('summary.earned', { value: formatCurrency(bp.earnedTotal) })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSummaryOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 text-white hover:bg-teal-700"
              >
                {t('summary.close')}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
