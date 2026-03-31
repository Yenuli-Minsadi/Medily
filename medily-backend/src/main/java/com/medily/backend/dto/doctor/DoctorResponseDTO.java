package com.medily.backend.dto.doctor;

import lombok.Data;

@Data
public class DoctorResponseDTO {
    private Integer id;
    private String name;
    private String email;
    private String specialization;
    private String licenseNumber;
    private String clinicName;
    private String clinicCity;
}