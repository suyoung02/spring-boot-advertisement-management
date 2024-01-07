package com.example.backend.dto;

import jakarta.validation.constraints.NotEmpty;

public class DistrictDto {
      @NotEmpty
    private Integer id;

     @NotEmpty
    private String district;

     @NotEmpty
    private String ward;
}
