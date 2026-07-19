package com.medily.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AuthResponseDTO {
    private String token;
    private String role;
    private String name;
    private Integer userId;
    private String accountStatus;
    private Boolean isSubscribed;
}