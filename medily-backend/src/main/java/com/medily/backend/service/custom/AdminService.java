package com.medily.backend.service.custom;

import com.medily.backend.dto.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

public interface AdminService {

    List<Map<String, Object>> getPendingDoctors();
    void approveDoctor(Integer userId);
    void rejectDoctor(Integer userId);
    List<Map<String, Object>> getAllUsers();
    void deactivateUser(Integer userId);
    void activateUser(Integer userId);

}
