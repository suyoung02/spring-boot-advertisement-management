package com.example.backend.service;

import java.security.Principal;

import com.example.backend.dto.ChangePasswordRequest;
import com.example.backend.dto.JwtAuthenticationReponse;
import com.example.backend.dto.RefreshTokenRequest;
import com.example.backend.dto.SignInRequest;
import com.example.backend.dto.SignUpRequest;
import com.example.backend.entity.User;

public interface AuthenticationService {
    User signup(SignUpRequest signUpRequest);

    JwtAuthenticationReponse signin(SignInRequest signInRequest);

    JwtAuthenticationReponse refreshToken(RefreshTokenRequest refreshTokenRequest);

    boolean changePassword(ChangePasswordRequest changePasswordRequest, Principal connectedUser);

    String regenerateOtp(String username);
}
