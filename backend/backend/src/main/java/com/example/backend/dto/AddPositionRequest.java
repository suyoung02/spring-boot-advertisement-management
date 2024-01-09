package com.example.backend.dto;

import com.example.backend.enums.IsActived;
import lombok.Data;

@Data
public class AddPositionRequest {
    private String name;
    private String address;
    private String ward;
    private String district;
    private String province;
    private String location_type;
    private String ads_form;
    private String planning_status;
    private String photo;
    private String place_id;
    private Double latitude;
    private Double longitude;
    private IsActived is_active;

}
