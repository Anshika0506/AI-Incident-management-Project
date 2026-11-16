import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  Plus, 
  ChevronRight,
  ExternalLink,
  Edit3,
  Layers,
  History,
  Activity,
  Flame,
  Shield
} from 'lucide-react';
import LogStream from './LogStream';
import AIDiagnosis from './AIDiagnosis';
import IncidentTopology from './IncidentTopology';
import IncidentTimeline from './IncidentTimeline';

export default function IncidentDetail({
  incident,
  logs = [],
  onUpdateStatus,
  onRunAnalysis,
  isAnalyzing,
  onOpenIngestModal
}) {
  const [activeTab, setActiveTab] = useState('AI_DIAGNOSIS'); // 'AI_DIAGNOSIS' | 'LOGS' | 'TOPOLOGY' | 'TIMELINE'
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!incident) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 h-[760px] flex flex-col items-center justify-center p-8 text-center text-slate-400 shadow-sm">
        <Shield className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="text-sm font-semibold text-slate-700">No Incident Selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Select an incident from the queue on the left to inspect telemetry logs, trigger Gemini AI root-cause analysis, and review playbooks.
        </p>
      </div>
    );
  }

  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await onUpdateStatus(incident.id, newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'LOW':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const formatTimestamp = (iso) => {
    if (!iso) return 'Recent';
    try {
      const d = new Date(iso);
      return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-[760px] overflow-hidden shadow-sm">
      
      {/* Master Incident Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 space-y-3">
        
        {/* Top Badges & Interactive Status Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-bold shadow-xs">
              #{incident.id}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${getSeverityBadge(incident.severity)}`}>
              {incident.severity}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Created {formatTimestamp(incident.createdAt)}
            </span>
          </div>

          {/* Quick Status Buttons / Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              {[
                { status: 'OPEN', label: 'Open', color: 'text-red-700 font-semibold' },
                { status: 'IN_PROGRESS', label: 'In Progress', color: 'text-amber-700 font-semibold' },
                { status: 'RESOLVED', label: 'Resolved', color: 'text-emerald-700 font-semibold' },
              ].map(s => (
                <button
                  key={s.status}
                  disabled={isUpdatingStatus}
                  onClick={() => handleStatusChange(s.status)}
                  className={`px-2.5 py-1 rounded-md text-xs transition ${
                    incident.status === s.status
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className={incident.status === s.status ? s.color : ''}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Incident Title */}
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
          {incident.title}
        </h2>

        {/* Incident Description */}
        {incident.description && (
          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            {incident.description}
          </p>
        )}

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200 overflow-x-auto text-xs">
          {[
            { id: 'AI_DIAGNOSIS', label: 'AI Diagnosis & Playbook', icon: Sparkles, badge: incident.confidenceScore || 'RAG' },
            { id: 'LOGS', label: 'Telemetry Logs', icon: Terminal, badge: `${logs.length}` },
            { id: 'TOPOLOGY', label: 'Failure Topology', icon: Layers },
            { id: 'TIMELINE', label: 'Incident Timeline', icon: History },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Tab Panels Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-white">
        
        {/* Tab 1: AI Diagnosis */}
        {activeTab === 'AI_DIAGNOSIS' && (
          <AIDiagnosis
            incident={incident}
            onRunAnalysis={onRunAnalysis}
            isAnalyzing={isAnalyzing}
            onResolveIncident={() => handleStatusChange('RESOLVED')}
          />
        )}

        {/* Tab 2: Logs */}
        {activeTab === 'LOGS' && (
          <LogStream
            logs={logs}
            incidentId={incident.id}
            onOpenIngestModal={onOpenIngestModal}
          />
        )}

        {/* Tab 3: Topology Map */}
        {activeTab === 'TOPOLOGY' && (
          <IncidentTopology
            incident={incident}
            logs={logs}
          />
        )}

        {/* Tab 4: Timeline */}
        {activeTab === 'TIMELINE' && (
          <IncidentTimeline
            incident={incident}
            logs={logs}
          />
        )}

      </div>

    </div>
  );
}
