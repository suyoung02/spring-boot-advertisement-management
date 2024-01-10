package com.example.backend.controller;

import com.example.backend.dto.AddPanelRequest;
import com.example.backend.dto.ContractRequest;
import com.example.backend.entity.Contract;
import com.example.backend.enums.Role;
import com.example.backend.exception.AppException;
import com.example.backend.service.ContractService;
import jakarta.validation.Valid;
import org.apache.log4j.Logger;
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
    private static final Logger logger = Logger.getLogger(ContractController.class);
    @Autowired
    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @GetMapping("")
    public ResponseEntity<List<Contract>> getAllContract() {
        logger.info("Request received for getAllContract");
        return new ResponseEntity<>(contractService.getAllContract(), HttpStatus.OK);
    }

    @GetMapping("/wait")
    public ResponseEntity<List<Contract>> getAllContractWaitApprove() {
        logger.info("Request received for getAllContractWaitApprove");
        List<Contract> myObjectList = contractService.getAllContract();
        List<Contract> filteredList = myObjectList.stream()
                .filter(obj -> "Chờ duyệt".equals(obj.getState()))
                .collect(Collectors.toList());
        logger.info("Contract is waiting for approve");
        return new ResponseEntity<>(filteredList, HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<String> createContract(@Valid @RequestBody ContractRequest contractRequest, Principal principal) {
        logger.info("Request received for createContract");
        contractService.createContract(contractRequest,principal.getName());
        String log = String.format("Contract added successfully:%s", contractRequest);
        logger.debug(log);
        return new ResponseEntity<>("Create contract success", HttpStatus.OK);
    }

    @PostMapping("{id}")
    public ResponseEntity<String> approveContract(@PathVariable (value = "id") String id) {
        int contractId;
        logger.info("Request received for approveContract");
        try {
            contractId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            logger.error(e);
            throw new AppException(400, HttpStatus.BAD_REQUEST, "id should be integer");
        }
        String log = String.format("Contract:%s is approved", contractId);
        logger.info(log);
        contractService.approveContract(contractId);

        return new ResponseEntity<>("Approve contract success", HttpStatus.OK);
    }

    @PostMapping("check-expiration")
    public ResponseEntity<String> checkExpirationContract() {
        logger.info("Request received for checkExpirationContract");
        contractService.checkExpirationContract();
        logger.info("Check expired contract success");
        return new ResponseEntity<>("Check expired contract success", HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteContract(@PathVariable (value = "id") String id,
                                                 Principal principal) {

        int contractId;
        logger.info("Request received for deleteContract");
        try {
            contractId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            logger.error(e);
            throw new AppException(400, HttpStatus.BAD_REQUEST, "id should be integer");
        }
        String log = String.format("Contract:%s is deleted", contractId);
        logger.info(log);
        contractService.deleteContract(contractId, principal.getName());

        return new ResponseEntity<>("Delete contract success", HttpStatus.OK);
    }


}
