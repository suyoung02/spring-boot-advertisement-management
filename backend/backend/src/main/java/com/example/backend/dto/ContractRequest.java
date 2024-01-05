package com.example.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.Date;

@Data
public class ContractRequest {
    @NotEmpty
    private String enterprise_info;

    @Pattern(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Email must be the right format")
    @NotEmpty
    private String enterprise_email;

    @NotEmpty
    private String enterprise_phone_number;

    @NotNull
    private Date contract_begin;

    @NotNull
    private Date contract_expiration;

    @NotNull
    private Integer ads_panel;

    @NotNull
    private String state;

    private Integer staff;

    private String ads_type;

    private String size;

    private Integer ads_position;

    private String ads_img;
}