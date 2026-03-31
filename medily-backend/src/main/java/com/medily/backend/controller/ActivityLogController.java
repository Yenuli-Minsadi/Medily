package com.medily.backend.controller;

import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.dto.activitylog.ActivityLogResponseDTO;
import com.medily.backend.service.custom.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    // Admin views recent activity logs
    @GetMapping
    public ResponseEntity<ApiResponse<List<ActivityLogResponseDTO>>> getRecentLogs() {
        return ResponseEntity.ok(ApiResponse.success(activityLogService.getRecentLogs()));
    }
}
