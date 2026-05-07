package com.alexanderpolozhnov.forklift_directory.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "forklifts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Forklift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String brand;

    @Column(nullable = false, length = 100)
    private String number;

    @Column(name = "load_capacity", nullable = false, precision = 10, scale = 3)
    private BigDecimal loadCapacity;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "modified_at", nullable = false)
    private LocalDateTime modifiedAt;

    @Column(name = "modified_by", nullable = false, length = 255)
    private String modifiedBy;

    @OneToMany(mappedBy = "forklift", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Incident> incidents = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        modifiedAt = LocalDateTime.now();
        if (isActive == null) {
            isActive = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        modifiedAt = LocalDateTime.now();
    }
}
