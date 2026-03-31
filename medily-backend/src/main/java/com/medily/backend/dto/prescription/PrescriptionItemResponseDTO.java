package com.medily.backend.dto.prescription;

import lombok.Data;

@Data
public class PrescriptionItemResponseDTO {
    private Integer id;
    private String medicineName;
    private String dosage;
    private String duration;
    private String instructions;
}