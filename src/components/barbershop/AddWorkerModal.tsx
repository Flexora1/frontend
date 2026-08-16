import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, UserPlus, Phone, Lock, Scissors, Percent, Award } from 'lucide-react';
import { barbershopApi } from '@/api/barbershopApi';
import { Barber } from '@/types';
import { toast } from 'sonner';

interface AddWorkerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkerAdded: (newBarber: Barber) => void;
}

export function AddWorkerModal({ open, onOpenChange, onWorkerAdded }: AddWorkerModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [specialty, setSpecialty] = useState('Fade & Soqol ustasi');
  const [password, setPassword] = useState('');
  const [commissionPercent, setCommissionPercent] = useState('50');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Введите имя и фамилию мастера');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      toast.error('Введите номер телефона мастера');
      return;
    }

    setLoading(true);
    try {
      const newBarber = await barbershopApi.addBarber({
        firstName,
        lastName,
        phone,
        specialty,
        password,
        commissionPercent: Number(commissionPercent) || 50,
      });

      toast.success(
        `Новый работник ${firstName} ${lastName} зарегистрирован! Теперь он может войти в систему.`
      );
      onWorkerAdded(newBarber);
      onOpenChange(false);

      // Reset form
      setFirstName('');
      setLastName('');
      setPhone('+998 ');
      setPassword('');
    } catch (err) {
      toast.error(' Ошибка при добавлении работника');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 z-50 shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-600 text-white flex items-center justify-center font-bold">
                <Scissors className="w-4 h-4" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Добавить нового работника
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500">
                  Регистрация мастера в системе менеджером
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-medium">
              Добавленный работник получит доступ для входа во вкладке «Сотрудник / Менеджер».
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Имя *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Рустам"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Фамилия *
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Каримов"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Номер телефона *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 999 88 77"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Специализация *
              </label>
              <div className="relative">
                <Award className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Fade & Soqol ustasi / VIP Master"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Пароль для входа мастера *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Процент зарплаты от заказа (%)
              </label>
              <div className="relative">
                <Percent className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="number"
                  min="10"
                  max="90"
                  value={commissionPercent}
                  onChange={(e) => setCommissionPercent(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> Добавить и Зарегистрировать Работника
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
