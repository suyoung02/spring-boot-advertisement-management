package com.example.backend.service;

import com.example.backend.dto.ContractRequest;
import com.example.backend.entity.Contract;
import com.example.backend.exception.AppException;
import com.example.backend.repository.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ContractService {
    private final ContractRepository contractRepository;

    @Autowired
    public ContractService(ContractRepository contractRepository) {
        this.contractRepository = contractRepository;
    }

    public void createContract(ContractRequest contractRequest) {
        Contract contract = new Contract();
        contract.setEnterprise_info(contractRequest.getEnterprise_info());
        contract.setEnterprise_email(contractRequest.getEnterprise_email());
        contract.setEnterprise_phone_number(contractRequest.getEnterprise_phone_number());
        contract.setContract_begin(contractRequest.getContract_begin());
        contract.setContract_expiration(contractRequest.getContract_expiration());
        contract.setState("Chờ duyệt");
        contract.setAds_panel(contractRequest.getAds_panel());

        this.contractRepository.save(contract);
    }

    public void approveContract(Integer id) {
        Optional<Contract> contracts = this.contractRepository.findById(id);
        Contract contract = contracts.get();
        if (contract == null) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "This contract is not exist");
        }

        contract.setState("Đang hiện diện");
        this.contractRepository.save(contract);
    }

    public void deleteContract(Integer id) {
        if (this.contractRepository.findById(id) == null) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "This contract is not exist");
        }

        this.contractRepository.deleteById(id);
    }
}
