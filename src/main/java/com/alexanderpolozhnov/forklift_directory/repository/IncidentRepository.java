package com.alexanderpolozhnov.forklift_directory.repository;

import com.alexanderpolozhnov.forklift_directory.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    List<Incident> findByForkliftIdOrderByStartedAtDesc(Long forkliftId);

    long countByForkliftId(Long forkliftId);
}
