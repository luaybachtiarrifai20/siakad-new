import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, role } = useAuth();
  const email = user?.email || 'pengguna@kampus.ac.id';
  const initials = email ? email.substring(0, 2).toUpperCase() : 'US';

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 flex items-center px-4 md:px-6 gap-3 sticky top-0 z-10">
      {/* Hamburger (mobile only) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xs sm:max-w-md">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Cari sesuatu..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700/50">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block max-w-[140px]">
            <p className="text-white text-xs font-medium leading-tight truncate">{email}</p>
            <p className="text-slate-500 text-[10px] truncate">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
