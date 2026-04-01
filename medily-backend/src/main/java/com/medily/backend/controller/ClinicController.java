package com.medily.backend.controller;

import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.dto.clinic.ClinicRequestDTO;
import com.medily.backend.dto.clinic.ClinicResponseDTO;
import com.medily.backend.service.custom.ClinicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clinics")
@RequiredArgsConstructor
public class ClinicController {

    private final ClinicService clinicService;

    // Create a new clinic (Admin only)
    @PostMapping
    public ResponseEntity<ApiResponse<ClinicResponseDTO>> createClinic(
            @Valid @RequestBody ClinicRequestDTO request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.success(clinicService.createClinic(request), "Clinic created"));
    }

    // Update a clinic by id (Admin only)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClinicResponseDTO>> updateClinic(
            @PathVariable Integer id,
            @Valid @RequestBody ClinicRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.success(clinicService.updateClinic(id, request), "Clinic updated"));
    }

    // Retrieve all registered clinics (Anyone can view)
    @GetMapping
    public ResponseEntity<ApiResponse<List<ClinicResponseDTO>>> getAllClinics() {
        return ResponseEntity.ok(ApiResponse.success(clinicService.getAllClinics()));
    }

    // Retrieve specific registered clinics (Anyone can view)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClinicResponseDTO>> getClinicById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(clinicService.getClinicById(id)));
    }

    // Remove a clinic by id (Admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClinic(@PathVariable Integer id) {
        clinicService.deleteClinic(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Clinic deleted"));
    }
}