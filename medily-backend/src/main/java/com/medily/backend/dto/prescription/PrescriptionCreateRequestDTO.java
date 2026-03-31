package com.medily.backend.dto.prescription;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class PrescriptionCreateRequestDTO {
    @NotNull
    private Integer patientId;
    @NotNull
    private Integer appointmentId;
    private String notes;
    @NotNull
    private List<PrescriptionItemRequestDTO> items;
}