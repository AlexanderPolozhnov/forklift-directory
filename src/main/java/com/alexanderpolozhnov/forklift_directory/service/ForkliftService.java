package com.alexanderpolozhnov.forklift_directory.service;

import com.alexanderpolozhnov.forklift_directory.dto.request.ForkliftRequest;
import com.alexanderpolozhnov.forklift_directory.dto.response.ForkliftResponse;
import com.alexanderpolozhnov.forklift_directory.entity.AppUser;
import com.alexanderpolozhnov.forklift_directory.entity.Forklift;
import com.alexanderpolozhnov.forklift_directory.exception.BusinessException;
import com.alexanderpolozhnov.forklift_directory.exception.ResourceNotFoundException;
import com.alexanderpolozhnov.forklift_directory.mapper.ForkliftMapper;
import com.alexanderpolozhnov.forklift_directory.repository.ForkliftRepository;
import com.alexanderpolozhnov.forklift_directory.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ForkliftService {

    private final ForkliftRepository forkliftRepository;
    private final IncidentRepository incidentRepository;
    private final ForkliftMapper forkliftMapper;

    @Transactional(readOnly = true)
    public Page<ForkliftResponse> findAll(String number, Pageable pageable) {
        return forkliftRepository.findByNumberContainingIgnoreCase(number, pageable)
                .map(forkliftMapper::toResponse);
    }

    @Transactional
    public ForkliftResponse create(ForkliftRequest request) {
        if (forkliftRepository.existsByNumberIgnoreCase(request.number())) {
            throw new BusinessException("Погрузчик с номером " + request.number() + " уже существует", HttpStatus.CONFLICT);
        }
        Forklift forklift = forkliftMapper.toEntity(request);
        forklift.setModifiedBy(getCurrentUserFullName());
        return forkliftMapper.toResponse(forkliftRepository.save(forklift));
    }

    @Transactional
    public ForkliftResponse update(Long id, ForkliftRequest request) {
        if (forkliftRepository.existsByNumberIgnoreCaseAndIdNot(request.number(), id)) {
            throw new BusinessException("Погрузчик с номером " + request.number() + " уже существует", HttpStatus.CONFLICT);
        }
        Forklift forklift = findForkliftById(id);
        forkliftMapper.updateEntity(forklift, request);
        forklift.setModifiedBy(getCurrentUserFullName());
        return forkliftMapper.toResponse(forkliftRepository.save(forklift));
    }

    @Transactional
    public void delete(Long id) {
        findForkliftById(id);
        long incidentCount = incidentRepository.countByForkliftId(id);
        if (incidentCount > 0) {
            throw new BusinessException(
                    "Невозможно удалить погрузчик с текущими инцидентами. Количество: " + incidentCount,
                    HttpStatus.CONFLICT
            );
        }
        forkliftRepository.deleteById(id);
    }

    private Forklift findForkliftById(Long id) {
        return forkliftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Погрузчик не найден с идентификатором: " + id));
    }

    private String getCurrentUserFullName() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof AppUser appUser) {
            return appUser.getFullName();
        }
        return "system";
    }
}
