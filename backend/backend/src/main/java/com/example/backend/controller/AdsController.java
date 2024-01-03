package com.example.backend.controller;

import com.example.backend.dto.AddPositionRequest;
import com.example.backend.entity.AdsPosition;
import com.example.backend.service.AdsService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/ads")
public class AdsController {
    private final AdsService adsService;

    @GetMapping("/getAllPosition")
    public ResponseEntity<List<AdsPosition>> getAllPosition(){
        List<AdsPosition> result = adsService.getAllPosition();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/addNewPosition")
    public ResponseEntity<AdsPosition> addNewPosition(@Valid @RequestBody AddPositionRequest newPosition) {
        try {
            System.out.println(newPosition);
            AdsPosition result = adsService.addNewPosition(newPosition);

            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/deletePosition/{id}")
    public ResponseEntity<String> deletePosition(@PathVariable(value = "id") Integer id){
        try{
            System.out.println(id);
            if(adsService.deletePosition(id)){
                return new ResponseEntity<>("Deleted", HttpStatus.OK);
            }
            return new ResponseEntity<>("Id not found", HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<>("Error", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/updatePosition/{id}")
    public ResponseEntity<AdsPosition> updatePosition(@PathVariable(value = "id") Integer id, @Valid @RequestBody AddPositionRequest newPosition){
        try{
            AdsPosition result = adsService.updatePosition(id, newPosition);
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
