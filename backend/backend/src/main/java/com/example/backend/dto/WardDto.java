package com.example.backend.dto;

import jakarta.validation.constraints.NotEmpty;

public class WardDto {
    @NotEmpty
    private String ward;
}
