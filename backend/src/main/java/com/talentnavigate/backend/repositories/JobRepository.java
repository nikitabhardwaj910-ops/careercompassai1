package com.talentnavigate.backend.repositories;

import com.talentnavigate.backend.models.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, String> {
    List<Job> findByStatus(String status);
    List<Job> findByPostedById(String userId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT j.postedBy) FROM Job j")
    long countDistinctEmployers();
}
