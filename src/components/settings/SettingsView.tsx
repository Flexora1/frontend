import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Phone,
  Lock,
  Scissors,
  Save,
  CheckCircle2,
  Bell,
  ShieldCheck,
  Award,
  Plus,
  UserPlus,
  Moon,
  Sun,
} from 'lucide-react';
import { barbershopApi } from '@/api/barbershopApi';
import { AddWorkerModal } from '@/components/barbershop/AddWorkerModal';
import { useLanguage } from '@/i18n/LanguageContext';
import { toast } from 'sonner';

export function SettingsView() {
  const { t, language, setLanguage } = useLanguage();
  
  // Modal for adding new worker/master
  const [addWorkerOpen, setAddWorkerOpen] = useState(false);

  // Master Profile state
  const [firstName, setFirstName] = useState('Alisher');
  const [lastName, setLastName] = useState('Usta');
  const [phone, setPhone] = useState('+998 90 111 22 33');
  const [specialty, setSpecialty] = useState('Fade & Soqol ustasi');
  
  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Shift & Notification state
  const [isWorkingToday, setIsWorkingToday] = useState(true);
  const [telegramAlerts, setTelegramAlerts] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error(t('settings.nameError') || "Ism va familiyani kiriting");
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      toast.error(t('settings.phoneError') || "To'g'ri telefon raqam kiriting");
      return;
    }

    if (newPassword) {
      if (newPassword.length < 4) {
        toast.error("Yangi parol kamida 4 ta belgidan iborat bo'lishi kerak");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Yangi parollar mos kelmadi");
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success("Sozlamalar va profil ma'lumotlari muvaffaqiyatli saqlandi!");
    }, 400);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Section 0: Manager Action — Add New Master / Barber */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs backdrop-blur-xs flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5" /> MENERER BOSHQARUVI
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight">Yangi Usta (Xodim) Ro'yxatdan O'tkazish</h2>
          <p className="text-xs opacity-90">
            Tizimga yangi usta (sartarosh) qo'shish va unga shaxsiy kirish parolini biriktirish
          </p>
        </div>

        <button
          onClick={() => setAddWorkerOpen(true)}
          className="py-3 px-5 rounded-xl bg-white text-amber-900 hover:bg-amber-50 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-amber-600" /> + Yangi Usta Qo'shish
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Personal Profile Data */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Foydalanuvchi va Usta ma'lumotlari
              </h2>
              <p className="text-xs text-slate-400">Ism, familiya, telefon va mutaxassislik</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ismingiz *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Familiyangiz *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Telefon raqam *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-mono rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mutaxassislik
              </label>
              <div className="relative">
                <Award className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Change Password */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Lock className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Xavfsizlik va Parolni O'zgartirish
              </h2>
              <p className="text-xs text-slate-400">Tizimga kirish parolini yangilang</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Amaldagi parol
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Yangi parol
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Parolni tasdiqlash
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Work Shift & Notifications */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Scissors className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Ish Smensasi va Bildirishnomalar
              </h2>
              <p className="text-xs text-slate-400">Ish rejimi va Telegram habarlari</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer select-none rounded-xl">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Bugungi smena (Ishda / Na smene)
              </span>
              <input
                type="checkbox"
                checked={isWorkingToday}
                onChange={(e) => setIsWorkingToday(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer select-none rounded-xl">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Yangi mijoz yozilganda Telegram bildirishnoma yuborish
              </span>
              <input
                type="checkbox"
                checked={telegramAlerts}
                onChange={(e) => setTelegramAlerts(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-0 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> Sozlamalarni saqlash
        </button>
      </form>

      {/* Add Worker Modal Component */}
      <AddWorkerModal
        open={addWorkerOpen}
        onOpenChange={setAddWorkerOpen}
        onWorkerAdded={() => {
          toast.success("Yangi usta ro'yxatga olindi!");
        }}
      />
    </div>
  );
}
