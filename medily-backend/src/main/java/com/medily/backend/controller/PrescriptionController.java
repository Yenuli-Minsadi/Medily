package com.medily.backend.controller;

import com.medily.backend.dto.clinic.ClinicRequestDTO;
import com.medily.backend.dto.clinic.ClinicResponseDTO;
import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.dto.prescription.PrescriptionCreateRequestDTO;
import com.medily.backend.dto.prescription.PrescriptionResponseDTO;
import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final UserRepository userRepository;

    // Create a new prescription (Doctor only)
    @PostMapping
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> createPrescription(
            @Valid @RequestBody PrescriptionCreateRequestDTO request) {

        // FIX: Use the helper method to get the ID from the Security Context
        Integer doctorUserId = getCurrentUserId();

        return ResponseEntity.status(201)
                .body(ApiResponse.success(
                        prescriptionService.createPrescription(doctorUserId, request),
                        "Prescription issued successfully"
                ));
    }

    // Update a clinic by id (Doctor only)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> updatePrescription(
            @PathVariable Integer id,
            @Valid @RequestBody PrescriptionCreateRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.success(prescriptionService.updatePrescription(id, request), "Prescription updated"));
    }

    // List all prescriptions (Patient only)
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>> getMyPrescriptions() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                prescriptionService.getPrescriptionsByPatient((userId))));
    }

    // List all prescriptions (Doctor only)
    @GetMapping("/doctor")
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>> getDoctorPrescriptions() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                prescriptionService.getPrescriptionsByDoctor((userId))));
    }

    // List specific prescription (Anyone)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> getPrescriptionById(
            @PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(
                prescriptionService.getPrescriptionById(id)));
    }

    private Integer getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}