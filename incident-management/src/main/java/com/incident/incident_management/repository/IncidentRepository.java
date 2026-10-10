package com.incident.incident_management.repository;

import com.incident.incident_management.model.Incident;
import com.incident.incident_management.model.IncidentStatus;
import com.incident.incident_management.model.Severity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

    // Custom query method: Find all incidents with a specific status (e.g. OPEN)
    List<Incident> findByStatus(IncidentStatus status);

    // Custom query method: Find all incidents by severity (e.g. CRITICAL)
    List<Incident> findBySeverity(Severity severity);

    // Custom query method: Find incidents by status ordered by creation time descending
    List<Incident> findByStatusOrderByCreatedAtDesc(IncidentStatus status);
}
