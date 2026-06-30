package com.talentnavigate.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private String avatar;

    // Academic
    private String college;
    private String degree;
    private String specialization;
    private String currentYear;
    private String graduationYear;
    private String cgpa;

    // Professional
    @Column(name = "current_job_role")
    private String currentRole;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_skills", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    private List<String> skills;

    private String preferredRole;
    private String experienceLevel;
    
    @Column(length = 1000)
    private String certifications;
    
    private String portfolio;
    private String github;
    private String linkedin;

    // Resume
    private String resumeUrl;

    // Job Preferences
    private String jobPreference;
    private String preferredLocation;
    private String workMode;
    private String expectedStipend;
    private String expectedSalary;

    // AI Features
    @Column(length = 2000)
    private String careerGoal;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_domains", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "domain")
    private List<String> interestedDomains;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_industries", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "industry")
    private List<String> preferredIndustries;

    // Metadata
    private Boolean termsAccepted;
    private Integer profileCompletion = 0;
    private LocalDateTime createdAt = LocalDateTime.now();

}
