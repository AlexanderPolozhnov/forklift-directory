package com.alexanderpolozhnov.forklift_directory.dto.response;

import java.time.LocalDateTime;

public record IncidentResponse(
        Long id,
        Long forkliftId,
        LocalDateTime startedAt,
        LocalDateTime resolvedAt,
        String description,
        String downtimeFormatted
) {}
