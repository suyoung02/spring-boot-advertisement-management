package com.example.backend.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddReportRequest {


    private String reportForm;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String content;

    private String state;

    private String deviceId;

    private String image1;

    private String image2;

    private String solving;

    private Integer adsPanel;

    private Integer adsPosition;
}
