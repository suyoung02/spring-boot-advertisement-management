package com.example.backend.controller;

import java.security.Principal;

import org.apache.log4j.Logger;
import com.example.backend.service.impl.LogoutServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.security.core.Authentication;
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
@CrossOrigin
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final LogoutServiceImpl logoutService;

    private static final Logger logger = Logger.getLogger(AuthenticationController.class);
    @PostMapping("/vhtt/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignUpRequest signUpRequest) {
        logger.info("Request received for signup");
        authenticationService.signup(signUpRequest);
        String log = String.format("Signup success:%s", signUpRequest);
        logger.debug(log);
        return new ResponseEntity<>("Registration success", HttpStatus.OK);
    }

    @PostMapping("/normal/signin")
    public ResponseEntity<JwtAuthenticationReponse> signin(@RequestBody SignInRequest signInRequest) {
        logger.info("Request received for signin");
        logger.info("Signin success:%s");
        return ResponseEntity.ok(authenticationService.signin(signInRequest));
    }

    @PostMapping("/normal/refresh-token")
    public ResponseEntity<JwtAuthenticationReponse> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        logger.info("Request received for refresh token");
        return ResponseEntity.ok(authenticationService.refreshToken(refreshTokenRequest));
    }

    @PatchMapping("/all/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest,
            Principal connectedUser) {
        logger.info("Request received for change password");
        authenticationService.changePassword(changePasswordRequest, connectedUser);
        logger.info("Changed password success");
        return new ResponseEntity<>("Changed password success", HttpStatus.OK);
    }

    @PutMapping("/normal/regenerate-otp")
    public ResponseEntity<String> regenerateOtp(@RequestParam String username) {
        logger.info("Request received for regenerate otp");
        logger.info("Regenerate otp success");
        return new ResponseEntity<>(authenticationService.regenerateOtp(username), HttpStatus.OK);
    }

    @PatchMapping("/normal/forgot-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        logger.info("Request received for reset password");
        return new ResponseEntity<>(authenticationService.resetPassword(request), HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) {
        logoutService.logout(httpServletRequest, httpServletResponse, authentication);
        return new ResponseEntity<>("Logout success", HttpStatus.OK);
    }
}
