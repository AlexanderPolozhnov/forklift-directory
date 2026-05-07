package com.alexanderpolozhnov.forklift_directory.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public record ForkliftRequest(
        @NotBlank(message = "Бренд не может быть пустым")
        String brand,

        @NotBlank(message = "Номер не может быть пустым")
        @Pattern(regexp = "^\\S+$", message = "Номер не должен содержать пробелы")
        String number,

        @NotNull(message = "Грузоподъемность обязательна")
        @DecimalMin(value = "0.001", message = "Грузоподъемность должна быть больше 0")
        BigDecimal loadCapacity,

        @NotNull(message = "Статус активности обязателен")
        Boolean isActive
) {}
