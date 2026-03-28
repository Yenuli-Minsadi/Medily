package com.medily.backend.dto.notification;

import lombok.Data;

@Data
public class NotificationResponseDTO {
    private Long id;
    private String message;
    private String type;
    private boolean read;
    private String createdAt;
}