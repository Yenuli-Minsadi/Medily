package com.medily.backend.dto.doctor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DoctorRequestDTO {
    @NotBlank
    private String specialization;
    @NotBlank
    private String qualifications;
    @NotNull
    private Long clinicId;
}