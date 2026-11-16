import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Clock, 
  ChevronRight,
  Flame,
  CheckCircle2,
  X,
  Layers,
  AlertCircle
} from 'lucide-react';

export default function IncidentList({ 
  incidents = [], 
  selectedId, 
  onSelectIncident 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'ACTIVE' | 'RESOLVED'

  // Filter logic
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = 
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (incident.description && incident.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      String(incident.id).includes(searchTerm);

    if (!matchesSearch) return false;

    if (filterTab === 'CRITICAL') {
      return incident.severity === 'CRITICAL' || incident.severity === 'HIGH';
    }
    if (filterTab === 'ACTIVE') {
      return incident.status === 'OPEN' || incident.status === 'IN_PROGRESS';
    }
    if (filterTab === 'RESOLVED') {
      return incident.status === 'RESOLVED' || incident.status === 'CLOSED';
    }
    return true;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Critical
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-50 text-amber-700 border border-amber-200">
            High
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-blue-50 text-blue-700 border border-blue-200">
            Medium
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 text-slate-600 border border-slate-200">
            Low
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
            Open
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Resolved
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-[760px] overflow-hidden shadow-sm">
      
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Incident Queue</h2>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {filteredIncidents.length} of {incidents.length}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ID, title, or service..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Segmented Filter Control */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg text-[11px]">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'CRITICAL', label: 'P1/P2' },
            { id: 'ACTIVE', label: 'Active' },
            { id: 'RESOLVED', label: 'Resolved' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`py-1 rounded text-center font-medium transition ${
                filterTab === tab.id
                  ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
        {filteredIncidents.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p>No incidents match your filter.</p>
          </div>
        ) : (
          filteredIncidents.map(inc => {
            const isSelected = selectedId === inc.id;

            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className={`p-3 rounded-lg cursor-pointer transition border ${
                  isSelected
                    ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600 border-indigo-200 shadow-xs'
                    : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-[11px] font-bold text-slate-600">
                      #{inc.id}
                    </span>
                    <span className="text-slate-300">•</span>
                    <h3 className="text-xs font-semibold text-slate-900 truncate">
                      {inc.title}
                    </h3>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
                    {formatRelativeTime(inc.createdAt)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {inc.description || 'No description provided'}
                </p>

                <div className="mt-2 flex items-center justify-between pt-1 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {getSeverityBadge(inc.severity)}
                    {getStatusBadge(inc.status)}
                  </div>

                  {inc.confidenceScore && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                      <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                      {inc.confidenceScore} RAG
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
