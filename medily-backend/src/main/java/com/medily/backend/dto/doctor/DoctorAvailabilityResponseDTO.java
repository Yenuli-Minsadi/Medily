package com.medily.backend.dto.doctor;

import lombok.Data;

@Data
public class DoctorAvailabilityResponseDTO {
    private Integer id;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
}