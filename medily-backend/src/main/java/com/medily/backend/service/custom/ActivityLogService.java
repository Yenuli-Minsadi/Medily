package com.medily.backend.service.custom;

import com.medily.backend.dto.activitylog.ActivityLogResponseDTO;

import java.util.List;

public interface ActivityLogService {
    List<ActivityLogResponseDTO> getRecentLogs();
    void log(Integer userId, String action);
}