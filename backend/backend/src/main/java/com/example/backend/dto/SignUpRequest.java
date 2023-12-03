package com.example.backend.dto;

import com.example.backend.enums.Role;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SignUpRequest {
    @Pattern(regexp = "^[a-z0-9]{8,20}$", message = "Username must be of 8 to 20 length with no uppercase characters and no special characters")
    private String username;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$", message = "Password must be min 8 and max 20 length containing atleast 1 uppercase, 1 lowercase, 1 special characters and 1 digit")
    private String password;

    private Role role;

    private String ward;

    private String district;
}
