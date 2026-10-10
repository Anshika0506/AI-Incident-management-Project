package com.incident.incident_management.service;

import com.incident.incident_management.dto.IngestLogRequest;
import com.incident.incident_management.dto.LogResponse;

import java.util.List;

public interface LogService {

    LogResponse ingestLog(IngestLogRequest request);

    List<LogResponse> getLogsByIncidentId(Long incidentId);
}
