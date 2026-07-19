package com.medily.backend.controller;

import com.medily.backend.dto.chat.ChatMessageDTO;
import com.medily.backend.dto.chat.ChatRoomDTO;
import com.medily.backend.dto.chat.CreateChatRoomRequest;
import com.medily.backend.dto.chat.SendMessageRequest;
import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.entity.User;
import com.medily.backend.repository.AppointmentRepository;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.impl.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;

    // Get all chat rooms for current user
    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<List<ChatRoomDTO>>> getChatRooms() {
        Integer userId = getCurrentUserId();
        String role = getCurrentUserRole();
        return ResponseEntity.ok(ApiResponse.success(
            chatService.getChatRoomsForUser(userId, role)));
    }

    // Create or get existing chat room
    @PostMapping("/rooms")
    public ResponseEntity<ApiResponse<ChatRoomDTO>> createChatRoom(
            @RequestBody CreateChatRoomRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            chatService.createOrGetChatRoom(
                request.getPatientId(), request.getParticipantId())));
    }

    // Get messages for a chat room
    @GetMapping("/rooms/{chatRoomId}/messages")
    public ResponseEntity<ApiResponse<List<ChatMessageDTO>>> getMessages(
            @PathVariable Integer chatRoomId) {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
            chatService.getMessages(chatRoomId, userId)));
    }

    // Send a message via REST (WebSocket push happens inside service)
    @PostMapping("/rooms/{chatRoomId}/messages")
    public ResponseEntity<ApiResponse<ChatMessageDTO>> sendMessage(
            @PathVariable Integer chatRoomId,
            @RequestBody SendMessageRequest request) {
        Integer senderId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
            chatService.sendMessage(chatRoomId, senderId, request.getContent())));
    }

    // Get all patients
    @GetMapping("/patients")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllPatients() {
        List<Map<String, Object>> patients = userRepository.findAll().stream()
            .filter(u -> u.getRole().name().equals("PATIENT"))
            .map(u -> Map.<String, Object>of(
                "userId", u.getUserId(),
                "fullName", u.getFullName()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    @GetMapping("/participants")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getParticipants() {
        List<Map<String, Object>> participants = userRepository.findAll().stream()
                .filter(u -> u.getRole().name().equals("DOCTOR")
                        || u.getRole().name().equals("PHARMACIST"))
                .map(u -> Map.<String, Object>of(
                        "userId", u.getUserId(),
                        "fullName", u.getFullName(),
                        "role", u.getRole().name()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(participants));
    }

    @GetMapping("/doctor-patients")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDoctorPatients() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User doctor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Get patients who have appointments with this doctor
        List<Map<String, Object>> patients = appointmentRepository
                .findByDoctor_User_UserId(doctor.getUserId())
                .stream()
                .map(apt -> apt.getPatient())
                .distinct()
                .map(p -> {
                    User patientUser = p.getUser();
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("userId", patientUser.getUserId());
                    map.put("fullName", patientUser.getFullName());
                    map.put("email", patientUser.getEmail());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    private Integer getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
            .map(User::getUserId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String getCurrentUserRole() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
            .map(u -> u.getRole().name())
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}