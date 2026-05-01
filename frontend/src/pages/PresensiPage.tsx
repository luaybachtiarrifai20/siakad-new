import { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface PresensiRecord {
  tanggal: string;
  pertemuan: number;
  materi: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alfa';
}

interface MKPresensi {
  id: string;
  kode: string;
  nama: string;
  dosen: string;
  totalPertemuan: number;
  records: PresensiRecord[];
}

const statusConfig = {
  hadir: { label: 'Hadir', icon: <CheckCircle size={14} />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  izin: { label: 'Izin', icon: <Clock size={14} />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  sakit: { label: 'Sakit', icon: <AlertCircle size={14} />, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  alfa: { label: 'Alfa', icon: <XCircle size={14} />, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

const presensiData: MKPresensi[] = [
  {
    id: '1', kode: 'IF601', nama: 'Rekayasa Perangkat Lunak', dosen: 'Prof. Budi Santoso', totalPertemuan: 16,
    records: [
      { tanggal: '17 Feb 2025', pertemuan: 1, materi: 'Pengantar RPL & SDLC', status: 'hadir' },
      { tanggal: '24 Feb 2025', pertemuan: 2, materi: 'Requirements Engineering', status: 'hadir' },
      { tanggal: '3 Mar 2025', pertemuan: 3, materi: 'Use Case Diagram', status: 'izin' },
      { tanggal: '10 Mar 2025', pertemuan: 4, materi: 'Class Diagram UML', status: 'hadir' },
      { tanggal: '17 Mar 2025', pertemuan: 5, materi: 'Software Testing', status: 'hadir' },
      { tanggal: '24 Mar 2025', pertemuan: 6, materi: 'Agile & Scrum', status: 'hadir' },
      { tanggal: '31 Mar 2025', pertemuan: 7, materi: 'Review UTS', status: 'sakit' },
      { tanggal: '14 Apr 2025', pertemuan: 8, materi: 'Deployment & DevOps', status: 'hadir' },
    ],
  },
  {
    id: '2', kode: 'IF602', nama: 'Kecerdasan Buatan', dosen: 'Dr. Maya Indah', totalPertemuan: 16,
    records: [
      { tanggal: '18 Feb 2025', pertemuan: 1, materi: 'Pengantar AI & ML', status: 'hadir' },
      { tanggal: '25 Feb 2025', pertemuan: 2, materi: 'Algoritma Pencarian', status: 'hadir' },
      { tanggal: '4 Mar 2025', pertemuan: 3, materi: 'Logika Fuzzy', status: 'hadir' },
      { tanggal: '11 Mar 2025', pertemuan: 4, materi: 'Neural Network Dasar', status: 'alfa' },
      { tanggal: '18 Mar 2025', pertemuan: 5, materi: 'Supervised Learning', status: 'hadir' },
      { tanggal: '25 Mar 2025', pertemuan: 6, materi: 'Unsupervised Learning', status: 'hadir' },
    ],
  },
];

function persenHadir(records: PresensiRecord[], total: number) {
  const attended = records.filter(r => r.status === 'hadir').length;
  return { persen: Math.round((attended / Math.max(records.length, 1)) * 100), ekivalen: Math.round((attended / total) * 100) };
}

export default function PresensiPage() {
  const [selectedMK, setSelectedMK] = useState(presensiData[0].id);
  const mk = presensiData.find(m => m.id === selectedMK)!;
  const { persen } = persenHadir(mk.records, mk.totalPertemuan);
  const counts = { hadir: 0, izin: 0, sakit: 0, alfa: 0 } as Record<string, number>;
  mk.records.forEach(r => counts[r.status]++);
  const sisaPertemuan = mk.totalPertemuan - mk.records.length;

  const barColor = persen >= 80 ? 'bg-emerald-500' : persen >= 75 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Presensi Kehadiran</h2>
        <p className="text-slate-400 text-sm mt-1">Semester Genap — Tahun Akademik 2024/2025</p>
      </div>

      {/* MK Selector */}
      <div className="flex flex-wrap gap-2">
        {presensiData.map(m => {
          const { persen: p } = persenHadir(m.records, m.totalPertemuan);
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMK(m.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 ${
                selectedMK === m.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>{m.kode}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-md ${p >= 75 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{p}%</span>
            </button>
          );
        })}
      </div>

      {/* MK Detail Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="text-white font-semibold">{mk.nama}</h3>
            <p className="text-slate-400 text-sm">{mk.dosen} · {mk.kode}</p>
          </div>
          <div className="text-sm text-slate-400">
            <span>{mk.records.length}</span>/{mk.totalPertemuan} pertemuan
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Kehadiran</span>
            <span className={persen >= 75 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>{persen}% {persen >= 75 ? '✓ Aman' : '⚠ Kurang'}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${persen}%` }} />
          </div>
          <div className="flex justify-between text-[11px] text-slate-600 mt-1.5">
            <span>0%</span>
            <span className="text-amber-600">75% (min)</span>
            <span>100%</span>
          </div>
        </div>

        {/* Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(counts) as Array<keyof typeof statusConfig>).map(s => {
            const cfg = statusConfig[s];
            return (
              <div key={s} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border ${cfg.color}`}>
                {cfg.icon}
                <div>
                  <p className="text-xs opacity-80">{cfg.label}</p>
                  <p className="text-lg font-bold leading-tight">{counts[s]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm">Detail Kehadiran</h3>
          <span className="text-slate-500 text-xs">{sisaPertemuan} pertemuan tersisa</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/30">
                <th className="text-left px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Pertemuan</th>
                <th className="text-left px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Tanggal</th>
                <th className="text-left px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Materi</th>
                <th className="text-center px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mk.records.map(r => {
                const cfg = statusConfig[r.status];
                return (
                  <tr key={r.pertemuan} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-slate-300 text-sm font-medium">Ke-{r.pertemuan}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-sm">{r.tanggal}</td>
                    <td className="px-5 py-3.5 text-slate-300 text-sm hidden md:table-cell">{r.materi}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                        {cfg.icon}{cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {/* Remaining rows placeholder */}
              {Array.from({ length: sisaPertemuan }, (_, i) => (
                <tr key={`sisa-${i}`} className="opacity-40">
                  <td className="px-5 py-3.5"><span className="text-slate-500 text-sm">Ke-{mk.records.length + i + 1}</span></td>
                  <td className="px-5 py-3.5 text-slate-600 text-sm">—</td>
                  <td className="px-5 py-3.5 text-slate-600 text-sm hidden md:table-cell">Belum dilaksanakan</td>
                  <td className="px-5 py-3.5 text-center"><span className="text-slate-600 text-xs">—</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
