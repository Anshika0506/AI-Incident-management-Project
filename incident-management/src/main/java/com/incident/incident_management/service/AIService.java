package com.incident.incident_management.service;

import com.incident.incident_management.dto.AnalysisResponse;
import com.incident.incident_management.model.Incident;
import com.incident.incident_management.model.LogEntry;
import java.util.List;

public interface AIService {
    AnalysisResponse analyzeIncident(Incident incident, List<LogEntry> logs);
}
