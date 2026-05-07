package com.alexanderpolozhnov.forklift_directory.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ForkliftRequest(
        @NotBlank String brand,
        @NotBlank String number,
        @NotNull @DecimalMin("0.001") BigDecimal loadCapacity,
        @NotNull Boolean isActive
) {}
