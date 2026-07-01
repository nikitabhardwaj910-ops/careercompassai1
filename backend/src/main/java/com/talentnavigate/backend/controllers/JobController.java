package com.talentnavigate.backend.controllers;

import com.talentnavigate.backend.models.Job;
import com.talentnavigate.backend.models.Notification;
import com.talentnavigate.backend.models.User;
import com.talentnavigate.backend.repositories.JobRepository;
import com.talentnavigate.backend.repositories.NotificationRepository;
import com.talentnavigate.backend.repositories.UserRepository;
import com.talentnavigate.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @GetMapping
    public ResponseEntity<List<Job>> getAllActiveJobs() {
        return ResponseEntity.ok(jobRepository.findByStatus("Active"));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody Job jobRequest, Authentication authentication) {
        User postedByUser = null;
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            try {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                postedByUser = userRepository.findById(userDetails.getId()).orElse(null);
            } catch (Exception e) {
                // Fall back if principal casting fails
            }
        }
        
        if (postedByUser == null) {
            List<User> users = userRepository.findAll();
            if (!users.isEmpty()) {
                postedByUser = users.get(0);
            } else {
                User admin = new User();
                admin.setFullName("System Admin");
                admin.setEmail("admin@careercompass.ai");
                admin.setPassword("admin123");
                postedByUser = userRepository.save(admin);
            }
        }

        Job job = new Job();
        job.setTitle(jobRequest.getTitle());
        job.setCompany(jobRequest.getCompany());
        job.setType(jobRequest.getType());
        job.setLocation(jobRequest.getLocation());
        job.setDescription(jobRequest.getDescription());
        job.setRequiredSkills(jobRequest.getRequiredSkills());
        job.setStatus(jobRequest.getStatus() != null ? jobRequest.getStatus() : "Active");
        job.setDeadline(jobRequest.getDeadline() != null ? jobRequest.getDeadline() : "2026-07-31");
        job.setPostedBy(postedByUser);
        job.setPostedAt(LocalDateTime.now());
        job.setApplicantsCount(0);

        Job savedJob = jobRepository.save(job);

        boolean isInternship = savedJob.getType() != null && savedJob.getType().toLowerCase().contains("intern");
        String typeLabel = isInternship ? "Internship" : "Job";

        // Notify users about the new post
        try {
            Notification notif = new Notification();
            notif.setTitle("New " + typeLabel + " Posted: " + savedJob.getTitle());
            notif.setMessage(savedJob.getCompany() + " is hiring for a " + savedJob.getTitle() + " in " + savedJob.getLocation() + ". Check it out on your " + typeLabel + " Dashboard!");
            notif.setType(isInternship ? "internship" : "job");
            notif.setTime("Just now");
            notif.setRead(false);
            notif.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notif);
        } catch (Exception e) {
            System.err.println("Failed to create notification: " + e.getMessage());
        }

        return ResponseEntity.ok(savedJob);
    }

    @PostMapping("/recommendations")
    public ResponseEntity<?> getJobRecommendations(@RequestBody Map<String, Object> request) {
        try {
            List<Job> activeJobs = jobRepository.findByStatus("Active");
            if (activeJobs.isEmpty()) {
                activeJobs = jobRepository.findAll();
            }
            
            String typeFilter = (String) request.get("typeFilter");
            if (typeFilter != null && !typeFilter.isEmpty()) {
                activeJobs = activeJobs.stream()
                        .filter(j -> j.getType() != null && j.getType().toLowerCase().contains(typeFilter.toLowerCase()))
                        .toList();
            }
            
            Object skillsObj = request.get("skills");
            String resumeText = (String) request.get("resumeText");
            
            if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.equals("your_api_key_here")) {
                return ResponseEntity.ok(activeJobs);
            }
            
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            String jobsJson = mapper.writeValueAsString(activeJobs);
            
            String prompt = "You are an expert AI Career Coach. Given the candidate's resume/skills and the list of available jobs, select and rank the best matching jobs.\n" +
                    "Candidate Skills/Resume: " + (skillsObj != null ? skillsObj.toString() : resumeText) + "\n\n" +
                    "Available Jobs (JSON): " + jobsJson + "\n\n" +
                    "Return STRICTLY a JSON array of objects, where each object represents a recommended job containing all original job fields plus two additional fields:\n" +
                    "- matchScore (integer between 75 and 99 representing match percentage)\n" +
                    "- aiReasoning (short 1-2 sentence explanation of why this job matches the candidate's skills)\n" +
                    "Do NOT output markdown code blocks. Output ONLY the raw JSON array.";
            
            Map<String, Object> part = Map.of("text", prompt);
            Map<String, Object> content = Map.of("parts", new Object[]{part});
            Map<String, Object> requestBody = Map.of("contents", new Object[]{content});
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
            Map<String, Object> responseBody = response.getBody();
            
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List candidates = (List) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> candidate = (Map<String, Object>) candidates.get(0);
                    Map<String, Object> contentObj = (Map<String, Object>) candidate.get("content");
                    List parts = (List) contentObj.get("parts");
                    if (!parts.isEmpty()) {
                        Map<String, Object> firstPart = (Map<String, Object>) parts.get(0);
                        String jsonString = (String) firstPart.get("text");
                        jsonString = jsonString.replaceAll("^```json\\s*", "").replaceAll("\\s*```$", "").trim();
                        List<Map<String, Object>> recommendedJobs = mapper.readValue(jsonString, List.class);
                        return ResponseEntity.ok(recommendedJobs);
                    }
                }
            }
            return ResponseEntity.ok(activeJobs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(jobRepository.findAll());
        }
    }
}
