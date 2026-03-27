package com.medily.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "post_audience")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostAudience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audience_id")
    private Integer audienceId;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @Enumerated(EnumType.STRING)
    @Column(name = "audience")
    private Audience audience;

    // Enum
    public enum Audience {
        ALL, PATIENTS, DOCTORS, PHARMACISTS
    }
}