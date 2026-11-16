import React, { useState } from 'react';
import { 
  Terminal, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Copy, 
  Check, 
  X
} from 'lucide-react';

export default function LogStream({ 
  logs = [], 
  incidentId, 
  onOpenIngestModal 
}) {
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchLog, setSearchLog] = useState('');
  const [expandedLogIds, setExpandedLogIds] = useState(new Set());
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedTraceId, setCopiedTraceId] = useState(null);

  const toggleExpand = (id) => {
    const next = new Set(expandedLogIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedLogIds(next);
  };

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'ALL' || log.logLevel === filterLevel;
    const matchesSearch = 
      log.message.toLowerCase().includes(searchLog.toLowerCase()) ||
      (log.sourceService && log.sourceService.toLowerCase().includes(searchLog.toLowerCase())) ||
      (log.stackTrace && log.stackTrace.toLowerCase().includes(searchLog.toLowerCase()));

    return matchesLevel && matchesSearch;
  });

  const handleCopyAll = () => {
    const text = filteredLogs.map(l => `[${l.timestamp}] [${l.logLevel}] [${l.sourceService}]: ${l.message}\n${l.stackTrace || ''}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyTrace = (e, id, trace) => {
    e.stopPropagation();
    navigator.clipboard.writeText(trace);
    setCopiedTraceId(id);
    setTimeout(() => setCopiedTraceId(null), 2000);
  };

  const getLogLevelStyle = (level) => {
    switch (level) {
      case 'FATAL':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/50';
      case 'ERROR':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/50';
      case 'WARN':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'INFO':
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-500/50';
    }
  };

  const formatLogTime = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toISOString().replace('T', ' ').substring(11, 23);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="rounded-xl border border-slate-300 bg-slate-900 flex flex-col h-[560px] overflow-hidden shadow-sm">
      
      {/* Terminal Top Window Bar */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        
        {/* Terminal Window Controls & Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90"></span>
          </div>
          
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs font-mono text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>logs://incident-{incidentId}/stream</span>
            <span className="text-slate-500 font-semibold">({filteredLogs.length} events)</span>
          </div>
        </div>

        {/* Action Tools & Ingestion Trigger */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
              placeholder="Search message or trace..."
              className="bg-slate-900 border border-slate-700 rounded-md pl-7 pr-7 py-1 text-[11px] text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 transition w-36 sm:w-48"
            />
            {searchLog && (
              <button 
                onClick={() => setSearchLog('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Copy All */}
          <button
            onClick={handleCopyAll}
            className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
            title="Copy all filtered logs"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Ingest Log Modal Trigger */}
          <button
            onClick={onOpenIngestModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium transition active:scale-95"
            title="Ingest new microservice error log"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ingest Log</span>
          </button>
        </div>
      </div>

      {/* Log Level Filter Tabs Bar */}
      <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          {['ALL', 'FATAL', 'ERROR', 'WARN', 'INFO'].map(level => {
            const count = level === 'ALL' ? logs.length : logs.filter(l => l.logLevel === level).length;
            return (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-2.5 py-0.5 rounded-md transition font-medium ${
                  filterLevel === level
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {level} ({count})
              </button>
            );
          })}
        </div>

        <div className="text-[10px] text-slate-500 hidden sm:block">
          Tail Live Stream • Spring JPA Telemetry
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] space-y-1 select-text">
        {filteredLogs.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500">
            <Terminal className="w-8 h-8 text-slate-700 mb-2" />
            <p className="text-xs text-slate-400">No telemetry logs found for Incident #{incidentId}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Click "+ Ingest Log" above to send exception logs from microservices.
            </p>
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const isExpanded = expandedLogIds.has(log.id || index);
            const hasTrace = Boolean(log.stackTrace);

            return (
              <div 
                key={log.id || index}
                className="rounded border border-transparent hover:border-slate-800 hover:bg-slate-800/40 p-1.5 transition"
              >
                {/* Single Log Line */}
                <div 
                  onClick={() => hasTrace && toggleExpand(log.id || index)}
                  className={`flex items-start gap-2.5 ${hasTrace ? 'cursor-pointer' : ''}`}
                >
                  {/* Line Number */}
                  <span className="text-[10px] text-slate-500 select-none w-5 text-right font-mono flex-shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Timestamp */}
                  <span className="text-slate-400 flex-shrink-0 select-none">
                    {formatLogTime(log.timestamp)}
                  </span>

                  {/* Log Level Badge */}
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider border flex-shrink-0 ${getLogLevelStyle(log.logLevel)}`}>
                    {log.logLevel}
                  </span>

                  {/* Source Service */}
                  <span className="text-indigo-300 font-semibold flex-shrink-0">
                    [{log.sourceService || 'service'}]:
                  </span>

                  {/* Message */}
                  <span className="text-slate-200 flex-1 break-words">
                    {log.message}
                  </span>

                  {/* Expand Chevron for Stack Trace */}
                  {hasTrace && (
                    <span className="text-slate-400 hover:text-slate-200 flex-shrink-0 flex items-center gap-1">
                      <span className="text-[10px] text-slate-500">trace</span>
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </span>
                  )}
                </div>

                {/* Expanded Stack Trace */}
                {hasTrace && isExpanded && (
                  <div className="mt-2 ml-7 p-3 rounded-lg bg-black/80 border border-slate-800 text-rose-300 font-mono text-[10px] overflow-x-auto relative">
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-slate-400 text-[10px]">
                      <span>Exception Stack Trace</span>
                      <button
                        onClick={(e) => handleCopyTrace(e, log.id, log.stackTrace)}
                        className="flex items-center gap-1 text-slate-300 hover:text-white"
                      >
                        {copiedTraceId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedTraceId === log.id ? 'Copied' : 'Copy Trace'}</span>
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap leading-relaxed">{log.stackTrace}</pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
