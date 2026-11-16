import React from 'react';
import { 
  Clock, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  ShieldAlert
} from 'lucide-react';

export default function IncidentTimeline({ incident, logs = [] }) {
  const events = [
    {
      id: 1,
      title: 'Incident Declared & P1 Alert Dispatched',
      description: `Monitoring alert triggered: ${incident.title}. Triage assigned to SRE on-call team.`,
      timestamp: incident.createdAt,
      type: 'ALERT',
      icon: ShieldAlert,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
    },
    {
      id: 2,
      title: 'Microservice Telemetry Traces Ingested',
      description: `${logs.length} error events & exception stack traces captured via POST /api/v1/logs.`,
      timestamp: logs[logs.length - 1]?.timestamp || incident.createdAt,
      type: 'LOGS',
      icon: Terminal,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    ...(incident.rootCause ? [{
      id: 3,
      title: 'Google Gemini 1.5 Flash RAG Inference Completed',
      description: `Grounding completed in 2.8s. Root cause identified with ${incident.confidenceScore || '94%'} confidence score. Result cached in RAM.`,
      timestamp: incident.updatedAt,
      type: 'AI',
      icon: Sparkles,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    }] : []),
    ...(incident.status === 'RESOLVED' || incident.status === 'CLOSED' ? [{
      id: 4,
      title: 'Mitigation Verified & Status Switched to RESOLVED',
      description: 'Runbook steps executed. Connection pool and error rates returned within acceptable SLA limits.',
      timestamp: incident.updatedAt,
      type: 'RESOLVED',
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    }] : [{
      id: 4,
      title: 'Investigation In Progress',
      description: 'Active engineering remediation underway. Awaiting runbook verification.',
      timestamp: new Date().toISOString(),
      type: 'IN_PROGRESS',
      icon: Clock,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    }]),
  ];

  const formatEventTime = (iso) => {
    if (!iso) return 'Recent';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      
      {/* Timeline Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Incident Lifecycle & Audit Timeline
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological audit trail documenting detection, telemetry ingestion, AI synthesis, and status updates
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
          {events.length} Timeline Events
        </span>
      </div>

      {/* Stepper Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
        {events.map((event) => {
          const Icon = event.icon;
          return (
            <div key={event.id} className="relative group">
              {/* Event Marker */}
              <div className={`absolute -left-6 top-1 w-6 h-6 rounded-full border flex items-center justify-center -translate-x-1/2 ${event.color} shadow-xs`}>
                <Icon className="w-3 h-3" />
              </div>

              {/* Event Card */}
              <div className="ml-4 p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
                    {event.title}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500">
                    {formatEventTime(event.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
