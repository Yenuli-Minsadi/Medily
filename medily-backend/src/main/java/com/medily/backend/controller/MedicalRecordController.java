package com.medily.backend.controller;

import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.dto.medical.MedicalRecordRequestDTO;
import com.medily.backend.dto.medical.MedicalRecordResponseDTO;
import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.MedicalRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;
    private final UserRepository userRepository;

    // Create a new medical record (Doctor only)
    @PostMapping
    public ResponseEntity<ApiResponse<MedicalRecordResponseDTO>> createRecord(
            @Valid @RequestBody MedicalRecordRequestDTO request) {
        Integer userId = getCurrentUserId();
        return ResponseEntity.status(201).body(ApiResponse.success(
                medicalRecordService.createRecord((userId), request), "Record created"));
    }

    // List medical records (Patient only)
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<MedicalRecordResponseDTO>>> getMyRecords() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                medicalRecordService.getRecordsByPatient(userId)));
    }

    private Integer getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}