package com.incident.incident_management.controller;

import com.incident.incident_management.dto.AnalysisResponse;
import com.incident.incident_management.dto.CreateIncidentRequest;
import com.incident.incident_management.dto.IncidentResponse;
import com.incident.incident_management.model.IncidentStatus;
import com.incident.incident_management.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    // 1. Create a new incident
    @PostMapping
    public ResponseEntity<IncidentResponse> createIncident(@Valid @RequestBody CreateIncidentRequest request) {
        IncidentResponse createdIncident = incidentService.createIncident(request);
        return new ResponseEntity<>(createdIncident, HttpStatus.CREATED);
    }

    // 2. Get all incidents
    @GetMapping
    public ResponseEntity<List<IncidentResponse>> getAllIncidents() {
        List<IncidentResponse> incidents = incidentService.getAllIncidents();
        return ResponseEntity.ok(incidents);
    }

    // 3. Get incident by ID
    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getIncidentById(@PathVariable Long id) {
        IncidentResponse incident = incidentService.getIncidentById(id);
        return ResponseEntity.ok(incident);
    }

    // 4. Update incident status
    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentResponse> updateIncidentStatus(
            @PathVariable Long id,
            @RequestParam IncidentStatus status) {
        IncidentResponse updatedIncident = incidentService.updateIncidentStatus(id, status);
        return ResponseEntity.ok(updatedIncident);
    }
@PostMapping("/{id}/analyze")
public ResponseEntity<AnalysisResponse> analyzeIncident(@PathVariable Long id) {
    AnalysisResponse response = incidentService.analyzeIncident(id);
    return ResponseEntity.ok(response);
}}
