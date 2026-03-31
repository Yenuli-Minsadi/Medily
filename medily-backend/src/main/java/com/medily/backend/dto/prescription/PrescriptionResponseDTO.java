package com.medily.backend.dto.prescription;

import lombok.Data;

import java.util.List;

@Data
public class PrescriptionResponseDTO {
    private Integer id;
    private String doctorName;
    private String patientName;
    private String appointmentDate;
    private String notes;
    private List<PrescriptionItemResponseDTO> items;
    private String createdAt;
}