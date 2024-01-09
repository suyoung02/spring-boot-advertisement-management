package com.example.backend.controller;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.PlanningStatus;
import com.example.backend.exception.InvalidAccountException;
import com.example.backend.service.AdsService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/v1/planningStatus")
public class PlanningStatusController {
    private final AdsService adsService;
    private static final Logger logger = Logger.getLogger(PlanningStatusController.class);
    @GetMapping("/getAll")
    public ResponseEntity<List<PlanningStatus>> getAll() {
        logger.info("Request received for getAllPlanningStatus");
        List<PlanningStatus> result = adsService.getAllPlanningStatus();
        String logmsg = String.format("Retrieved planning status: {}", result);
        logger.debug(logmsg);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/addNew")
    public ResponseEntity<PlanningStatus> addNewTAdsType(@Valid @RequestBody PlanningStatus planningStatus) {
        logger.info("Request received for add new planning status");
        if (planningStatus.getTitle().length() == 0) {
            logger.warn("Invalid title");
            throw new InvalidAccountException("Invalid title");
        }

        PlanningStatus result = adsService.addNewPlanningStatus(planningStatus);
        String log = String.format("Planning status added successfully: {}", result);
        logger.info(log);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{title}")
    public ResponseEntity<String> deleteAdsType(@PathVariable String title) {
        logger.info("Request delete planning status");
        if (title.length() == 0) {
            logger.warn("Invalid title");
            throw new InvalidAccountException("Invalid title");
        } else {
            if (adsService.deletePlanningStatus(title)) {
                String log = String.format("Planning status deleted successfully: {}", title);
                logger.info(log);
                return new ResponseEntity<>("Deleted", HttpStatus.OK);
            }
            logger.warn("Title not found");
            return new ResponseEntity<>("Title not found", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update/{title}")
    public ResponseEntity<String> updateAdsType(@PathVariable String title,
            @Valid @RequestBody PlanningStatus planningStatus) {
        logger.info("Request update planning status");
        if (title.length() == 0) {
            logger.warn("Invalid title");
            throw new InvalidAccountException("Invalid title");
        } else {
            if (adsService.updatePlanningStatus(title, planningStatus)) {
                String log = String.format("Planning status updated successfully: {}", title);
                logger.info(log);
                return new ResponseEntity<>("Updated", HttpStatus.OK);
            }
            logger.warn("Title not found");
            return new ResponseEntity<>("Title not found", HttpStatus.NOT_FOUND);
        }
    }

}
