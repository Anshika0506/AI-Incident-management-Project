import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import IncidentsPage from './pages/IncidentsPage';
import TelemetryPage from './pages/TelemetryPage';
import CreateIncidentModal from './components/CreateIncidentModal';
import IngestLogModal from './components/IngestLogModal';
import OutageSimulatorModal from './components/OutageSimulatorModal';
import AuthModal from './components/AuthModal';
import { incidentService } from './api/incidentService';
import { logService } from './api/logService';
import { authService } from './api/authService';
import { INITIAL_MOCK_INCIDENTS, INITIAL_MOCK_LOGS } from './data/mockData';
import { CheckCircle2, AlertTriangle, Sparkles, X } from 'lucide-react';

export default function App() {
  // Navigation: 3 Distinct Pages ('dashboard' | 'incidents' | 'telemetry')
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (['dashboard', 'incidents', 'telemetry'].includes(hash)) {
      return hash;
    }
    return 'dashboard';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Synchronize with browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['dashboard', 'incidents', 'telemetry'].includes(hash)) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Primary Incident & Log State
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [logs, setLogs] = useState([]);
  const [backendOnline, setBackendOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load incidents from backend (or fallback to mock data)
  const loadIncidents = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const data = await incidentService.getAllIncidents();
      
      // Strict check: On Vercel SPA without backend, /api/* returns index.html string
      // Only mark online if data is a genuine JSON array with incident objects
      const isRealBackendData = Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0].title;
      
      if (isRealBackendData) {
        setBackendOnline(true);
        setIncidents(data);
        setSelectedIncident(prev => {
          if (!prev) return data[0];
          const found = data.find(i => i.id === prev.id);
          return found || data[0];
        });
      } else {
        setBackendOnline(false);
        setIncidents(INITIAL_MOCK_INCIDENTS);
        setSelectedIncident(INITIAL_MOCK_INCIDENTS[0]);
      }
    } catch (err) {
      console.warn('Backend not detected. Operating in Simulated Demo Mode.', err.message);
      setBackendOnline(false);
      setIncidents(prev => (prev.length > 0 ? prev : INITIAL_MOCK_INCIDENTS));
      setSelectedIncident(prev => prev || INITIAL_MOCK_INCIDENTS[0]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load logs for the selected incident
  const loadLogsForIncident = async (incidentId) => {
    if (!incidentId) return;

    if (backendOnline) {
      try {
        const data = await logService.getLogsByIncidentId(incidentId);
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0].message) {
          setLogs(data);
          return;
        }
      } catch (err) {
        console.error('Error fetching logs from backend:', err);
      }
    }

    // Fallback to mock logs
    const mockList = INITIAL_MOCK_LOGS[incidentId] || [];
    setLogs(mockList);
  };

  // Initial load
  useEffect(() => {
    loadIncidents();
  }, []);

  // When selected incident changes, load its logs
  useEffect(() => {
    if (selectedIncident?.id) {
      loadLogsForIncident(selectedIncident.id);
    }
  }, [selectedIncident?.id, backendOnline]);

  // Auth Handlers
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    showToast(`Welcome back, ${userData.username}! Authenticated via Spring Security JWT.`, 'success');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    showToast('Signed out successfully.', 'info');
  };

  // Handle selecting an incident
  const handleSelectIncident = (incident) => {
    setSelectedIncident(incident);
  };

  // Create new incident
  const handleCreateIncident = async (payload) => {
    if (backendOnline) {
      try {
        const created = await incidentService.createIncident(payload);
        setIncidents(prev => [created, ...prev]);
        setSelectedIncident(created);
        showToast(`Incident #${created.id} created successfully!`, 'success');
        return;
      } catch (err) {
        console.error('Failed to create in backend, creating locally', err);
      }
    }

    // Demo Mode creation
    const newId = incidents.length > 0 ? Math.max(...incidents.map(i => i.id)) + 1 : 1;
    const localIncident = {
      id: newId,
      ...payload,
      status: 'OPEN',
      rootCause: null,
      suggestedPlaybook: null,
      confidenceScore: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setIncidents(prev => [localIncident, ...prev]);
    setSelectedIncident(localIncident);
    showToast(`Incident #${newId} created (Demo Mode)!`, 'info');
  };

  // Update status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
  const handleUpdateStatus = async (id, status) => {
    if (backendOnline) {
      try {
        const updated = await incidentService.updateStatus(id, status);
        setIncidents(prev => prev.map(i => i.id === id ? updated : i));
        setSelectedIncident(updated);
        showToast(`Incident #${id} status changed to ${status}`, 'success');
        return;
      } catch (err) {
        console.error('Failed status update on backend:', err);
      }
    }

    // Demo mode update
    setIncidents(prev => prev.map(i => {
      if (i.id === id) {
        const up = { ...i, status, updatedAt: new Date().toISOString() };
        setSelectedIncident(up);
        return up;
      }
      return i;
    }));
    showToast(`Incident #${id} status updated to ${status}`, 'info');
  };

  // Ingest Log
  const handleIngestLog = async (logPayload) => {
    if (backendOnline) {
      try {
        const createdLog = await logService.ingestLog(logPayload);
        setLogs(prev => [createdLog, ...prev]);
        showToast('Telemetry log ingested into Spring Boot backend!', 'success');
        return;
      } catch (err) {
        console.error('Backend log ingest error:', err);
      }
    }

    // Demo mode log ingest
    const newLogId = logs.length > 0 ? Math.max(...logs.map(l => l.id || 0)) + 1 : 101;
    const localLog = {
      id: newLogId,
      ...logPayload,
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [localLog, ...prev]);
    showToast('Telemetry log added to stream!', 'info');
  };

  // Run AI RAG Analysis
  const handleRunAnalysis = async (id) => {
    setIsAnalyzing(true);
    try {
      if (backendOnline) {
        try {
          const response = await incidentService.analyzeIncident(id);
          
          if (response && response.rootCause) {
            const updatedIncident = {
              ...selectedIncident,
              rootCause: response.rootCause,
              confidenceScore: response.confidenceScore || '94%',
              suggestedPlaybook: response.suggestedPlaybook,
              updatedAt: new Date().toISOString(),
            };

            setIncidents(prev => prev.map(i => i.id === id ? updatedIncident : i));
            setSelectedIncident(updatedIncident);
            showToast('Google Gemini RAG Analysis successfully generated & persisted!', 'success');
            return;
          }
        } catch (apiErr) {
          console.warn('Backend analyze call failed, falling back to simulated analysis:', apiErr.message);
          setBackendOnline(false);
          // Seamlessly fall through to simulated analysis below!
        }
      }

      // Simulated Demo Mode (Simulates sub-2s AI RAG inference)
      await new Promise(r => setTimeout(r, 1600));

      const simulatedAnalysis = {
        rootCause: 'Connection pool timeout observed on payment-service. HikariCP max pool size (20) saturated due to slow unindexed queries on checkout tables.',
        suggestedPlaybook: '1. Scale Hikari connection pool size from 20 to 50 via spring.datasource.hikari.maximum-pool-size=50.\n2. Terminate long-running lock queries using pg_terminate_backend / kill query.\n3. Add missing composite index on transaction_ledger (user_id, status, created_at).\n4. Restart payment-service instances in rolling deployment.',
        confidenceScore: '94%'
      };

      const updatedIncident = {
        ...selectedIncident,
        rootCause: selectedIncident?.rootCause || simulatedAnalysis.rootCause,
        confidenceScore: selectedIncident?.confidenceScore || simulatedAnalysis.confidenceScore,
        suggestedPlaybook: selectedIncident?.suggestedPlaybook || simulatedAnalysis.suggestedPlaybook,
        updatedAt: new Date().toISOString(),
      };

      setIncidents(prev => prev.map(i => i.id === id ? updatedIncident : i));
      setSelectedIncident(updatedIncident);
      showToast('Gemini RAG Analysis generated (Simulated Mode)!', 'success');
    } catch (err) {
      console.error('Analysis failed:', err);
      showToast(`Analysis error: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Inject 1-Click Simulated Outage
  const handleInjectScenario = async (scenario) => {
    if (backendOnline) {
      try {
        const created = await incidentService.createIncident({
          title: scenario.title,
          description: scenario.description,
          severity: scenario.severity,
        });

        await logService.ingestLog({
          incidentId: created.id,
          logLevel: 'ERROR',
          sourceService: scenario.service,
          message: scenario.sampleLog,
          stackTrace: `org.springframework.dao.DataAccessException: Failure in ${scenario.service} at port 8080.\n  at com.incident.${scenario.service}.handle(Service.java:42)`
        });

        await loadIncidents();
        showToast(`Outage scenario '${scenario.title}' injected to Spring Boot!`, 'success');
        return;
      } catch (err) {
        console.error('Backend scenario injection failed, falling back to local', err);
      }
    }

    // Local Demo Injection
    const newId = incidents.length > 0 ? Math.max(...incidents.map(i => i.id)) + 1 : 1;
    const newIncident = {
      id: newId,
      title: scenario.title,
      description: scenario.description,
      severity: scenario.severity,
      status: 'OPEN',
      rootCause: scenario.rootCause,
      suggestedPlaybook: scenario.suggestedPlaybook,
      confidenceScore: scenario.confidenceScore,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newLogs = [
      {
        id: Date.now(),
        incidentId: newId,
        logLevel: 'ERROR',
        sourceService: scenario.service,
        message: scenario.sampleLog,
        stackTrace: `org.springframework.dao.DataAccessException: Failure in ${scenario.service} on port 8080.\n  at com.incident.${scenario.service}.handle(Service.java:42)\n  at java.base/java.lang.Thread.run(Thread.java:842)`,
        timestamp: new Date().toISOString(),
      }
    ];

    setIncidents(prev => [newIncident, ...prev]);
    setSelectedIncident(newIncident);
    setLogs(newLogs);
    showToast(`Injected Outage '${scenario.title}'!`, 'info');
  };

  // Quick Seed DB
  const handleSeedDemoData = async () => {
    if (!backendOnline) {
      setIncidents(INITIAL_MOCK_INCIDENTS);
      setSelectedIncident(INITIAL_MOCK_INCIDENTS[0]);
      showToast('Loaded demo incidents into local view', 'info');
      return;
    }

    try {
      showToast('Seeding initial incidents to Spring Boot backend...', 'info');
      for (const inc of INITIAL_MOCK_INCIDENTS) {
        const created = await incidentService.createIncident({
          title: inc.title,
          description: inc.description,
          severity: inc.severity,
        });

        const mockLogList = INITIAL_MOCK_LOGS[inc.id] || [];
        for (const log of mockLogList) {
          await logService.ingestLog({
            incidentId: created.id,
            logLevel: log.logLevel,
            sourceService: log.sourceService,
            message: log.message,
            stackTrace: log.stackTrace,
          });
        }
      }
      await loadIncidents();
      showToast('Spring Boot DB successfully seeded with real test incidents & logs!', 'success');
    } catch (err) {
      console.error('Seed error:', err);
      showToast('Failed to seed backend database', 'error');
    }
  };

  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-xs font-medium transition bg-white border-slate-200 text-slate-800">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
          {toast.type === 'info' && <Sparkles className="w-4 h-4 text-indigo-600" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Primary Navigation Header with 3 Page Tabs */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        backendOnline={backendOnline}
        onRefresh={() => loadIncidents(false)}
        isRefreshing={isRefreshing}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        incidentsCount={incidents.length}
        criticalCount={criticalCount}
        onSeedDemoData={handleSeedDemoData}
        onOpenSimulateModal={() => setIsSimulateModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Dynamic Multi-Page Router Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6">
        
        {/* PAGE 1: SRE OPERATIONS DASHBOARD */}
        {currentPage === 'dashboard' && (
          <DashboardPage
            incidents={incidents}
            selectedIncident={selectedIncident}
            onSelectIncident={handleSelectIncident}
            onNavigateToIncidents={() => handleNavigate('incidents')}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onOpenSimulateModal={() => setIsSimulateModalOpen(true)}
            onOpenIngestModal={() => setIsIngestModalOpen(true)}
            backendOnline={backendOnline}
          />
        )}

        {/* PAGE 2: INCIDENT MANAGEMENT & AI INVESTIGATION WORKSPACE */}
        {currentPage === 'incidents' && (
          <IncidentsPage
            incidents={incidents}
            selectedIncident={selectedIncident}
            onSelectIncident={handleSelectIncident}
            logs={logs}
            onUpdateStatus={handleUpdateStatus}
            onRunAnalysis={handleRunAnalysis}
            isAnalyzing={isAnalyzing}
            onOpenIngestModal={() => setIsIngestModalOpen(true)}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onOpenSimulateModal={() => setIsSimulateModalOpen(true)}
          />
        )}

        {/* PAGE 3: SRE TELEMETRY STREAM & LOG LAB */}
        {currentPage === 'telemetry' && (
          <TelemetryPage
            logs={logs}
            incidents={incidents}
            onIngestLog={handleIngestLog}
            onOpenIngestModal={() => setIsIngestModalOpen(true)}
            onOpenSimulateModal={() => setIsSimulateModalOpen(true)}
            backendOnline={backendOnline}
          />
        )}

      </main>

      {/* Clean Enterprise Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-6 text-center text-xs text-slate-500 font-mono flex items-center justify-between max-w-7xl mx-auto w-full">
        <span className="font-sans text-slate-600 font-medium">IncidentOps AI — Incident Intelligence & Remediation Platform</span>
        <span className="hidden sm:inline text-slate-400">Spring Boot 3.2 • React 19 • Tailwind CSS</span>
      </footer>

      {/* Modals (Accessible from any page) */}
      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateIncident}
      />

      <IngestLogModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        incidentId={selectedIncident?.id || 1}
        onIngest={handleIngestLog}
      />

      <OutageSimulatorModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        onInjectScenario={handleInjectScenario}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
