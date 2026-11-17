package com.incident.incident_management.dto;

import com.incident.incident_management.model.IncidentStatus;
import com.incident.incident_management.model.Severity;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentResponse {

    private Long id;
    private String title;
    private String description;
    private Severity severity;
    private IncidentStatus status;
    private String rootCause;
    private String suggestedPlaybook;
    private String confidenceScore;
    private String similarityScore;
    private Long similarIncidentId;
    private String similarIncidentTitle;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public String getSuggestedPlaybook() {
        return suggestedPlaybook;
    }

    public void setSuggestedPlaybook(String suggestedPlaybook) {
        this.suggestedPlaybook = suggestedPlaybook;
    }

    public String getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(String confidenceScore) {
        this.confidenceScore = confidenceScore;
    }
}
