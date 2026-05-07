package com.alexanderpolozhnov.forklift_directory.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ForkliftResponse(
        Long id,
        String brand,
        String number,
        BigDecimal loadCapacity,
        Boolean isActive,
        LocalDateTime modifiedAt,
        String modifiedBy
) {}
