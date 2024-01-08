package com.example.backend.controller;

import com.example.backend.dto.AddPanelRequest;
import com.example.backend.dto.ContractRequest;
import com.example.backend.entity.Contract;
import com.example.backend.enums.Role;
import com.example.backend.exception.AppException;
import com.example.backend.service.ContractService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RestController
@RequestMapping("api/v1/contract")
public class ContractController {
    private final ContractService contractService;

    @Autowired
    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @GetMapping("")
    public ResponseEntity<List<Contract>> getAllContract() {
        return new ResponseEntity<>(contractService.getAllContract(), HttpStatus.OK);
    }

    @GetMapping("/wait")
    public ResponseEntity<List<Contract>> getAllContractWaitApprove() {
        List<Contract> myObjectList = contractService.getAllContract();
        List<Contract> filteredList = myObjectList.stream()
                .filter(obj -> "Chờ duyệt".equals(obj.getState()))
                .collect(Collectors.toList());
        return new ResponseEntity<>(filteredList, HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<String> createContract(@Valid @RequestBody ContractRequest contractRequest, Principal principal) {
        contractService.createContract(contractRequest,principal.getName());

        return new ResponseEntity<>("Create contract success", HttpStatus.OK);
    }

    @PostMapping("{id}")
    public ResponseEntity<String> approveContract(@PathVariable (value = "id") String id) {
        int contractId;
        try {
            contractId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "id should be integer");
        }

        contractService.approveContract(contractId);

        return new ResponseEntity<>("Approve contract success", HttpStatus.OK);
    }

    @PostMapping("check-expiration")
    public ResponseEntity<String> checkExpirationContract() {
        contractService.checkExpirationContract();
        return new ResponseEntity<>("Check expired contract success", HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteContract(@PathVariable (value = "id") String id,
                                                 Principal principal) {

        int contractId;
        try {
            contractId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "id should be integer");
        }

        contractService.deleteContract(contractId, principal.getName());

        return new ResponseEntity<>("Delete contract success", HttpStatus.OK);
    }


}
