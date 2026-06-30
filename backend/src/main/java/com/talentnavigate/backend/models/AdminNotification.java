package com.talentnavigate.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String message;

    @Column(nullable = false)
    private String targetAudience; // e.g., "All Users", "All Students", "All Employers"

    @Column(nullable = false)
    private String type; // e.g., "System Announcement", "Job Alert", "Marketing"

    @Column(nullable = false)
    private String status; // e.g., "Sent", "Draft"

    private LocalDateTime createdAt = LocalDateTime.now();
}
