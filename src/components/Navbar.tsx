import React from 'react';
import { Award, PlusCircle, LayoutDashboard, Settings, Database, LogOut, UserCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'new' | 'dashboard' | 'settings';
  setActiveTab: (tab: 'new' | 'dashboard' | 'settings') => void;
  schoolName: string;
  totalCertificates: number;
  currentUser?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  schoolName,
  totalCertificates,
  currentUser = 'hajijunejo',
  onLogout,
}) => {
  return (
    <header className="bg-[#0F172A] text-slate-300 border-b border-slate-800 sticky top-0 z-40 print:hidden shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold shadow-xs shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                CertGen <span className="text-blue-400">Pro</span>
              </h1>
              <span className="hidden md:inline-block text-slate-500 text-xs">|</span>
              <p className="hidden md:block text-xs text-slate-400 font-medium truncate max-w-xs">
                {schoolName || 'Government High School'}
              </p>
              <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-400/20 text-blue-400 text-[10px] font-bold rounded uppercase tracking-wider hidden sm:inline-block">
                Govt Format
              </span>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2.5">
            {/* Database indicator */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded border border-slate-700/50">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{totalCertificates} Records Saved</span>
            </div>

            <nav className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('new')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'new'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Certificate</span>
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            </nav>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/90 px-2.5 py-1 rounded font-mono border border-slate-700/60">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-bold text-white text-[11px]">{currentUser}</span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Logout Admin Session"
                  className="px-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded text-xs font-semibold flex items-center gap-1 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

