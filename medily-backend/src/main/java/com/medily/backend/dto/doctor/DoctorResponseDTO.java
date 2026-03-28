package com.medily.backend.dto.doctor;

import lombok.Data;

@Data
public class DoctorResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String specialization;
    private String qualifications;
    private String clinicName;
    private String clinicCity;
}