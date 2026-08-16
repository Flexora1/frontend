import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Scissors,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface CalendarEvent {
  id: string;
  clientName: string;
  clientPhone: string;
  barberName: string;
  serviceName: string;
  price: number;
  scheduledDate: string; // e.g. "2026-08-16"
  scheduledTime: string; // e.g. "11:30"
  registeredAt: string;  // e.g. "15 Авг, 18:40"
  status: 'WAITING' | 'IN_CHAIR' | 'COMPLETED' | 'CANCELLED';
}

const mockEvents: CalendarEvent[] = [
  {
    id: 'ev-1',
    clientName: 'Jasur Bekmirzayev',
    clientPhone: '+998 90 123 45 67',
    barberName: 'Usta Alisher',
    serviceName: 'Soch kesish (Klassik / Fade)',
    price: 60000,
    scheduledDate: '2026-08-16',
    scheduledTime: '11:00',
    registeredAt: '15 Avgust, 19:20',
    status: 'IN_CHAIR',
  },
  {
    id: 'ev-2',
    clientName: 'Sardor Rahimiv',
    clientPhone: '+998 91 987 65 43',
    barberName: 'Usta Alisher',
    serviceName: 'VIP Kompleks (Soch + Soqol)',
    price: 120000,
    scheduledDate: '2026-08-16',
    scheduledTime: '12:30',
    registeredAt: '16 Avgust, 09:15',
    status: 'WAITING',
  },
  {
    id: 'ev-3',
    clientName: 'Bobur Mansurov',
    clientPhone: '+998 93 555 11 22',
    barberName: 'Usta Rustam',
    serviceName: 'Soqol olish va forma berish',
    price: 40000,
    scheduledDate: '2026-08-16',
    scheduledTime: '14:00',
    registeredAt: '14 Avgust, 14:10',
    status: 'WAITING',
  },
  {
    id: 'ev-4',
    clientName: 'Sherzod Mahmudov',
    clientPhone: '+998 97 777 88 99',
    barberName: 'Usta Jahongir',
    serviceName: 'Bolalar soch turmagi',
    price: 50000,
    scheduledDate: '2026-08-16',
    scheduledTime: '10:15',
    registeredAt: '15 Avgust, 21:00',
    status: 'COMPLETED',
  },
  {
    id: 'ev-5',
    clientName: 'Farrux Umarov',
    clientPhone: '+998 94 444 33 22',
    barberName: 'Usta Rustam',
    serviceName: 'Soch kesish (Klassik / Fade)',
    price: 60000,
    scheduledDate: '2026-08-17',
    scheduledTime: '15:30',
    registeredAt: '16 Avgust, 11:00',
    status: 'WAITING',
  },
  {
    id: 'ev-6',
    clientName: 'Dilshod Karimov',
    clientPhone: '+998 90 888 77 66',
    barberName: 'Usta Jahongir',
    serviceName: 'VIP Kompleks',
    price: 120000,
    scheduledDate: '2026-08-17',
    scheduledTime: '17:00',
    registeredAt: '16 Avgust, 12:45',
    status: 'WAITING',
  },
];

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-16');
  const [selectedBarberFilter, setSelectedBarberFilter] = useState<string>('ALL');

  const filteredEvents = mockEvents.filter((ev) => {
    const matchDate = ev.scheduledDate === selectedDate;
    const matchBarber = selectedBarberFilter === 'ALL' || ev.barberName === selectedBarberFilter;
    return matchDate && matchBarber;
  });

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">


      {/* Date & Filter Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
        {/* Date Selector Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate('2026-08-15')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDate === '2026-08-15'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            15 Avgust (Kecha)
          </button>
          <button
            onClick={() => setSelectedDate('2026-08-16')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDate === '2026-08-16'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            16 Avgust (Bugun)
          </button>
          <button
            onClick={() => setSelectedDate('2026-08-17')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDate === '2026-08-17'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            17 Avgust (Ertaga)
          </button>
        </div>

        {/* Barber Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedBarberFilter}
            onChange={(e) => setSelectedBarberFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="ALL">Barcha Ustalar</option>
            <option value="Usta Alisher">Usta Alisher</option>
            <option value="Usta Rustam">Usta Rustam</option>
            <option value="Usta Jahongir">Usta Jahongir</option>
          </select>
        </div>
      </div>

      {/* Timeline Schedule Events List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {selectedDate === '2026-08-16' ? 'Bugungi Tashriflar Jadvali' : `${selectedDate} sanasidagi yozuvlar`}
          </h2>
          <span className="text-xs font-semibold text-teal-600">
            Jami yozuvlar: {filteredEvents.length} ta
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            Ushbu kunga hali yozuvlar mavjud emas.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3"
              >
                {/* Event Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-base font-black text-slate-900 dark:text-slate-100 font-mono">
                      {ev.scheduledTime}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      ev.status === 'IN_CHAIR'
                        ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        : ev.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-teal-500/10 text-teal-600 border border-teal-500/20'
                    }`}
                  >
                    {ev.status === 'IN_CHAIR'
                      ? 'HOZIR KRESLODA'
                      : ev.status === 'COMPLETED'
                      ? 'XIZMAT KURSATILDI'
                      : 'NAVATDA KUTMOQDA'}
                  </span>
                </div>

                {/* Client Info */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-slate-400" /> {ev.clientName}
                    </span>
                    <span className="font-mono text-slate-500 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {ev.clientPhone}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 pt-1">
                    <span>Usta: <strong className="text-slate-800 dark:text-slate-200">{ev.barberName}</strong></span>
                    <span className="font-extrabold text-teal-600">{formatCurrency(ev.price)}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                    <span>Xizmat: {ev.serviceName}</span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">
                      Ro'yxatdan o'tgan: {ev.registeredAt}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
