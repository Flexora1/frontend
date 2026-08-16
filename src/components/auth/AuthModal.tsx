import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Lock,
  User,
  Scissors,
  Crown,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { barbershopApi } from '@/api/barbershopApi';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: (role: 'BARBER' | 'OWNER', name: string) => void;
}

export function AuthModal({
  open,
  onOpenChange,
  onLoginSuccess,
}: AuthModalProps) {
  const navigate = useNavigate();

  // Worker/Manager Login Form State
  const [staffRole, setStaffRole] = useState<'BARBER' | 'OWNER'>('BARBER');
  const [staffPhoneOrEmail, setStaffPhoneOrEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');

  // Reset fields when modal is opened
  useEffect(() => {
    if (open) {
      setStaffPhoneOrEmail('');
      setStaffPassword('');
    }
  }, [open]);

  // Handle Worker & Manager Login ONLY with Strict Authentication
  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffPhoneOrEmail.trim() || !staffPassword.trim()) {
      toast.error("Xodimlarning login/telefoni va parolini kiriting!");
      return;
    }

    try {
      const user = await barbershopApi.authenticateStaff(
        staffPhoneOrEmail,
        staffPassword,
        staffRole
      );

      if (user.role === 'OWNER') {
        toast.success(`Muvaffaqiyatli kirildi: ${user.name}`);
        if (onLoginSuccess) onLoginSuccess('OWNER', user.name);
        onOpenChange(false);
        navigate('/manager');
      } else {
        toast.success(`Muvaffaqiyatli kirildi: ${user.name}`);
        if (onLoginSuccess) onLoginSuccess('BARBER', user.name);
        onOpenChange(false);
        navigate('/barber');
      }
    } catch (err: any) {
      toast.error(err.message || "Noto'g'ri login yoki parol!");
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
                  Xodimlar uchun tizimga kirish
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500">
                  Usta va Menejer ishchi kabinetiga kirish
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleStaffLogin} className="space-y-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Xodimlarning kirish oynasi.</span> Ochiq ro'yxatdan o'tish yopiq. Yangi ustani faqat Menejer o'z boshqaruv panelida ro'yxatga oladi.
              </div>
            </div>

            {/* Role Toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Rolingizni tanlang
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStaffRole('BARBER')}
                  className={`py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    staffRole === 'BARBER'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" /> Usta (Sartarosh)
                </button>

                <button
                  type="button"
                  onClick={() => setStaffRole('OWNER')}
                  className={`py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    staffRole === 'OWNER'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" /> Menejer (Ega)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Login / Xodim telefon raqami
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={staffPhoneOrEmail}
                  onChange={(e) => setStaffPhoneOrEmail(e.target.value)}
                  placeholder="Login / Telefon raqam"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Xodim paroli
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  placeholder="Parol"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 px-4 text-xs font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                staffRole === 'OWNER'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> {staffRole === 'OWNER' ? 'Menejer' : 'Usta'} sifatida kirish
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
