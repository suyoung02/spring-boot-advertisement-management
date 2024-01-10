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

import com.example.backend.entity.LocationType;
import com.example.backend.exception.InvalidAccountException;
import com.example.backend.service.AdsService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/v1/locationType")
public class LocationTypeController {
    private final AdsService adsService;
    private static final Logger logger = Logger.getLogger(LocationTypeController.class);
    @GetMapping("/getAll")
    public ResponseEntity<List<LocationType>> getAll() {
        logger.info("Request received for getAllLocationTypes");
        List<LocationType> result = adsService.getAllLocationTypes();
        String logmsg = String.format("Retrieved location types: %s", result);
        logger.debug(logmsg);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/addNew")
    public ResponseEntity<LocationType> addNewTAdsType(@Valid @RequestBody LocationType locationType) {
        logger.info("Request received for add new location type");
        if (locationType.getTitle().length() == 0) {
            logger.warn("Invalid title");
            throw new InvalidAccountException("Invalid title");
        }

        LocationType result = adsService.addNewLocationType(locationType);
        String log = String.format("Location type added successfully: %s", result);
        logger.info(log);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{title}")
    public ResponseEntity<String> deleteAdsType(@PathVariable String title) {
        logger.info("Request delete location type");
        if (title.length() == 0) {
            logger.warn("Invalid title");
            throw new InvalidAccountException("Invalid title");
        } else {
            if (adsService.deleteLocationType(title)) {
                logger.info("Location type deleted successfully");
                return new ResponseEntity<>("Deleted", HttpStatus.OK);
            }
            logger.warn("Title not found");
            return new ResponseEntity<>("Title not found", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update/{title}")
    public ResponseEntity<String> updateAdsType(@PathVariable String title,
            @Valid @RequestBody LocationType locationType) {
        System.out.println(title);
        logger.info("Request update location type");
        if (title.length() == 0) {
            logger.warn("Invalid title");
            throw new InvalidAccountException("Invalid title");
        } else {
            if (adsService.updateLocationType(title, locationType)) {
                logger.info("Updated");
                return new ResponseEntity<>("Updated", HttpStatus.OK);
            }
            logger.warn("Title not found");
            return new ResponseEntity<>("Title not found", HttpStatus.NOT_FOUND);
        }
    }

}
