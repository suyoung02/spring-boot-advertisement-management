package com.example.backend.dto;

import com.example.backend.entity.AdsImages;
import com.example.backend.entity.AdsPanel;
import lombok.Data;

@Data
public class AdsPanelWithImagesDTO {
    private AdsPanel adsPanel;
    private AdsImages adsImages;

    public AdsPanelWithImagesDTO(AdsPanel adsPanel, AdsImages adsImages) {
        this.adsPanel = adsPanel;
        this.adsImages = adsImages;
    }
}
