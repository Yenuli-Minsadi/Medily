package com.medily.backend.controller;

import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.dto.doctor.*;
import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;
    private final UserRepository userRepository;

    // Initialize/update doctor profile after signup (Doctor only)
    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> completeProfile(
            @Valid @RequestBody DoctorRequestDTO request) {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                doctorService.completeProfile((userId), request), "Profile completed"));
    }

    // Retrieve doctor profile info (Doctor only)
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> getMyProfile() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(doctorService.getDoctorByUserId((userId))));
    }

    // List all registered doctors (Anyone can view)
    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> getAllDoctors() {
        return ResponseEntity.ok(ApiResponse.success(doctorService.getAllDoctors()));
    }

    // Filter doctors by medical specialization (Anyone can view)
    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> getBySpecialization(
            @PathVariable String specialization) {
        return ResponseEntity.ok(ApiResponse.success(
                doctorService.getDoctorsBySpecialization(specialization)));
    }
    private Integer getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}