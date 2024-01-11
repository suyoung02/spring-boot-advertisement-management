package com.example.backend.controller;

import java.security.Principal;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.PositionRequirementRequest;
import com.example.backend.entity.PositionRequirement;
import com.example.backend.enums.Status;
import com.example.backend.exception.AppException;
import com.example.backend.service.PositionRequirementService;

@Controller
@RestController
@CrossOrigin
@RequestMapping("api/v1/position_requirement")
public class PositionRequirementController {
    private final PositionRequirementService positionRequirementService;
    private static final Logger logger = Logger.getLogger(EditingRequirementController.class);

    public PositionRequirementController(PositionRequirementService positionRequirementService) {
        this.positionRequirementService = positionRequirementService;
    }

    @GetMapping("")
    public ResponseEntity<List<PositionRequirement>> getAllPositionRequirement(Principal connectedUser) {
        logger.info("Request received for getAllPositionRequirement");
        return new ResponseEntity<>(this.positionRequirementService.getAllEditingRequirement(connectedUser),
                HttpStatus.OK);
    }

    @GetMapping("/wait")
    public ResponseEntity<List<PositionRequirement>> getAllWaitPositionRequirement() {
        logger.info("Request received for getAllWaitPositionRequirement");
        logger.info("Return all position requirement which is waiting for approve");
        return new ResponseEntity<>(this.positionRequirementService.getAllWaitEditingRequirement(), HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<String> createPositionRequirement(@RequestBody PositionRequirementRequest editingRequirement,
            Principal principal) {
        logger.info("Request received for createPositionRequirement");
        positionRequirementService.createEditingRequirement(editingRequirement, principal.getName());
        String log = String.format("PositionRequirement added successfully: %s", editingRequirement);
        logger.debug(log);
        return new ResponseEntity<>("Create Request success", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updatePositionRequirement(@RequestBody PositionRequirementRequest editingRequirement,
            @PathVariable(value = "id") String id) {
        logger.info("Request received for updatePositionRequirement");
        positionRequirementService.updateEditingRequirement(editingRequirement, Integer.parseInt(id));
        String log = String.format("PositionRequirement update successfully: %s", editingRequirement);
        logger.debug(log);
        return new ResponseEntity<>("Update Request success", HttpStatus.OK);
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<String> approvePositionRequirement(@PathVariable(value = "id") String id) {
        logger.info("Request received for approvePositionRequirement");
        int editingId;
        try {
            editingId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            logger.error(e);
            throw new AppException(400, HttpStatus.BAD_REQUEST, "id should be integer");
        }

        positionRequirementService.approveEditingRequirement(editingId, Status.ACTIVE);
        logger.info("Approve position requirement success");
        return new ResponseEntity<>("Approve request success", HttpStatus.OK);
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<String> rejectPositionRequirement(@PathVariable(value = "id") String id) {
        logger.info("Request received for rejectPositionRequirement");
        int editingId;
        try {
            editingId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            logger.error(e);
            throw new AppException(400, HttpStatus.BAD_REQUEST, "id should be integer");
        }

        positionRequirementService.approveEditingRequirement(editingId, Status.REJECT);
        logger.info("Reject position requirement success");
        return new ResponseEntity<>("Reject request success", HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deletePositionRequirement(@PathVariable(value = "id") String id) {
        logger.info("Request received for deletePositionRequirement");
        int editingId;
        try {
            editingId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            logger.error(e);
            throw new AppException(400, HttpStatus.BAD_REQUEST, "id should be integer");
        }

        positionRequirementService.deleteEditingRequirement(editingId);
        logger.info("Delete position requirement success");
        return new ResponseEntity<>("Delete request success", HttpStatus.OK);
    }
}
