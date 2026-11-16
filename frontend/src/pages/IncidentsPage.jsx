import React from 'react';
import IncidentList from '../components/IncidentList';
import IncidentDetail from '../components/IncidentDetail';
import { Shield, Plus, Zap } from 'lucide-react';

export default function IncidentsPage({
  incidents = [],
  selectedIncident,
  onSelectIncident,
  logs = [],
  onUpdateStatus,
  onRunAnalysis,
  isAnalyzing,
  onOpenIngestModal,
  onOpenCreateModal,
  onOpenSimulateModal
}) {
  return (
    <div className="space-y-4">
      
      {/* Top Incident Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Incident Management & Triage
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {incidents.length} Records
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Select an incident from the queue to review telemetry, trigger AI diagnosis, and execute recovery steps.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSimulateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulate Outage</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Incident</span>
          </button>
        </div>
      </div>

      {/* Two-Column Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Incidents Queue (4 cols) */}
        <div className="lg:col-span-4">
          <IncidentList
            incidents={incidents}
            selectedId={selectedIncident?.id}
            onSelectIncident={onSelectIncident}
          />
        </div>

        {/* Right Column: Master Detail & 4 Deep-Dive Tabs (8 cols) */}
        <div className="lg:col-span-8">
          <IncidentDetail
            incident={selectedIncident}
            logs={logs}
            onUpdateStatus={onUpdateStatus}
            onRunAnalysis={onRunAnalysis}
            isAnalyzing={isAnalyzing}
            onOpenIngestModal={onOpenIngestModal}
          />
        </div>

      </div>

    </div>
  );
}
