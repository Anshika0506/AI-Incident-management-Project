package com.incident.incident_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private String rootCause;
    private String confidenceScore;
    private String suggestedPlaybook;
    private String similarityScore;
    private Long similarIncidentId;
    private String similarIncidentTitle;

}
