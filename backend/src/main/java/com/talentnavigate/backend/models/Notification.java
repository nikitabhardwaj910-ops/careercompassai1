package com.talentnavigate.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String type; // e.g., "match", "ai", "interview", "system", "job"

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    private String time; // e.g., "Just now", "2 hours ago"

    @Column(name = "is_read")
    private boolean read = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
