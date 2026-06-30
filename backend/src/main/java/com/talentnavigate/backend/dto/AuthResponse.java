package com.talentnavigate.backend.dto;

import com.talentnavigate.backend.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private User user;
}
