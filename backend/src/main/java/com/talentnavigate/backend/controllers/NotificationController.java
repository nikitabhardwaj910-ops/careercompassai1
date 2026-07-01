package com.talentnavigate.backend.controllers;

import com.talentnavigate.backend.models.Notification;
import com.talentnavigate.backend.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications(org.springframework.security.core.Authentication authentication) {
        String currentUserId = null;
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            try {
                com.talentnavigate.backend.security.UserDetailsImpl userDetails = (com.talentnavigate.backend.security.UserDetailsImpl) authentication.getPrincipal();
                currentUserId = userDetails.getId();
            } catch (Exception e) {}
        }

        List<Notification> all = notificationRepository.findAllByOrderByCreatedAtDesc();
        if (all.isEmpty()) {
            Notification n1 = new Notification(null, "match", "New Top Match: Machine Learning Intern", "Globex AI just posted a role that matches your profile at 96%. Apply now!", "2 hours ago", false, LocalDateTime.now().minusHours(2));
            Notification n2 = new Notification(null, "ai", "Aether Insight: Resume Score Improved", "Your recent upload boosted your ATS score to 92%. Check the suggestions to reach 100%.", "5 hours ago", false, LocalDateTime.now().minusHours(5));
            Notification n3 = new Notification(null, "interview", "Interview Scheduled: Initech", "Your technical round is confirmed for Thursday at 2:00 PM EST. Check your calendar.", "Yesterday", true, LocalDateTime.now().minusDays(1));
            notificationRepository.saveAll(List.of(n1, n2, n3));
            all = notificationRepository.findAllByOrderByCreatedAtDesc();
        }

        List<Notification> userNotifications = new java.util.ArrayList<>();
        for (Notification n : all) {
            if (n.getUserId() == null || (currentUserId != null && currentUserId.equals(n.getUserId()))) {
                userNotifications.add(n);
            }
        }
        return ResponseEntity.ok(userNotifications);
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead(org.springframework.security.core.Authentication authentication) {
        String currentUserId = null;
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            try {
                com.talentnavigate.backend.security.UserDetailsImpl userDetails = (com.talentnavigate.backend.security.UserDetailsImpl) authentication.getPrincipal();
                currentUserId = userDetails.getId();
            } catch (Exception e) {}
        }
        String finalUserId = currentUserId;
        List<Notification> notifications = notificationRepository.findAll();
        for (Notification n : notifications) {
            if (n.getUserId() == null || (finalUserId != null && finalUserId.equals(n.getUserId()))) {
                n.setRead(true);
            }
        }
        notificationRepository.saveAll(notifications);
        return ResponseEntity.ok().build();
    }
}
