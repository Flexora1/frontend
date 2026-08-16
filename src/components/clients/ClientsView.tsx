import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Phone,
  Clock,
  Scissors,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Filter,
  UserCheck,
  UserX,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  status: 'IN_CHAIR' | 'WAITING' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
  arrivalTime: string;     // e.g. "11:00"
  visitDate: string;       // e.g. "16 Avgust, 2026"
  registeredAt: string;    // e.g. "15 Avgust, 19:20"
  barberName: string;
  serviceName: string;
  amount: number;
  totalVisitsCount: number;
}

const mockClientsList: ClientRecord[] = [
  {
    id: 'cli-1',
    name: 'Jasur Bekmirzayev',
    phone: '+998 90 123 45 67',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'IN_CHAIR',
    arrivalTime: 'Bugun 11:00 da keldi',
    visitDate: '16 Avgust, 2026',
    registeredAt: '15 Avgust, 19:20',
    barberName: 'Usta Alisher',
    serviceName: 'Soch kesish (Klassik / Fade)',
    amount: 60000,
    totalVisitsCount: 5,
  },
  {
    id: 'cli-2',
    name: 'Sardor Rahimiv',
    phone: '+998 91 987 65 43',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'WAITING',
    arrivalTime: 'Bugun 11:45 ga kutilmoqda',
    visitDate: '16 Avgust, 2026',
    registeredAt: '16 Avgust, 09:15',
    barberName: 'Usta Alisher',
    serviceName: 'VIP Kompleks (Soch + Soqol)',
    amount: 120000,
    totalVisitsCount: 3,
  },
  {
    id: 'cli-3',
    name: 'Sherzod Mahmudov',
    phone: '+998 97 777 88 99',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'COMPLETED',
    arrivalTime: 'Bugun 10:15 da keldi va ketdi',
    visitDate: '16 Avgust, 2026',
    registeredAt: '15 Avgust, 21:00',
    barberName: 'Usta Jahongir',
    serviceName: 'Bolalar soch turmagi',
    amount: 50000,
    totalVisitsCount: 8,
  },
  {
    id: 'cli-4',
    name: 'Farrux Umarov',
    phone: '+998 94 444 33 22',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'NO_SHOW',
    arrivalTime: 'Bugun 10:00 ga kelmadi',
    visitDate: '16 Avgust, 2026',
    registeredAt: '14 Avgust, 18:30',
    barberName: 'Usta Rustam',
    serviceName: 'Soch kesish (Klassik / Fade)',
    amount: 60000,
    totalVisitsCount: 1,
  },
  {
    id: 'cli-5',
    name: 'Bobur Mansurov',
    phone: '+998 93 555 11 22',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    status: 'WAITING',
    arrivalTime: 'Bugun 14:00 ga kutilmoqda',
    visitDate: '16 Avgust, 2026',
    registeredAt: '14 Avgust, 14:10',
    barberName: 'Usta Rustam',
    serviceName: 'Soqol olish va forma berish',
    amount: 40000,
    totalVisitsCount: 4,
  },
  {
    id: 'cli-6',
    name: 'Azizbek Qodirov',
    phone: '+998 99 333 22 11',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: 'CANCELLED',
    arrivalTime: '15 Avgustda bekor qilingan',
    visitDate: '15 Avgust, 2026',
    registeredAt: '13 Avgust, 11:20',
    barberName: 'Usta Alisher',
    serviceName: 'Soch kesish',
    amount: 60000,
    totalVisitsCount: 2,
  },
];

export function ClientsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState<string>('ALL');

  const filteredClients = mockClientsList.filter((cli) => {
    const matchSearch =
      cli.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cli.phone.includes(searchQuery);
    const matchStatus = activeStatusTab === 'ALL' || cli.status === activeStatusTab;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">


      {/* Controls & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveStatusTab('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeStatusTab === 'ALL'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Barchasi ({mockClientsList.length})
          </button>
          <button
            onClick={() => setActiveStatusTab('IN_CHAIR')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeStatusTab === 'IN_CHAIR'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Hozir Kresloda ({mockClientsList.filter((c) => c.status === 'IN_CHAIR').length})
          </button>
          <button
            onClick={() => setActiveStatusTab('WAITING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeStatusTab === 'WAITING'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Kutmoqda ({mockClientsList.filter((c) => c.status === 'WAITING').length})
          </button>
          <button
            onClick={() => setActiveStatusTab('COMPLETED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeStatusTab === 'COMPLETED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Bajarildi ({mockClientsList.filter((c) => c.status === 'COMPLETED').length})
          </button>
          <button
            onClick={() => setActiveStatusTab('NO_SHOW')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeStatusTab === 'NO_SHOW'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Kelmadi ({mockClientsList.filter((c) => c.status === 'NO_SHOW').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mijoz ismi yoki telefoni..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 rounded-xl"
          />
        </div>
      </div>

      {/* Clients Table / Cards List */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Mijoz</th>
                <th className="py-3 px-4">Tashrif Holati</th>
                <th className="py-3 px-4">Qachon keldi / keladi</th>
                <th className="py-3 px-4">Ro'yxatdan o'tgan sanasi</th>
                <th className="py-3 px-4">Usta & Xizmat</th>
                <th className="py-3 px-4 text-right">Summa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredClients.map((cli) => (
                <tr key={cli.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Client Name & Phone */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cli.avatar}
                        alt={cli.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {cli.name}
                        </div>
                        <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {cli.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Visit Status Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        cli.status === 'IN_CHAIR'
                          ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          : cli.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : cli.status === 'NO_SHOW'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : cli.status === 'CANCELLED'
                          ? 'bg-slate-500/10 text-slate-600 border border-slate-500/20'
                          : 'bg-teal-500/10 text-teal-600 border border-teal-500/20'
                      }`}
                    >
                      {cli.status === 'IN_CHAIR' && <Scissors className="w-3 h-3 animate-bounce" />}
                      {cli.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3" />}
                      {cli.status === 'NO_SHOW' && <UserX className="w-3 h-3" />}
                      {cli.status === 'IN_CHAIR'
                        ? 'HOZIR KRESLODA'
                        : cli.status === 'COMPLETED'
                        ? 'XIZMAT BAJARILDI'
                        : cli.status === 'NO_SHOW'
                        ? 'KELMADI'
                        : cli.status === 'CANCELLED'
                        ? 'BEKOR QILINGAN'
                        : 'NAVBATDA KUTMOQDA'}
                    </span>
                  </td>

                  {/* Arrival Time */}
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-500" />
                      <span>{cli.arrivalTime}</span>
                    </div>
                  </td>

                  {/* Registered Date */}
                  <td className="py-3.5 px-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>{cli.registeredAt}</span>
                    </div>
                  </td>

                  {/* Master & Service */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{cli.barberName}</div>
                    <div className="text-slate-400 text-[11px]">{cli.serviceName}</div>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-teal-600">
                    {formatCurrency(cli.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
