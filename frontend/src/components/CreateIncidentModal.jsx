import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function CreateIncidentModal({ 
  isOpen, 
  onClose, 
  onCreate 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('CRITICAL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await onCreate({
        title: title.trim(),
        description: description.trim(),
        severity: severity,
      });
      setTitle('');
      setDescription('');
      setSeverity('CRITICAL');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create incident.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Declare Production Incident</h3>
              <p className="text-xs text-slate-500">Initialize a tracked incident record in Spring Boot</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Incident Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Payment Gateway 504 Gateway Timeout"
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* Severity Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Severity Level <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'CRITICAL', label: 'Critical', activeClass: 'border-rose-400 bg-rose-50 text-rose-700' },
                { value: 'HIGH', label: 'High', activeClass: 'border-amber-400 bg-amber-50 text-amber-700' },
                { value: 'MEDIUM', label: 'Medium', activeClass: 'border-blue-400 bg-blue-50 text-blue-700' },
                { value: 'LOW', label: 'Low', activeClass: 'border-slate-400 bg-slate-100 text-slate-700' },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSeverity(s.value)}
                  className={`py-2 rounded-lg text-xs font-semibold border transition text-center ${
                    severity === s.value 
                      ? `${s.activeClass} shadow-xs` 
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Description & Symptoms
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail error patterns, affected endpoints, customer impact, or related commits..."
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
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
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Incident'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
