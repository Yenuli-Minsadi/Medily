package com.medily.backend.dto.doctor;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DoctorAvailabilityRequestDTO {
    @NotBlank
    private String dayOfWeek;   // MONDAY, TUESDAY etc.
    @NotBlank
    private String startTime;   // HH:mm
    @NotBlank
    private String endTime;
}