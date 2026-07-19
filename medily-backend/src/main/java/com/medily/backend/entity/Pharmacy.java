package com.medily.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pharmacy")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pharmacy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pharmacy_id")
    private Integer pharmacyId;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "city", length = 255)
    private String city;

    @Column(name = "contact_number", length = 10)
    private String contactNumber;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "avg_response_minutes")
    private Integer avgResponseMinutes;
}