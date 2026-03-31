package com.medily.backend.service.custom;

import com.medily.backend.dto.notification.NotificationResponseDTO;

import java.util.List;

public interface NotificationService {
    List<NotificationResponseDTO> getNotificationsByUser(Integer userId);
    void markAsRead(Integer notificationId);
    void createNotification(Integer userId, String message, String type);
}