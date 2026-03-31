package com.medily.backend.dto.user;

import lombok.Data;

@Data
public class UserResponseDTO {
    private Integer id;
    private String name;
    private String email;
    private String role;
    private String createdAt;
}