package com.medily.backend.controller;

import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.dto.pharmacy.PharmacyRequestDTO;
import com.medily.backend.dto.pharmacy.PharmacyResponseDTO;
import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.PharmacyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacies")
@RequiredArgsConstructor
public class PharmacyController {

    private final PharmacyService pharmacyService;
    private final UserRepository userRepository;

    // Initialize/update pharmacy profile after signup (Pharmacy only)
    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<PharmacyResponseDTO>> completeProfile(
            @Valid @RequestBody PharmacyRequestDTO request) {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                pharmacyService.completeProfile((userId), request), "Profile completed"));
    }

    // Retrieve pharmacist profile info (Pharmacist only)
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PharmacyResponseDTO>> getMyProfile() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(pharmacyService.getPharmacyByUserId((userId))));
    }

    // List all patients (Admin and Patient can view)
    @GetMapping
    public ResponseEntity<ApiResponse<List<PharmacyResponseDTO>>> getAllPharmacies() {
        return ResponseEntity.ok(ApiResponse.success(pharmacyService.getAllPharmacies()));
    }

    private Integer getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}