package com.medily.backend.dto.clinic;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClinicRequestDTO {
    @NotBlank
    private String name;
    @NotBlank

    private String address;

    private String contactNumber;

    @NotBlank
    private String city;
}