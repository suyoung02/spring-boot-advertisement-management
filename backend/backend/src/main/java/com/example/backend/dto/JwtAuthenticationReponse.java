package com.example.backend.dto;

import lombok.Data;

@Data
public class JwtAuthenticationReponse {
    private String accessToken;

    private String refreshToken;
}
