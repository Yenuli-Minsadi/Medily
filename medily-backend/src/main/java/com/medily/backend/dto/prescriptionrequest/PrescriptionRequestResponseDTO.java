package com.medily.backend.dto.prescriptionrequest;

import lombok.Data;

@Data
public class PrescriptionRequestResponseDTO {
    private Integer id;
    private String patientName;
    private String pharmacyName;
    private String status;// Pending, Accepted, Rejected
    private String createdAt;
    private String prescriptionNotes;
}