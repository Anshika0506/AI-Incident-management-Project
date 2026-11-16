import React from 'react';
import { 
  Activity, 
  AlertOctagon, 
  Sparkles, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Zap, 
  Server, 
  Database, 
  Cpu, 
  ArrowRight, 
  Plus, 
  Radio, 
  Layers, 
  ShieldCheck, 
  AlertTriangle,
  TrendingUp,
  BarChart3,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import MetricsBar from '../components/MetricsBar';

export default function DashboardPage({
  incidents = [],
  selectedIncident,
  onSelectIncident,
  onNavigateToIncidents,
  onOpenCreateModal,
  onOpenSimulateModal,
  onOpenIngestModal,
  backendOnline
}) {
  const total = incidents.length;
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;
  const openCount = incidents.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length;
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;

  // Recent 5 incidents
  const recentIncidents = [...incidents].slice(0, 5);

  // Microservice fleet telemetry
  const services = [
    {
      name: 'payment-service',
      port: 'Port 8080 • HikariCP Pool',
      status: criticalCount > 0 ? 'Degraded' : 'Operational',
      latency: criticalCount > 0 ? '420ms' : '28ms',
      errorRate: criticalCount > 0 ? '4.8%' : '0.01%',
      type: 'Primary Payment API',
      statusBadge: criticalCount > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      name: 'auth-service',
      port: 'Spring Security 6 • JWT',
      status: 'Operational',
      latency: '18ms',
      errorRate: '0.00%',
      type: 'Stateless Token Auth',
      statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      name: 'order-service',
      port: 'Kafka Consumer • Events',
      status: 'Operational',
      latency: '42ms',
      errorRate: '0.02%',
      type: 'Order Processing',
      statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      name: 'catalog-service',
      port: 'OpenJDK 22 • Heap 48%',
      status: 'Operational',
      latency: '15ms',
      errorRate: '0.00%',
      type: 'Inventory & Search',
      statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      name: 'MySQL 8.0 Primary',
      port: 'Port 3306 • incidentdb',
      status: backendOnline ? 'Connected' : 'Simulated',
      latency: '1.8ms',
      errorRate: '0.00%',
      type: 'ACID Relational Storage',
      statusBadge: backendOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      name: 'Google Gemini 3.5 Flash',
      port: 'REST Client • RAG Engine',
      status: 'Available',
      latency: '< 5ms (Cached)',
      errorRate: '0.00%',
      type: 'Root Cause & Playbooks',
      statusBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Realistic System Health Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${criticalCount > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              System Status:
            </span>
            {criticalCount > 0 ? (
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                Degraded Performance — {criticalCount} Active P1 Incident
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                All Core Services Operational
              </span>
            )}
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-mono">
              Uptime 99.98%
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Site Reliability & Incident Command Dashboard
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl">
            Real-time telemetry monitoring, automated exception aggregation, and Google Gemini RAG root-cause diagnostics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={onOpenSimulateModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulate Outage</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Incident</span>
          </button>

          <button
            onClick={onNavigateToIncidents}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 transition"
          >
            <span>Incident Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Primary KPI Metrics Bar */}
      <MetricsBar incidents={incidents} />

      {/* 3. Microservice Fleet Status & Health Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Service Infrastructure & Dependencies
            </h3>
          </div>
          <span className="text-xs text-slate-500">6 Components Healthy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {services.map((svc, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 font-mono">
                    {svc.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{svc.port}</p>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${svc.statusBadge}`}>
                  {svc.status}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Latency</span>
                  <span className="text-slate-700 font-medium font-mono">{svc.latency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Errors</span>
                  <span className="text-slate-700 font-medium font-mono">{svc.errorRate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Role</span>
                  <span className="text-slate-600 truncate block text-[11px]">{svc.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Outages & Recent Incident Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recent Incident Activity
            </h3>
            <p className="text-xs text-slate-500">
              Track active investigations, root-cause statuses, and resolution playbooks.
            </p>
          </div>

          <button
            onClick={onNavigateToIncidents}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            <span>View All ({incidents.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-medium uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-mono">ID</th>
                <th className="py-2.5 px-4">Incident Summary</th>
                <th className="py-2.5 px-4">Severity</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">AI Analysis</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentIncidents.map(inc => {
                const isCritical = inc.severity === 'CRITICAL';
                const isResolved = inc.status === 'RESOLVED' || inc.status === 'CLOSED';
                
                return (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-600 whitespace-nowrap">
                      #{inc.id}
                    </td>
                    <td className="py-3 px-4 max-w-xs sm:max-w-md">
                      <p className="font-semibold text-slate-900 truncate">{inc.title}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{inc.description || 'No description provided'}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                        isCritical 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : inc.severity === 'HIGH' 
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {isCritical && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                        isResolved
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : inc.status === 'IN_PROGRESS'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {isResolved ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-slate-500" />}
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {inc.confidenceScore ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-[11px]">
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          {inc.confidenceScore} Conf.
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Not analyzed</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          onSelectIncident(inc);
                          onNavigateToIncidents();
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 text-xs font-medium transition"
                      >
                        <span>Investigate</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Clean Architectural Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Context-Aware RAG</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Raw stack traces are retrieved directly from Spring Data JPA and fed to Google Gemini 3.5 Flash at low temperature (0.2) to prevent hallucinations.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-800 font-semibold mb-1.5">
            <Database className="w-4 h-4 text-slate-700" />
            <span>Sub-5ms Cache-Aside</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Spring's <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-[11px]">@Cacheable</code> saves 100% of LLM token costs on repeated diagnostic queries across concurrent engineers.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Stateless JWT Security</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Stateless security filter chain with BCrypt cost 10 and HMAC-SHA256 tokens eliminates session storage on the server for horizontal scalability.
          </p>
        </div>
      </div>

    </div>
  );
}
