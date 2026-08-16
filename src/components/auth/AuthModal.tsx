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
import { useLanguage } from '@/i18n/LanguageContext';

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
  const { t } = useLanguage();

  // Worker/Manager Login Form State
  const [staffRole, setStaffRole] = useState<'BARBER' | 'OWNER'>('BARBER');
  const [staffPhoneOrEmail, setStaffPhoneOrEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');

  // Auto-fill default credentials when modal opens or role changes
  useEffect(() => {
    if (open) {
      if (staffRole === 'OWNER') {
        setStaffPhoneOrEmail('admin@resto.uz');
        setStaffPassword('admin123');
      } else {
        setStaffPhoneOrEmail('+998 90 111 22 33');
        setStaffPassword('master123');
      }
    }
  }, [open, staffRole]);

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

      toast.success(
        `Xush kelibsiz, ${user.name}! Kabinetga muvaffaqiyatli kirdingiz.`
      );

      if (onLoginSuccess) {
        onLoginSuccess(user.role, user.name);
      }

      onOpenChange(false);

      if (user.role === 'OWNER') {
        navigate('/manager');
      } else {
        navigate('/barber');
      }
    } catch (err: any) {
      toast.error(err.message || "Noto'g'ri login, parol yoki mos kelmaydigan rol!");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 animate-fade-in" />

        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 z-50 shadow-2xl animate-in zoom-in-95 rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {t('auth.title')}
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500">
                  {t('auth.desc')}
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold rounded-xl flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>{t('auth.notice')}</span>
          </div>

          <form onSubmit={handleStaffLogin} className="space-y-4">
            {/* Role Radio buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('auth.selectRole')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStaffRole('BARBER')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    staffRole === 'BARBER'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" /> {t('auth.barber')}
                </button>

                <button
                  type="button"
                  onClick={() => setStaffRole('OWNER')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    staffRole === 'OWNER'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" /> {t('auth.manager')}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('auth.loginLabel')}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={staffPhoneOrEmail}
                  onChange={(e) => setStaffPhoneOrEmail(e.target.value)}
                  placeholder="Login / Telefon raqam"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-mono rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('auth.passwordLabel')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  placeholder="Parol"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-md mt-2"
            >
              {t('auth.submit')} {staffRole === 'BARBER' ? t('auth.barber') : t('auth.manager')}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
