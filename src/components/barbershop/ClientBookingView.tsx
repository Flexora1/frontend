import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Scissors,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Phone,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Smartphone,
} from 'lucide-react';
import { barbershopApi, barbershopServices } from '@/api/barbershopApi';
import { Barber, BarbershopService, Appointment } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export function ClientBookingView() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [activeBooking, setActiveBooking] = useState<Appointment | null>(null);

  // Booking Form State
  const [step, setStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-1');
  const [selectedBarberId, setSelectedBarberId] = useState<string>('bar-1');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('14:30');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('+998 ');

  const availableTimeSlots = ['12:30', '13:00', '14:00', '14:30', '15:30', '16:00', '17:00'];

  useEffect(() => {
    barbershopApi.getBarbers().then(setBarbers);
  }, []);

  const selectedService = barbershopServices.find((s) => s.id === selectedServiceId) || barbershopServices[0];
  const selectedBarber = barbers.find((b) => b.id === selectedBarberId) || barbers[0];

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      toast.error('Ismingizni kiriting!');
      return;
    }

    try {
      const created = await barbershopApi.createOnlineBooking(
        clientName,
        clientPhone,
        selectedBarberId,
        selectedServiceId,
        selectedTimeSlot
      );
      setActiveBooking(created);
      toast.success('Navbatingiz muvaffaqiyatli band qilindi!');
    } catch (err) {
      toast.error('Navbat olishda xatolik');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      {/* Client View Banner Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs backdrop-blur-xs flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" /> ONLAYN NAVBAT OLIŞ
          </span>
          <span className="text-xs font-semibold opacity-90">Mahalla Sartaroshxonasi</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Sartaroshxonaga Navbat Olish
        </h1>
        <p className="text-xs opacity-90 leading-relaxed">
          Uyda o'tirib onlayn navbat oling, navbatingiz kelganda sartaroshxonaga keling!
        </p>
      </div>

      {/* If Active Booking Exists -> Show Live Queue Tracker Widget */}
      {activeBooking ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-teal-500 shadow-xl space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                Sizning Navbatingiz Saqlandi
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                {activeBooking.appointmentNumber}
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs">
              Muvaffaqiyatli Брон
            </span>
          </div>

          {/* Live Tracker Widget */}
          <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={selectedBarber?.avatar}
                alt={selectedBarber?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-teal-500"
              />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {activeBooking.barberName}
                </div>
                <div className="text-xs text-slate-500">{activeBooking.serviceName}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-teal-500/20 flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                Kutilayotgan vaqt: <strong className="text-slate-900 dark:text-slate-100">{activeBooking.scheduledTime}</strong>
              </span>
              <span className="font-extrabold text-teal-600 dark:text-teal-400">
                {formatCurrency(activeBooking.totalAmount)}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500 animate-spin" /> Sizning navbatingizga 2 ta mijoz qoldi (~20-25 daqiqa)
            </div>
            <p>Iltimos, navbatingiz kelishiga 5-10 daqiqa qolganda sartaroshxonaga keling.</p>
          </div>

          <button
            onClick={() => setActiveBooking(null)}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Yangi navbat olish
          </button>
        </motion.div>
      ) : (
        /* Booking Wizard Form */
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
          {/* Steps Breadcrumb */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className={step === 1 ? 'text-teal-600 dark:text-teal-400' : ''}>1. Xizmat</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={step === 2 ? 'text-teal-600 dark:text-teal-400' : ''}>2. Usta</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={step === 3 ? 'text-teal-600 dark:text-teal-400' : ''}>3. Vaqt</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={step === 4 ? 'text-teal-600 dark:text-teal-400' : ''}>4. Tasdiqlash</span>
          </div>

          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                1-Qadam: Xizmat turini tanlang
              </h2>

              <div className="space-y-2.5">
                {barbershopServices.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                      selectedServiceId === srv.id
                        ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 text-slate-900 dark:text-slate-100 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{srv.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Vaqti: ~{srv.durationMinutes} daqiqa</div>
                    </div>
                    <div className="text-sm font-extrabold text-teal-600 dark:text-teal-400">
                      {formatCurrency(srv.price)}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                Ustani tanlashga o'tish <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Choose Barber */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  2-Qadam: Ustani tanlang
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Orqaga
                </button>
              </div>

              <div className="space-y-3">
                {barbers.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBarberId(b.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      selectedBarberId === b.id
                        ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={b.avatar}
                      alt={b.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-teal-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {b.name}
                        </span>
                        <span className="text-xs font-bold text-amber-500">★ {b.rating}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{b.specialty}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                Vaqtni tanlashga o'tish <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: Choose Time Slot */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  3-Qadam: Bo'sh vaqtni tanlang
                </h2>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Orqaga
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {availableTimeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedTimeSlot === slot
                        ? 'border-teal-500 bg-teal-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(4)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                Ma'lumotlarni tasdiqlash <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 4: Confirm Booking */}
          {step === 4 && (
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  4-Qadam: Ismingiz va Telefon raqamingiz
                </h2>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Orqaga
                </button>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tanlangan Xizmat:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Usta:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{selectedBarber.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vaqti:</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">{selectedTimeSlot}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-sm">
                  <span>Нархи:</span>
                  <span className="text-teal-600">{formatCurrency(selectedService.price)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ismingiz *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Masalan: Murod"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Telefon Raqamingiz *
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm transition-all shadow-md cursor-pointer"
              >
                Navbatni Tasdiqlash & Bron Qilish
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
