import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  User, 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  LogIn
} from 'lucide-react';
import { authService } from '../api/authService';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess 
}) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isLoginTab) {
      // Login Flow
      if (!username.trim() || !password) {
        setError('Please enter both username and password.');
        return;
      }

      setIsSubmitting(true);
      try {
        const data = await authService.login({ username: username.trim(), password });
        onLoginSuccess(data);
        onClose();
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data || err.message || 'Login failed.';
        setError(typeof msg === 'string' ? msg : 'Invalid credentials.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Registration Flow
      if (!username.trim() || !email.trim() || !password) {
        setError('All fields are required.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      setIsSubmitting(true);
      try {
        await authService.register({
          username: username.trim(),
          email: email.trim(),
          password
        });
        setSuccessMsg('Account created successfully! Please sign in.');
        setIsLoginTab(true);
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data || err.message || 'Registration failed.';
        setError(typeof msg === 'string' ? msg : 'Registration failed.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Quick fill sample credentials for viva demo
  const handleDemoFill = () => {
    setUsername('admin_anshika');
    setPassword('admin@123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">SRE Identity & Access</h3>
              <p className="text-[11px] text-slate-500">Spring Security 6.x & JWT Authentication</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => { setIsLoginTab(true); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition ${
              isLoginTab
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginTab(false); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition ${
              !isLoginTab
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. anshika_sre"
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Email (Only on Register) */}
          {!isLoginTab && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anshika@company.com"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Confirm Password (Only on Register) */}
          {!isLoginTab && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Authenticating...' : isLoginTab ? 'Sign In' : 'Register Account'}</span>
          </button>

          {/* Quick Demo Credentials Autofill */}
          {isLoginTab && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 transition"
              >
                <span>Autofill Sample Demo Credentials</span>
              </button>
            </div>
          )}

        </form>

      </div>
    </div>
  );
}
