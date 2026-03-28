package com.medily.backend.dto.clinic;

import lombok.Data;

@Data
public class ClinicResponseDTO {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String phone;
}