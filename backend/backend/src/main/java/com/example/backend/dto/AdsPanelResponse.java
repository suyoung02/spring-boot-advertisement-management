package com.example.backend.dto;

import com.example.backend.entity.AdsPanel;
import com.example.backend.entity.AdsPosition;
import com.example.backend.entity.AdsType;
import com.example.backend.entity.Contract;
import lombok.Data;

@Data
public class AdsPanelResponse {
    private AdsPanel adsPanel;
    private AdsType adsType;
    private AdsPosition adsPosition;
    private Contract contract;

    public AdsPanelResponse(AdsPanel adsPanel, AdsType adsType, AdsPosition adsPosition, Contract contract) {
        this.adsPanel = adsPanel;
        this.adsPosition = adsPosition;
        this.adsType = adsType;
        this.contract = contract;
    }

    public AdsPanelResponse(AdsPanel adsPanel, AdsType adsType, Contract contract) {
        this.adsPanel = adsPanel;
        this.adsType = adsType;
        this.contract = contract;
    }

    public AdsPanelResponse(AdsPanel adsPanel, Contract contract) {
        this.adsPanel = adsPanel;
        this.contract = contract;
    }

    public AdsPanelResponse(AdsPanel adsPanel) {
        this.adsPanel = adsPanel;
    }
}
