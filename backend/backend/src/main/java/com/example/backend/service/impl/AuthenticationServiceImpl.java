package com.example.backend.service.impl;

import java.security.Principal;
import java.util.HashMap;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ChangePasswordRequest;
import com.example.backend.dto.JwtAuthenticationReponse;
import com.example.backend.dto.RefreshTokenRequest;
import com.example.backend.dto.SignInRequest;
import com.example.backend.dto.SignUpRequest;
import com.example.backend.entity.Staff;
import com.example.backend.entity.User;
import com.example.backend.exception.InvalidAccountException;
import com.example.backend.repository.StaffRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthenticationService;
import com.example.backend.service.JwtService;

import lombok.RequiredArgsConstructor;
import lombok.var;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;

    private final StaffRepository staffRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    @Override
    public User signup(SignUpRequest signUpRequest) {
        // check if username already exists
        if (isExistedUsername(signUpRequest.getUsername())) {
            throw new InvalidAccountException("Username already exists");
        }

        // check if confirm password does not match to password
        if (!signUpRequest.getConfirmPassword().equals(signUpRequest.getPassword())) {
            throw new InvalidAccountException("Confirm password does not match to password");
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setDistrict(signUpRequest.getDistrict());
        user.setWard(signUpRequest.getWard());
        user.setRole(signUpRequest.getRole());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        userRepository.save(user);

        Staff staff = new Staff();
        staff.setFullname(signUpRequest.getFullname());
        staff.setDob(signUpRequest.getDob());
        staff.setEmail(signUpRequest.getEmail());
        staff.setPhoneNumber(signUpRequest.getPhoneNumber());
        staff.setUsername(signUpRequest.getUsername());
        staffRepository.save(staff);

        return user;
    }

    @Override
    public JwtAuthenticationReponse signin(SignInRequest signInRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signInRequest.getUsername(), signInRequest.getPassword()));

        var user = userRepository.findByUsername(signInRequest.getUsername())
                .orElseThrow(() -> new InvalidAccountException("Invalid username"));

        var jwt = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(new HashMap<>(), user);

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
                .orElseThrow(() -> new InvalidAccountException("Invalid username"));

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

    public boolean changePassword(ChangePasswordRequest changePasswordRequest, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // check if the current password is incorrect
        if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
            throw new InvalidAccountException("Wrong password");
        }

        // check if the current password is same new password
        if (changePasswordRequest.getCurrentPassword().equals(changePasswordRequest.getNewPassword())) {
            throw new InvalidAccountException("Should create a new password");
        }

        // check if confirm password does not match to new password
        if (!changePasswordRequest.getConfirmPassword().equals(changePasswordRequest.getNewPassword())) {
            throw new InvalidAccountException("Confirm password does not match to new password");
        }

        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepository.save(user);

        return true;
    }

    private boolean isExistedUsername(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        return user != null ? true : false;
    }
}
