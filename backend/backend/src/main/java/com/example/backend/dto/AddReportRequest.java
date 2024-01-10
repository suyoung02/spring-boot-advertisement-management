package com.example.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddReportRequest {

    private String reportForm;

    private String fullName;
    @Email(message = "Invalid email")
    private String email;
    @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$", message = "Invalid phone number")
    private String phoneNumber;

    private String content;

    private String state;

    private String deviceId;

    private String image1;

    private String image2;

    private String solving;

    private Integer adsPanel;

    private Integer adsPosition;

    private String token;
}
