package com.example.backend.controller;

import com.example.backend.entity.AdsType;
import com.example.backend.exception.InvalidAccountException;
import com.example.backend.service.AdsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/v1/adsType")
public class AdsTypeController {
    private final AdsService adsService;
    private static final Logger logger = Logger.getLogger(AdsTypeController.class);
    @GetMapping("/getAll")
    public ResponseEntity<List<AdsType>> getAllAdsType() {
        logger.info("Request received for getAllAdsType");
        List<AdsType> result = adsService.getAllType();
        String logmsg = String.format("Retrieved ads type:%s", result);
        logger.debug(logmsg);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/addNew")
    public ResponseEntity<AdsType> addNewTAdsType(@Valid @RequestBody AdsType adsType) {
        logger.info("Request received for add new ads type");
        if (adsType.getTitle().length() == 0) {
            logger.warn("Invalid title");
            throw new InvalidAccountException("Invalid title");
        }

        AdsType result = adsService.addNewType(adsType);
        String log = String.format("Ads type added successfully:%s", result);
        logger.info(log);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{title}")
    public ResponseEntity<String> deleteAdsType(@PathVariable String title) {
        logger.info("Request delete ads type");
        if (title.length() == 0) {
            logger.warn("Invalid title");
            throw new InvalidAccountException("Invalid title");
        } else {
            if (adsService.deleteTypeAds(title)) {
                logger.info("Deleted");
                return new ResponseEntity<>("Deleted", HttpStatus.OK);
            }
            logger.warn("Title not found");
            return new ResponseEntity<>("Title not found", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update/{title}")
    public ResponseEntity<String> updateAdsType(@PathVariable String title, @Valid @RequestBody AdsType adsType) {
        logger.info("Request update ads type");
        System.out.println(title);
        if (title.length() == 0) {
            logger.warn("Invalid title");
            throw new InvalidAccountException("Invalid title");
        } else {
            if (adsService.updateAdsType(title, adsType)) {
                logger.info("Updated");
                return new ResponseEntity<>("Updated", HttpStatus.OK);
            }
            logger.warn("Title not found");
            return new ResponseEntity<>("Title not found", HttpStatus.NOT_FOUND);
        }
    }

}
