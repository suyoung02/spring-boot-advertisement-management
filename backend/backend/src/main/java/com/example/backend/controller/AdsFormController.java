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

    @GetMapping("/getAll")
    public ResponseEntity<List<AdsForm>> getAll() {
        List<AdsForm> result = adsService.getAllAdsForms();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/addNew")
    public ResponseEntity<AdsForm> addNewAdsForm(@Valid @RequestBody AdsForm adsForm) {
        if (adsForm.getTitle().length() == 0) {
            throw new InvalidAccountException("Invalid title");
        }

        AdsForm result = adsService.addNewAdsForm(adsForm);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{title}")
    public ResponseEntity<String> delete(@PathVariable String title) {
        if (title.length() == 0) {
            throw new InvalidAccountException("Invalid title");
        } else {
            if (adsService.deleteAdsForm(title)) {
                return new ResponseEntity<>("Deleted", HttpStatus.OK);
            }
            return new ResponseEntity<>("Title not found", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update/{title}")
    public ResponseEntity<String> update(@PathVariable String title, @Valid @RequestBody AdsForm adsForm) {
        System.out.println(title);
        if (title.length() == 0) {
            throw new InvalidAccountException("Invalid title");
        } else {
            if (adsService.updateAdsForm(title, adsForm)) {
                return new ResponseEntity<>("Updated", HttpStatus.OK);
            }
            return new ResponseEntity<>("Title not found", HttpStatus.NOT_FOUND);
        }
    }

}
