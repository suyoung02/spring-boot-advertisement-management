package com.example.backend.controller;

import com.example.backend.entity.Ward;
import com.example.backend.dto.AddPositionRequest;
import com.example.backend.entity.District;
import com.example.backend.service.LocationService;
import org.apache.log4j.Logger;
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
    private static final Logger logger = Logger.getLogger(LocationController.class);
    @Autowired
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/wards")
    public ResponseEntity<List<Ward>> getAllWards() {
        logger.info("Request received for getAllWards");
        List<Ward> wards = locationService.getAllWards();
        String logmsg = String.format("Retrieved wards: {}", wards);
        logger.debug(logmsg);
        return new ResponseEntity<>(wards, HttpStatus.OK);
    }

    @GetMapping("/districts")
    public ResponseEntity<List<District>> getAllDistricts(@RequestBody AddPositionRequest wardName) {
        logger.info("Request received for getAllDistricts");
        List<District> districts = locationService.getAllDistricts(wardName);
        System.out.println(districts);
        String logmsg = String.format("Retrieved districts: {}", districts);
        logger.debug(logmsg);
        return new ResponseEntity<>(districts, HttpStatus.OK);
    }


    @PostMapping("/wards")
    public ResponseEntity<String> addWard(@RequestBody AddPositionRequest ward) {
        logger.info("Request received for add new ward");
        try {
            locationService.addWard(ward);
            String log = String.format("Ward added successfully: {}", ward);
            logger.info(log);
            return new ResponseEntity<>("Ward added successfully", HttpStatus.CREATED);
        } catch (DataIntegrityViolationException  ex) {
            logger.warn("Duplicate ward entry");
            return new ResponseEntity<>("Duplicate ward entry: " + ward.getWard(), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            // Handle other exceptions
            logger.error("Error during ward insertion");
            return new ResponseEntity<>("Error during ward insertion", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

    @PutMapping("/wards/{ward}")
    public ResponseEntity<String> updateWard(@PathVariable String ward, @RequestBody Ward updatedWard) {
        logger.info("Request received for update ward");
        try {
            Ward oldWard = locationService.findWardByName(ward);

            if (oldWard != null) {
                locationService.updateWard(updatedWard,oldWard);
                logger.info("Ward updated successfully");
                return new ResponseEntity<>("Ward updated successfully", HttpStatus.OK);
            } else {
                logger.warn("Ward not found");
                return new ResponseEntity<>("Ward not found", HttpStatus.NOT_FOUND);
            }
        }
        catch (DataIntegrityViolationException  ex) {
            logger.warn("Duplicate ward entry");
            return new ResponseEntity<>("Duplicate ward entry: " + updatedWard.getWard(), HttpStatus.BAD_REQUEST);
        }
        catch (Exception ex) {
            // Handle other exceptions
            logger.error("Error during ward insertion");
            return new ResponseEntity<>("Error during ward insertion", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/wards")
    public ResponseEntity<String> deleteWard(@RequestBody AddPositionRequest ward) {
        logger.info("Request received for delete ward");
        try {
        if (ward != null) {
            locationService.deleteWard(ward);
            logger.info("Ward deleted successfully");
            return new ResponseEntity<>("Ward deleted successfully", HttpStatus.OK);
        } else {
            logger.warn("Ward not found");
            return new ResponseEntity<>("Ward not found", HttpStatus.NOT_FOUND);
        }
        }
        catch (DataIntegrityViolationException  ex) {
            logger.warn("Duplicate ward entry");
            return new ResponseEntity<>("Duplicate ward entry: " + ward.getWard(), HttpStatus.BAD_REQUEST);
        }
        catch (Exception ex) {
            // Handle other exceptions
            logger.error("Error during ward insertion");
            return new ResponseEntity<>("Error during ward insertion", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/districts/{id}")
    public ResponseEntity<District> getDistrictById(@PathVariable Integer id) {
        logger.info("Request received for getDistrictById");
        Optional<District> district = locationService.getDistrictById(id);
        String logmsg = String.format("Retrieved district: {}", district);
        logger.debug(logmsg);
        return district.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/districts")
    public ResponseEntity<String> addDistrict(@RequestBody District district) {
        logger.info("Request received for add new district");
        locationService.addDistrict(district);
        String log = String.format("District added successfully: {}", district);
        logger.info(log);
        return new ResponseEntity<>("District added successfully", HttpStatus.CREATED);
    }

    @PutMapping("/districts/{id}")
    public ResponseEntity<String> updateDistrict(@PathVariable Integer id, @RequestBody District updatedDistrict) {
        logger.info("Request received for update district");
        Optional<District> existingDistrict = locationService.getDistrictById(id);
        if (existingDistrict != null) {
            locationService.updateDistrict(id,updatedDistrict);
            logger.info("District updated successfully");
            return new ResponseEntity<>("District updated successfully", HttpStatus.OK);
        } else {
            logger.warn("District not found");
            return new ResponseEntity<>("District not found", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/districts/{id}")
    public ResponseEntity<String> deleteDistrict(@PathVariable Integer id) {
        logger.info("Request received for delete district");
        Optional<District> district = locationService.getDistrictById(id);
        if (district != null) {
            locationService.deleteDistrict(id);
            logger.info("District deleted successfully");
            return new ResponseEntity<>("District deleted successfully", HttpStatus.OK);
        } else {
            logger.warn("District not found");
            return new ResponseEntity<>("District not found", HttpStatus.NOT_FOUND);
        }
    }
}
