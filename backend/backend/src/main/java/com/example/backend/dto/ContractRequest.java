package com.example.backend.dto;

import jakarta.validation.constraints.*;
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
}
