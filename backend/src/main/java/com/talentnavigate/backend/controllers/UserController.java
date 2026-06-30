package com.talentnavigate.backend.controllers;

import com.talentnavigate.backend.models.User;
import com.talentnavigate.backend.repositories.UserRepository;
import com.talentnavigate.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        
        // Update basic fields
        if(updatedUser.getFullName() != null) user.setFullName(updatedUser.getFullName());
        if(updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if(updatedUser.getAvatar() != null) user.setAvatar(updatedUser.getAvatar());

        // Academic
        if(updatedUser.getCollege() != null) user.setCollege(updatedUser.getCollege());
        if(updatedUser.getDegree() != null) user.setDegree(updatedUser.getDegree());
        if(updatedUser.getSpecialization() != null) user.setSpecialization(updatedUser.getSpecialization());
        if(updatedUser.getCurrentYear() != null) user.setCurrentYear(updatedUser.getCurrentYear());
        if(updatedUser.getGraduationYear() != null) user.setGraduationYear(updatedUser.getGraduationYear());
        if(updatedUser.getCgpa() != null) user.setCgpa(updatedUser.getCgpa());

        // Professional
        if(updatedUser.getCurrentRole() != null) user.setCurrentRole(updatedUser.getCurrentRole());
        if(updatedUser.getSkills() != null) user.setSkills(updatedUser.getSkills());
        if(updatedUser.getPreferredRole() != null) user.setPreferredRole(updatedUser.getPreferredRole());
        if(updatedUser.getExperienceLevel() != null) user.setExperienceLevel(updatedUser.getExperienceLevel());
        if(updatedUser.getCertifications() != null) user.setCertifications(updatedUser.getCertifications());
        if(updatedUser.getPortfolio() != null) user.setPortfolio(updatedUser.getPortfolio());
        if(updatedUser.getGithub() != null) user.setGithub(updatedUser.getGithub());
        if(updatedUser.getLinkedin() != null) user.setLinkedin(updatedUser.getLinkedin());

        // Resume & Job
        if(updatedUser.getResumeUrl() != null) user.setResumeUrl(updatedUser.getResumeUrl());
        if(updatedUser.getJobPreference() != null) user.setJobPreference(updatedUser.getJobPreference());
        if(updatedUser.getPreferredLocation() != null) user.setPreferredLocation(updatedUser.getPreferredLocation());
        if(updatedUser.getWorkMode() != null) user.setWorkMode(updatedUser.getWorkMode());
        if(updatedUser.getExpectedStipend() != null) user.setExpectedStipend(updatedUser.getExpectedStipend());
        if(updatedUser.getExpectedSalary() != null) user.setExpectedSalary(updatedUser.getExpectedSalary());

        // AI
        if(updatedUser.getCareerGoal() != null) user.setCareerGoal(updatedUser.getCareerGoal());
        if(updatedUser.getInterestedDomains() != null) user.setInterestedDomains(updatedUser.getInterestedDomains());
        if(updatedUser.getPreferredIndustries() != null) user.setPreferredIndustries(updatedUser.getPreferredIndustries());

        // Metadata
        if(updatedUser.getTermsAccepted() != null) user.setTermsAccepted(updatedUser.getTermsAccepted());
        if(updatedUser.getProfileCompletion() != null) user.setProfileCompletion(updatedUser.getProfileCompletion());

        userRepository.save(user);

        return ResponseEntity.ok(user);
    }
}
