package com.medily.backend.dto.prescriptionrequest;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PrescriptionRequestResponseDTO {
    private Integer id;
    private String patientName;
    private LocalDate issuedDate;
    private String pharmacyName;
    private String status;// Pending, Accepted, Rejected
    private String createdAt;
    private String prescriptionNotes;
}