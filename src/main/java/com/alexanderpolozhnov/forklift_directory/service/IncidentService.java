package com.alexanderpolozhnov.forklift_directory.service;

import com.alexanderpolozhnov.forklift_directory.dto.request.IncidentRequest;
import com.alexanderpolozhnov.forklift_directory.dto.response.IncidentResponse;
import com.alexanderpolozhnov.forklift_directory.entity.Forklift;
import com.alexanderpolozhnov.forklift_directory.entity.Incident;
import com.alexanderpolozhnov.forklift_directory.exception.BusinessException;
import com.alexanderpolozhnov.forklift_directory.exception.ResourceNotFoundException;
import com.alexanderpolozhnov.forklift_directory.mapper.IncidentMapper;
import com.alexanderpolozhnov.forklift_directory.repository.ForkliftRepository;
import com.alexanderpolozhnov.forklift_directory.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final ForkliftRepository forkliftRepository;
    private final IncidentMapper incidentMapper;

    @Transactional(readOnly = true)
    public List<IncidentResponse> findByForkliftId(Long forkliftId) {
        findForkliftById(forkliftId);
        return incidentRepository.findByForkliftIdOrderByStartedAtDesc(forkliftId)
                .stream()
                .map(incidentMapper::toResponse)
                .toList();
    }

    @Transactional
    public IncidentResponse create(Long forkliftId, IncidentRequest request) {
        Forklift forklift = findForkliftById(forkliftId);
        validateDates(request);
        Incident incident = incidentMapper.toEntity(request);
        incident.setForklift(forklift);
        return incidentMapper.toResponse(incidentRepository.save(incident));
    }

    @Transactional
    public IncidentResponse update(Long id, IncidentRequest request) {
        Incident incident = findIncidentById(id);
        validateDates(request);
        incidentMapper.updateEntity(incident, request);
        return incidentMapper.toResponse(incidentRepository.save(incident));
    }

    @Transactional
    public void delete(Long id) {
        findIncidentById(id);
        incidentRepository.deleteById(id);
    }

    private Forklift findForkliftById(Long id) {
        return forkliftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Forklift not found with id: " + id));
    }

    private Incident findIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + id));
    }

    private void validateDates(IncidentRequest request) {
        if (request.resolvedAt() != null && request.resolvedAt().isBefore(request.startedAt())) {
            throw new BusinessException("resolvedAt must be after or equal to startedAt", HttpStatus.BAD_REQUEST);
        }
    }
}
