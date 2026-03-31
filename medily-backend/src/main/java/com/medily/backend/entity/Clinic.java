package com.medily.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clinic")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clinic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "clinic_id")
    private Integer clinicId;

    @Column(name = "name", length = 100)
    private String name;

    private String address;

    @Column(name = "contact_number", length = 10)
    private String contactNumber;

    @Column(name = "city", length = 255)
    private String city;
}