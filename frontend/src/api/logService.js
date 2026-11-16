import apiClient from './client';

export const logService = {
  // 1. Fetch logs for a specific incident
  getLogsByIncidentId: async (incidentId) => {
    const response = await apiClient.get(`/v1/logs/incident/${incidentId}`);
    return response.data;
  },

  // 2. Ingest a new log entry
  ingestLog: async (payload) => {
    // payload: { incidentId, logLevel, sourceService, message, stackTrace }
    const response = await apiClient.post('/v1/logs', payload);
    return response.data;
  },
};
