package com.medily.backend.dto.doctor;

import lombok.Data;

@Data
public class DoctorAvailabilityResponseDTO {
    private Long id;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
}