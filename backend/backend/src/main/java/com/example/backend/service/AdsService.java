package com.example.backend.service;

import com.example.backend.dto.AddPanelRequest;
import com.example.backend.dto.AddPositionRequest;
import com.example.backend.dto.AdsPanelWithImagesDTO;
import com.example.backend.entity.AdsPanel;
import com.example.backend.entity.AdsPosition;
import com.example.backend.entity.AdsType;

import java.util.List;
import java.util.Optional;

public interface AdsService {
    List<AdsPosition> getAllPosition();

    AdsPosition addNewPosition(AddPositionRequest newPosition);
    Optional<AdsPosition> getDetailPosition(Integer id);
    Boolean deletePosition(Integer id);
    Boolean deletePanel(Integer id);

    AdsPosition updatePosition(Integer Id, AddPositionRequest newPosition);
    AdsPanel updatePanel(Integer Id, AddPanelRequest newPosition);
    Optional<AdsPanel> getDetailPanel(Integer id);
    List<AdsPanel> getAllPanels();

    Boolean addNewPanel(AddPanelRequest newPanel);
    List<AdsType> getAllType();
    AdsType addNewType(AdsType adsType);
    Boolean deleteTypeAds(String title);
    Boolean updateAdsType(String title, AdsType adsType);

    List<AdsPanelWithImagesDTO> getAllPresentingPanel();
}
