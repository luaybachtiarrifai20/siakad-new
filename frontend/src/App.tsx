import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import ComingSoon from './pages/ComingSoon';
import UserManagement from './pages/UserManagement';
import KRSPage from './pages/KRSPage';
import NilaiPage from './pages/NilaiPage';
import JadwalPage from './pages/JadwalPage';
import PresensiPage from './pages/PresensiPage';
import PembayaranPage from './pages/PembayaranPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard (layout wraps all sub-routes) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="mahasiswa" element={<ComingSoon />} />
          <Route path="dosen" element={<ComingSoon />} />
          <Route path="matkul" element={<ComingSoon />} />
          <Route path="kelas" element={<ComingSoon />} />
          <Route path="jadwal" element={<JadwalPage />} />
          <Route path="krs" element={<KRSPage />} />
          <Route path="nilai" element={<NilaiPage />} />
          <Route path="presensi" element={<PresensiPage />} />
          <Route path="pembayaran" element={<PembayaranPage />} />
          <Route path="ukt" element={<ComingSoon />} />
          <Route path="laporan" element={<ComingSoon />} />
          <Route path="prodi" element={<ComingSoon />} />
          <Route path="fakultas" element={<ComingSoon />} />
          <Route path="settings" element={<ComingSoon />} />
        </Route>

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
