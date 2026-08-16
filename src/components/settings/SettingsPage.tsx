import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Clock,
  Percent,
  CreditCard,
  Save,
  Building,
  Phone,
  MapPin,
  Check,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { PaymentMethod } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ShopSettings {
  shopName: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
  workDays: number[]; // 0 = Dushanba ... 6 = Yakshanba
  commissionPercent: number;
  paymentMethods: PaymentMethod[];
}

const STORAGE_KEY = 'flexora-barber-settings';

const defaultSettings: ShopSettings = {
  shopName: 'Flexora Barber',
  address: 'Toshkent sh., Chilonzor tumani, 12-uy',
  phone: '+998 90 123 45 67',
  openTime: '09:00',
  closeTime: '20:00',
  workDays: [0, 1, 2, 3, 4, 5, 6],
  commissionPercent: 50,
  paymentMethods: ['CASH', 'CARD', 'CLICK_PAYME'],
};

const dayKeys = ['day.mon', 'day.tue', 'day.wed', 'day.thu', 'day.fri', 'day.sat', 'day.sun'];

const paymentOptions: { value: PaymentMethod; labelKey: string }[] = [
  { value: 'CASH', labelKey: 'settings.cash' },
  { value: 'CARD', labelKey: 'settings.card' },
  { value: 'CLICK_PAYME', labelKey: 'settings.clickPayme' },
];

function loadSettings(): ShopSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return defaultSettings;
}

export function SettingsPage() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<ShopSettings>(loadSettings);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof ShopSettings>(key: K, value: ShopSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const toggleWorkDay = (day: number) => {
    setSettings((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((d) => d !== day)
        : [...prev.workDays, day].sort(),
    }));
    setSaved(false);
  };

  const togglePayment = (method: PaymentMethod) => {
    setSettings((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter((m) => m !== method)
        : [...prev.paymentMethods, method],
    }));
    setSaved(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore storage errors
    }
    setSaved(true);
    toast.success(t('settings.saved'));
  };

  const inputClass =
    'w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500';
  const labelClass = 'block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1';

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs">
              {t('nav.settings')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            {t('settings.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('settings.subtitle')}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Save className="w-4 h-4" /> {t('settings.save')}
        </button>
      </motion.div>

      {/* Section 1: Shop Info */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t('settings.shopInfo')}
            </h2>
            <p className="text-[11px] text-slate-400">{t('settings.shopInfoDesc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>{t('settings.shopName')}</label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={settings.shopName}
                onChange={(e) => update('shopName', e.target.value)}
                className={cn(inputClass, 'pl-9')}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>{t('settings.address')}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={settings.address}
                onChange={(e) => update('address', e.target.value)}
                className={cn(inputClass, 'pl-9')}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>{t('settings.phone')}</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={cn(inputClass, 'pl-9')}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 2: Work Schedule */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t('settings.schedule')}
            </h2>
            <p className="text-[11px] text-slate-400">{t('settings.scheduleDesc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('settings.openTime')}</label>
            <input
              type="time"
              value={settings.openTime}
              onChange={(e) => update('openTime', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t('settings.closeTime')}</label>
            <input
              type="time"
              value={settings.closeTime}
              onChange={(e) => update('closeTime', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t('settings.workDays')}</label>
          <div className="flex flex-wrap gap-2">
            {dayKeys.map((key, idx) => {
              const active = settings.workDays.includes(idx);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleWorkDay(idx)}
                  className={cn(
                    'px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer select-none',
                    active
                      ? 'border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  {t(key)}
                </button>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Section 3: Master commission */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t('settings.commission')}
            </h2>
            <p className="text-[11px] text-slate-400">{t('settings.commissionDesc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={settings.commissionPercent}
            onChange={(e) => update('commissionPercent', Number(e.target.value))}
            className="flex-1 accent-teal-600 cursor-pointer"
          />
          <div className="w-16 py-2 text-center text-sm font-extrabold text-teal-600 dark:text-teal-400 rounded-xl bg-teal-500/10 border border-teal-500/20">
            {settings.commissionPercent}%
          </div>
        </div>
      </motion.section>

      {/* Section 4: Payment methods */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t('settings.payments')}
            </h2>
            <p className="text-[11px] text-slate-400">{t('settings.paymentsDesc')}</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {paymentOptions.map((opt) => {
            const active = settings.paymentMethods.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => togglePayment(opt.value)}
                className={cn(
                  'w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none',
                  active
                    ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                )}
              >
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t(opt.labelKey)}
                </span>
                <span
                  className={cn(
                    'w-5 h-5 rounded-lg border flex items-center justify-center transition-colors',
                    active
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 text-transparent'
                  )}
                >
                  <Check className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* Saved indicator */}
      {saved && (
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <Check className="w-4 h-4" /> {t('settings.saved')}
        </div>
      )}
    </div>
  );
}
