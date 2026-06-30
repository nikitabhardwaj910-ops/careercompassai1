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
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = notificationRepository.findAllByOrderByCreatedAtDesc();
        if (notifications.isEmpty()) {
            // Seed initial notifications if empty
            Notification n1 = new Notification(null, "match", "New Top Match: Machine Learning Intern", "Globex AI just posted a role that matches your profile at 96%. Apply now!", "2 hours ago", false, LocalDateTime.now().minusHours(2));
            Notification n2 = new Notification(null, "ai", "Aether Insight: Resume Score Improved", "Your recent upload boosted your ATS score to 92%. Check the suggestions to reach 100%.", "5 hours ago", false, LocalDateTime.now().minusHours(5));
            Notification n3 = new Notification(null, "interview", "Interview Scheduled: Initech", "Your technical round is confirmed for Thursday at 2:00 PM EST. Check your calendar.", "Yesterday", true, LocalDateTime.now().minusDays(1));
            notificationRepository.saveAll(List.of(n1, n2, n3));
            notifications = notificationRepository.findAllByOrderByCreatedAtDesc();
        }
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead() {
        List<Notification> notifications = notificationRepository.findAll();
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
        return ResponseEntity.ok().build();
    }
}
