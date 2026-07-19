package com.medily.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequestDTO {
    @NotBlank
    private String name;
    @NotBlank @Email
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String role;// Admin, Doctor, Patient, Pharmacist

    private String specialization;
    private String medicalRegNumber;
}