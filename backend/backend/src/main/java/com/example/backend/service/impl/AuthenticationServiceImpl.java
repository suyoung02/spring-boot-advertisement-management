package com.example.backend.service.impl;

import java.util.HashMap;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.JwtAuthenticationReponse;
import com.example.backend.dto.RefreshTokenRequest;
import com.example.backend.dto.SignInRequest;
import com.example.backend.dto.SignUpRequest;
import com.example.backend.entity.User;
import com.example.backend.exception.InvalidAccountException;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthenticationService;
import com.example.backend.service.JwtService;

import lombok.RequiredArgsConstructor;
import lombok.var;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    public User signup(SignUpRequest signUpRequest) {
        User user = new User();

        user.setUsername(signUpRequest.getUsername());
        user.setDistrict(signUpRequest.getDistrict());
        user.setWard(signUpRequest.getWard());
        user.setRole(signUpRequest.getRole());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        return userRepository.save(user);
    }

    public JwtAuthenticationReponse signin(SignInRequest signInRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signInRequest.getUsername(), signInRequest.getPassword()));

        User user = userRepository.findByUsername(signInRequest.getUsername())
                .orElseThrow(() -> new InvalidAccountException());

        String jwt = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(new HashMap<>(), user);

        JwtAuthenticationReponse jwtAuthenticationReponse = new JwtAuthenticationReponse();

        jwtAuthenticationReponse.setAccessToken(jwt);
        jwtAuthenticationReponse.setRefreshToken(refreshToken);

        // Save a refresh token to database
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return jwtAuthenticationReponse;
    }

    public JwtAuthenticationReponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        String username = jwtService.extractUserName(refreshTokenRequest.getToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidAccountException());

        if (jwtService.isTokenValid(refreshTokenRequest.getToken(), user)
                && user.getRefreshToken().equals(refreshTokenRequest.getToken())) {
            var jwt = jwtService.generateToken(user);

            JwtAuthenticationReponse jwtAuthenticationReponse = new JwtAuthenticationReponse();

            jwtAuthenticationReponse.setAccessToken(jwt);
            jwtAuthenticationReponse.setRefreshToken(refreshTokenRequest.getToken());

            return jwtAuthenticationReponse;
        }

        return null;
    }

    public boolean isExistedUsername(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        return user != null ? true : false;
    }
}
