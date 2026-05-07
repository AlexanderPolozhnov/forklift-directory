package com.alexanderpolozhnov.forklift_directory.controller;

import com.alexanderpolozhnov.forklift_directory.dto.request.ForkliftRequest;
import com.alexanderpolozhnov.forklift_directory.dto.response.ForkliftResponse;
import com.alexanderpolozhnov.forklift_directory.dto.response.IncidentResponse;
import com.alexanderpolozhnov.forklift_directory.service.ForkliftService;
import com.alexanderpolozhnov.forklift_directory.service.IncidentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/forklifts")
@RequiredArgsConstructor
@Tag(name = "Forklifts")
@SecurityRequirement(name = "bearerAuth")
public class ForkliftController {

    private final ForkliftService forkliftService;
    private final IncidentService incidentService;

    @GetMapping
    @Operation(summary = "Get all forklifts with optional number filter")
    public ResponseEntity<Page<ForkliftResponse>> getAll(
            @RequestParam(required = false, defaultValue = "") String number,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(forkliftService.findAll(number, pageable));
    }

    @PostMapping
    @Operation(summary = "Create a new forklift")
    public ResponseEntity<ForkliftResponse> create(@Valid @RequestBody ForkliftRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(forkliftService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a forklift")
    public ResponseEntity<ForkliftResponse> update(@PathVariable Long id, @Valid @RequestBody ForkliftRequest request) {
        return ResponseEntity.ok(forkliftService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a forklift (forbidden if incidents exist)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        forkliftService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/incidents")
    @Operation(summary = "Get incidents for a forklift")
    public ResponseEntity<List<IncidentResponse>> getIncidents(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.findByForkliftId(id));
    }

    @PostMapping("/{id}/incidents")
    @Operation(summary = "Create an incident for a forklift")
    public ResponseEntity<IncidentResponse> createIncident(
            @PathVariable Long id,
            @Valid @RequestBody com.alexanderpolozhnov.forklift_directory.dto.request.IncidentRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(incidentService.create(id, request));
    }
}
