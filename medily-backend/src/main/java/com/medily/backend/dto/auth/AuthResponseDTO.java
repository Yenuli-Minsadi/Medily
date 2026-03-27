package com.medily.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String role;
    private String name;   // ChatGPT missed this — frontend needs it for the navbar
    private Long userId;
}