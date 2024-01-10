package com.example.backend.dto;

import java.util.Date;

import lombok.Data;

@Data
public class EditingRequirementRequest {
    private String new_info;

    private Date time_submit;

    private String reason;

    private String status;

    private Integer staff;

    private Integer ads_panel;
}
