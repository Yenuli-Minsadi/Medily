package com.medily.backend.service.custom.impl;

import com.medily.backend.dto.activitylog.ActivityLogResponseDTO;
import com.medily.backend.entity.ActivityLog;
import com.medily.backend.entity.User;
import com.medily.backend.repository.ActivityLogRepository;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<ActivityLogResponseDTO> getRecentLogs() {
        return activityLogRepository.findTop20ByOrderByCreatedAtDesc()
                .stream()
                .map(log -> {
                    ActivityLogResponseDTO dto = new ActivityLogResponseDTO();
                    dto.setId(Long.valueOf(log.getLogId()));
                    dto.setUserName(log.getUser().getFullName());
                    dto.setAction(log.getAction());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void log(Long userId, String action) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ActivityLog log = new ActivityLog();
        log.setUser(user);
        log.setAction(action);
        activityLogRepository.save(log);
    }
}