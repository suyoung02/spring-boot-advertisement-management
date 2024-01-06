package com.example.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/all/get-individual")
    public ResponseEntity<StaffDto> getPersonalStaff(Principal connectedUser) {
        return new ResponseEntity<>(staffService.getPersonalStaff(connectedUser), HttpStatus.OK);
    }
}
