import { useAuth } from '../context/AuthContext';
import {
  Users, BookOpen, GraduationCap, CreditCard,
  TrendingUp, Calendar, ClipboardList, AlertCircle,
} from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
}

const statsByRole: Record<string, StatCard[]> = {
  SUPER_ADMIN: [
    { label: 'Total Pengguna', value: '1.234', sub: '+12 bulan ini', icon: <Users size={22} />, color: 'blue' },
    { label: 'Total Mahasiswa', value: '986', sub: 'Aktif semester ini', icon: <GraduationCap size={22} />, color: 'emerald' },
    { label: 'Total Dosen', value: '84', sub: 'Aktif mengajar', icon: <BookOpen size={22} />, color: 'violet' },
    { label: 'Total Prodi', value: '12', sub: '3 Fakultas', icon: <ClipboardList size={22} />, color: 'amber' },
  ],
  ADMIN: [
    { label: 'Mahasiswa Aktif', value: '986', sub: 'Semester Genap 2024/2025', icon: <GraduationCap size={22} />, color: 'blue' },
    { label: 'Pengajuan KRS', value: '342', sub: '88 belum disetujui', icon: <ClipboardList size={22} />, color: 'amber' },
    { label: 'Mata Kuliah', value: '124', sub: 'Tersedia semester ini', icon: <BookOpen size={22} />, color: 'emerald' },
    { label: 'Jadwal Konflik', value: '3', sub: 'Perlu penanganan', icon: <AlertCircle size={22} />, color: 'red' },
  ],
  DOSEN: [
    { label: 'Kelas Aktif', value: '4', sub: 'Semester ini', icon: <BookOpen size={22} />, color: 'blue' },
    { label: 'Total Mahasiswa', value: '148', sub: 'Dari semua kelas', icon: <Users size={22} />, color: 'emerald' },
    { label: 'Nilai Belum Diisi', value: '32', sub: 'Dari 3 mata kuliah', icon: <ClipboardList size={22} />, color: 'amber' },
    { label: 'Pertemuan Minggu Ini', value: '6', sub: 'Jadwal aktif', icon: <Calendar size={22} />, color: 'violet' },
  ],
  MAHASISWA: [
    { label: 'SKS Diambil', value: '22', sub: 'Semester ini', icon: <BookOpen size={22} />, color: 'blue' },
    { label: 'IPK', value: '3.72', sub: 'Kumulatif', icon: <TrendingUp size={22} />, color: 'emerald' },
    { label: 'Kehadiran', value: '92%', sub: 'Rata-rata semua MK', icon: <Calendar size={22} />, color: 'violet' },
    { label: 'Tagihan UKT', value: 'Lunas', sub: 'Semester Genap 2025', icon: <CreditCard size={22} />, color: 'amber' },
  ],
  KAPRODI: [
    { label: 'Total Mahasiswa', value: '312', sub: 'Aktif di prodi', icon: <GraduationCap size={22} />, color: 'blue' },
    { label: 'Dosen Aktif', value: '24', sub: 'Di program studi', icon: <Users size={22} />, color: 'emerald' },
    { label: 'Rata-rata IPK', value: '3.41', sub: 'Seluruh mahasiswa', icon: <TrendingUp size={22} />, color: 'violet' },
    { label: 'MK Berjalan', value: '36', sub: 'Semester ini', icon: <BookOpen size={22} />, color: 'amber' },
  ],
  DEKAN: [
    { label: 'Total Mahasiswa', value: '1.240', sub: 'Seluruh prodi di fakultas', icon: <GraduationCap size={22} />, color: 'blue' },
    { label: 'Total Dosen', value: '64', sub: 'Aktif di fakultas', icon: <Users size={22} />, color: 'emerald' },
    { label: 'Program Studi', value: '6', sub: 'Di bawah fakultas', icon: <BookOpen size={22} />, color: 'violet' },
    { label: 'Rata-rata IPK', value: '3.38', sub: 'Seluruh fakultas', icon: <TrendingUp size={22} />, color: 'amber' },
  ],
  KEUANGAN: [
    { label: 'Total Tagihan', value: 'Rp 4,8M', sub: 'Semester ini', icon: <CreditCard size={22} />, color: 'blue' },
    { label: 'Sudah Lunas', value: '742', sub: 'Mahasiswa', icon: <TrendingUp size={22} />, color: 'emerald' },
    { label: 'Belum Bayar', value: '244', sub: 'Perlu tindak lanjut', icon: <AlertCircle size={22} />, color: 'red' },
    { label: 'Pendapatan Bulan Ini', value: 'Rp 820Jt', sub: '+12% dari bulan lalu', icon: <TrendingUp size={22} />, color: 'amber' },
  ],
};

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const welcomeByRole: Record<string, string> = {
  SUPER_ADMIN: 'Selamat datang, Super Administrator! Pantau dan kelola semua aspek sistem universitas.',
  ADMIN: 'Selamat datang, Admin Akademik! Kelola data akademik mahasiswa dan dosen di sini.',
  DOSEN: 'Selamat datang! Anda dapat mengelola kelas, presensi, dan nilai mahasiswa melalui menu di samping.',
  MAHASISWA: 'Selamat datang! Pantau KRS, nilai, jadwal, dan status pembayaran UKT Anda di sini.',
  KAPRODI: 'Selamat datang, Kaprodi! Monitoring seluruh aktivitas akademik program studi Anda.',
  DEKAN: 'Selamat datang! Pantau kinerja akademik dan statistik seluruh fakultas Anda.',
  KEUANGAN: 'Selamat datang! Kelola tagihan UKT, riwayat pembayaran, dan laporan keuangan kampus.',
};

export default function DashboardHome() {
  const { role } = useAuth();
  const currentRole = role || 'MAHASISWA';
  const stats = statsByRole[currentRole] || statsByRole['MAHASISWA'];
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-slate-500 text-sm">{dateStr}</p>
        <h2 className="text-2xl font-bold text-white mt-1">Dashboard</h2>
        <p className="text-slate-400 text-sm mt-1">{welcomeByRole[currentRole]}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-slate-500 text-xs mt-1">{stat.sub}</p>
              </div>
              <div className={`p-2.5 rounded-xl border ${colorMap[stat.color]}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Announcements */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Pengumuman Terbaru</h3>
          <div className="space-y-3">
            {[
              { title: 'Jadwal UTS Semester Genap 2024/2025', time: '2 jam lalu', tag: 'Akademik' },
              { title: 'Batas akhir pengisian KRS: 10 Mei 2025', time: '1 hari lalu', tag: 'KRS' },
              { title: 'Pengumuman Beasiswa Bidikmisi Tahap 2', time: '3 hari lalu', tag: 'Beasiswa' },
              { title: 'Libur Nasional — Hari Raya Waisak 13 Mei 2025', time: '5 hari lalu', tag: 'Kalender' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-500 text-xs">{item.time}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] border border-slate-700">{item.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Jadwal Minggu Ini</h3>
          <div className="space-y-3">
            {[
              { day: 'Senin', subject: 'Algoritma & Pemrograman', time: '08:00 - 10:00' },
              { day: 'Selasa', subject: 'Basis Data Lanjut', time: '10:00 - 12:00' },
              { day: 'Rabu', subject: 'Rekayasa Perangkat Lunak', time: '13:00 - 15:00' },
              { day: "Jum'at", subject: 'Statistik Inferensia', time: '09:00 - 11:00' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-slate-800/50">
                <div className="text-center min-w-[44px]">
                  <p className="text-blue-400 text-xs font-bold">{item.day.slice(0, 3).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-white text-sm font-medium leading-tight">{item.subject}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
