package com.alexanderpolozhnov.forklift_directory.service;

import com.alexanderpolozhnov.forklift_directory.dto.request.ForkliftRequest;
import com.alexanderpolozhnov.forklift_directory.exception.BusinessException;
import com.alexanderpolozhnov.forklift_directory.mapper.ForkliftMapper;
import com.alexanderpolozhnov.forklift_directory.repository.ForkliftRepository;
import com.alexanderpolozhnov.forklift_directory.repository.IncidentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ForkliftServiceTest {

    @Mock
    private ForkliftRepository forkliftRepository;

    @Mock
    private IncidentRepository incidentRepository;

    @Mock
    private ForkliftMapper forkliftMapper;

    @InjectMocks
    private ForkliftService forkliftService;

    @Test
    void create_WhenNumberExists_ShouldThrowBusinessException() {
        // Arrange
        String duplicateNumber = "FL-001";
        ForkliftRequest request = new ForkliftRequest("Brand", duplicateNumber, new BigDecimal("2.5"), true);
        when(forkliftRepository.existsByNumberIgnoreCase(duplicateNumber)).thenReturn(true);

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> forkliftService.create(request));
        assertEquals("Погрузчик с номером FL-001 уже существует", exception.getMessage());
        assertEquals(HttpStatus.CONFLICT, exception.getStatus());
    }

    @Test
    void update_WhenNumberExistsForOtherId_ShouldThrowBusinessException() {
        // Arrange
        Long targetId = 1L;
        String duplicateNumber = "FL-002";
        ForkliftRequest request = new ForkliftRequest("Brand", duplicateNumber, new BigDecimal("2.5"), true);
        when(forkliftRepository.existsByNumberIgnoreCaseAndIdNot(duplicateNumber, targetId)).thenReturn(true);

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> forkliftService.update(targetId, request));
        assertEquals("Погрузчик с номером FL-002 уже существует", exception.getMessage());
        assertEquals(HttpStatus.CONFLICT, exception.getStatus());
    }
}
