import React, { useState } from 'react';
import { X, Terminal, AlertTriangle, Sparkles, Send } from 'lucide-react';
import { SAMPLE_LOG_PRESETS } from '../data/mockData';

export default function IngestLogModal({
  isOpen,
  onClose,
  incidentId,
  onIngest
}) {
  const [logLevel, setLogLevel] = useState('ERROR');
  const [sourceService, setSourceService] = useState('payment-service');
  const [message, setMessage] = useState('');
  const [stackTrace, setStackTrace] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Apply a sample preset
  const handleApplyPreset = (preset) => {
    setLogLevel(preset.logLevel);
    setSourceService(preset.sourceService);
    setMessage(preset.message);
    setStackTrace(preset.stackTrace || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !sourceService.trim()) {
      setError('Source service and log message are required.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await onIngest({
        incidentId: Number(incidentId),
        logLevel,
        sourceService: sourceService.trim(),
        message: message.trim(),
        stackTrace: stackTrace.trim() || null,
      });

      // Clear & Close
      setMessage('');
      setStackTrace('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to ingest log.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-xl shadow-xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Ingest Microservice Telemetry Log</h3>
              <p className="text-xs text-slate-500">
                Target Incident <span className="font-mono text-indigo-600 font-semibold">#{incidentId}</span>
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Preset Buttons for Quick Demonstration */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Real-World Scenario Presets:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_LOG_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Log Level */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Log Level
              </label>
              <select
                value={logLevel}
                onChange={(e) => setLogLevel(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="ERROR">ERROR</option>
                <option value="FATAL">FATAL</option>
                <option value="WARN">WARN</option>
                <option value="INFO">INFO</option>
              </select>
            </div>

            {/* Source Service */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Source Service
              </label>
              <input
                type="text"
                required
                value={sourceService}
                onChange={(e) => setSourceService(e.target.value)}
                placeholder="e.g. payment-service"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Log Message */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Log Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Connection to MySQL DB timed out after 30000ms. HikariPool-1 exhausted."
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Stack Trace */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Stack Trace (Optional)
            </label>
            <textarea
              rows={4}
              value={stackTrace}
              onChange={(e) => setStackTrace(e.target.value)}
              placeholder="Paste exception stack trace (java.sql.SQLTransientConnectionException...)"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-rose-300 placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Ingesting...' : 'Ingest Log'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
