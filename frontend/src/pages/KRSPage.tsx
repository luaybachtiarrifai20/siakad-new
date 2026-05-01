import { useState } from 'react';
import { BookOpen, Plus, Trash2, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react';

interface MataKuliah {
  id: string;
  kode: string;
  nama: string;
  sks: number;
  dosen: string;
  hari: string;
  jam: string;
  ruang: string;
  kuota: number;
  terisi: number;
}

interface KRS {
  id: string;
  kode: string;
  nama: string;
  sks: number;
  dosen: string;
  hari: string;
  jam: string;
  status: 'disetujui' | 'menunggu' | 'ditolak';
}

const mkTersedia: MataKuliah[] = [
  { id: '1', kode: 'IF301', nama: 'Algoritma & Struktur Data', sks: 3, dosen: 'Dr. Andi Wijaya', hari: 'Senin', jam: '08:00-10:30', ruang: 'Lab A1', kuota: 35, terisi: 28 },
  { id: '2', kode: 'IF302', nama: 'Basis Data Lanjut', sks: 3, dosen: 'Dr. Siti Rahayu', hari: 'Selasa', jam: '10:00-12:30', ruang: 'Ruang 301', kuota: 40, terisi: 38 },
  { id: '3', kode: 'IF303', nama: 'Rekayasa Perangkat Lunak', sks: 3, dosen: 'Prof. Budi Santoso', hari: 'Rabu', jam: '13:00-15:30', ruang: 'Ruang 202', kuota: 40, terisi: 22 },
  { id: '4', kode: 'IF304', nama: 'Jaringan Komputer', sks: 2, dosen: 'Dr. Cahyo Purnomo', hari: 'Kamis', jam: '08:00-09:40', ruang: 'Lab B2', kuota: 30, terisi: 15 },
  { id: '5', kode: 'IF305', nama: 'Kecerdasan Buatan', sks: 3, dosen: 'Dr. Maya Indah', hari: "Jum'at", jam: '09:00-11:30', ruang: 'Ruang 401', kuota: 35, terisi: 30 },
  { id: '6', kode: 'MK201', nama: 'Statistik Inferensia', sks: 2, dosen: 'Dr. Rudi Hermawan', hari: "Jum'at", jam: '13:00-14:40', ruang: 'Ruang 103', kuota: 40, terisi: 40 },
];

const krsAwal: KRS[] = [
  { id: '1', kode: 'IF301', nama: 'Algoritma & Struktur Data', sks: 3, dosen: 'Dr. Andi Wijaya', hari: 'Senin', jam: '08:00-10:30', status: 'disetujui' },
  { id: '3', kode: 'IF303', nama: 'Rekayasa Perangkat Lunak', sks: 3, dosen: 'Prof. Budi Santoso', hari: 'Rabu', jam: '13:00-15:30', status: 'menunggu' },
];

const statusConfig = {
  disetujui: { label: 'Disetujui', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle size={13} /> },
  menunggu: { label: 'Menunggu', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: <Clock size={13} /> },
  ditolak: { label: 'Ditolak', color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: <AlertCircle size={13} /> },
};

const MAX_SKS = 24;

export default function KRSPage() {
  const [krs, setKrs] = useState<KRS[]>(krsAwal);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'krs' | 'katalog'>('krs');

  const totalSks = krs.reduce((s, k) => s + k.sks, 0);

  const handleTambah = (mk: MataKuliah) => {
    if (krs.find(k => k.id === mk.id)) return;
    if (totalSks + mk.sks > MAX_SKS) return alert(`Maksimum SKS (${MAX_SKS}) terlampaui!`);
    if (mk.terisi >= mk.kuota) return alert('Kuota kelas sudah penuh!');
    const newEntry: KRS = { id: mk.id, kode: mk.kode, nama: mk.nama, sks: mk.sks, dosen: mk.dosen, hari: mk.hari, jam: mk.jam, status: 'menunggu' };
    setKrs(prev => [...prev, newEntry]);
  };

  const handleHapus = (id: string) => setKrs(prev => prev.filter(k => k.id !== id));

  const filtered = mkTersedia.filter(mk =>
    mk.nama.toLowerCase().includes(search.toLowerCase()) ||
    mk.kode.toLowerCase().includes(search.toLowerCase()) ||
    mk.dosen.toLowerCase().includes(search.toLowerCase())
  );

  const sksPercent = Math.min((totalSks / MAX_SKS) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Kartu Rencana Studi (KRS)</h2>
        <p className="text-slate-400 text-sm mt-1">Semester Genap — Tahun Akademik 2024/2025</p>
      </div>

      {/* SKS Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-slate-400 text-sm">Total SKS Diambil</p>
            <p className="text-3xl font-bold text-white">{totalSks} <span className="text-base font-normal text-slate-500">/ {MAX_SKS} SKS</span></p>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
            totalSks >= MAX_SKS ? 'bg-red-500/10 text-red-400 border-red-500/20' :
            totalSks >= 18 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {krs.length} Mata Kuliah
          </div>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${totalSks >= MAX_SKS ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${sksPercent}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900/60 border border-slate-800 p-1 rounded-xl w-fit">
        {[{ key: 'krs', label: 'KRS Saya' }, { key: 'katalog', label: 'Katalog Mata Kuliah' }].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'krs' | 'katalog')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'krs' ? (
        /* KRS Table */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/40">
                  <th className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Kode</th>
                  <th className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Mata Kuliah</th>
                  <th className="text-center px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">SKS</th>
                  <th className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Jadwal</th>
                  <th className="text-center px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="text-center px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {krs.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-500">Belum ada mata kuliah yang diambil</td></tr>
                )}
                {krs.map(mk => {
                  const s = statusConfig[mk.status];
                  return (
                    <tr key={mk.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded">{mk.kode}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-white font-medium text-sm">{mk.nama}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{mk.dosen}</p>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-white font-bold">{mk.sks}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <p className="text-slate-300 text-sm">{mk.hari}</p>
                        <p className="text-slate-500 text-xs">{mk.jam}</p>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.color}`}>
                          {s.icon}{s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleHapus(mk.id)}
                          disabled={mk.status === 'disetujui'}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Hapus dari KRS"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Katalog */
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari mata kuliah atau dosen..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(mk => {
              const sudahDiambil = krs.some(k => k.id === mk.id);
              const penuh = mk.terisi >= mk.kuota;
              const sksOverflow = totalSks + mk.sks > MAX_SKS;
              const persen = Math.min((mk.terisi / mk.kuota) * 100, 100);
              return (
                <div key={mk.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{mk.kode}</span>
                      <h4 className="text-white font-semibold text-sm mt-2 leading-tight">{mk.nama}</h4>
                      <p className="text-slate-500 text-xs mt-1">{mk.dosen}</p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-white font-bold text-lg">{mk.sks}</p>
                      <p className="text-slate-500 text-xs">SKS</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <span>{mk.hari}, {mk.jam}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span>{mk.ruang}</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Kuota</span>
                      <span className={penuh ? 'text-red-400' : 'text-slate-400'}>{mk.terisi}/{mk.kuota}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${persen >= 100 ? 'bg-red-500' : persen >= 80 ? 'bg-amber-500' : 'bg-blue-500'}`}
                        style={{ width: `${persen}%` }}
                      />
                    </div>
                  </div>
                  <button
                    disabled={sudahDiambil || penuh || sksOverflow}
                    onClick={() => handleTambah(mk)}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                      sudahDiambil ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 cursor-default' :
                      (penuh || sksOverflow) ? 'opacity-50 cursor-not-allowed text-slate-500 border-slate-700' :
                      'bg-blue-600 text-white border-blue-600 hover:bg-blue-500'
                    }`}
                  >
                    {sudahDiambil ? (<><CheckCircle size={13} /> Ditambahkan</>) :
                     penuh ? 'Kuota Penuh' : sksOverflow ? 'SKS Melebihi Batas' :
                     (<><Plus size={13} /> Tambah KRS</>)}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
