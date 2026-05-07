package com.alexanderpolozhnov.forklift_directory.dto.response;

public record AuthResponse(
        String accessToken,
        String fullName
) {}
