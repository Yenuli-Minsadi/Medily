package com.medily.backend.controller;

import com.medily.backend.dto.appointment.AppointmentRequestDTO;
import com.medily.backend.dto.appointment.AppointmentResponseDTO;
import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    // Patient books an appointment
    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> bookAppointment(
            @Valid @RequestBody AppointmentRequestDTO request) {
        Integer patientUserId = getCurrentUserId();
        return ResponseEntity.status(201)
                .body(ApiResponse.success(
                        appointmentService.bookAppointment(patientUserId, request),
                        "Appointment booked successfully"
                ));
    }

    // Patient views their appointments
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getMyAppointments() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                appointmentService.getAppointmentsByPatient(userId)));
    }

    // Doctor views their appointments
    @GetMapping("/doctor")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getDoctorAppointments() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                appointmentService.getAppointmentsByDoctor(userId)));
    }

    // Doctor or Admin updates appointment status
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> updateStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success(
                appointmentService.updateStatus(id, status)));
    }

    // Admin views all appointments
    @GetMapping
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getAllAppointments() {
        return ResponseEntity.ok(ApiResponse.success(
                appointmentService.getAllAppointments()));
    }

    private Integer getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}