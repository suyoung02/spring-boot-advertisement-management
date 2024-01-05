package com.example.backend.dto;

import com.example.backend.entity.AdsPosition;
import lombok.Data;

import java.util.Date;

@Data
public class AddPanelRequest {
    private Integer id;
    private String ads_type;
    private String size;
    private Date contract_expiration;
    private Integer ads_position;
}
