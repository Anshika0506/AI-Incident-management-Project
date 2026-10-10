package com.incident.incident_management.controller;

import com.incident.incident_management.dto.IngestLogRequest;
import com.incident.incident_management.dto.LogResponse;
import com.incident.incident_management.service.LogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/logs")
@RequiredArgsConstructor
public class LogController {

    private final LogService logService;

    // 1. Ingest a raw log entry
    @PostMapping
    public ResponseEntity<LogResponse> ingestLog(@Valid @RequestBody IngestLogRequest request) {
        LogResponse createdLog = logService.ingestLog(request);
        return new ResponseEntity<>(createdLog, HttpStatus.CREATED);
    }

    // 2. Fetch all logs for a specific incident ID
    @GetMapping("/incident/{incidentId}")
    public ResponseEntity<List<LogResponse>> getLogsByIncident(@PathVariable Long incidentId) {
        List<LogResponse> logs = logService.getLogsByIncidentId(incidentId);
        return ResponseEntity.ok(logs);
    }
}
