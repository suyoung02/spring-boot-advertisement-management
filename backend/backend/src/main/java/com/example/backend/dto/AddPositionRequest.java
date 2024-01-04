package com.example.backend.dto;

import lombok.Data;

@Data
public class AddPositionRequest {
    private String address;
    private String ward;
    private String district;
    private String province;
    private String location_type;
    private String ads_form;
    private String planning_status;

}
