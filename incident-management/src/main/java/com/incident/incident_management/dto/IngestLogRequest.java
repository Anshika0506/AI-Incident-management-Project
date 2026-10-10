package com.incident.incident_management.dto;

import com.incident.incident_management.model.LogLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngestLogRequest {

    @NotNull(message = "Incident ID is required")
    private Long incidentId;

    @NotNull(message = "Log Level is required")
    private LogLevel logLevel;

    @NotBlank(message = "Source Service is required")
    private String sourceService;

    @NotBlank(message = "Log message is required")
    private String message;

    private String stackTrace;
}
