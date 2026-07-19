package com.medily.backend.dto.prescription;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PrescriptionCreateRequestDTO {
    @NotNull
    private Integer patientId;
    private LocalDate issuedDate;
    @NotNull
    private Integer appointmentId;
    private String notes;
    @NotNull
    private List<PrescriptionItemRequestDTO> items;
}