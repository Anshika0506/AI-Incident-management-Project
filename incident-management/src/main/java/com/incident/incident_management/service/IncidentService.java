package com.incident.incident_management.service;

import com.incident.incident_management.dto.AnalysisResponse;
import com.incident.incident_management.dto.CreateIncidentRequest;
import com.incident.incident_management.dto.IncidentResponse;
import com.incident.incident_management.model.IncidentStatus;

import java.util.List;

public interface IncidentService {

    IncidentResponse createIncident(CreateIncidentRequest request);

    List<IncidentResponse> getAllIncidents();

    IncidentResponse getIncidentById(Long id);

    IncidentResponse updateIncidentStatus(Long id, IncidentStatus status);


    AnalysisResponse analyzeIncident(Long id);
}
