package com.example.backend.dto;

import java.util.Date;

import com.example.backend.enums.Status;

import lombok.Data;

@Data
public class PositionRequirementRequest {
    private String new_info;

    private Date time_submit;

    private String reason;

    private Status status;

    private Integer staff;

    private Integer ads_position;
}
