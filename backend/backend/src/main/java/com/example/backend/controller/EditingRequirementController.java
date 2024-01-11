package com.example.backend.controller;

import com.example.backend.dto.EditingRequirementRequest;
import com.example.backend.dto.PositionRequirementRequest;
import com.example.backend.entity.Contract;
import com.example.backend.entity.EditingRequirement;
import com.example.backend.enums.Status;
import com.example.backend.exception.AppException;
import com.example.backend.service.EditingRequirementService;
import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Controller
@RestController
@CrossOrigin
@RequestMapping("api/v1/editing_requirement")
public class EditingRequirementController {
    private final EditingRequirementService editingRequirementService;
    private static final Logger logger = Logger.getLogger(EditingRequirementController.class);

    public EditingRequirementController(EditingRequirementService editingRequirementService) {
        this.editingRequirementService = editingRequirementService;
    }

    @GetMapping("")
    public ResponseEntity<List<EditingRequirement>> getAllEditingRequirement(Principal connectedUser) {
        logger.info("Request received for getAllEditingRequirement");
        return new ResponseEntity<>(this.editingRequirementService.getAllEditingRequirement(connectedUser),
                HttpStatus.OK);
    }

    @GetMapping("/wait")
    public ResponseEntity<List<EditingRequirement>> getAllWaitEditingRequirement() {
        logger.info("Request received for getAllWaitEditingRequirement");
        logger.info("Return all editing requirement which is waiting for approve");
        return new ResponseEntity<>(this.editingRequirementService.getAllWaitEditingRequirement(), HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<String> createEditingRequirement(@RequestBody EditingRequirementRequest editingRequirement,
            Principal principal) {
        logger.info("Request received for createEditingRequirement");
        editingRequirementService.createEditingRequirement(editingRequirement, principal.getName());
        String log = String.format("EditingRequirement added successfully: %s", editingRequirement);
        logger.debug(log);
        return new ResponseEntity<>("Create Request success", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateEditingRequirement(@RequestBody EditingRequirementRequest editingRequirement,
            @PathVariable(value = "id") String id) {
        logger.info("Request received for updateEditingRequirement");
        editingRequirementService.updateEditingRequirement(editingRequirement, Integer.parseInt(id));
        String log = String.format("EditingRequirement update successfully: %s", editingRequirement);
        logger.debug(log);
        return new ResponseEntity<>("Update Request success", HttpStatus.OK);
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<String> approveEditingRequirement(@PathVariable(value = "id") String id) {
        logger.info("Request received for approveEditingRequirement");
        int editingId;
        try {
            editingId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            logger.error(e);
            throw new AppException(400, HttpStatus.BAD_REQUEST, "id should be integer");
        }

        editingRequirementService.approveEditingRequirement(editingId, Status.ACTIVE);
        logger.info("Approve editing requirement success");
        return new ResponseEntity<>("Approve request success", HttpStatus.OK);
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<String> rejectEditingRequirement(@PathVariable(value = "id") String id) {
        logger.info("Request received for rejectEditingRequirement");
        int editingId;
        try {
            editingId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            logger.error(e);
            throw new AppException(400, HttpStatus.BAD_REQUEST, "id should be integer");
        }

        editingRequirementService.approveEditingRequirement(editingId, Status.ACTIVE);
        logger.info("Reject editing requirement success");
        return new ResponseEntity<>("Reject request success", HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteEditingRequirement(@PathVariable(value = "id") String id) {
        logger.info("Request received for deleteEditingRequirement");
        int editingId;
        try {
            editingId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            logger.error(e);
            throw new AppException(400, HttpStatus.BAD_REQUEST, "id should be integer");
        }

        editingRequirementService.deleteEditingRequirement(editingId);
        logger.info("Delete editing requirement success");
        return new ResponseEntity<>("Delete request success", HttpStatus.OK);
    }
}
