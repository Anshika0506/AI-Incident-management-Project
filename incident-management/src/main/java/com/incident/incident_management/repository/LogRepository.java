package com.incident.incident_management.repository;

import com.incident.incident_management.model.LogEntry;
import com.incident.incident_management.model.LogLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<LogEntry, Long> {

    // Fetch all logs belonging to a specific incident ID
    List<LogEntry> findByIncidentIdOrderByTimestampDesc(Long incidentId);

    // Fetch logs by incident ID and specific LogLevel (e.g., fetch only ERROR logs for an incident)
    List<LogEntry> findByIncidentIdAndLogLevel(Long incidentId, LogLevel logLevel);
}
