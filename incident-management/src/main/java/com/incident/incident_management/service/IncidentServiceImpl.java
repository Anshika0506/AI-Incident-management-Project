package com.incident.incident_management.service;

import com.incident.incident_management.dto.AnalysisResponse;
import com.incident.incident_management.dto.CreateIncidentRequest;
import com.incident.incident_management.dto.IncidentResponse;
import com.incident.incident_management.model.Incident;
import com.incident.incident_management.model.IncidentStatus;
import com.incident.incident_management.model.LogEntry;
import com.incident.incident_management.repository.IncidentRepository;
import com.incident.incident_management.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncidentServiceImpl implements IncidentService {

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private AIService aiService;

    @Override
    public IncidentResponse createIncident(CreateIncidentRequest request) {
        Incident incident = new Incident();
        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setSeverity(request.getSeverity());
        incident.setStatus(IncidentStatus.OPEN);

        Incident savedIncident = incidentRepository.save(incident);
        return mapToResponse(savedIncident);
    }

    @Override
    public List<IncidentResponse> getAllIncidents() {
        return incidentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public IncidentResponse getIncidentById(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with ID: " + id));
        return mapToResponse(incident);
    }

    @Override
    public IncidentResponse updateIncidentStatus(Long id, IncidentStatus status) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with ID: " + id));
        incident.setStatus(status);
        Incident updatedIncident = incidentRepository.save(incident);
        return mapToResponse(updatedIncident);
    }

    // AI RAG Analysis Implementation
    @Override
    public AnalysisResponse analyzeIncident(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with ID: " + id));

        List<LogEntry> logs = logRepository.findByIncidentIdOrderByTimestampDesc(id);

        return aiService.analyzeIncident(incident, logs);
    }

    // Helper method: Entity to DTO mapping
    private IncidentResponse mapToResponse(Incident incident) {
        IncidentResponse response = new IncidentResponse();
        response.setId(incident.getId());
        response.setTitle(incident.getTitle());
        response.setDescription(incident.getDescription());
        response.setSeverity(incident.getSeverity());
        response.setStatus(incident.getStatus());
        return response;
    }
}
