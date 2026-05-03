import { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Edit2, Trash2, 
  UserCheck, Mail, Shield, ShieldCheck, 
  Loader2, AlertCircle, CheckCircle, X
} from 'lucide-react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  ADMIN: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  DOSEN: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  MAHASISWA: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  KAPRODI: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  DEKAN: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
};

const roles = [
  'SUPER_ADMIN', 'ADMIN', 'DOSEN', 'MAHASISWA', 'KAPRODI', 'DEKAN', 'KEUANGAN'
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'MAHASISWA'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('siakad_token');
      const res = await axios.get(`${apiUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err: any) {
      setError('Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('siakad_token');
      if (editingUser) {
        await axios.put(`${apiUrl}/users/${editingUser.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('User berhasil diperbarui');
      } else {
        await axios.post(`${apiUrl}/users`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('User berhasil ditambahkan');
      }
      
      setShowModal(false);
      setFormData({ email: '', password: '', role: 'MAHASISWA' });
      setEditingUser(null);
      fetchUsers();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
    
    try {
      const token = localStorage.getItem('siakad_token');
      await axios.delete(`${apiUrl}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('User berhasil dihapus');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Gagal menghapus user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Manajemen User</h2>
          <p className="text-slate-400 text-sm mt-1">Kelola akses dan akun seluruh civitas akademika</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setFormData({ email: '', password: '', role: 'MAHASISWA' });
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} />
          Tambah User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <Users size={18} />
            <span className="text-sm">Total User</span>
          </div>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-2 text-purple-400">
            <ShieldCheck size={18} />
            <span className="text-sm">Super Admin</span>
          </div>
          <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'SUPER_ADMIN').length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-2 text-emerald-400">
            <UserCheck size={18} />
            <span className="text-sm">Role Aktif</span>
          </div>
          <p className="text-2xl font-bold text-white">{new Set(users.map(u => u.role)).size}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-800/20">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari email atau role..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          {success && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm animate-fade-in">
              <CheckCircle size={16} />
              {success}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-800/40">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 hidden md:table-cell">Dibuat Pada</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 size={24} className="text-blue-500 animate-spin mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">Memuat data user...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-sm">
                    Tidak ada user ditemukan
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                          <Mail size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.email}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${roleColors[user.role] || 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-xs text-slate-400">{new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingUser(user);
                            setFormData({ email: user.email, password: '', role: user.role });
                            setShowModal(true);
                          }}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{editingUser ? 'Edit User' : 'Tambah User Baru'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Email Kampus</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="email@siakad.ac.id"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Password {editingUser && '(Kosongkan jika tidak ingin diubah)'}</label>
                <div className="relative">
                  <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Role User</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({...formData, role: r})}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                        formData.role === r 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : editingUser ? 'Simpan Perubahan' : 'Buat Akun User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
