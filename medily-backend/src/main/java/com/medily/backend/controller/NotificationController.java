package com.medily.backend.controller;

import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.dto.notification.NotificationResponseDTO;
import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    // List notification messages (Anyone can view)
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponseDTO>>> getMyNotifications() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                notificationService.getNotificationsByUser(userId)));
    }

    // Mark notification as read (Anyone)
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Integer id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Marked as read"));
    }

    private Integer getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}