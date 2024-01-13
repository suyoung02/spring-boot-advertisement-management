package com.example.backend.service;

import java.security.Principal;
import java.util.List;

import com.example.backend.dto.AddPanelRequest;
import com.example.backend.dto.AddPositionRequest;
import com.example.backend.dto.AdsPanelResponse;
import com.example.backend.dto.AdsPanelWithImagesDTO;
import com.example.backend.dto.AdsPositionResponse;
import com.example.backend.entity.AdsForm;
import com.example.backend.entity.AdsPanel;
import com.example.backend.entity.AdsPosition;
import com.example.backend.entity.AdsType;
import com.example.backend.entity.LocationType;
import com.example.backend.entity.PlanningStatus;

public interface AdsService {
    List<AdsPositionResponse> getAllPosition();

    AdsPosition addNewPosition(AddPositionRequest newPosition);

    List<AdsPositionResponse> getDetailPosition(Integer id);

    Boolean deletePosition(Integer id);

    Boolean deletePanel(Integer id);

    AdsPosition updatePosition(Integer Id, AddPositionRequest newPosition);

    AdsPanel updatePanel(Integer Id, AddPanelRequest newPosition);

    List<AdsPanelWithImagesDTO> getDetailPanel(Integer id);

    List<AdsPanelResponse> getAllPanels();

    Boolean addNewPanel(AddPanelRequest newPanel);

    List<AdsType> getAllType();

    AdsType addNewType(AdsType adsType);

    Boolean deleteTypeAds(String title);

    Boolean updateAdsType(String title, AdsType adsType);

    List<AdsForm> getAllAdsForms();

    AdsForm addNewAdsForm(AdsForm adsFormAdsForm);

    Boolean deleteAdsForm(String title);

    Boolean updateAdsForm(String title, AdsForm adsForm);

    List<LocationType> getAllLocationTypes();

    LocationType addNewLocationType(LocationType locationType);

    Boolean deleteLocationType(String title);

    Boolean updateLocationType(String title, LocationType locationType);

    List<PlanningStatus> getAllPlanningStatus();

    PlanningStatus addNewPlanningStatus(PlanningStatus planningStatus);

    Boolean deletePlanningStatus(String title);

    Boolean updatePlanningStatus(String title, PlanningStatus planningStatus);

    List<AdsPanelWithImagesDTO> getAllPresentingPanel();

    List<AdsPanelWithImagesDTO> getAllPanelWithPosition(Principal principal);
}
