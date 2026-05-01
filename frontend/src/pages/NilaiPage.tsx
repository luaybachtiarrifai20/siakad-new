import { useState } from 'react';
import { TrendingUp, Award, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

interface Nilai {
  kode: string;
  nama: string;
  sks: number;
  nilaiAngka: number;
  nilaiHuruf: string;
  bobot: number;
}

interface Semester {
  id: string;
  label: string;
  ipk: number;
  totalSks: number;
  mataKuliah: Nilai[];
}

const hurufColor: Record<string, string> = {
  'A': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'AB': 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  'B': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'BC': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'C': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'D': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'E': 'text-red-400 bg-red-500/10 border-red-500/20',
};

const semesterData: Semester[] = [
  {
    id: '6', label: 'Semester 6 — Genap 2024/2025', ipk: 3.72, totalSks: 22,
    mataKuliah: [
      { kode: 'IF601', nama: 'Rekayasa Perangkat Lunak', sks: 3, nilaiAngka: 90, nilaiHuruf: 'A', bobot: 4.0 },
      { kode: 'IF602', nama: 'Kecerdasan Buatan', sks: 3, nilaiAngka: 85, nilaiHuruf: 'AB', bobot: 3.5 },
      { kode: 'IF603', nama: 'Pengolahan Citra Digital', sks: 3, nilaiAngka: 88, nilaiHuruf: 'A', bobot: 4.0 },
      { kode: 'IF604', nama: 'Sistem Terdistribusi', sks: 3, nilaiAngka: 78, nilaiHuruf: 'B', bobot: 3.0 },
      { kode: 'MK601', nama: 'Statistik Inferensia', sks: 2, nilaiAngka: 82, nilaiHuruf: 'AB', bobot: 3.5 },
    ],
  },
  {
    id: '5', label: 'Semester 5 — Ganjil 2024/2025', ipk: 3.68, totalSks: 20,
    mataKuliah: [
      { kode: 'IF501', nama: 'Basis Data Lanjut', sks: 3, nilaiAngka: 88, nilaiHuruf: 'A', bobot: 4.0 },
      { kode: 'IF502', nama: 'Jaringan Komputer', sks: 2, nilaiAngka: 80, nilaiHuruf: 'AB', bobot: 3.5 },
      { kode: 'IF503', nama: 'Pemrograman Web', sks: 3, nilaiAngka: 92, nilaiHuruf: 'A', bobot: 4.0 },
      { kode: 'IF504', nama: 'Keamanan Jaringan', sks: 2, nilaiAngka: 75, nilaiHuruf: 'B', bobot: 3.0 },
      { kode: 'IF505', nama: 'Pemrograman Mobile', sks: 3, nilaiAngka: 84, nilaiHuruf: 'AB', bobot: 3.5 },
    ],
  },
  {
    id: '4', label: 'Semester 4 — Genap 2023/2024', ipk: 3.55, totalSks: 22,
    mataKuliah: [
      { kode: 'IF401', nama: 'Algoritma & Pemrograman', sks: 3, nilaiAngka: 85, nilaiHuruf: 'AB', bobot: 3.5 },
      { kode: 'IF402', nama: 'Desain Sistem Informasi', sks: 3, nilaiAngka: 78, nilaiHuruf: 'B', bobot: 3.0 },
      { kode: 'IF403', nama: 'Analisis Sistem', sks: 3, nilaiAngka: 80, nilaiHuruf: 'AB', bobot: 3.5 },
      { kode: 'IF404', nama: 'Manajemen Proyek', sks: 2, nilaiAngka: 88, nilaiHuruf: 'A', bobot: 4.0 },
      { kode: 'MK401', nama: 'Kalkulus Lanjut', sks: 3, nilaiAngka: 70, nilaiHuruf: 'BC', bobot: 2.5 },
    ],
  },
];

function IPKBar({ value, max = 4 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color = value >= 3.5 ? 'bg-emerald-500' : value >= 3.0 ? 'bg-blue-500' : value >= 2.5 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="w-full bg-slate-800 rounded-full h-1.5">
      <div className={`h-1.5 rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function NilaiPage() {
  const [open, setOpen] = useState<Record<string, boolean>>({ '6': true });

  const ipkKumulatif = 3.65;
  const totalSksLulus = 64;

  const toggle = (id: string) => setOpen(prev => ({ ...prev, [id]: !prev[id] }));

  const getRingkasan = (ipk: number) => {
    if (ipk >= 3.5) return { label: 'Cum Laude', color: 'text-emerald-400' };
    if (ipk >= 3.0) return { label: 'Sangat Memuaskan', color: 'text-blue-400' };
    if (ipk >= 2.5) return { label: 'Memuaskan', color: 'text-amber-400' };
    return { label: 'Cukup', color: 'text-slate-400' };
  };

  const { label, color } = getRingkasan(ipkKumulatif);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Nilai Akademik</h2>
        <p className="text-slate-400 text-sm mt-1">Riwayat nilai per semester dan transkrip akademik</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm">IPK Kumulatif</p>
              <p className="text-4xl font-bold text-white mt-1">{ipkKumulatif.toFixed(2)}</p>
              <p className={`text-sm font-medium mt-1 ${color}`}>{label}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="mt-3">
            <IPKBar value={ipkKumulatif} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm">Total SKS Lulus</p>
              <p className="text-4xl font-bold text-white mt-1">{totalSksLulus}</p>
              <p className="text-slate-500 text-sm mt-1">dari 144 SKS total</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <BarChart3 size={22} />
            </div>
          </div>
          <div className="mt-3">
            <IPKBar value={totalSksLulus} max={144} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm">Semester Ditempuh</p>
              <p className="text-4xl font-bold text-white mt-1">6</p>
              <p className="text-slate-500 text-sm mt-1">Perkiraan lulus: 2026</p>
            </div>
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Award size={22} />
            </div>
          </div>
          <div className="mt-3 flex gap-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full ${i < 6 ? 'bg-violet-500' : 'bg-slate-800'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Per Semester */}
      <div className="space-y-3">
        {semesterData.map(sem => (
          <div key={sem.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {/* Semester Header */}
            <button
              onClick={() => toggle(sem.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">{sem.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{sem.mataKuliah.length} Mata Kuliah · {sem.totalSks} SKS</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-slate-400 text-xs">IP Semester</p>
                  <p className="text-white font-bold text-lg">{sem.ipk.toFixed(2)}</p>
                </div>
                {open[sem.id] ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
              </div>
            </button>

            {/* Tabel Nilai */}
            {open[sem.id] && (
              <div className="border-t border-slate-800 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/30">
                      <th className="text-left px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Kode</th>
                      <th className="text-left px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Mata Kuliah</th>
                      <th className="text-center px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">SKS</th>
                      <th className="text-center px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Nilai</th>
                      <th className="text-center px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Huruf</th>
                      <th className="text-center px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Bobot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {sem.mataKuliah.map(mk => (
                      <tr key={mk.kode} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{mk.kode}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-white text-sm font-medium">{mk.nama}</p>
                        </td>
                        <td className="px-5 py-3.5 text-center text-slate-300 text-sm">{mk.sks}</td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-white font-semibold text-sm">{mk.nilaiAngka}</span>
                            <div className="w-16 bg-slate-800 rounded-full h-1">
                              <div className="h-1 rounded-full bg-blue-500" style={{ width: `${mk.nilaiAngka}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${hurufColor[mk.nilaiHuruf] || 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                            {mk.nilaiHuruf}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center text-slate-300 text-sm font-medium">{mk.bobot.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-800/30 border-t border-slate-700">
                      <td colSpan={2} className="px-5 py-3 text-slate-400 text-sm font-semibold">Total</td>
                      <td className="px-5 py-3 text-center text-white font-bold text-sm">{sem.totalSks}</td>
                      <td colSpan={2} className="px-5 py-3" />
                      <td className="px-5 py-3 text-center text-white font-bold text-sm">IP: {sem.ipk.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
