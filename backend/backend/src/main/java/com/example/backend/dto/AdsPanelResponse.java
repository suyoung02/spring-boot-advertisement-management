package com.example.backend.dto;

import com.example.backend.entity.AdsPanel;
import com.example.backend.entity.AdsPosition;
import com.example.backend.entity.AdsType;
import lombok.Data;

@Data
public class AdsPanelResponse {
    private AdsPanel adsPanel;
    private AdsType adsType;
    private AdsPosition adsPosition;

    public AdsPanelResponse(AdsPanel adsPanel, AdsType adsType, AdsPosition adsPosition){
        this.adsPanel = adsPanel;
        this.adsPosition = adsPosition;
        this.adsType = adsType;
    }
}
