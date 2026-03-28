package com.medily.backend.dto.doctor;

import lombok.Data;

@Data
public class DoctorSummaryDTO {
    private Long id;
    private String name;
    private String specialization;
}