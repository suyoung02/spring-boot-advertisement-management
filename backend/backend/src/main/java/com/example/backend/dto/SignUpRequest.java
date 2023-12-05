package com.example.backend.dto;

import java.sql.Date;

import com.example.backend.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SignUpRequest {
    @NotEmpty
    @Pattern(regexp = "^[a-z0-9]{8,20}$", message = "Username must be of 8 to 20 length with no uppercase characters and no special characters")
    private String username;

    @NotEmpty
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$", message = "Password must be min 8 and max 20 length containing atleast 1 uppercase, 1 lowercase, 1 special characters and 1 digit")
    private String password;

    @NotEmpty
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$", message = "Confirm password must be min 8 and max 20 length containing atleast 1 uppercase, 1 lowercase, 1 special characters and 1 digit")
    private String confirmPassword;

    @NotNull(message = "Role must not be null")
    private Role role;

    private String ward;

    private String district;

    @NotEmpty(message = "Fullname must not be empty")
    private String fullname;

    @NotNull(message = "Date of birth must not be null")
    private Date dob;

    @Email(message = "Invalid email")
    private String email;

    @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$", message = "Invalid phone number")
    private String phoneNumber;
}
