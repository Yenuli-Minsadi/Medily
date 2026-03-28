package com.medily.backend.dto.prescription;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PrescriptionItemRequestDTO {
    @NotBlank
    private String medicineName;
    @NotBlank
    private String dosage;
    @NotBlank
    private String duration;
    private String instructions;
}