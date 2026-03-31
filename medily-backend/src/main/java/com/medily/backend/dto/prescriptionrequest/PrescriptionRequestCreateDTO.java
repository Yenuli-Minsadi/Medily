//Patient → Pharmacy request (Uber-like flow)
package com.medily.backend.dto.prescriptionrequest;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PrescriptionRequestCreateDTO {
    @NotNull
    private Integer prescriptionId;
    @NotNull
    private Integer pharmacyId;
}