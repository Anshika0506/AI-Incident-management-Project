package com.incident.incident_management.service;

import com.incident.incident_management.dto.AnalysisResponse;
import com.incident.incident_management.model.Incident;
import com.incident.incident_management.model.LogEntry;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIServiceImpl implements AIService {

    @Override
    public AnalysisResponse analyzeIncident(Incident incident, List<LogEntry> logs) {

        StringBuilder logsText = new StringBuilder();
        if (logs != null && !logs.isEmpty()) {
            for (LogEntry log : logs) {
                logsText.append("[").append(log.getLogLevel()).append("] ")
                        .append(log.getMessage())
                        .append("\n");
            }
        } else {
            logsText.append("No specific raw logs attached.");
        }

        // Step 2: RAG Prompt Construct (Augment)
        String prompt = buildRAGPrompt(incident, logsText.toString());

        System.out.println("--- GENERATED RAG PROMPT ---");
        System.out.println(prompt);

        // Step 3: Mock AI Response (Jab tak LLM API Key configure nahi karte)
        // Generation Result
        AnalysisResponse response = new AnalysisResponse();
        response.setRootCause("High Memory & DB Connection Timeout detected in logs.");
        response.setConfidenceScore("92%");
        response.setSuggestedPlaybook("1. Restart payment-service pod.\n2. Increase Hikari pool size to 50.\n3. Check unclosed DB connections.");

        return response;
    }

    // Helper Method to build RAG Prompt
    private String buildRAGPrompt(Incident incident, String logsText) {
        return "SYSTEM: You are an Incident Management AI Expert.\n" +
                "INCIDENT TITLE: " + incident.getTitle() + "\n" +
                "DESCRIPTION: " + incident.getDescription() + "\n" +
                "RAW LOGS:\n" + logsText + "\n" +
                "TASK: Analyze the root cause and provide actionable resolution steps.";
    }
}
