import React from 'react';
import { 
  Server, 
  Database, 
  Globe, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Cpu,
  Layers
} from 'lucide-react';

export default function IncidentTopology({ incident, logs = [] }) {
  // Infer affected components based on incident title and logs
  const isDBIncident = incident.title.toLowerCase().includes('database') || 
                       incident.title.toLowerCase().includes('hikaricp') || 
                       incident.title.toLowerCase().includes('timeout') ||
                       incident.title.toLowerCase().includes('connection');

  const isAuthIncident = incident.title.toLowerCase().includes('auth') || 
                         incident.title.toLowerCase().includes('jwt') ||
                         incident.title.toLowerCase().includes('redis');

  const isKafkaIncident = incident.title.toLowerCase().includes('kafka') ||
                          incident.title.toLowerCase().includes('order') ||
                          incident.title.toLowerCase().includes('consumer');

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      
      {/* Topology Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Distributed Microservice Topology & Failure Path
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time dependency visualization identifying degraded nodes and downstream cascading impacts
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            Node Failure Detected
          </span>
        </div>
      </div>

      {/* Visual Dependency Diagram */}
      <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8 overflow-x-auto">
        
        {/* Node 1: Client / Web Traffic */}
        <div className="flex flex-col items-center p-4 rounded-lg bg-white border border-slate-200 w-40 text-center shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-2">
            <Globe className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-900">Edge Gateway</span>
          <span className="text-[10px] text-slate-500 font-mono">React / Cloudflare</span>
          <span className="mt-2 text-[10px] text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Healthy
          </span>
        </div>

        <ArrowRight className="w-5 h-5 text-slate-400 hidden md:block" />

        {/* Node 2: Core Microservice (e.g. Payment / Auth / Order) */}
        <div className="flex flex-col items-center p-4 rounded-lg bg-white border border-slate-200 w-44 text-center shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
            <Server className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-900">
            {isAuthIncident ? 'Auth Service' : isKafkaIncident ? 'Order Service' : 'Payment Service'}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Spring Boot 3.2</span>
          <span className="mt-2 text-[10px] text-amber-700 font-medium flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Degraded
          </span>
        </div>

        <ArrowRight className="w-5 h-5 text-rose-500 hidden md:block" />

        {/* Node 3: The Failing Infrastructure Component */}
        <div className="flex flex-col items-center p-4 rounded-lg bg-rose-50/70 border-2 border-rose-300 w-48 text-center shadow-xs relative">
          <span className="absolute -top-2.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-600 text-white uppercase tracking-wider">
            Root Cause Node
          </span>
          <div className="w-10 h-10 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-2 mt-1">
            {isAuthIncident ? <Cpu className="w-5 h-5" /> : <Database className="w-5 h-5" />}
          </div>
          <span className="text-xs font-semibold text-rose-900">
            {isAuthIncident ? 'Redis Master Cluster' : isKafkaIncident ? 'Kafka Broker 02' : 'HikariCP Pool (DB)'}
          </span>
          <span className="text-[10px] text-rose-700 font-mono">
            {isAuthIncident ? 'Port 6379 (Split-Brain)' : isKafkaIncident ? 'Partition 3 (Lag 150k)' : '20/20 Pool Exhausted'}
          </span>
          <span className="mt-2 text-[10px] text-rose-800 font-medium flex items-center gap-1 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Active Failure
          </span>
        </div>

        <ArrowRight className="w-5 h-5 text-slate-400 hidden md:block" />

        {/* Node 4: Persistence Layer / Target */}
        <div className="flex flex-col items-center p-4 rounded-lg bg-white border border-slate-200 w-40 text-center shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-2">
            <Database className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-900">Primary Database</span>
          <span className="text-[10px] text-slate-500 font-mono">MySQL 8.0 ACID</span>
          <span className="mt-2 text-[10px] text-slate-600 font-medium flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            Lock Cascading
          </span>
        </div>

      </div>

      {/* Topology Diagnostics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-slate-500 font-medium">Fault Isolation Scope</p>
          <p className="text-slate-900 font-semibold mt-1">Single Point of Failure (SPOF)</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Blast radius contained to transaction write path</p>
        </div>
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-slate-500 font-medium">Circuit Breaker Status</p>
          <p className="text-amber-700 font-semibold mt-1">OPEN (Resilience4j 80% error)</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Preventing cascading thread starvation</p>
        </div>
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-slate-500 font-medium">AI Recommended Mitigation</p>
          <p className="text-indigo-700 font-semibold mt-1">Pool Expansion & Connection Reset</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Refer to Runbook tab for exact CLI commands</p>
        </div>
      </div>

    </div>
  );
}
