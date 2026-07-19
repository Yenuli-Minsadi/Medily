package com.medily.backend.controller;

import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.medily.backend.service.custom.EmailService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    // Get all pending doctors
    @GetMapping("/doctors/pending")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPendingDoctors() {
        List<Map<String, Object>> doctors = userRepository.findAll().stream()
                .filter(u -> u.getRole().name().equals("DOCTOR")
                        && u.getAccountStatus() == User.AccountStatus.PENDING)
                .map(u -> Map.<String, Object>of(
                        "userId", u.getUserId(),
                        "fullName", u.getFullName(),
                        "email", u.getEmail(),
                        "specialization", u.getSpecialization() != null ? u.getSpecialization() : "",
                        "medicalRegNumber", u.getMedicalRegNumber() != null ? u.getMedicalRegNumber() : "",
                        "accountStatus", u.getAccountStatus().name()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    // Approve doctor
    @PatchMapping("/doctors/{userId}/approve")
    public ResponseEntity<ApiResponse<String>> approveDoctor(@PathVariable Integer userId) {
        User doctor = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setAccountStatus(User.AccountStatus.ACTIVE);
        userRepository.save(doctor);

        // Send in-app notification
        notificationService.createNotification(
                doctor.getUserId(),
                "Your account has been verified! You can now access all features.",
                "VERIFICATION"
        );

        // Send email
        emailService.sendVerificationEmail(doctor.getEmail(), doctor.getFullName());

        return ResponseEntity.ok(ApiResponse.success("Doctor approved successfully"));
    }

    // Reject doctor
    @PatchMapping("/doctors/{userId}/reject")
    public ResponseEntity<ApiResponse<String>> rejectDoctor(@PathVariable Integer userId) {
        User doctor = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setAccountStatus(User.AccountStatus.REJECTED);
        userRepository.save(doctor);

        notificationService.createNotification(
                doctor.getUserId(),
                "Your account verification was unsuccessful. Please contact support.",
                "VERIFICATION"
        );

        return ResponseEntity.ok(ApiResponse.success("Doctor rejected"));
    }

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(u -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("userId", u.getUserId());
                    map.put("fullName", u.getFullName());
                    map.put("email", u.getEmail());
                    map.put("role", u.getRole().name());
                    map.put("status", u.getStatus() != null ? u.getStatus().name() : "ACTIVE");
                    map.put("accountStatus", u.getAccountStatus() != null ? u.getAccountStatus().name() : "ACTIVE");
                    map.put("createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : "");
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    // Deactivate user
    @PatchMapping("/users/{userId}/deactivate")
    public ResponseEntity<ApiResponse<String>> deactivateUser(@PathVariable Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.Status.INACTIVE);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("User deactivated"));
    }

    // Activate user
    @PatchMapping("/users/{userId}/activate")
    public ResponseEntity<ApiResponse<String>> activateUser(@PathVariable Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.Status.ACTIVE);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("User activated"));
    }
}
