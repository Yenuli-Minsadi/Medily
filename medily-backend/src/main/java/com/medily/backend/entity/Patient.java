package com.medily.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.Period;

@Entity
@Table(name = "patient")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Integer patientId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Transient
    public Integer getAge() {
        return (this.dateOfBirth != null) ? Period.between(this.dateOfBirth, LocalDate.now()).getYears() : null;
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    // Enum
    public enum Gender {
        MALE, FEMALE, OTHER
    }
}