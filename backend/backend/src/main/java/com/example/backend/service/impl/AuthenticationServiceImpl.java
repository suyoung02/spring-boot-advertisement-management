package com.example.backend.service.impl;

import java.security.Principal;
import java.sql.Timestamp;
import java.util.HashMap;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ChangePasswordRequest;
import com.example.backend.dto.ForgotPasswordRequest;
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
import com.example.backend.util.EmailUtil;
import com.example.backend.util.OtpUtil;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;

    private final StaffRepository staffRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final OtpUtil otpUtil;

    private final EmailUtil emailUtil;

    @Override
    public User signup(SignUpRequest signUpRequest) {
        // check if username already exists
        if (isExistedUsername(signUpRequest.getUsername())) {
            throw new InvalidAccountException("Username already exists");
        }

        // check if email already exists
        if (isExistedEmail(signUpRequest.getEmail())) {
            throw new InvalidAccountException("Email already exists");
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
        if (!isMatchedOldPassword(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
            throw new InvalidAccountException("Wrong password");
        }

        // check if the current password is same new password
        if (isMatchedOldPassword(changePasswordRequest.getNewPassword(), user.getPassword())) {
            throw new InvalidAccountException("Should create a new password");
        }

        // check if confirm password does not match to new password
        if (!isMatchedNewPassword(changePasswordRequest.getNewPassword(), changePasswordRequest.getConfirmPassword())) {
            throw new InvalidAccountException("Confirm password does not match to new password");
        }

        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepository.save(user);

        return true;
    }

    public String regenerateOtp(String username) {
        Staff staff = staffRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidAccountException("Invalid username"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidAccountException("Invalid username"));
        String email = staff.getEmail();
        String otp = otpUtil.generateOtp();
        String fullname = staff.getFullname();

        try {
            emailUtil.sendOtpToEmail(email, otp, fullname);
        } catch (MessagingException ex) {
            throw new RuntimeException("Unable to send OTP, please try again");
        }

        user.setOtp(otp);
        user.setExpiredOtp(new Timestamp(System.currentTimeMillis() + OtpUtil.EXPIRE_OTP));
        userRepository.save(user);

        return "OTP sent to your email ".concat(emailUtil.hashEmail(email));
    }

    public String resetPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new InvalidAccountException("Invalid username"));

        // check if confirm password does not match to new password
        if (!isMatchedNewPassword(request.getNewPassword(), request.getConfirmPassword())) {
            throw new InvalidAccountException("Confirm password does not match to new password");
        }

        // check if OTP is invalid
        if (!isValidOtp(user, request.getOtp())) {
            throw new InvalidAccountException("OTP went wrong");
        }

        // Save new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Reset password successfully";
    }

    private boolean isExistedUsername(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        return user != null ? true : false;
    }

    private boolean isExistedEmail(String email) {
        Staff staff = staffRepository.findByEmail(email).orElse(null);

        return staff != null ? true : false;
    }

    private boolean isMatchedNewPassword(String newPassword, String confirmPassword) {
        if (confirmPassword.equals(newPassword)) {
            return true;
        }

        return false;
    }

    private boolean isMatchedOldPassword(String oldPassword, String newPassword) {
        if (passwordEncoder.matches(oldPassword, newPassword)) {
            return true;
        }

        return false;
    }

    private boolean isValidOtp(User user, String otp) {
        if (user.getOtp() == null) {
            return false;
        }

        // if expiring otp, return false
        if (Long.compare(user.getExpiredOtp().getTime(), System.currentTimeMillis()) < 0) {
            return false;
        }

        if (!user.getOtp().equals(otp)) {
            return false;
        }

        return true;
    }
}
