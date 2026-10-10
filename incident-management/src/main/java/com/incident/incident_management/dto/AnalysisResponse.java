package com.incident.incident_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse {

    private String rootCause;
    private String confidenceScore;
    private String suggestedPlaybook;

}
