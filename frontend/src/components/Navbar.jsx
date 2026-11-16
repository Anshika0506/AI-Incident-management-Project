import React from 'react';
import { 
  Shield, 
  Activity, 
  RefreshCw, 
  Plus, 
  Server, 
  User,
  LogIn,
  LogOut,
  Zap,
  LayoutDashboard,
  Terminal,
  AlertCircle
} from 'lucide-react';

export default function Navbar({ 
  currentPage = 'dashboard',
  onNavigate,
  backendOnline, 
  onRefresh, 
  isRefreshing, 
  onOpenCreateModal,
  incidentsCount = 0,
  criticalCount = 0,
  onSeedDemoData,
  onOpenSimulateModal,
  currentUser,
  onOpenAuthModal,
  onLogout
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-2.5 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-sm cursor-pointer hover:bg-indigo-700 transition"
          >
            <Shield className="w-4 h-4" />
          </div>

          <div 
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="cursor-pointer select-none"
          >
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-1">
                IncidentOps <span className="text-indigo-600 font-semibold">AI</span>
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                SRE Platform
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Reliability & Incident Intelligence
            </p>
          </div>
        </div>

        {/* 🚀 PRIMARY 3-PAGE NAVIGATION BAR */}
        <nav className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200">
          
          {/* Page 1: Dashboard */}
          <button
            onClick={() => onNavigate && onNavigate('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentPage === 'dashboard'
                ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          {/* Page 2: Incidents Workspace */}
          <button
            onClick={() => onNavigate && onNavigate('incidents')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentPage === 'incidents'
                ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Incidents</span>
            {criticalCount > 0 ? (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                {criticalCount} P1
              </span>
            ) : incidentsCount > 0 ? (
              <span className="ml-0.5 text-[10px] text-slate-500">
                ({incidentsCount})
              </span>
            ) : null}
          </button>

          {/* Page 3: Telemetry Stream & Ingestion */}
          <button
            onClick={() => onNavigate && onNavigate('telemetry')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentPage === 'telemetry'
                ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Logs & Telemetry</span>
          </button>

        </nav>

        {/* Right Action Tools & User Auth */}
        <div className="flex items-center gap-2">
          
          {/* Backend Status indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-mono">
            <span className="text-slate-500">API:</span>
            {backendOnline ? (
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                8080 Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Demo Mode
              </span>
            )}
          </div>

          {/* Simulate Outage Button */}
          <button
            onClick={onOpenSimulateModal}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium transition active:scale-95"
            title="Launch Chaos Outage Simulator"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Simulate Outage</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition active:scale-95"
            title="Refresh data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          {/* User Auth Section */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-semibold">{currentUser.username}</span>
                <span className="text-[10px] text-slate-500 font-mono">({currentUser.roles?.[0] || 'SRE'})</span>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-md bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
