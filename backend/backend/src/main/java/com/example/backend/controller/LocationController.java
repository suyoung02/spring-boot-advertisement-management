package com.example.backend.controller;

import com.example.backend.entity.Ward;
import com.example.backend.dto.AddPositionRequest;
import com.example.backend.entity.District;
import com.example.backend.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/location")
public class LocationController {

    private final LocationService locationService;

    @Autowired
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/wards")
    public ResponseEntity<List<Ward>> getAllWards() {
        List<Ward> wards = locationService.getAllWards();
        return new ResponseEntity<>(wards, HttpStatus.OK);
    }

    @GetMapping("/districts")
    public ResponseEntity<List<District>> getAllDistricts(@RequestBody AddPositionRequest wardName) {
        List<District> districts = locationService.getAllDistricts(wardName);
        System.out.println(districts);
        return new ResponseEntity<>(districts, HttpStatus.OK);
    }


    @PostMapping("/wards")
    public ResponseEntity<String> addWard(@RequestBody AddPositionRequest ward) {
        try {
            locationService.addWard(ward);
            return new ResponseEntity<>("Ward added successfully", HttpStatus.CREATED);
        } catch (DataIntegrityViolationException  ex) {
            return new ResponseEntity<>("Duplicate ward entry: " + ward.getWard(), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            // Handle other exceptions
            return new ResponseEntity<>("Error during ward insertion", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

    @PutMapping("/wards/{ward}")
    public ResponseEntity<String> updateWard(@PathVariable String ward, @RequestBody Ward updatedWard) {

        try {
            Ward oldWard = locationService.findWardByName(ward);

            if (oldWard != null) {
                locationService.updateWard(updatedWard,oldWard);
                return new ResponseEntity<>("Ward updated successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Ward not found", HttpStatus.NOT_FOUND);
            }
        }
        catch (DataIntegrityViolationException  ex) {
            return new ResponseEntity<>("Duplicate ward entry: " + updatedWard.getWard(), HttpStatus.BAD_REQUEST);
        }
        catch (Exception ex) {
            // Handle other exceptions
            return new ResponseEntity<>("Error during ward insertion", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/wards")
    public ResponseEntity<String> deleteWard(@RequestBody AddPositionRequest ward) {
        try {
        if (ward != null) {
            locationService.deleteWard(ward);
            return new ResponseEntity<>("Ward deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Ward not found", HttpStatus.NOT_FOUND);
        }
        }
        catch (DataIntegrityViolationException  ex) {
            return new ResponseEntity<>("Duplicate ward entry: " + ward.getWard(), HttpStatus.BAD_REQUEST);
        }
        catch (Exception ex) {
            // Handle other exceptions
            return new ResponseEntity<>("Error during ward insertion", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/districts/{id}")
    public ResponseEntity<District> getDistrictById(@PathVariable Integer id) {
        Optional<District> district = locationService.getDistrictById(id);
        return district.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/districts")
    public ResponseEntity<String> addDistrict(@RequestBody District district) {
        locationService.addDistrict(district);
        return new ResponseEntity<>("District added successfully", HttpStatus.CREATED);
    }

    @PutMapping("/districts/{id}")
    public ResponseEntity<String> updateDistrict(@PathVariable Integer id, @RequestBody District updatedDistrict) {
        Optional<District> existingDistrict = locationService.getDistrictById(id);
        if (existingDistrict != null) {
            locationService.updateDistrict(id,updatedDistrict);
            return new ResponseEntity<>("District updated successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("District not found", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/districts/{id}")
    public ResponseEntity<String> deleteDistrict(@PathVariable Integer id) {
        Optional<District> district = locationService.getDistrictById(id);
        if (district != null) {
            locationService.deleteDistrict(id);
            return new ResponseEntity<>("District deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("District not found", HttpStatus.NOT_FOUND);
        }
    }
}
