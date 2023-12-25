package com.example.backend.controller;

import com.example.backend.dto.ContractRequest;
import com.example.backend.exception.AppException;
import com.example.backend.service.ContractService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RestController
@RequestMapping("api/v1/contract")
public class ContractController {
    private final ContractService contractService;

    @Autowired
    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @PostMapping("")
    public ResponseEntity<String> createContract(@Valid @RequestBody ContractRequest contractRequest) {
        contractService.createContract(contractRequest);

        return new ResponseEntity<>("Create contract success", HttpStatus.OK);
    }

    @PostMapping("{id}")
    public ResponseEntity<String> approveContract(@PathVariable (value = "id") String id) {

        int contractId;
        System.out.println(id);
        try {
            contractId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "id should be integer");
        }

        contractService.approveContract(contractId);

        return new ResponseEntity<>("Delete contract success", HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteContract(@PathVariable (value = "id") String id,
                                                 @Valid @RequestBody ContractRequest contractRequest) {

        int contractId;
        try {
            contractId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "id should be integer");
        }

        contractService.deleteContract(contractId);

        return new ResponseEntity<>("Delete contract success", HttpStatus.OK);
    }
}
