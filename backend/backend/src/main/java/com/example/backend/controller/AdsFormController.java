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

import com.example.backend.entity.AdsForm;
import com.example.backend.exception.InvalidAccountException;
import com.example.backend.service.AdsService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/v1/adsForm")
public class AdsFormController {
    private final AdsService adsService;

    private static final Logger logger = Logger.getLogger(AdsFormController.class);

    @GetMapping("/getAll")
    public ResponseEntity<List<AdsForm>> getAll() {
        logger.info("Request received for getAllAdsForms");
        List<AdsForm> result = adsService.getAllAdsForms();
        String logmsg = String.format("Retrieved ads forms: %s", result);
        logger.debug(logmsg);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/addNew")
    public ResponseEntity<AdsForm> addNewAdsForm(@Valid @RequestBody AdsForm adsForm) {
        logger.info("Request received for add new ads form");
        if (adsForm.getTitle().length() == 0) {
            logger.warn("Invalid title");
            throw new InvalidAccountException("Invalid title");
        }

        AdsForm result = adsService.addNewAdsForm(adsForm);
        String log = String.format("Ads form added successfully: %s", result);
        logger.info(log);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{title}")
    public ResponseEntity<String> delete(@PathVariable String title) {
        logger.info("Request delete ads form");
        if (title.length() == 0) {
            logger.warn("Invalid title");
            throw new InvalidAccountException("Invalid title");
        } else {
            if (adsService.deleteAdsForm(title)) {
                logger.info("Ads form deleted successfully");
                return new ResponseEntity<>("Deleted", HttpStatus.OK);
            }
            logger.warn("Title not found");
            return new ResponseEntity<>("Title not found", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update/{title}")
    public ResponseEntity<String> update(@PathVariable String title, @Valid @RequestBody AdsForm adsForm) {
        logger.info("Request update ads form");
        if (title.length() == 0) {
            logger.warn("Invalid title");
            throw new InvalidAccountException("Invalid title");
        } else {
            if (adsService.updateAdsForm(title, adsForm)) {
                logger.info("Ads form updated successfully");
                return new ResponseEntity<>("Updated", HttpStatus.OK);
            }
            logger.warn("Title not found");
            return new ResponseEntity<>("Title not found", HttpStatus.NOT_FOUND);
        }
    }

}
