import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/dashboard/users': 'Manajemen User',
  '/dashboard/mahasiswa': 'Data Mahasiswa',
  '/dashboard/dosen': 'Data Dosen',
  '/dashboard/matkul': 'Mata Kuliah',
  '/dashboard/kelas': 'Kelas Saya',
  '/dashboard/jadwal': 'Jadwal',
  '/dashboard/krs': 'KRS',
  '/dashboard/nilai': 'Nilai',
  '/dashboard/presensi': 'Presensi',
  '/dashboard/pembayaran': 'Pembayaran',
  '/dashboard/ukt': 'Tagihan UKT',
  '/dashboard/laporan': 'Laporan',
  '/dashboard/prodi': 'Data Program Studi',
  '/dashboard/fakultas': 'Data Fakultas',
  '/dashboard/settings': 'Pengaturan',
};

export default function ComingSoon() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'Halaman';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
        <Construction size={28} className="text-amber-400" />
      </div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="text-slate-400 mt-2 max-w-md text-sm">
        Modul ini sedang dalam pengembangan dan akan segera tersedia. 
        Silakan hubungi administrator untuk informasi lebih lanjut.
      </p>
    </div>
  );
}
