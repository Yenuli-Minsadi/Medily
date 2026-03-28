package com.medily.backend.dto.prescription;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class PrescriptionCreateRequestDTO {
    @NotNull
    private Long patientId;
    @NotNull
    private Long appointmentId;
    private String notes;
    @NotNull
    private List<PrescriptionItemRequestDTO> items;
}