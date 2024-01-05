package com.example.backend.service;

import com.example.backend.dto.ContractRequest;
import com.example.backend.entity.Contract;
import com.example.backend.entity.Staff;
import com.example.backend.exception.AppException;
import com.example.backend.repository.ContractRepository;
import com.example.backend.repository.StaffRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContractService {
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    @Autowired
    public ContractService(ContractRepository contractRepository, UserRepository userRepository, StaffRepository staffRepository) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
    }

    public List<Contract> getAllContract() {
        return this.contractRepository.findAll();
    }

    public void createContract(ContractRequest contractRequest, String username) {
        Contract contract = new Contract();
        contract.setEnterprise_info(contractRequest.getEnterprise_info());
        contract.setEnterprise_email(contractRequest.getEnterprise_email());
        contract.setEnterprise_phone_number(contractRequest.getEnterprise_phone_number());
        contract.setContract_begin(contractRequest.getContract_begin());
        contract.setContract_expiration(contractRequest.getContract_expiration());
        contract.setState("Chờ duyệt");
        contract.setAds_panel(contractRequest.getAds_panel());

        Optional<Staff> user = this.staffRepository.findByUsername(username);
        Staff users = user.get();

        contract.setStaff(users.getId());
        this.contractRepository.save(contract);
    }

    public void approveContract(Integer id) {
        Optional<Contract> contracts = this.contractRepository.findById(id);
        Contract contract = contracts.get();

        if (contract == null) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "This contract is not exist");
        }
        Contract old = this.contractRepository.getLatestContract(contract.getAds_panel());
        old.setState("Đã hết hạn");
        contract.setState("Đang hiện diện");

        this.contractRepository.save(old);
        this.contractRepository.save(contract);
    }

    public void deleteContract(Integer id) {
        if (this.contractRepository.findById(id) == null) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "This contract is not exist");
        }

        this.contractRepository.deleteById(id);
    }
}
