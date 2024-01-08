package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@AllArgsConstructor
@Getter
@Setter
public class ReCaptchaResponse {
    private boolean success;
    private Timestamp challenge_ts;
    private String hostname;
}
