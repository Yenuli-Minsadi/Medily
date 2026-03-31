package com.medily.backend.dto.clinic;

import lombok.Data;

@Data
public class ClinicResponseDTO {
    private Integer id;
    private String name;

    private String address;

    private String contactNumber;
    private String city;
}