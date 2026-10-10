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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
