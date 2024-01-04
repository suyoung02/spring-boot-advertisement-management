package com.example.backend.service;

import com.example.backend.dto.AddPanelRequest;
import com.example.backend.dto.AddPositionRequest;
import com.example.backend.entity.AdsPanel;
import com.example.backend.entity.AdsPosition;

import java.util.List;

public interface AdsService {
    List<AdsPosition> getAllPosition();

    AdsPosition addNewPosition(AddPositionRequest newPosition);

    Boolean deletePosition(Integer id);

    AdsPosition updatePosition(Integer Id, AddPositionRequest newPosition);

    List<AdsPanel> getAllPanels();

    Boolean addNewPanel(AddPanelRequest newPanel);
}
