package com.incident.incident_management.dto;

import com.incident.incident_management.model.LogLevel;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogResponse {

    private Long id;
    private Long incidentId;
    private LogLevel logLevel;
    private String sourceService;
    private String message;
    private String stackTrace;
    private LocalDateTime timestamp;
}
