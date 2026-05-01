import { useState } from 'react';
import { Mail, Lock, KeyRound, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'credentials' | 'verify'>('credentials');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const normalizedEmail = email.toLowerCase().trim();
      await axios.post('http://localhost:8000/auth/request-otp', { email: normalizedEmail, password });
      setStep('verify');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal mengirim OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const res = await axios.post('http://localhost:8000/auth/verify-otp', { email: normalizedEmail, otp });
      localStorage.setItem('siakad_token', res.data.customToken);
      localStorage.setItem('siakad_role', res.data.role);

      if (res.data.customToken !== 'mock_custom_token_bypass') {
        await signInWithCustomToken(auth, res.data.customToken);
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'OTP tidak valid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 mb-5 shadow-lg shadow-blue-500/30">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">SIAKAD Panel</h1>
          <p className="text-slate-400 mt-2 text-sm">
            {step === 'credentials' ? 'Masuk ke portal akademik universitas' : `Kode OTP dikirim ke ${email}`}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`flex-1 h-1 rounded-full transition-all ${step === 'credentials' ? 'bg-blue-500' : 'bg-blue-500'}`} />
          <div className={`flex-1 h-1 rounded-full transition-all ${step === 'verify' ? 'bg-blue-500' : 'bg-slate-700'}`} />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleRequestOTP} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Email Kampus</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none text-sm"
                  placeholder="email@kampus.ac.id"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-11 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>Kirim Kode OTP <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Kode OTP</label>
              <p className="text-xs text-slate-500">Masukkan 6 digit kode yang dikirim ke email Anda</p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-center tracking-[0.5em] text-lg placeholder-slate-500 transition-all outline-none"
                  placeholder="••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verifikasi & Masuk'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('credentials'); setOtp(''); setError(''); }}
              className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              ← Kembali
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
