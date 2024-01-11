package com.example.backend.dto;

import com.example.backend.entity.AdsImages;
import com.example.backend.entity.AdsPanel;
import com.example.backend.entity.AdsPosition;
import com.example.backend.entity.Contract;
import lombok.Data;

@Data
public class AdsPanelWithImagesDTO {
    private AdsPosition adsPosition;
    private AdsPanel adsPanel;
    private AdsImages adsImages;
    public Contract contract;

    public AdsPanelWithImagesDTO(AdsPosition adsPosition, AdsPanel adsPanel, AdsImages adsImages, Contract contract) {
        this.adsPosition = adsPosition;
        this.adsPanel = adsPanel;
        this.adsImages = adsImages;
        this.contract = contract;
    }
}
