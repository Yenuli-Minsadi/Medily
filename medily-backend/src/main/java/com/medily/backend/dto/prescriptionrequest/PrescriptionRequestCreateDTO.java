//Prescription Request from Patient to Pharmacy
package com.medily.backend.dto.prescriptionrequest;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PrescriptionRequestCreateDTO {
    @NotNull
    private Integer prescriptionId;

    @NotNull
    private Integer pharmacyId;

}