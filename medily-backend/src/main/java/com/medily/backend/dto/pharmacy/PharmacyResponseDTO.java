package com.medily.backend.dto.pharmacy;

import lombok.Data;

@Data
public class PharmacyResponseDTO {
    private Long id;
    private String name;
    private String address;
    private String phone;
}