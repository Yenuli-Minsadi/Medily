package com.medily.backend.controller;

import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.dto.patient.PatientRequestDTO;
import com.medily.backend.dto.patient.PatientResponseDTO;
import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final UserRepository userRepository;

    // Initialize/update doctor profile after signup (Doctor only)
    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<PatientResponseDTO>> completeProfile(
            @Valid @RequestBody PatientRequestDTO request) {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                patientService.completeProfile((userId), request), "Profile completed"));
    }

    // Retrieve patient profile info (Patient only)
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PatientResponseDTO>> getMyProfile() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(patientService.getPatientByUserId(userId)));
    }

    // List all patients (Admin and Doctor can view)
    @GetMapping
    public ResponseEntity<ApiResponse<List<PatientResponseDTO>>> getAllPatients() {
        return ResponseEntity.ok(ApiResponse.success(patientService.getAllPatients()));
    }

    private Integer getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}