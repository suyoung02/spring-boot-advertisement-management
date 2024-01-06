package com.example.backend.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ChangePasswordRequest;
import com.example.backend.dto.ForgotPasswordRequest;
import com.example.backend.dto.JwtAuthenticationReponse;
import com.example.backend.dto.RefreshTokenRequest;
import com.example.backend.dto.SignInRequest;
import com.example.backend.dto.SignUpRequest;
import com.example.backend.service.AuthenticationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/vhtt/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignUpRequest signUpRequest) {
        authenticationService.signup(signUpRequest);

        return new ResponseEntity<>("Registration success", HttpStatus.OK);
    }

    @PostMapping("/normal/signin")
    public ResponseEntity<JwtAuthenticationReponse> signin(@RequestBody SignInRequest signInRequest) {
        return ResponseEntity.ok(authenticationService.signin(signInRequest));
    }

    @PostMapping("/normal/refresh-token")
    public ResponseEntity<JwtAuthenticationReponse> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        return ResponseEntity.ok(authenticationService.refreshToken(refreshTokenRequest));
    }

    @PatchMapping("/all/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest,
            Principal connectedUser) {

        authenticationService.changePassword(changePasswordRequest, connectedUser);
        return new ResponseEntity<>("Changed password success", HttpStatus.OK);
    }

    @PutMapping("/normal/regenerate-otp")
    public ResponseEntity<String> regenerateOtp(@RequestParam String username) {
        return new ResponseEntity<>(authenticationService.regenerateOtp(username), HttpStatus.OK);
    }

    @PatchMapping("/normal/forgot-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return new ResponseEntity<>(authenticationService.resetPassword(request), HttpStatus.OK);
    }
}
