package com.medily.backend.dto.pharmacy;

import lombok.Data;

@Data
public class PharmacyResponseDTO {
    private Integer id;
    private Integer pharmacistUserId;
    private String name;
    private String address;
    private String phone;
    private Double latitude;
    private Double longitude;
    private Double rating;              // e.g. 4.2
    private Integer avgResponseMinutes; // e.g. 15
    private Double distanceKm;
}