package com.medily.backend.dto.activitylog;

import lombok.Data;

@Data
public class ActivityLogResponseDTO {
    private Long id;
    private String userName;
    private String action;
    private String createdAt;
}