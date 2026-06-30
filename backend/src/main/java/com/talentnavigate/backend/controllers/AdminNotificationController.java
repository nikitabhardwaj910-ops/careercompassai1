package com.talentnavigate.backend.controllers;

import com.talentnavigate.backend.models.AdminNotification;
import com.talentnavigate.backend.repositories.AdminNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/notifications")
public class AdminNotificationController {

    @Autowired
    private AdminNotificationRepository adminNotificationRepository;

    @GetMapping
    public ResponseEntity<List<AdminNotification>> getAllAdminNotifications() {
        return ResponseEntity.ok(adminNotificationRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<AdminNotification> createAdminNotification(@RequestBody AdminNotification notification) {
        // Here we could also loop through users and create personal notifications if the status is "Sent"
        AdminNotification saved = adminNotificationRepository.save(notification);
        return ResponseEntity.ok(saved);
    }
}
