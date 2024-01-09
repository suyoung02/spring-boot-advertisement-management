package com.example.backend.controller;

import java.util.List;

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

    @GetMapping("/getAll")
    public ResponseEntity<List<LocationType>> getAll() {
        List<LocationType> result = adsService.getAllLocationTypes();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/addNew")
    public ResponseEntity<LocationType> addNewTAdsType(@Valid @RequestBody LocationType locationType) {
        if (locationType.getTitle().length() == 0) {
            throw new InvalidAccountException("Invalid title");
        }

        LocationType result = adsService.addNewLocationType(locationType);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{title}")
    public ResponseEntity<String> deleteAdsType(@PathVariable String title) {
        if (title.length() == 0) {
            throw new InvalidAccountException("Invalid title");
        } else {
            if (adsService.deleteLocationType(title)) {
                return new ResponseEntity<>("Deleted", HttpStatus.OK);
            }
            return new ResponseEntity<>("Title not found", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update/{title}")
    public ResponseEntity<String> updateAdsType(@PathVariable String title,
            @Valid @RequestBody LocationType locationType) {
        System.out.println(title);
        if (title.length() == 0) {
            throw new InvalidAccountException("Invalid title");
        } else {
            if (adsService.updateLocationType(title, locationType)) {
                return new ResponseEntity<>("Updated", HttpStatus.OK);
            }
            return new ResponseEntity<>("Title not found", HttpStatus.NOT_FOUND);
        }
    }

}
