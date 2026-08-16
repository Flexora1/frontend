import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Scissors,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Phone,
  Lock,
  ChevronRight,
  ArrowLeft,
  Smartphone,
  UserPlus,
} from 'lucide-react';
import { barbershopApi, barbershopServices } from '@/api/barbershopApi';
import { Barber, Appointment } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';
import { toast } from 'sonner';

export function ClientBookingView() {
  const { t } = useLanguage();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [activeBooking, setActiveBooking] = useState<Appointment | null>(null);

  // Booking Form State - STEP 1 is Registration
  const [step, setStep] = useState<number>(1);

  // Client Registration state (STEP 1)
  const [clientFirstName, setClientFirstName] = useState<string>('');
  const [clientLastName, setClientLastName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientPassword, setClientPassword] = useState<string>('');

  // Booking Selection states (STEPS 2, 3, 4)
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-1');
  const [selectedBarberId, setSelectedBarberId] = useState<string>('bar-1');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('14:30');

  const availableTimeSlots = ['12:30', '13:00', '14:00', '14:30', '15:30', '16:00', '17:00'];

  useEffect(() => {
    barbershopApi.getBarbers().then(setBarbers);
  }, []);

  const selectedService = barbershopServices.find((s) => s.id === selectedServiceId) || barbershopServices[0];
  const selectedBarber = barbers.find((b) => b.id === selectedBarberId) || barbers[0];

  // Handle Step 1 Registration
  const handleRegisterClientStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientFirstName.trim() || !clientLastName.trim()) {
      toast.error("Ism va familiyangizni kiriting");
      return;
    }
    if (!clientPhone.trim() || clientPhone.length < 8) {
      toast.error("To'g'ri telefon raqamingizni kiriting");
      return;
    }
    if (!clientPassword.trim() || clientPassword.length < 4) {
      toast.error("Parol kamida 4 ta belgidan iborat bo'lishi kerak");
      return;
    }

    toast.success(`Xush kelibsiz, ${clientFirstName}! Profil yaratildi. Endi xizmatni tanlang.`);
    setStep(2);
  };

  // Handle Final Booking Creation (STEP 4)
  const handleFinalBookingSubmit = async () => {
    const fullName = `${clientFirstName} ${clientLastName}`.trim();
    try {
      const newBooking = await barbershopApi.createOnlineBooking(
        fullName,
        clientPhone,
        selectedBarberId,
        selectedServiceId,
        selectedTimeSlot
      );

      setActiveBooking(newBooking);
      toast.success(`Navbatingiz ${selectedTimeSlot} ga band qilindi!`);
    } catch (err) {
      toast.error("Bron qilishda xatolik yuz berdi");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      {/* Client View Banner Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs backdrop-blur-xs flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" /> {t('booking.badge')}
          </span>
          <span className="text-xs font-semibold opacity-90">RestoBarbera</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          {t('booking.title')}
        </h1>
        <p className="text-xs opacity-90 leading-relaxed">
          {t('booking.subtitle')}
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
                Sizning Navbatingiz Tasdiqlandi
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                {activeBooking.appointmentNumber}
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs">
              Bron Faol
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
                Rejalashtirilgan vaqt: <strong className="text-slate-900 dark:text-slate-100">{activeBooking.scheduledTime}</strong>
              </span>
              <span className="font-extrabold text-teal-600 dark:text-teal-400">
                {formatCurrency(activeBooking.totalAmount)}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500 animate-spin" /> Qabulgacha taxminan ~25 daqiqa qoldi
            </div>
            <p>Iltimos, belgilangan vaqtdan 5–10 daqiqa oldin kelishingizni so'raymiz.</p>
          </div>

          <button
            onClick={() => {
              setActiveBooking(null);
              setStep(2);
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Yana bir xizmatga navbat olish
          </button>
        </motion.div>
      ) : (
        /* Booking Wizard Form */
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
          {/* Steps Breadcrumb */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className={step === 1 ? 'text-teal-600 dark:text-teal-400 font-extrabold' : ''}>
              {t('booking.step1')}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={step === 2 ? 'text-teal-600 dark:text-teal-400 font-extrabold' : ''}>
              {t('booking.step2')}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={step === 3 ? 'text-teal-600 dark:text-teal-400 font-extrabold' : ''}>
              {t('booking.step3')}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={step === 4 ? 'text-teal-600 dark:text-teal-400 font-extrabold' : ''}>
              {t('booking.step4')}
            </span>
          </div>

          {/* STEP 1: CLIENT REGISTRATION */}
          {step === 1 && (
            <form onSubmit={handleRegisterClientStep} className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {t('booking.step1Title')}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Profil yaratish va navbat band qilish uchun ma'lumotlaringizni kiriting
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('booking.firstName')}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={clientFirstName}
                      onChange={(e) => setClientFirstName(e.target.value)}
                      placeholder="Jasur"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-medium rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('booking.lastName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={clientLastName}
                    onChange={(e) => setClientLastName(e.target.value)}
                    placeholder="Bekmirzayev"
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-medium rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('booking.phone')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-mono rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('booking.password')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={clientPassword}
                    onChange={(e) => setClientPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md"
              >
                <UserPlus className="w-4 h-4" /> {t('booking.nextStep2')} <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: SELECT SERVICE */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {t('booking.step2Title')}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Mijoz: <strong className="text-teal-600">{clientFirstName} {clientLastName}</strong> ({clientPhone})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Profilni o'zgartirish
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {barbershopServices.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-500/10 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          {service.name}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                      </div>
                      <div className="mt-2 flex justify-between items-center text-xs">
                        <span className="text-slate-400">{service.durationMinutes} daqiqa</span>
                        <span className="font-extrabold text-teal-600 dark:text-teal-400">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md"
              >
                {t('booking.nextStep3')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: SELECT BARBER */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {t('booking.step3Title')}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Tanlangan xizmat: <strong className="text-teal-600">{selectedService.name}</strong> ({formatCurrency(selectedService.price)})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Xizmatni o'zgartirish
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {barbers.map((barber) => {
                  const isSelected = selectedBarberId === barber.id;
                  return (
                    <div
                      key={barber.id}
                      onClick={() => setSelectedBarberId(barber.id)}
                      className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-500/10 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={barber.avatar}
                        alt={barber.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-teal-500"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          {barber.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{barber.specialty}</div>
                        <div className="text-[10px] text-amber-500 font-bold mt-0.5">
                          ★ {barber.rating} rating
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(4)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md"
              >
                {t('booking.nextStep4')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 4: TIME SLOT & CONFIRMATION */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {t('booking.step4Title')}
                  </h2>
                  <p className="text-xs text-slate-500">Bugungi bo'sh vaqt oralig'ini tanlang</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Ustani o'zgartirish
                </button>
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {availableTimeSlots.map((time) => {
                  const isSelected = selectedTimeSlot === time;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTimeSlot(time)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>

              {/* Summary Breakdown Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mijoz:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {clientFirstName} {clientLastName} ({clientPhone})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Xizmat:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {selectedService.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Master:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {selectedBarber.name}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-bold">
                  <span className="text-slate-700 dark:text-slate-300">To'lov summasi:</span>
                  <span className="text-teal-600 dark:text-teal-400 text-sm">
                    {formatCurrency(selectedService.price)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleFinalBookingSubmit}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Scissors className="w-4 h-4" /> {t('booking.confirmBtn')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
