package com.talentnavigate.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String type; // e.g., "Full-time", "Internship", "Contract"

    @Column(nullable = false)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    private List<String> requiredSkills;

    @Column(nullable = false)
    private String status; // e.g., "Active", "Pending", "Expired"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by_user_id")
    private User postedBy;

    private LocalDateTime postedAt = LocalDateTime.now();

    private Integer applicantsCount = 0;

    private String deadline;
}
