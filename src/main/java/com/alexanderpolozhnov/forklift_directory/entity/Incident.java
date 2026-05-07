package com.alexanderpolozhnov.forklift_directory.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "incidents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forklift_id", nullable = false)
    private Forklift forklift;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(columnDefinition = "TEXT")
    private String description;

    public long getDowntimeMinutes() {
        LocalDateTime end = resolvedAt != null ? resolvedAt : LocalDateTime.now();
        return ChronoUnit.MINUTES.between(startedAt, end);
    }
}
