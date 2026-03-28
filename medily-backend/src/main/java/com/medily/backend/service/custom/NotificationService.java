package com.medily.backend.service.custom;

import com.medily.backend.dto.notification.NotificationResponseDTO;

import java.util.List;

public interface NotificationService {
    List<NotificationResponseDTO> getNotificationsByUser(Long userId);
    void markAsRead(Long notificationId);
    void createNotification(Long userId, String message, String type);
}