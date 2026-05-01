import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, BookOpen, ClipboardList, Calendar,
  GraduationCap, CreditCard, BarChart3, Settings, LogOut,
  BookMarked, FileText, School, ChevronRight, X,
} from 'lucide-react';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const menusByRole: Record<string, MenuItem[]> = {
  SUPER_ADMIN: [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Manajemen User', path: '/dashboard/users', icon: <Users size={18} /> },
    { label: 'Fakultas & Prodi', path: '/dashboard/fakultas', icon: <School size={18} /> },
    { label: 'Mata Kuliah', path: '/dashboard/matkul', icon: <BookOpen size={18} /> },
    { label: 'Laporan Sistem', path: '/dashboard/laporan', icon: <BarChart3 size={18} /> },
    { label: 'Pengaturan', path: '/dashboard/settings', icon: <Settings size={18} /> },
  ],
  ADMIN: [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Data Mahasiswa', path: '/dashboard/mahasiswa', icon: <GraduationCap size={18} /> },
    { label: 'Data Dosen', path: '/dashboard/dosen', icon: <Users size={18} /> },
    { label: 'Mata Kuliah', path: '/dashboard/matkul', icon: <BookOpen size={18} /> },
    { label: 'Jadwal Kelas', path: '/dashboard/jadwal', icon: <Calendar size={18} /> },
    { label: 'KRS Mahasiswa', path: '/dashboard/krs', icon: <ClipboardList size={18} /> },
  ],
  DOSEN: [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Kelas Saya', path: '/dashboard/kelas', icon: <BookMarked size={18} /> },
    { label: 'Input Nilai', path: '/dashboard/nilai', icon: <FileText size={18} /> },
    { label: 'Presensi', path: '/dashboard/presensi', icon: <ClipboardList size={18} /> },
    { label: 'Jadwal Mengajar', path: '/dashboard/jadwal', icon: <Calendar size={18} /> },
  ],
  MAHASISWA: [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'KRS', path: '/dashboard/krs', icon: <ClipboardList size={18} /> },
    { label: 'Nilai', path: '/dashboard/nilai', icon: <GraduationCap size={18} /> },
    { label: 'Jadwal', path: '/dashboard/jadwal', icon: <Calendar size={18} /> },
    { label: 'Presensi', path: '/dashboard/presensi', icon: <BookMarked size={18} /> },
    { label: 'Pembayaran', path: '/dashboard/pembayaran', icon: <CreditCard size={18} /> },
  ],
  KAPRODI: [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Monitoring Prodi', path: '/dashboard/prodi', icon: <BarChart3 size={18} /> },
    { label: 'Data Mahasiswa', path: '/dashboard/mahasiswa', icon: <GraduationCap size={18} /> },
    { label: 'Data Dosen', path: '/dashboard/dosen', icon: <Users size={18} /> },
    { label: 'Kurikulum', path: '/dashboard/matkul', icon: <BookOpen size={18} /> },
  ],
  DEKAN: [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Monitoring Fakultas', path: '/dashboard/fakultas', icon: <School size={18} /> },
    { label: 'Statistik Akademik', path: '/dashboard/laporan', icon: <BarChart3 size={18} /> },
    { label: 'Data Prodi', path: '/dashboard/prodi', icon: <BookOpen size={18} /> },
  ],
  KEUANGAN: [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Tagihan UKT', path: '/dashboard/ukt', icon: <CreditCard size={18} /> },
    { label: 'Riwayat Pembayaran', path: '/dashboard/pembayaran', icon: <FileText size={18} /> },
    { label: 'Laporan Keuangan', path: '/dashboard/laporan', icon: <BarChart3 size={18} /> },
  ],
};

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: 'Super Administrator',
  ADMIN: 'Admin Akademik',
  DOSEN: 'Dosen',
  MAHASISWA: 'Mahasiswa',
  KAPRODI: 'Kepala Program Studi',
  DEKAN: 'Dekan / Rektor',
  KEUANGAN: 'Bagian Keuangan',
};

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const currentRole = role || 'MAHASISWA';
  const menus = menusByRole[currentRole] || menusByRole['MAHASISWA'];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo + Close button */}
      <div className="px-4 py-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">SIAKAD</h1>
            <p className="text-slate-500 text-xs">Sistem Akademik</p>
          </div>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Role Badge */}
      <div className="px-4 py-3 mx-3 mt-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider truncate">{roleLabel[currentRole]}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menus.map((item) => (
          <NavLink
            key={item.path + item.label}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </div>
  );
}
