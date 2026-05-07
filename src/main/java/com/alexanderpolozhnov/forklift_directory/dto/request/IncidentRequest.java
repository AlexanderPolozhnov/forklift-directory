package com.alexanderpolozhnov.forklift_directory.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record IncidentRequest(
        @NotNull LocalDateTime startedAt,
        LocalDateTime resolvedAt,
        String description
) {}
