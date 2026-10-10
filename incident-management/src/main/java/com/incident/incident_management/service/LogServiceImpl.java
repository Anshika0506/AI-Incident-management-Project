package com.incident.incident_management.service;

import com.incident.incident_management.dto.IngestLogRequest;
import com.incident.incident_management.dto.LogResponse;
import com.incident.incident_management.model.Incident;
import com.incident.incident_management.model.LogEntry;
import com.incident.incident_management.repository.IncidentRepository;
import com.incident.incident_management.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LogServiceImpl implements LogService {

    private final LogRepository logRepository;
    private final IncidentRepository incidentRepository;

    @Override
    public LogResponse ingestLog(IngestLogRequest request) {
        // 1. Verify that the referenced Incident exists in MySQL
        Incident incident = incidentRepository.findById(request.getIncidentId())
                .orElseThrow(() -> new RuntimeException("Cannot ingest log. Incident not found with ID: " + request.getIncidentId()));

        // 2. Build LogEntry entity
        LogEntry logEntry = LogEntry.builder()
                .incidentId(incident.getId())
                .logLevel(request.getLogLevel())
                .sourceService(request.getSourceService())
                .message(request.getMessage())
                .stackTrace(request.getStackTrace())
                .build();

        // 3. Save to MySQL
        LogEntry savedLog = logRepository.save(logEntry);

        return mapToResponse(savedLog);
    }

    @Override
    public List<LogResponse> getLogsByIncidentId(Long incidentId) {
        // Verify incident exists
        if (!incidentRepository.existsById(incidentId)) {
            throw new RuntimeException("Incident not found with ID: " + incidentId);
        }

        return logRepository.findByIncidentIdOrderByTimestampDesc(incidentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private LogResponse mapToResponse(LogEntry logEntry) {
        return LogResponse.builder()
                .id(logEntry.getId())
                .incidentId(logEntry.getIncidentId())
                .logLevel(logEntry.getLogLevel())
                .sourceService(logEntry.getSourceService())
                .message(logEntry.getMessage())
                .stackTrace(logEntry.getStackTrace())
                .timestamp(logEntry.getTimestamp())
                .build();
    }
}
