package com.example.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ForgotPasswordRequest {
    @NotEmpty(message = "Username must not be empty")
    private String username;

    @NotEmpty(message = "OTP must not be empty")
    private String otp;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$", message = "New password must be min 8 and max 20 length containing atleast 1 uppercase, 1 lowercase, 1 special characters and 1 digit")
    private String newPassword;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$", message = "Confirm password must be min 8 and max 20 length containing atleast 1 uppercase, 1 lowercase, 1 special characters and 1 digit")
    private String confirmPassword;
}
