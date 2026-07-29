import React, { useState } from 'react';
import { Lock, User, KeyRound, LogIn, AlertCircle, ShieldCheck, Award } from 'lucide-react';
import { SchoolSettings } from '../types';

interface LoginFormProps {
  settings: SchoolSettings;
  onLoginSuccess: (username: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ settings, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check saved custom credentials or default credentials
  const getAuthorizedUsers = () => {
    try {
      const saved = localStorage.getItem('cert_app_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      // fallback
    }
    const legacyUser = localStorage.getItem('cert_admin_username') || '@gbhsshajijunejo';
    const legacyPass = localStorage.getItem('cert_admin_password') || 'ADMIN';
    return [
      { id: 'default-admin', username: legacyUser, password: legacyPass, role: 'Admin' }
    ];
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const inputUser = username.trim();
      const inputPass = password.trim();

      if (!inputUser || !inputPass) {
        setError('Please enter both username and password.');
        setIsSubmitting(false);
        return;
      }

      const users = getAuthorizedUsers();
      const matchedUser = users.find(
        (u: any) =>
          u.username.toLowerCase() === inputUser.toLowerCase() &&
          u.password === inputPass
      );

      // Also fallback match default @gbhsshajijunejo / ADMIN if list was wiped
      const isDefaultMatch =
        (inputUser.toLowerCase() === '@gbhsshajijunejo' || inputUser.toLowerCase() === 'gbhsshajijunejo') &&
        inputPass === 'ADMIN';

      if (matchedUser || isDefaultMatch) {
        onLoginSuccess(matchedUser ? matchedUser.username : '@gbhsshajijunejo');
      } else {
        setError('Invalid username or password. Please check your credentials.');
        setIsSubmitting(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top Header Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-600/20 border border-blue-400/30 mb-3">
            <Award className="w-9 h-9" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            GBHSS HAJI JUNEJO (CAMPUS), DISTRICT BADIN
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Certificate Generator & Admin Portal
          </p>
          <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[11px] font-semibold rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Admin Access</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <LogIn className="w-5 h-5 text-blue-400" />
            System Authentication
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Enter authorized administrator credentials to manage and issue school certificates.
          </p>

          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2.5 text-red-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder=""
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white transition"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg shadow-md transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Login to Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-6">
          Authorized Access Only &bull; Sindh Government Education Department Format
        </p>
      </div>
    </div>
  );
};
