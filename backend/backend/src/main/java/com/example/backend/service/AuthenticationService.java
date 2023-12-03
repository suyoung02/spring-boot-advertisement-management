package com.example.backend.service;

import com.example.backend.dto.JwtAuthenticationReponse;
import com.example.backend.dto.RefreshTokenRequest;
import com.example.backend.dto.SignInRequest;
import com.example.backend.dto.SignUpRequest;
import com.example.backend.entity.User;

public interface AuthenticationService {
    User signup(SignUpRequest signUpRequest);

    JwtAuthenticationReponse signin(SignInRequest signInRequest);

    JwtAuthenticationReponse refreshToken(RefreshTokenRequest refreshTokenRequest);

    boolean isExistedUsername(String username);
}
