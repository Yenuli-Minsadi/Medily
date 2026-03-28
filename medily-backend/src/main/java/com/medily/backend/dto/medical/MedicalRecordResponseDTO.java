package com.medily.backend.dto.medical;

import lombok.Data;

@Data
public class MedicalRecordResponseDTO {
    private Long id;
    private String patientName;
    private String doctorName;
    private String diagnosis;
    private String notes;
    private String createdAt;
}