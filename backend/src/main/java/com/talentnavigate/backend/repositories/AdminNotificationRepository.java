package com.talentnavigate.backend.repositories;

import com.talentnavigate.backend.models.AdminNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminNotificationRepository extends JpaRepository<AdminNotification, String> {
    List<AdminNotification> findAllByOrderByCreatedAtDesc();
}
