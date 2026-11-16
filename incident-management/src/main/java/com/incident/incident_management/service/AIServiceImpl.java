package com.incident.incident_management.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.incident.incident_management.dto.AnalysisResponse;
import com.incident.incident_management.model.Incident;
import com.incident.incident_management.model.LogEntry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class AIServiceImpl implements AIService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestClient restClient = RestClient.create();

    @Override
    public AnalysisResponse analyzeIncident(Incident incident, List<LogEntry> logs) {
        // 1. Format logs for RAG context
        StringBuilder logsText = new StringBuilder();
        if (logs != null && !logs.isEmpty()) {
            for (LogEntry log : logs) {
                logsText.append("[").append(log.getLogLevel()).append("] ")
                        .append(log.getMessage())
                        .append("\n");
            }
        } else {
            logsText.append("No specific logs provided.");
        }

        // 2. RAG Prompt Engineering
        String prompt = buildRAGPrompt(incident, logsText.toString());

        try {
            // 3. Gemini Request Payload
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", prompt)))
                    )
            );

            // 4. Calling Google Gemini API
            String endpoint = geminiApiUrl + "?key=" + geminiApiKey;

            String responseString = restClient.post()
                    .uri(endpoint)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            // 5. Parse Gemini Response
            JsonNode rootNode = objectMapper.readTree(responseString);
            String aiRawText = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            // Extract JSON from markdown backticks if returned
            aiRawText = aiRawText.replaceAll("```json", "").replaceAll("```", "").trim();

            JsonNode parsedJson = objectMapper.readTree(aiRawText);

            AnalysisResponse analysisResponse = new AnalysisResponse();
            analysisResponse.setRootCause(parsedJson.path("rootCause").asText());
            analysisResponse.setConfidenceScore(parsedJson.path("confidenceScore").asText());

            // Handle playbook whether it is a String or an Array
            JsonNode playbookNode = parsedJson.path("suggestedPlaybook");
            if (playbookNode.isArray()) {
                StringBuilder sb = new StringBuilder();
                for (JsonNode step : playbookNode) {
                    sb.append(step.asText()).append("\n");
                }
                analysisResponse.setSuggestedPlaybook(sb.toString().trim());
            } else {
                analysisResponse.setSuggestedPlaybook(playbookNode.asText());
            }

            return analysisResponse;

        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            AnalysisResponse fallback = new AnalysisResponse();
            fallback.setRootCause("AI Analysis Service Temporary Issue: " + e.getMessage());
            fallback.setConfidenceScore("N/A");
            fallback.setSuggestedPlaybook("Please review the logs manually.");
            return fallback;
        }
    }

    private String buildRAGPrompt(Incident incident, String logsText) {
        return "You are an expert SRE / DevOps Incident Intelligence AI.\n" +
                "Analyze this production incident and return ONLY a valid JSON object (no markdown, no other text) with keys: 'rootCause', 'confidenceScore', and 'suggestedPlaybook'.\n\n" +
                "INCIDENT TITLE: " + incident.getTitle() + "\n" +
                "DESCRIPTION: " + incident.getDescription() + "\n" +
                "LOGS:\n" + logsText + "\n";
    }
}
