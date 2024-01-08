package com.example.backend.dto;

import java.sql.Date;

import com.example.backend.enums.Role;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffDto {
    private Integer id;

    private String fullname;

    private Date dob;

    private String email;

    private String phoneNumber;

    private String username;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String ward;

    private String district;
}
