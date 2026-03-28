package com.medily.backend.service.custom;

import com.medily.backend.dto.auth.AuthResponseDTO;
import com.medily.backend.dto.auth.LoginRequestDTO;
import com.medily.backend.dto.auth.RegisterRequestDTO;

public interface AuthService {
    AuthResponseDTO register(RegisterRequestDTO request);
    AuthResponseDTO login(LoginRequestDTO request);
}