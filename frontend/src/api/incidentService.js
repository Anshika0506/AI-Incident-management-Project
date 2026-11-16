import apiClient from './client';

export const incidentService = {
  // 1. Fetch all incidents
  getAllIncidents: async () => {
    const response = await apiClient.get('/v1/incidents');
    return response.data;
  },

  // 2. Fetch single incident by ID
  getIncidentById: async (id) => {
    const response = await apiClient.get(`/v1/incidents/${id}`);
    return response.data;
  },

  // 3. Create a new incident
  createIncident: async (payload) => {
    // payload: { title, description, severity }
    const response = await apiClient.post('/v1/incidents', payload);
    return response.data;
  },

  // 4. Update incident status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/v1/incidents/${id}/status?status=${status}`);
    return response.data;
  },

  // 5. Trigger Google Gemini AI RAG Analysis
  analyzeIncident: async (id) => {
    const response = await apiClient.post(`/v1/incidents/${id}/analyze`);
    return response.data;
  },
};
