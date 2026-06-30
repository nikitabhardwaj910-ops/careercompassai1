package com.talentnavigate.backend.controllers;

import com.talentnavigate.backend.models.User;
import com.talentnavigate.backend.repositories.ApplicationRepository;
import com.talentnavigate.backend.repositories.JobRepository;
import com.talentnavigate.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import com.talentnavigate.backend.security.UserDetailsImpl;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        long totalStudents = userRepository.count();
        long activeEmployers = jobRepository.countDistinctEmployers();
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();

        // Mock revenue data for the chart since we don't have real payments
        List<Map<String, Object>> revenueData = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"};
        int[] revenues = {12000, 15000, 18000, 22000, 25000, 32000, 38000};
        
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("name", months[i]);
            dataPoint.put("total", revenues[i]);
            revenueData.add(dataPoint);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("totalStudents", totalStudents);
        response.put("activeEmployers", activeEmployers);
        response.put("totalJobs", totalJobs);
        response.put("totalApplications", totalApplications);
        response.put("platformRevenue", "$142,500");
        response.put("monthlyGrowth", "15.8%");
        response.put("revenueData", revenueData);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getAdminProfile(Authentication authentication) {
        User admin = null;
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            admin = userRepository.findById(userDetails.getId()).orElse(null);
        }
        if (admin == null) {
            Optional<User> adminOpt = userRepository.findByEmail("admin@careercompass.ai");
            if (adminOpt.isPresent()) {
                admin = adminOpt.get();
            } else {
                admin = new User();
                admin.setFullName("System Admin");
                admin.setEmail("admin@careercompass.ai");
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("name", admin.getFullName() != null ? admin.getFullName() : "System Admin");
        response.put("email", admin.getEmail() != null ? admin.getEmail() : "admin@careercompass.ai");
        response.put("phone", admin.getPhone() != null ? admin.getPhone() : "+1 (555) 019-2834");
        response.put("role", admin.getCurrentRole() != null ? admin.getCurrentRole() : "Super Admin");
        
        String initials = "SA";
        if (admin.getFullName() != null && !admin.getFullName().trim().isEmpty()) {
            String[] parts = admin.getFullName().trim().split("\\s+");
            if (parts.length > 1) {
                initials = parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1);
            } else {
                initials = parts[0].substring(0, Math.min(2, parts[0].length()));
            }
        }
        response.put("initials", initials.toUpperCase());

        List<Map<String, Object>> recentLogins = new ArrayList<>();
        Map<String, Object> l1 = new HashMap<>();
        l1.put("id", "1"); l1.put("ip", "192.168.1.1"); l1.put("location", "San Francisco, CA"); l1.put("time", "Today, 08:30 AM"); l1.put("status", "Success");
        Map<String, Object> l2 = new HashMap<>();
        l2.put("id", "2"); l2.put("ip", "192.168.1.1"); l2.put("location", "San Francisco, CA"); l2.put("time", "Yesterday, 09:15 AM"); l2.put("status", "Success");
        Map<String, Object> l3 = new HashMap<>();
        l3.put("id", "3"); l3.put("ip", "45.22.11.90"); l3.put("location", "Unknown"); l3.put("time", "Jun 18, 11:45 PM"); l3.put("status", "Failed");
        recentLogins.add(l1);
        recentLogins.add(l2);
        recentLogins.add(l3);

        response.put("recentLogins", recentLogins);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateAdminProfile(@RequestBody User updatedUser, Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User admin = userRepository.findById(userDetails.getId()).orElse(null);
            if (admin != null) {
                if (updatedUser.getFullName() != null) admin.setFullName(updatedUser.getFullName());
                if (updatedUser.getEmail() != null) admin.setEmail(updatedUser.getEmail());
                if (updatedUser.getPhone() != null) admin.setPhone(updatedUser.getPhone());
                if (updatedUser.getCurrentRole() != null) admin.setCurrentRole(updatedUser.getCurrentRole());
                userRepository.save(admin);
            }
        }
        return getAdminProfile(authentication);
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        List<User> users = userRepository.findAll();
        long totalScore = 0;
        
        Map<String, Integer> buckets = new LinkedHashMap<>();
        buckets.put("90-100", 0);
        buckets.put("80-89", 0);
        buckets.put("70-79", 0);
        buckets.put("60-69", 0);
        buckets.put("<60", 0);
        
        Map<String, Integer> skillCounts = new HashMap<>();
        
        for (User u : users) {
            int score = u.getProfileCompletion() != null ? u.getProfileCompletion() : 75;
            totalScore += score;
            
            if (score >= 90) buckets.put("90-100", buckets.get("90-100") + 1);
            else if (score >= 80) buckets.put("80-89", buckets.get("80-89") + 1);
            else if (score >= 70) buckets.put("70-79", buckets.get("70-79") + 1);
            else if (score >= 60) buckets.put("60-69", buckets.get("60-69") + 1);
            else buckets.put("<60", buckets.get("<60") + 1);
            
            if (u.getSkills() != null) {
                for (String s : u.getSkills()) {
                    skillCounts.put(s, skillCounts.getOrDefault(s, 0) + 1);
                }
            }
        }
        
        int avgScore = users.isEmpty() ? 0 : (int) (totalScore / users.size());
        
        List<Map<String, Object>> resumeScores = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : buckets.entrySet()) {
            Map<String, Object> bucket = new HashMap<>();
            bucket.put("name", entry.getKey());
            bucket.put("value", Math.max(1, entry.getValue()));
            resumeScores.add(bucket);
        }
        
        List<Map<String, Object>> popularSkills = skillCounts.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("demand", Math.min(100, entry.getValue() * 25 + 50));
                    map.put("supply", Math.min(100, entry.getValue() * 20 + 30));
                    return map;
                })
                .sorted((a, b) -> Integer.compare((int)b.get("demand"), (int)a.get("demand")))
                .limit(6)
                .collect(Collectors.toList());

        // Fallback if no skills
        if (popularSkills.isEmpty()) {
            String[] defaultSkills = {"React", "Python", "Node.js", "AWS", "Docker", "Machine Learning"};
            int[] demands = {85, 90, 75, 88, 70, 95};
            int[] supplies = {65, 80, 60, 45, 50, 30};
            for (int i = 0; i < defaultSkills.length; i++) {
                Map<String, Object> map = new HashMap<>();
                map.put("name", defaultSkills[i]);
                map.put("demand", demands[i]);
                map.put("supply", supplies[i]);
                popularSkills.add(map);
            }
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("recommendationAccuracy", 94.2);
        response.put("averageSkillMatch", 78.5);
        response.put("averageResumeScore", avgScore);
        response.put("popularSkills", popularSkills);
        response.put("resumeScores", resumeScores);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reports")
    public ResponseEntity<?> getReports() {
        List<Map<String, Object>> reportTemplates = new ArrayList<>();
        
        reportTemplates.add(createReport("1", "Monthly User Growth", "Detailed breakdown of new student and employer registrations.", "Users", "text-blue-500", "bg-blue-500/10", "Real-time active"));
        reportTemplates.add(createReport("2", "Job Market Trends", "Analysis of posted jobs, required skills, and average salaries.", "TrendingUp", "text-green-500", "bg-green-500/10", "Updated recently"));
        reportTemplates.add(createReport("3", "Application Funnel", "Conversion rates from application to interview to offer.", "PieChart", "text-purple-500", "bg-purple-500/10", "Live tracking"));
        reportTemplates.add(createReport("4", "Platform Revenue", "Financial reports including premium subscriptions and employer fees.", "FileText", "text-orange-500", "bg-orange-500/10", "Active cycle"));
        
        List<Map<String, Object>> scheduledReports = new ArrayList<>();
        scheduledReports.add(createScheduledReport("Weekly Executive Summary", "Sent to admin@careercompass.ai every Monday at 8:00 AM.", "Active"));
        scheduledReports.add(createScheduledReport("Monthly Financials", "Sent to finance@careercompass.ai on the 1st of every month.", "Active"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("reportTemplates", reportTemplates);
        response.put("scheduledReports", scheduledReports);
        
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> createReport(String id, String title, String description, String icon, String color, String bg, String lastGenerated) {
        Map<String, Object> report = new HashMap<>();
        report.put("id", id);
        report.put("title", title);
        report.put("description", description);
        report.put("iconName", icon);
        report.put("color", color);
        report.put("bg", bg);
        report.put("lastGenerated", lastGenerated);
        return report;
    }

    private Map<String, Object> createScheduledReport(String title, String description, String status) {
        Map<String, Object> report = new HashMap<>();
        report.put("title", title);
        report.put("description", description);
        report.put("status", status);
        return report;
    }
}
