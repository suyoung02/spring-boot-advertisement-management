package com.example.backend.controller;

import com.example.backend.dto.AddPanelRequest;
import com.example.backend.dto.AddPositionRequest;
import com.example.backend.entity.AdsPanel;
import com.example.backend.entity.AdsPosition;
import com.example.backend.service.AdsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/v1/ads")
public class AdsController {
    private final AdsService adsService;

    @GetMapping("/all/getAllPosition")
    public ResponseEntity<List<AdsPosition>> getAllPosition(){
        System.out.println(1);
        List<AdsPosition> result = adsService.getAllPosition();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/all/getDetailPosition/{id}")
    public ResponseEntity<?> getDetailPosition(@PathVariable(value = "id") Integer id){
        Optional<AdsPosition> position = adsService.getDetailPosition(id);
        if(position != null){
            return new ResponseEntity<>(position, HttpStatus.OK);
        }
        return new ResponseEntity<>("Id Not found", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/vhtt/addNewPosition")
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
    @DeleteMapping("/vhtt/deletePosition/{id}")
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

    @PutMapping("/vhtt/updatePosition/{id}")
    public ResponseEntity<AdsPosition> updatePosition(@PathVariable(value = "id") Integer id, @Valid @RequestBody AddPositionRequest newPosition){
        try{
            AdsPosition result = adsService.updatePosition(id, newPosition);
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Panel controller....................

    @GetMapping("/all/getAllPanel")
    public ResponseEntity<List<AdsPanel>> getAllPanels(){
        List<AdsPanel> ads = adsService.getAllPanels();
        System.out.println(ads);
        return new ResponseEntity<>(ads, HttpStatus.OK);
    }

    @GetMapping("/all/getDetailPanel/{id}")
    public ResponseEntity<?> getDetailPanel(@PathVariable(value = "id") Integer id){
        Optional<AdsPanel> panel = adsService.getDetailPanel(id);
        if(panel != null){
            return new ResponseEntity<>(panel, HttpStatus.OK);
        }
        return new ResponseEntity<>("Id Not found", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/vhtt/addNewPanel")
    public ResponseEntity<String> addNewPanel(@Valid @RequestBody AddPanelRequest newPanel){
        System.out.println(newPanel);
        try{
            if(adsService.addNewPanel(newPanel)){
                return new ResponseEntity<>("panel", HttpStatus.OK);
            }
            return new ResponseEntity<>("Error", HttpStatus.BAD_REQUEST);

        }
        catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/vhtt/deletePanel")
    public ResponseEntity<String> deletePanel(@PathVariable(value = "id") Integer id){
        try{
            if(adsService.deletePanel(id)){
                return new ResponseEntity<>("Deleted", HttpStatus.OK);
            }
            return new ResponseEntity<>("Id not found", HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<>("Error", HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping("/vhtt/updatePanel")
    public ResponseEntity<AdsPanel> updatePanel(@PathVariable(value = "id") Integer id, @Valid @RequestBody AddPanelRequest newPosition){
        try{
            AdsPanel result = adsService.updatePanel(id, newPosition);
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
