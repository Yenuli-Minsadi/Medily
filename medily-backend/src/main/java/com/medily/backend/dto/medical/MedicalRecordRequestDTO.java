package com.medily.backend.dto.medical;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MedicalRecordRequestDTO {
    @NotNull
    private Integer patientId;
    @NotBlank
    private String diagnosis;
    private String notes;
}