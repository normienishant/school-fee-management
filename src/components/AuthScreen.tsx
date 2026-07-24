import React, { useState } from 'react';
import api from '../lib/api';
import { School, ShieldCheck, Mail, KeyRound, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthScreenProps {
  schoolName: string;
  onSessionLogin?: (email: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ schoolName, onSessionLogin }) => {
  const [email, setEmail] = useState('admin@school.edu');
  const [password, setPassword] = useState('Admin@123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, staff } = res.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('staff', JSON.stringify(staff));
        if (onSessionLogin) onSessionLogin(email);
      } else {
        setErrorMsg(res.data.error || 'Login failed');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (staffEmail: string) => {
    setEmail(staffEmail);
    setPassword('Admin@123');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: staffEmail, password: 'Admin@123' });
      if (res.data.success) {
        const { token, staff } = res.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('staff', JSON.stringify(staff));
        if (onSessionLogin) onSessionLogin(staffEmail);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 selection:bg-teal-500 selection:text-slate-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-xl shadow-teal-500/20 mb-2">
            <School className="w-7 h-7 font-black" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{schoolName}</h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
            Authorized Fee Collection & Financial Accounting Management System
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white">Staff Access Authentication</h2>
              <p className="text-[11px] text-slate-400">Sign in to access fee ledgers & issue receipts</p>
            </div>
            <span className="flex items-center space-x-1 text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AES-256</span>
            </span>
          </div>

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-2xl text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Staff Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="e.g. cashier@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Access Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-teal-500/20 cursor-pointer transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Portal Access...</span>
              ) : (
                <>
                  <span>Sign In to Ledger Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Quick Staff Profile Selection</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@school.edu')}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left cursor-pointer text-[11px] transition-colors"
              >
                <strong className="text-white block font-bold">School Admin</strong>
                <span className="text-[10px] text-slate-400">admin@school.edu</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('clerk@school.edu')}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left cursor-pointer text-[11px] transition-colors"
              >
                <strong className="text-white block font-bold">Accounts Clerk</strong>
                <span className="text-[10px] text-slate-400">clerk@school.edu</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Enterprise Security & Multi-Tenant Infrastructure</span>
          </div>
          <ul className="space-y-1.5 text-slate-300">
            <li className="flex items-start space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <span><strong>Bank-Grade Data Encryption:</strong> 256-bit TLS protocol protecting student ledgers, fee collections, and financial receipts.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <span><strong>Cloud Database Persistence:</strong> Automated cloud synchronization with instant multi-device record updates.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};