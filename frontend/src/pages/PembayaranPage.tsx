import { useState } from 'react';
import { CreditCard, CheckCircle, Clock, AlertCircle, Download, ChevronDown, ChevronUp } from 'lucide-react';

interface Tagihan {
  id: string;
  semester: string;
  tahunAkademik: string;
  nominal: number;
  batas: string;
  status: 'lunas' | 'menunggu' | 'terlambat';
  tanggalBayar?: string;
  metode?: string;
  noReferensi?: string;
}

interface Pembayaran {
  id: string;
  tanggal: string;
  keterangan: string;
  nominal: number;
  metode: string;
  noReferensi: string;
  status: 'berhasil' | 'gagal' | 'proses';
}

const tagihanData: Tagihan[] = [
  {
    id: '1', semester: 'Genap', tahunAkademik: '2024/2025',
    nominal: 4500000, batas: '28 Feb 2025', status: 'lunas',
    tanggalBayar: '15 Feb 2025', metode: 'Transfer Bank BNI', noReferensi: 'TXN2502150001',
  },
  {
    id: '2', semester: 'Ganjil', tahunAkademik: '2024/2025',
    nominal: 4500000, batas: '31 Agt 2024', status: 'lunas',
    tanggalBayar: '20 Agt 2024', metode: 'Virtual Account BRI', noReferensi: 'TXN2408200042',
  },
  {
    id: '3', semester: 'Genap', tahunAkademik: '2023/2024',
    nominal: 4200000, batas: '28 Feb 2024', status: 'lunas',
    tanggalBayar: '10 Feb 2024', metode: 'Transfer Bank Mandiri', noReferensi: 'TXN2402100078',
  },
];

const riwayatData: Pembayaran[] = [
  { id: '1', tanggal: '15 Feb 2025', keterangan: 'UKT Semester Genap 2024/2025', nominal: 4500000, metode: 'BNI Virtual Account', noReferensi: 'TXN2502150001', status: 'berhasil' },
  { id: '2', tanggal: '20 Agt 2024', keterangan: 'UKT Semester Ganjil 2024/2025', nominal: 4500000, metode: 'BRI Virtual Account', noReferensi: 'TXN2408200042', status: 'berhasil' },
  { id: '3', tanggal: '10 Feb 2024', keterangan: 'UKT Semester Genap 2023/2024', nominal: 4200000, metode: 'Bank Mandiri Transfer', noReferensi: 'TXN2402100078', status: 'berhasil' },
];

const statusTagihanCfg = {
  lunas: { label: 'Lunas', icon: <CheckCircle size={14} />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  menunggu: { label: 'Belum Bayar', icon: <Clock size={14} />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  terlambat: { label: 'Terlambat', icon: <AlertCircle size={14} />, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

const statusPembayaranCfg = {
  berhasil: { label: 'Berhasil', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  gagal: { label: 'Gagal', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  proses: { label: 'Diproses', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
};

const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function PembayaranPage() {
  const [expanded, setExpanded] = useState<string | null>('1');

  const totalBayar = tagihanData.filter(t => t.status === 'lunas').reduce((s, t) => s + t.nominal, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Pembayaran UKT</h2>
        <p className="text-slate-400 text-sm mt-1">Riwayat tagihan dan pembayaran uang kuliah tunggal</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm">Status Semester Ini</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">LUNAS</p>
              <p className="text-slate-500 text-xs mt-1">Semester Genap 2024/2025</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm">UKT Per Semester</p>
              <p className="text-2xl font-bold text-white mt-1">{formatRupiah(4500000)}</p>
              <p className="text-slate-500 text-xs mt-1">Golongan UKT III</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <CreditCard size={22} />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Dibayarkan</p>
              <p className="text-2xl font-bold text-white mt-1">{formatRupiah(totalBayar)}</p>
              <p className="text-slate-500 text-xs mt-1">{tagihanData.length} semester</p>
            </div>
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Tagihan List */}
      <div>
        <h3 className="text-white font-semibold mb-3">Riwayat Tagihan</h3>
        <div className="space-y-3">
          {tagihanData.map(t => {
            const cfg = statusTagihanCfg[t.status];
            const isOpen = expanded === t.id;
            return (
              <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : t.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <p className="text-white font-semibold text-sm">UKT Semester {t.semester} {t.tahunAkademik}</p>
                      <p className="text-slate-500 text-xs mt-0.5">Batas: {t.batas}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-white font-bold">{formatRupiah(t.nominal)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                      {cfg.icon}{cfg.label}
                    </span>
                    {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </button>

                {isOpen && t.status === 'lunas' && (
                  <div className="border-t border-slate-800 px-5 py-4 bg-slate-800/20">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Tanggal Bayar</p>
                        <p className="text-white font-medium">{t.tanggalBayar}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Metode Pembayaran</p>
                        <p className="text-white font-medium">{t.metode}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">No. Referensi</p>
                        <p className="text-white font-mono text-xs">{t.noReferensi}</p>
                      </div>
                    </div>
                    <button className="mt-4 flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      <Download size={13} /> Unduh Bukti Pembayaran
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Riwayat Pembayaran */}
      <div>
        <h3 className="text-white font-semibold mb-3">Transaksi Pembayaran</h3>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/30">
                  <th className="text-left px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Tanggal</th>
                  <th className="text-left px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Keterangan</th>
                  <th className="text-left px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Metode</th>
                  <th className="text-right px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Nominal</th>
                  <th className="text-center px-5 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {riwayatData.map(p => {
                  const cfg = statusPembayaranCfg[p.status];
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-3.5 text-slate-400 text-sm whitespace-nowrap">{p.tanggal}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-white text-sm">{p.keterangan}</p>
                        <p className="text-slate-500 text-xs font-mono">{p.noReferensi}</p>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-sm hidden sm:table-cell">{p.metode}</td>
                      <td className="px-5 py-3.5 text-right text-white font-semibold text-sm whitespace-nowrap">{formatRupiah(p.nominal)}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>{cfg.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
