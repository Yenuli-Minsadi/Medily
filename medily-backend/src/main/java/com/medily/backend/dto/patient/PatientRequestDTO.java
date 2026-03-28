package com.medily.backend.dto.patient;

import lombok.Data;

@Data
public class PatientRequestDTO {
    private String contact;
    private String address;
    private String dateOfBirth;
    private String bloodGroup;
    private String gender;
}