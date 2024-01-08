package com.example.backend.dto;

import com.example.backend.entity.AdsForm;
import com.example.backend.entity.AdsPosition;
import com.example.backend.entity.LocationType;
import com.example.backend.entity.PlanningStatus;
import lombok.Data;

@Data
public class AdsPositionResponse {
    private AdsPosition adsPosition;
    private LocationType locationType;
    private AdsForm adsForm;
    private PlanningStatus planningStatus;

    public AdsPositionResponse(AdsPosition adsPosition, LocationType locationType, AdsForm adsForm, PlanningStatus planningStatus){
        this.adsPosition = adsPosition;
        this.locationType = locationType;
        this.adsForm = adsForm;
        this.planningStatus = planningStatus;
    }
}
