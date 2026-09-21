import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const { setCurrentUser, setCurrentRole } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const user = {
      id: 'usr-' + Date.now(),
      fullName: fullName || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
      email,
      phone: phone || '(617) 555-0100',
      role: 'tenant' as const,
      createdAt: new Date().toISOString()
    };

    setCurrentUser(user);
    setCurrentRole('tenant');
    setSuccessMsg(mode === 'signup' ? 'Account created successfully! Welcome to ApartmentListing.' : 'Signed in successfully!');

    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1000);
  };

  const handleQuickLogin = (role: 'admin' | 'tenant') => {
    if (role === 'admin') {
      setCurrentUser({
        id: 'admin-landlord',
        fullName: 'David Sterling (Landlord Admin)',
        email: 'landlord@bostonapartmentlisting.com',
        phone: '(617) 555-0198',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00Z'
      });
      setCurrentRole('admin');
    } else {
      setCurrentUser({
        id: 'tenant-elena',
        fullName: 'Elena Rostova',
        email: 'elena.rostova@biogen.com',
        phone: '(617) 482-9912',
        role: 'tenant',
        createdAt: '2026-09-01T12:00:00Z'
      });
      setCurrentRole('tenant');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-5">
            <Logo size="md" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {mode === 'signin' ? 'Sign in to ApartmentListing' : 'Create your Tenant Account'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {mode === 'signin'
                ? 'Track your inquiries, rental applications, leases & payments'
                : 'Free Avail-powered rental portal for Boston home seekers'}
            </p>
          </div>

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="(617) 555-0199"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#0066FF] hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-150 text-sm mt-2"
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account & Continue'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-600">
            {mode === 'signin' ? (
              <span>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-[#0066FF] font-semibold hover:underline"
                >
                  Create one here
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-[#0066FF] font-semibold hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
                Quick Demo Access
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition-colors group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 group-hover:text-amber-800">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Landlord Admin</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">1-Landlord account</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('tenant')}
              className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-colors group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 group-hover:text-blue-800">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Sample Tenant</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Elena Rostova</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
