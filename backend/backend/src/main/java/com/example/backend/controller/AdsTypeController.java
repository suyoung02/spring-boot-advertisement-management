package com.example.backend.controller;

import com.example.backend.entity.AdsType;
import com.example.backend.exception.InvalidAccountException;
import com.example.backend.service.AdsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    @GetMapping("/getAll")
    public ResponseEntity<List<AdsType>> getAllAdsType() {
        List<AdsType> result = adsService.getAllType();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/addNew")
    public ResponseEntity<AdsType> addNewTAdsType(@Valid @RequestBody AdsType adsType) {
        if (adsType.getTitle().length() == 0) {
            throw new InvalidAccountException("Invalid title");
        }

        AdsType result = adsService.addNewType(adsType);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{title}")
    public ResponseEntity<String> deleteAdsType(@PathVariable String title) {
        if (title.length() == 0) {
            throw new InvalidAccountException("Invalid title");
        } else {
            if (adsService.deleteTypeAds(title)) {
                return new ResponseEntity<>("Deleted", HttpStatus.OK);
            }
            return new ResponseEntity<>("Title not found", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update/{title}")
    public ResponseEntity<String> updateAdsType(@PathVariable String title, @Valid @RequestBody AdsType adsType) {
        System.out.println(title);
        if (title.length() == 0) {
            throw new InvalidAccountException("Invalid title");
        } else {
            if (adsService.updateAdsType(title, adsType)) {
                return new ResponseEntity<>("Updated", HttpStatus.OK);
            }
            return new ResponseEntity<>("Title not found", HttpStatus.NOT_FOUND);
        }
    }

}
