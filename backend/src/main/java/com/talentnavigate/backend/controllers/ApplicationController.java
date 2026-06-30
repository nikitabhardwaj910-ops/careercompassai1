package com.talentnavigate.backend.controllers;

import com.talentnavigate.backend.models.Application;
import com.talentnavigate.backend.models.Job;
import com.talentnavigate.backend.models.Notification;
import com.talentnavigate.backend.models.User;
import com.talentnavigate.backend.repositories.ApplicationRepository;
import com.talentnavigate.backend.repositories.JobRepository;
import com.talentnavigate.backend.repositories.NotificationRepository;
import com.talentnavigate.backend.repositories.UserRepository;
import com.talentnavigate.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private void cleanupTestUsers(String preferredName) {
        String nameToUse = (preferredName != null && !preferredName.trim().isEmpty()) ? preferredName : "Nikita Candidate";
        List<User> users = userRepository.findAll();
        for (User u : users) {
            if (u.getFullName() != null && (u.getFullName().equalsIgnoreCase("Test User") || u.getFullName().equalsIgnoreCase("test user") || u.getFullName().equalsIgnoreCase("System Admin"))) {
                if (!u.getFullName().equalsIgnoreCase("System Admin")) {
                    u.setFullName(nameToUse);
                    userRepository.save(u);
                }
            }
        }
    }

    private User getCurrentOrFallbackUser(Authentication authentication, String applicantName) {
        cleanupTestUsers(applicantName);
        String nameToUse = (applicantName != null && !applicantName.trim().isEmpty()) ? applicantName : "Nikita Candidate";

        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            try {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                Optional<User> uOpt = userRepository.findById(userDetails.getId());
                if (uOpt.isPresent()) {
                    User u = uOpt.get();
                    if ("Test User".equalsIgnoreCase(u.getFullName())) {
                        u.setFullName(nameToUse);
                        userRepository.save(u);
                    }
                    return u;
                }
            } catch (Exception e) {
                // Fallback below
            }
        }
        List<User> users = userRepository.findAll();
        if (!users.isEmpty()) {
            User firstUser = users.get(0);
            if ("Test User".equalsIgnoreCase(firstUser.getFullName())) {
                firstUser.setFullName(nameToUse);
                userRepository.save(firstUser);
            }
            return firstUser;
        }
        
        User defaultUser = new User();
        defaultUser.setFullName(nameToUse);
        defaultUser.setEmail("nikita@careercompass.ai");
        defaultUser.setPassword("pass123");
        return userRepository.save(defaultUser);
    }

    @PostMapping("/{jobId}")
    public ResponseEntity<?> applyForJob(@PathVariable String jobId, @RequestParam(required = false) String applicantName, Authentication authentication) {
        User user = getCurrentOrFallbackUser(authentication, applicantName);
        
        Optional<Job> jobOpt = jobRepository.findById(jobId);
        if (jobOpt.isEmpty()) return ResponseEntity.badRequest().body("Job not found");

        if (applicationRepository.existsByJobIdAndUserId(jobId, user.getId())) {
            return ResponseEntity.badRequest().body("You have already applied for this job");
        }

        Job job = jobOpt.get();
        job.setApplicantsCount(job.getApplicantsCount() + 1);
        jobRepository.save(job);

        Application application = new Application();
        application.setJob(job);
        application.setUser(user);
        application.setStatus("Applied");
        application.setAppliedAt(LocalDateTime.now());

        applicationRepository.save(application);

        return ResponseEntity.ok("Successfully applied for the job");
    }

    @GetMapping("/me")
    public ResponseEntity<List<Application>> getMyApplications(Authentication authentication, @RequestParam(required = false) String applicantName) {
        User user = getCurrentOrFallbackUser(authentication, applicantName);
        List<Application> apps = applicationRepository.findByUserId(user.getId());
        if (apps.isEmpty()) {
            List<Application> all = applicationRepository.findAll();
            if (applicantName != null && !applicantName.trim().isEmpty()) {
                List<Application> filtered = new ArrayList<>();
                for (Application a : all) {
                    if (a.getUser() != null && applicantName.equalsIgnoreCase(a.getUser().getFullName())) {
                        filtered.add(a);
                    }
                }
                if (!filtered.isEmpty()) return ResponseEntity.ok(filtered);
            }
            return ResponseEntity.ok(all);
        }
        return ResponseEntity.ok(apps);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getJobApplications(@PathVariable String jobId) {
        return ResponseEntity.ok(applicationRepository.findByJobId(jobId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Application>> getAllApplications() {
        cleanupTestUsers(null);
        return ResponseEntity.ok(applicationRepository.findAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<Application> appOpt = applicationRepository.findById(id);
        if (appOpt.isEmpty()) return ResponseEntity.badRequest().body("Application not found");

        Application app = appOpt.get();
        String newStatus = body.get("status");
        if (newStatus != null) {
            app.setStatus(newStatus);
        }
        if (body.containsKey("interviewDate") && body.get("interviewDate") != null) {
            app.setInterviewDate(body.get("interviewDate"));
        }
        applicationRepository.save(app);

        // Trigger real-time notification for the candidate
        try {
            Notification notif = new Notification();
            notif.setCreatedAt(LocalDateTime.now());
            notif.setTime("Just now");
            notif.setRead(false);

            String roleName = app.getJob() != null ? app.getJob().getTitle() : "Role";
            String compName = app.getJob() != null ? app.getJob().getCompany() : "Company";

            if ("Interview".equalsIgnoreCase(newStatus)) {
                notif.setTitle("Interview Scheduled: " + compName);
                String dateInfo = app.getInterviewDate() != null && !app.getInterviewDate().isEmpty() ? " on " + app.getInterviewDate() : "";
                notif.setMessage("Congratulations! You have been selected for an interview for " + roleName + dateInfo + ". Check your Application Review dashboard for details.");
                notif.setType("interview");
            } else if ("Selected".equalsIgnoreCase(newStatus)) {
                notif.setTitle("Offer Selected: " + compName);
                notif.setMessage("Congratulations! You have been selected for the " + roleName + " position at " + compName + "!");
                notif.setType("match");
            } else if ("Rejected".equalsIgnoreCase(newStatus)) {
                notif.setTitle("Application Update: " + compName);
                notif.setMessage("Thank you for applying to " + roleName + ". Unfortunately, the team decided to pursue other candidates.");
                notif.setType("system");
            } else if ("Under Review".equalsIgnoreCase(newStatus)) {
                notif.setTitle("Application Under Review: " + compName);
                notif.setMessage("Your application for " + roleName + " is now being actively reviewed by hiring managers.");
                notif.setType("job");
            } else {
                notif.setTitle("Status Changed: " + roleName);
                notif.setMessage("Your application status has been updated to " + newStatus + ".");
                notif.setType("job");
            }
            notificationRepository.save(notif);
        } catch (Exception e) {
            System.err.println("Failed to send application notification: " + e.getMessage());
        }

        return ResponseEntity.ok(app);
    }
}
