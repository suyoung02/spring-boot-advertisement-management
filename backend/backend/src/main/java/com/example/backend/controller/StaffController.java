package com.example.backend.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.StaffDto;
import com.example.backend.exception.InvalidAccountException;
import com.example.backend.service.StaffService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/v1/staff")
public class StaffController {
    private final StaffService staffService;

    @GetMapping("/all/get-individual")
    public ResponseEntity<StaffDto> getPersonalStaff(Principal connectedUser) {
        return new ResponseEntity<>(staffService.getPersonalStaff(connectedUser), HttpStatus.OK);
    }

    @GetMapping("/vhtt/get-all")
    public ResponseEntity<List<StaffDto>> getAllStaffsWithoutVHTT() {
        return new ResponseEntity<>(staffService.getAllStaffsWithoutVHTT(), HttpStatus.OK);
    }

    @GetMapping("/vhtt/get-one")
    public ResponseEntity<StaffDto> getStaffByIdWithoutVHTT(@RequestParam String id) {
        try {
            int toId = Integer.parseInt(id);

            return new ResponseEntity<>(staffService.getStaffByIdWithoutVHTT(toId), HttpStatus.OK);
        } catch (NumberFormatException e) {
            throw new InvalidAccountException("Invalid staff");
        }
    }

    @PatchMapping("/all/update-individual")
    public ResponseEntity<String> updatePersonalStaff(@RequestBody Map<String, Object> fields,
            Principal connectedUser) {
        return new ResponseEntity<>(staffService.updatePersonalStaffByFields(connectedUser, fields), HttpStatus.OK);
    }

    @PatchMapping("/vhtt/update-one")
    public ResponseEntity<String> updateStaff(@RequestBody Map<String, Object> fields,
            @RequestParam String id) {
        try {
            int toId = Integer.parseInt(id);

            return new ResponseEntity<>(staffService.updateStaffByFields(toId, fields), HttpStatus.OK);
        } catch (NumberFormatException e) {
            throw new InvalidAccountException("Invalid staff");
        }
    }

    @DeleteMapping("/vhtt/remove-one")
    public ResponseEntity<String> removeStaffWithoutVHTT(@RequestParam String id) {
        try {
            int toId = Integer.parseInt(id);

            return new ResponseEntity<>(staffService.removeStaff(toId), HttpStatus.OK);
        } catch (NumberFormatException e) {
            throw new InvalidAccountException("Invalid staff");
        }
    }
}
