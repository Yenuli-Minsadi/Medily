package com.medily.backend.controller;

import com.medily.backend.dto.auth.AuthResponseDTO;
import com.medily.backend.dto.auth.LoginRequestDTO;
import com.medily.backend.dto.auth.RegisterRequestDTO;
import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.service.custom.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> register(@Valid @RequestBody RegisterRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.success(authService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.success(authService.login(request)));
    }
}