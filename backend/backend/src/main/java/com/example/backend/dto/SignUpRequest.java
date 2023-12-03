package com.example.backend.dto;

import com.example.backend.enums.Role;

import lombok.Data;

@Data
public class SignUpRequest {
    private String username;

    private String password;

    private Role role;

    private String ward;

    private String district;
}
