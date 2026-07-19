package com.medily.backend.controller;

import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> rateDoctor(
            @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(ApiResponse.success("Rating submitted"));// demo
    }
}