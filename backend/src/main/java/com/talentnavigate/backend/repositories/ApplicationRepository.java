package com.talentnavigate.backend.repositories;

import com.talentnavigate.backend.models.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {
    List<Application> findByUserId(String userId);
    List<Application> findByJobId(String jobId);
    boolean existsByJobIdAndUserId(String jobId, String userId);
}
