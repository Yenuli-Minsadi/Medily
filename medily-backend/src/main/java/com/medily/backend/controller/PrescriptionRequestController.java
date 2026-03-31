package com.medily.backend.controller;

import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.dto.prescriptionrequest.PrescriptionRequestCreateDTO;
import com.medily.backend.dto.prescriptionrequest.PrescriptionRequestResponseDTO;
import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.PrescriptionRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescription-requests")
@RequiredArgsConstructor
public class PrescriptionRequestController {

    private final PrescriptionRequestService prescriptionRequestService;
    private final UserRepository userRepository;

    // Submit a prescription to a specific pharmacy (Patient only)
    @PostMapping
    public ResponseEntity<ApiResponse<PrescriptionRequestResponseDTO>> sendRequest(
            @Valid @RequestBody PrescriptionRequestCreateDTO request) {
        Integer userId = getCurrentUserId();
        return ResponseEntity.status(201).body(ApiResponse.success(
                prescriptionRequestService.sendRequest((userId), request), "Request sent to pharmacy"));
    }

    // Retrieve all prescription requests initiated by the current patient
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PrescriptionRequestResponseDTO>>> getMyRequests() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                prescriptionRequestService.getRequestsByPatient(userId)));
    }

    // Fetch incoming prescription inquiries for the current pharmacist's store
    @GetMapping("/pharmacy")
    public ResponseEntity<ApiResponse<List<PrescriptionRequestResponseDTO>>> getPharmacyRequests() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                prescriptionRequestService.getRequestsByPharmacy(userId)));
    }

    // Update availability status of a requested prescription (Pharmacist only)
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<PrescriptionRequestResponseDTO>> updateStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success(
                prescriptionRequestService.updateStatus(id, status), "Status updated"));
    }

    private Integer getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}