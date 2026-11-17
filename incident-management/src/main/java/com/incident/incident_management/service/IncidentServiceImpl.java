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
import org.springframework.cache.annotation.Cacheable;
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

    // AI RAG Analysis with Cache-Aside Pattern & Historical Similarity Matching
    @Cacheable(value = "incidentAnalysis", key = "#id")
    @Override
    public AnalysisResponse analyzeIncident(Long id) {
        System.out.println(">>> [CACHE MISS] Fetching fresh Gemini AI RAG analysis for Incident ID: " + id);

        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with ID: " + id));

        List<LogEntry> logs = logRepository.findByIncidentIdOrderByTimestampDesc(id);

        // 1. Check for historical incident similarity across resolved incidents
        HistoricalMatch match = findBestHistoricalMatch(incident, logs);

        // 2. Perform RAG Analysis via Google Gemini
        AnalysisResponse analysisResponse = aiService.analyzeIncident(incident, logs);

        // 3. Attach Historical Similarity Score if a past match is found
        if (match != null && match.similarityPercentage >= 35) {
            String simScore = match.similarityPercentage + "% Match";
            analysisResponse.setSimilarityScore(simScore);
            analysisResponse.setSimilarIncidentId(match.pastIncident.getId());
            analysisResponse.setSimilarIncidentTitle(match.pastIncident.getTitle());
            System.out.println(">>> [HISTORICAL MATCH] Found " + simScore + " with past Incident #" + match.pastIncident.getId());

            // If AI fallback occurred, reuse proven historical root cause and playbook!
            if (analysisResponse.getRootCause() != null && analysisResponse.getRootCause().startsWith("AI Analysis Service Temporary Issue")) {
                if (match.pastIncident.getRootCause() != null) {
                    analysisResponse.setRootCause("[Historical Pattern Match] " + match.pastIncident.getRootCause());
                    analysisResponse.setConfidenceScore(match.similarityPercentage + "%");
                    analysisResponse.setSuggestedPlaybook(match.pastIncident.getSuggestedPlaybook());
                }
            }
        }

        // 4. Save analysis results to MySQL database
        incident.setRootCause(analysisResponse.getRootCause());
        incident.setSuggestedPlaybook(analysisResponse.getSuggestedPlaybook());
        incident.setConfidenceScore(analysisResponse.getConfidenceScore());
        incident.setSimilarityScore(analysisResponse.getSimilarityScore());
        incident.setSimilarIncidentId(analysisResponse.getSimilarIncidentId());
        incident.setSimilarIncidentTitle(analysisResponse.getSimilarIncidentTitle());
        incidentRepository.save(incident);

        return analysisResponse;
    }

    // Historical Incident Similarity Engine (Token Jaccard Coefficient)
    private static class HistoricalMatch {
        Incident pastIncident;
        int similarityPercentage;
        HistoricalMatch(Incident p, int s) { this.pastIncident = p; this.similarityPercentage = s; }
    }

    private HistoricalMatch findBestHistoricalMatch(Incident current, List<LogEntry> currentLogs) {
        List<Incident> allIncidents = incidentRepository.findAll();
        java.util.Set<String> currentTokens = tokenizeIncident(current, currentLogs);

        Incident bestMatch = null;
        double highestJaccard = 0.0;

        for (Incident past : allIncidents) {
            if (past.getId().equals(current.getId())) continue;
            // Prefer resolved or analyzed past incidents
            if (past.getRootCause() == null && past.getStatus() != IncidentStatus.RESOLVED) continue;

            java.util.Set<String> pastTokens = tokenizeIncident(past, java.util.Collections.emptyList());
            if (pastTokens.isEmpty()) continue;

            // Calculate Jaccard similarity: |A ∩ B| / |A ∪ B|
            java.util.Set<String> intersection = new java.util.HashSet<>(currentTokens);
            intersection.retainAll(pastTokens);

            java.util.Set<String> union = new java.util.HashSet<>(currentTokens);
            union.addAll(pastTokens);

            if (!union.isEmpty()) {
                double jaccard = (double) intersection.size() / union.size();
                if (jaccard > highestJaccard) {
                    highestJaccard = jaccard;
                    bestMatch = past;
                }
            }
        }

        if (bestMatch != null && highestJaccard > 0.15) {
            // Map jaccard (0.15 - 1.0) to realistic SRE similarity percentage (65% - 98%)
            int percent = (int) Math.min(98, Math.round(60 + (highestJaccard * 40)));
            return new HistoricalMatch(bestMatch, percent);
        }
        return null;
    }

    private java.util.Set<String> tokenizeIncident(Incident inc, List<LogEntry> logs) {
        java.util.Set<String> tokens = new java.util.HashSet<>();
        if (inc.getTitle() != null) extractTokens(inc.getTitle(), tokens);
        if (inc.getDescription() != null) extractTokens(inc.getDescription(), tokens);
        if (inc.getRootCause() != null) extractTokens(inc.getRootCause(), tokens);
        if (logs != null) {
            for (LogEntry l : logs) {
                if (l.getMessage() != null) extractTokens(l.getMessage(), tokens);
                if (l.getSourceService() != null) extractTokens(l.getSourceService(), tokens);
            }
        }
        return tokens;
    }

    private void extractTokens(String text, java.util.Set<String> set) {
        String[] words = text.toLowerCase().replaceAll("[^a-z0-9_\\-]", " ").split("\\s+");
        for (String w : words) {
            if (w.length() >= 3 && !isStopWord(w)) {
                set.add(w);
            }
        }
    }

    private boolean isStopWord(String w) {
        return w.equals("the") || w.equals("and") || w.equals("for") || w.equals("with") || 
               w.equals("this") || w.equals("that") || w.equals("error") || w.equals("failed");
    }

    // Helper method: Entity to DTO mapping
    private IncidentResponse mapToResponse(Incident incident) {
        IncidentResponse response = new IncidentResponse();
        response.setId(incident.getId());
        response.setTitle(incident.getTitle());
        response.setDescription(incident.getDescription());
        response.setSeverity(incident.getSeverity());
        response.setStatus(incident.getStatus());
        response.setRootCause(incident.getRootCause());
        response.setSuggestedPlaybook(incident.getSuggestedPlaybook());
        response.setConfidenceScore(incident.getConfidenceScore());
        response.setSimilarityScore(incident.getSimilarityScore());
        response.setSimilarIncidentId(incident.getSimilarIncidentId());
        response.setSimilarIncidentTitle(incident.getSimilarIncidentTitle());
        response.setCreatedAt(incident.getCreatedAt());
        response.setUpdatedAt(incident.getUpdatedAt());
        return response;
    }
}
