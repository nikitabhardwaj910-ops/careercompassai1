package com.talentnavigate.backend.controllers;

import com.talentnavigate.backend.dto.AuthResponse;
import com.talentnavigate.backend.dto.LoginRequest;
import com.talentnavigate.backend.dto.MessageResponse;
import com.talentnavigate.backend.dto.SignupRequest;
import com.talentnavigate.backend.models.User;
import com.talentnavigate.backend.repositories.UserRepository;
import com.talentnavigate.backend.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();

            return ResponseEntity.ok(new AuthResponse(jwt, user));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity.status(401).body(new MessageResponse("Error: Invalid email or password."));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body(new MessageResponse("Error: Authentication failed. Please check your credentials or sign up."));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setFullName(signUpRequest.getFullName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
