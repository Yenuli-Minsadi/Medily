package com.medily.backend.dto.clinic;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClinicRequestDTO {
    @NotBlank
    private String name;
    @NotBlank
    private String address;
    @NotBlank
    private String city;
    private String phone;
}