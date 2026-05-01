import { useState } from 'react';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface Jadwal {
  id: string;
  mataKuliah: string;
  kode: string;
  dosen: string;
  hari: string;
  jam: string;
  ruang: string;
  sks: number;
  warna: string;
}

const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at"];
const HARI_SHORT = ['Sen', 'Sel', 'Rab', 'Kam', "Jum"];

const jadwalData: Jadwal[] = [
  { id: '1', kode: 'IF601', mataKuliah: 'Rekayasa Perangkat Lunak', dosen: 'Prof. Budi Santoso', hari: 'Senin', jam: '08:00 - 10:30', ruang: 'Ruang 202', sks: 3, warna: 'blue' },
  { id: '2', kode: 'IF602', mataKuliah: 'Kecerdasan Buatan', dosen: 'Dr. Maya Indah', hari: 'Selasa', jam: '10:00 - 12:30', ruang: 'Lab AI', sks: 3, warna: 'violet' },
  { id: '3', kode: 'IF603', mataKuliah: 'Pengolahan Citra Digital', dosen: 'Dr. Cahyo Purnomo', hari: 'Rabu', jam: '13:00 - 15:30', ruang: 'Lab B2', sks: 3, warna: 'emerald' },
  { id: '4', kode: 'IF604', mataKuliah: 'Sistem Terdistribusi', dosen: 'Dr. Andi Wijaya', hari: 'Kamis', jam: '08:00 - 09:40', ruang: 'Ruang 301', sks: 2, warna: 'amber' },
  { id: '5', kode: 'MK601', mataKuliah: 'Statistik Inferensia', dosen: 'Dr. Rudi Hermawan', hari: "Jum'at", jam: '09:00 - 10:40', ruang: 'Ruang 103', sks: 2, warna: 'pink' },
  { id: '6', kode: 'IF605', mataKuliah: 'Kapita Selekta', dosen: 'Dr. Siti Rahayu', hari: "Jum'at", jam: '13:00 - 14:40', ruang: 'Ruang 401', sks: 2, warna: 'cyan' },
];

const colorMap: Record<string, { card: string; dot: string }> = {
  blue: { card: 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/15', dot: 'bg-blue-500' },
  violet: { card: 'bg-violet-500/10 border-violet-500/30 hover:bg-violet-500/15', dot: 'bg-violet-500' },
  emerald: { card: 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15', dot: 'bg-emerald-500' },
  amber: { card: 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15', dot: 'bg-amber-500' },
  pink: { card: 'bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/15', dot: 'bg-pink-500' },
  cyan: { card: 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/15', dot: 'bg-cyan-500' },
};

// Get current week dates
function getWeekDates(offset = 0) {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function JadwalPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [view, setView] = useState<'week' | 'list'>('week');
  const weekDates = getWeekDates(weekOffset);
  const today = new Date();
  const isToday = (d: Date) =>
    d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();

  const weekLabel = `${weekDates[0].toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} – ${weekDates[4].toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Jadwal Kuliah</h2>
          <p className="text-slate-400 text-sm mt-1">Semester Genap — Tahun Akademik 2024/2025</p>
        </div>
        <div className="flex gap-1 bg-slate-900/60 border border-slate-800 p-1 rounded-xl">
          {(['week', 'list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === v ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              {v === 'week' ? '📅 Mingguan' : '📋 Daftar'}
            </button>
          ))}
        </div>
      </div>

      {view === 'week' ? (
        <>
          {/* Week Navigator */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3">
            <button onClick={() => setWeekOffset(o => o - 1)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <p className="text-white font-semibold text-sm">{weekLabel}</p>
              {weekOffset === 0 && <p className="text-blue-400 text-xs mt-0.5">Minggu Ini</p>}
            </div>
            <button onClick={() => setWeekOffset(o => o + 1)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {HARI.map((hari, idx) => {
              const date = weekDates[idx];
              const jadwalHari = jadwalData.filter(j => j.hari === hari);
              const todayFlag = isToday(date);
              return (
                <div key={hari} className={`bg-slate-900 border rounded-2xl overflow-hidden ${todayFlag ? 'border-blue-500/50' : 'border-slate-800'}`}>
                  <div className={`px-3 py-3 text-center border-b ${todayFlag ? 'border-blue-500/30 bg-blue-500/10' : 'border-slate-800'}`}>
                    <p className={`text-xs font-semibold ${todayFlag ? 'text-blue-400' : 'text-slate-400'}`}>{HARI_SHORT[idx]}</p>
                    <p className={`text-lg font-bold mt-0.5 ${todayFlag ? 'text-blue-400' : 'text-white'}`}>{date.getDate()}</p>
                  </div>
                  <div className="p-2 space-y-2 min-h-[80px]">
                    {jadwalHari.length === 0 && (
                      <p className="text-slate-600 text-xs text-center pt-4">Libur</p>
                    )}
                    {jadwalHari.map(j => {
                      const c = colorMap[j.warna];
                      return (
                        <div key={j.id} className={`p-2 rounded-xl border ${c.card} transition-all cursor-pointer`}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                            <span className="text-[10px] font-mono text-slate-400">{j.kode}</span>
                          </div>
                          <p className="text-white text-xs font-semibold leading-tight">{j.mataKuliah}</p>
                          <p className="text-slate-400 text-[10px] mt-1">{j.jam}</p>
                          <p className="text-slate-500 text-[10px]">{j.ruang}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* List View */
        <div className="space-y-3">
          {HARI.map(hari => {
            const jadwalHari = jadwalData.filter(j => j.hari === hari);
            if (jadwalHari.length === 0) return null;
            return (
              <div key={hari} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800 bg-slate-800/30">
                  <p className="text-white font-semibold text-sm">{hari}</p>
                </div>
                <div className="divide-y divide-slate-800">
                  {jadwalHari.map(j => {
                    const c = colorMap[j.warna];
                    return (
                      <div key={j.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/30 transition-colors">
                        <div className={`w-1 self-stretch rounded-full ${c.dot}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm">{j.mataKuliah}</p>
                          <div className="flex flex-wrap gap-3 mt-1">
                            <span className="flex items-center gap-1 text-slate-500 text-xs"><User size={11} />{j.dosen}</span>
                            <span className="flex items-center gap-1 text-slate-500 text-xs"><MapPin size={11} />{j.ruang}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-slate-300 text-sm font-medium">{j.jam}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{j.sks} SKS</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total MK', value: jadwalData.length, icon: <Calendar size={16} /> },
          { label: 'Total SKS', value: jadwalData.reduce((s, j) => s + j.sks, 0), icon: <Clock size={16} /> },
          { label: 'Hari Kuliah', value: new Set(jadwalData.map(j => j.hari)).size, icon: <Calendar size={16} /> },
          { label: 'Ruang', value: new Set(jadwalData.map(j => j.ruang)).size, icon: <MapPin size={16} /> },
        ].map((item, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="text-slate-500">{item.icon}</div>
            <div>
              <p className="text-slate-400 text-xs">{item.label}</p>
              <p className="text-white font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
