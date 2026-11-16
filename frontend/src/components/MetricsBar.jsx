import React from 'react';
import { 
  AlertOctagon, 
  Activity, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Flame,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';

export default function MetricsBar({ incidents = [], activeFilter = 'ALL', onSelectFilter }) {
  const total = incidents.length;
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;
  const openCount = incidents.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length;
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
  const aiAnalyzedCount = incidents.filter(i => i.rootCause || i.confidenceScore).length;
  const aiRate = total > 0 ? Math.round((aiAnalyzedCount / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      
      {/* Metric 1: Total Incidents */}
      <div 
        onClick={() => onSelectFilter && onSelectFilter('ALL')}
        className={`bg-white border rounded-xl p-4 shadow-sm cursor-pointer transition ${
          activeFilter === 'ALL' ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Incidents</p>
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{total}</p>
          <span className="text-xs text-slate-500">recorded</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> {resolvedCount} resolved
          </span>
          <span className="text-slate-500">{openCount} active</span>
        </div>
      </div>

      {/* Metric 2: Active Critical Outages */}
      <div 
        onClick={() => onSelectFilter && onSelectFilter('CRITICAL')}
        className={`bg-white border rounded-xl p-4 shadow-sm cursor-pointer transition ${
          criticalCount > 0 
            ? 'border-red-200 bg-red-50/20' 
            : 'border-slate-200 hover:border-slate-300'
        } ${activeFilter === 'CRITICAL' ? 'ring-2 ring-red-500 border-red-500' : ''}`}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-red-700 uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-red-600" />
            Active Critical
          </p>
          <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="text-2xl font-bold text-red-600 tracking-tight">{criticalCount}</p>
          {criticalCount > 0 ? (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
              P1 Escalation
            </span>
          ) : (
            <span className="text-xs text-slate-500">None active</span>
          )}
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className={criticalCount > 0 ? 'text-red-600 font-medium' : 'text-slate-500'}>
            {criticalCount > 0 ? 'Immediate SRE triage needed' : 'All critical systems clear'}
          </span>
        </div>
      </div>

      {/* Metric 3: AI Diagnosis Rate */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-indigo-700 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI Diagnosis Coverage
          </p>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{aiRate}%</p>
          <span className="text-xs text-indigo-600 font-medium">{aiAnalyzedCount} of {total} analyzed</span>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-100">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${aiRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Metric 4: Estimated MTTR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            Average MTTR
          </p>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="text-2xl font-bold text-slate-900 tracking-tight">4.2m</p>
          <span className="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            -88% vs Manual
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
          <span className="text-slate-500 text-[11px]">Cache latency: &lt;5ms</span>
          <span className="text-emerald-600 text-[11px] font-sans font-medium">Fast Recovery</span>
        </div>
      </div>

    </div>
  );
}
