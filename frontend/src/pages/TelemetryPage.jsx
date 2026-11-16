import React, { useState } from 'react';
import { 
  Terminal, 
  Search, 
  Filter, 
  Plus, 
  Zap, 
  Server, 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Radio,
  FileCode,
  Activity
} from 'lucide-react';

export default function TelemetryPage({
  logs = [],
  incidents = [],
  onIngestLog,
  onOpenIngestModal,
  onOpenSimulateModal,
  backendOnline
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedService, setSelectedService] = useState('ALL');
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Quick Ingest Form state
  const [quickService, setQuickService] = useState('PaymentService');
  const [quickLevel, setQuickLevel] = useState('ERROR');
  const [quickMessage, setQuickMessage] = useState('');
  const [quickIncidentId, setQuickIncidentId] = useState(incidents[0]?.id || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Services list
  const servicesList = ['ALL', 'PaymentService', 'AuthService', 'OrderService', 'CatalogService'];

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesLevel = selectedLevel === 'ALL' || log.logLevel === selectedLevel;
    const matchesService = selectedService === 'ALL' || log.sourceService === selectedService;
    const matchesSearch = !searchTerm || 
      log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.sourceService?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.stackTrace?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesService && matchesSearch;
  });

  const errorCount = logs.filter(l => l.logLevel === 'ERROR' || l.logLevel === 'FATAL').length;
  const warnCount = logs.filter(l => l.logLevel === 'WARN').length;
  const infoCount = logs.filter(l => l.logLevel === 'INFO').length;

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    if (!quickMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await onIngestLog({
        incidentId: Number(quickIncidentId),
        logLevel: quickLevel,
        sourceService: quickService,
        message: quickMessage,
        stackTrace: `org.springframework.dao.DataAccessException: Exception in ${quickService} at port 8080\n  at com.incident.${quickService}.handle(Service.java:42)\n  at java.base/java.lang.Thread.run(Thread.java:842)`
      });
      setQuickMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* 1. Header & Live Telemetry KPI Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              SRE Telemetry Stream & Log Ingestion Lab
              <span className="flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Radio className="w-2.5 h-2.5 animate-pulse text-cyan-400" />
                Live Ingestion Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Real-time exception traces and unhandled stack traces correlated by Spring Boot for Gemini RAG grounding.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSimulateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Simulate Outage</span>
          </button>

          <button
            onClick={onOpenIngestModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ingest Telemetry Log</span>
          </button>
        </div>
      </div>

      {/* 2. Telemetry Quick Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Total Log Events</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-white">{logs.length}</span>
            <span className="text-[10px] text-slate-500 font-mono">traces</span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-rose-500/20 bg-rose-950/10">
          <span className="text-[10px] font-mono text-rose-300 uppercase flex items-center gap-1">
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            Errors & Fatal
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-400">{errorCount}</span>
            <span className="text-[10px] text-rose-300/60 font-mono">exceptions</span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-amber-500/20 bg-amber-950/10">
          <span className="text-[10px] font-mono text-amber-300 uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Warnings
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-300">{warnCount}</span>
            <span className="text-[10px] text-amber-300/60 font-mono">events</span>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-950/10">
          <span className="text-[10px] font-mono text-cyan-300 uppercase flex items-center gap-1">
            <Server className="w-3 h-3 text-cyan-400" />
            Backend Protocol
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-bold text-cyan-300 font-mono">POST /api/v1/logs</span>
          </div>
        </div>
      </div>

      {/* 3. Terminal Console with Filtering & Quick Ingest Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Terminal Log Console (8 cols) */}
        <div className="lg:col-span-8 glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
          
          {/* Terminal Top Bar */}
          <div className="bg-slate-900/90 p-3.5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search messages, services, stack traces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Level Filter Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {['ALL', 'ERROR', 'WARN', 'INFO'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition ${
                    selectedLevel === lvl
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

          </div>

          {/* Service Filter Pills */}
          <div className="bg-slate-950/60 px-3.5 py-2 border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            <span className="text-[10px] text-slate-500 uppercase mr-1">Service:</span>
            {servicesList.map(svc => (
              <button
                key={svc}
                onClick={() => setSelectedService(svc)}
                className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap transition ${
                  selectedService === svc
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/80'
                }`}
              >
                {svc}
              </button>
            ))}
          </div>

          {/* Terminal Logs Output Body */}
          <div className="p-3 bg-[#050811] font-mono text-xs overflow-y-auto max-h-[560px] space-y-2">
            {filteredLogs.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <FileCode className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No telemetry logs match the current search / filter criteria.</p>
              </div>
            ) : (
              filteredLogs.map(log => {
                const isExpanded = expandedLogId === log.id;
                const isError = log.logLevel === 'ERROR' || log.logLevel === 'FATAL';
                const isWarn = log.logLevel === 'WARN';

                return (
                  <div
                    key={log.id}
                    className={`rounded-lg border transition-all ${
                      isError
                        ? 'bg-rose-950/20 border-rose-500/30'
                        : isWarn
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-slate-900/60 border-slate-800/80'
                    }`}
                  >
                    <div 
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="p-2.5 flex items-start justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 mt-0.5 ${
                          isError
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : isWarn
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}>
                          {log.logLevel}
                        </span>

                        <span className="text-[10px] text-slate-500 shrink-0 mt-0.5">
                          {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '12:00:00'}
                        </span>

                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-indigo-300 shrink-0 mt-0.5">
                          {log.sourceService || 'System'}
                        </span>

                        <p className="text-slate-200 truncate font-sans text-xs pt-0.5">
                          {log.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                        {log.stackTrace && (
                          <span className="text-[10px] text-slate-500">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expandable Stack Trace */}
                    {isExpanded && log.stackTrace && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-800/60 mt-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Java Exception Stack Trace
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(log.id, log.stackTrace);
                            }}
                            className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300"
                          >
                            {copiedId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === log.id ? 'Copied' : 'Copy Trace'}</span>
                          </button>
                        </div>
                        <pre className="p-2.5 rounded bg-black/60 border border-slate-800 text-[11px] text-rose-300/90 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto max-h-56">
                          {log.stackTrace}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Quick Ingestion Control Station (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Quick Emit Telemetry Box */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 mb-3">
              <Zap className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Quick Ingest Telemetry
              </h3>
            </div>

            <form onSubmit={handleQuickSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Incident</label>
                <select
                  value={quickIncidentId}
                  onChange={(e) => setQuickIncidentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {incidents.map(inc => (
                    <option key={inc.id} value={inc.id}>
                      #{inc.id} - {inc.title.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Source Service</label>
                  <select
                    value={quickService}
                    onChange={(e) => setQuickService(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PaymentService">PaymentService</option>
                    <option value="AuthService">AuthService</option>
                    <option value="OrderService">OrderService</option>
                    <option value="CatalogService">CatalogService</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Log Level</label>
                  <select
                    value={quickLevel}
                    onChange={(e) => setQuickLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ERROR">ERROR</option>
                    <option value="WARN">WARN</option>
                    <option value="INFO">INFO</option>
                    <option value="FATAL">FATAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Error Message</label>
                <textarea
                  rows={2}
                  placeholder="e.g. HikariPool-1 connection timeout after 30000ms"
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !quickMessage.trim()}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Ingesting...' : 'Emit Telemetry Log'}</span>
              </button>
            </form>
          </div>

          {/* SRE Ingestion Architecture Guidance */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Relational Ingestion Rule
            </h4>
            <p className="leading-relaxed text-[11px]">
              Every emitted log is validated against <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300">IncidentRepository</code> via foreign key <code className="bg-slate-950 px-1 py-0.5 rounded text-cyan-300">incident_id</code> before persistence, ensuring zero orphaned log records.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
