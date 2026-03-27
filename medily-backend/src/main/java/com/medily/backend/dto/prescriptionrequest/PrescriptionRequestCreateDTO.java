// This is the Patient → Pharmacy request (the Uber-like flow)
package com.medily.backend.dto.prescriptionrequest;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PrescriptionRequestCreateDTO {
    @NotNull
    private Long prescriptionId;  // which prescription they're sending
    @NotNull
    private Long pharmacyId;      // which pharmacy they chose
}