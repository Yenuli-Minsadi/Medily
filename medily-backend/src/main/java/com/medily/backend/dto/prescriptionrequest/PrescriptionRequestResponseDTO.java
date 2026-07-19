package com.medily.backend.dto.prescriptionrequest;

import com.medily.backend.dto.prescription.PrescriptionItemResponseDTO;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PrescriptionRequestResponseDTO {
    private Integer id;
    private Integer prescriptionId;
    private String patientName;
    private LocalDate issuedDate;
    private String pharmacyName;
    private String status;// Pending, Accepted, Rejected
    private String requestedAt;
    private String prescriptionNotes;
    private List<PrescriptionItemResponseDTO> items;
    private String doctorName;
}