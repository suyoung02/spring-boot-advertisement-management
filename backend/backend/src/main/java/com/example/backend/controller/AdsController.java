package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.entity.AdsPanel;
import com.example.backend.entity.AdsPosition;
import com.example.backend.service.AdsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.apache.log4j.Logger;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/v1/ads")
public class AdsController {
    private final AdsService adsService;
    private static final Logger logger = Logger.getLogger(AdsController.class);

    @GetMapping("/all/getAllPosition")
    public ResponseEntity<List<AdsPositionResponse>> getAllPosition() {
        logger.info("Access get all position API");
        List<AdsPositionResponse> result = adsService.getAllPosition();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @GetMapping("/all/getDetailPosition/{id}")
    public ResponseEntity<?> getDetailPosition(@PathVariable(value = "id") Integer id) {
        List<AdsPositionResponse> position = adsService.getDetailPosition(id);
        logger.info("Access get detail position API");
        if (position != null) {
            logger.info("Return position");
            return new ResponseEntity<>(position.get(0), HttpStatus.OK);
        }
        logger.info("Position id not found");
        return new ResponseEntity<>("Id Not found", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/vhtt/addNewPosition")
    public ResponseEntity<AdsPosition> addNewPosition(@Valid @RequestBody AddPositionRequest newPosition) {
        logger.info("Access add new position");
        try {
            System.out.println(newPosition);
            AdsPosition result = adsService.addNewPosition(newPosition);
            logger.info("Add new position successfully");
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e);
            logger.error(e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/vhtt/deletePosition/{id}")
    public ResponseEntity<String> deletePosition(@PathVariable(value = "id") Integer id) {
        logger.info("Delete position");
        try {
            System.out.println(id);
            if (adsService.deletePosition(id)) {
                logger.info("Delete position successfully");
                return new ResponseEntity<>("Deleted", HttpStatus.OK);
            }
            logger.info("Id not found");
            return new ResponseEntity<>("Id not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.out.println(e);
            logger.error(e);
            return new ResponseEntity<>("Error", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/vhtt/updatePosition/{id}")
    public ResponseEntity<AdsPosition> updatePosition(@PathVariable(value = "id") Integer id,
            @Valid @RequestBody AddPositionRequest newPosition) {
        logger.info("Updating position");
        try {
            AdsPosition result = adsService.updatePosition(id, newPosition);
            logger.info("Update successfully");
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Panel controller....................

    @GetMapping("/all/getAllPanel")
    public ResponseEntity<List<AdsPanelResponse>> getAllPanels() {
        logger.info("Request received for getAllPanels");
        List<AdsPanelResponse> ads = adsService.getAllPanels();
        String logMessage = String.format("Retrieved panels: %s", ads);
        logger.debug(logMessage);
        return new ResponseEntity<>(ads, HttpStatus.OK);
    }

    @GetMapping("/all/getDetailPanel/{id}")
    public ResponseEntity<?> getDetailPanel(@PathVariable(value = "id") Integer id) {
        String logMessage1 = String.format("Request received for getDetailPanel with id: {}", id);
        logger.info(logMessage1);
        List<AdsPanelResponse> panel = adsService.getDetailPanel(id);
        if (panel != null && !panel.isEmpty()) {
            String logMessage = String.format("Retrieved panel details: %s", panel.get(0));
            logger.debug(logMessage);
            return new ResponseEntity<>(panel.get(0), HttpStatus.OK);
        }
        String logMsg = String.format("Panel not found for id: {}", id);
        logger.warn(logMsg);
        return new ResponseEntity<>("Id Not found", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/vhtt/addNewPanel")
    public ResponseEntity<String> addNewPanel(@Valid @RequestBody AddPanelRequest newPanel) {
        String logmsg = String.format("Request received for addNewPanel with panel: {}", newPanel);
        logger.info(logmsg);
        try {
            if (adsService.addNewPanel(newPanel)) {
                logger.info("Panel added successfully");
                return new ResponseEntity<>("panel", HttpStatus.OK);
            }
            logger.warn("Error adding panel");
            return new ResponseEntity<>("Error", HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            String logMessage = String.format("Exception occurred while adding panel: %s", e.getMessage());
            logger.error(logMessage, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/vhtt/deletePanel/{id}")
    public ResponseEntity<String> deletePanel(@PathVariable(value = "id") Integer id) {
        String logmsg = String.format("Request received for deletePanel with id: {}", id);
        logger.info(logmsg);
        try {
            if (adsService.deletePanel(id)) {
                logger.info("Panel deleted successfully");
                return new ResponseEntity<>("Deleted", HttpStatus.OK);
            }
            String logmsg1 = String.format("Panel not found for id: {}", id);
            logger.warn(logmsg1);
            return new ResponseEntity<>("Id not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Exception occurred while deleting panel", e);
            return new ResponseEntity<>("Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/vhtt/updatePanel/{id}")
    public ResponseEntity<AdsPanel> updatePanel(@PathVariable(value = "id") Integer id,
                                                @Valid @RequestBody AddPanelRequest newPosition) {
        String logmsg = String.format("Request received for updatePanel with id: {} and newPosition: {}", id, newPosition);
        logger.info(logmsg);
        try {
            AdsPanel result = adsService.updatePanel(id, newPosition);
            logger.info("Panel updated successfully");
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Exception occurred while updating panel", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all/presenting-panel")
    public ResponseEntity<List<AdsPanelWithImagesDTO>> getAllPresentingPanel() {
        logger.info("Request received for getAllPresentingPanel");
        List<AdsPanelWithImagesDTO> panels = adsService.getAllPresentingPanel();
        String logMsg = String.format("Retrieved presenting panels: {}", panels);
        logger.debug(logMsg);
        return new ResponseEntity<>(panels, HttpStatus.OK);
    }

}
