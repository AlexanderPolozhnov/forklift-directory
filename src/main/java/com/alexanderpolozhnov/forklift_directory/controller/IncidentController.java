package com.alexanderpolozhnov.forklift_directory.controller;

import com.alexanderpolozhnov.forklift_directory.dto.request.IncidentRequest;
import com.alexanderpolozhnov.forklift_directory.dto.response.IncidentResponse;
import com.alexanderpolozhnov.forklift_directory.service.IncidentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/incidents")
@RequiredArgsConstructor
@Tag(name = "Incidents")
@SecurityRequirement(name = "bearerAuth")
public class IncidentController {

    private final IncidentService incidentService;

    @PutMapping("/{id}")
    @Operation(summary = "Update an incident")
    public ResponseEntity<IncidentResponse> update(@PathVariable Long id, @Valid @RequestBody IncidentRequest request) {
        return ResponseEntity.ok(incidentService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an incident")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        incidentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
