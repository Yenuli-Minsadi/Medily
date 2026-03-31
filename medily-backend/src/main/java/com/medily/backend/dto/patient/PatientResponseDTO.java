package com.medily.backend.dto.patient;

import lombok.Data;

@Data
public class PatientResponseDTO {
    private Integer id;
    private String name;
    private String email;
    private String contact;
    private String address;
    private String dateOfBirth;
    private String bloodGroup;
}