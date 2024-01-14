package com.example.backend.dto;

import com.example.backend.entity.*;
import lombok.Data;

import java.util.List;

@Data
public class AdsPositionResponse {
    private AdsPosition adsPosition;
    private LocationType locationType;
    private AdsForm adsForm;
    private PlanningStatus planningStatus;
    private List<AdsPanel> panels;
    private List<AdsPanelResponse> panelDetails;
    private Boolean isReported;

    public AdsPositionResponse(AdsPosition adsPosition, LocationType locationType, AdsForm adsForm,
            PlanningStatus planningStatus) {
        this.adsPosition = adsPosition;
        this.locationType = locationType;
        this.adsForm = adsForm;
        this.planningStatus = planningStatus;
    }

    public AdsPositionResponse(AdsPosition adsPosition, LocationType locationType, AdsForm adsForm,
            PlanningStatus planningStatus, List<AdsPanel> panels) {
        this.adsPosition = adsPosition;
        this.locationType = locationType;
        this.adsForm = adsForm;
        this.planningStatus = planningStatus;
        this.panels = panels;
    }

    public AdsPositionResponse(AdsPosition adsPosition, LocationType locationType, AdsForm adsForm,
            PlanningStatus planningStatus, List<AdsPanel> panels, List<AdsPanelResponse> panelDetails) {
        this.adsPosition = adsPosition;
        this.locationType = locationType;
        this.adsForm = adsForm;
        this.planningStatus = planningStatus;
        this.panels = panels;
        this.panelDetails = panelDetails;
    }

    public AdsPositionResponse(AdsPosition adsPosition, LocationType locationType, AdsForm adsForm,
            PlanningStatus planningStatus, List<AdsPanel> panels, List<AdsPanelResponse> panelDetails,
            Boolean isReporded) {
        this.adsPosition = adsPosition;
        this.locationType = locationType;
        this.adsForm = adsForm;
        this.planningStatus = planningStatus;
        this.panels = panels;
        this.panelDetails = panelDetails;
        this.isReported = isReporded;
    }
}
