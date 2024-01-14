package com.example.backend.dto;

import java.util.Date;

import lombok.Data;

@Data
public class JwtAuthenticationReponse {
    private String accessToken;

    private String refreshToken;

    private Date expired_time;
}
