package com.example.backend.service;

import com.example.backend.dto.ContractRequest;
import com.example.backend.entity.AdsImages;
import com.example.backend.entity.AdsPanel;
import com.example.backend.entity.Contract;
import com.example.backend.entity.Staff;
import com.example.backend.entity.User;
import com.example.backend.enums.ContractState;
import com.example.backend.enums.Role;
import com.example.backend.exception.AppException;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
public class ContractService {
    private final ContractRepository contractRepository;
    private final AdsImagesRepository adsImagesRepository;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;
    private final AdsPanelRepository adsPanelRepository;

    @Autowired
    public ContractService(ContractRepository contractRepository, AdsImagesRepository adsImagesRepository,
            StaffRepository staffRepository, AdsPanelRepository adsPanelRepository, UserRepository userRepository) {
        this.contractRepository = contractRepository;
        this.adsImagesRepository = adsImagesRepository;
        this.staffRepository = staffRepository;
        this.adsPanelRepository = adsPanelRepository;
        this.userRepository = userRepository;
    }

    public List<Contract> getAllContract() {
        return this.contractRepository.findAll();
    }

    public void createContract(ContractRequest contractRequest, Principal principal) {
        AdsPanel adsPanel = new AdsPanel();
        adsPanel.setAds_type(contractRequest.getAds_type());
        adsPanel.setSize(contractRequest.getSize());
        adsPanel.setAds_position(contractRequest.getAds_position());
        adsPanel.setContent(contractRequest.getContent());
        adsPanel = this.adsPanelRepository.save(adsPanel);

        AdsImages adsImages = new AdsImages();
        adsImages.setAds_panel(adsPanel.getId());
        adsImages.setAds_image(contractRequest.getAds_img());
        this.adsImagesRepository.save(adsImages);

        System.out.println(contractRequest);

        contractRequest.setAds_panel(adsPanel.getId());
        Contract contract = new Contract();
        contract.setEnterprise_info(contractRequest.getEnterprise_info());
        contract.setEnterprise_email(contractRequest.getEnterprise_email());
        contract.setEnterprise_phone_number(contractRequest.getEnterprise_phone_number());
        contract.setContract_begin(contractRequest.getContract_begin());
        contract.setContract_expiration(contractRequest.getContract_expiration());
        contract.setAds_panel(contractRequest.getAds_panel());

        Optional<Staff> staff = this.staffRepository.findByUsername(principal.getName());
        Optional<User> user = this.userRepository.findByUsername(principal.getName());
        Staff _user = staff.get();

        var status = user.get().getRole() == Role.VHTT ? ContractState.APPROVED.state : ContractState.WAIT.state;

        contract.setState(status);

        contract.setStaff(_user.getId());
        contract = this.contractRepository.save(contract);
        adsPanel.setContract_id(contract.getId());
        this.adsPanelRepository.save(adsPanel);
    }

    public void approveContract(Integer id) {
        Optional<Contract> contracts = this.contractRepository.findById(id);
        Contract contract = contracts.get();

        if (contract == null) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "This contract is not exist");
        }

        contract.setState(ContractState.APPROVED.state);
        this.contractRepository.save(contract);
    }

    public void deleteContract(Integer id, String username) {
        Optional<Contract> contracts = this.contractRepository.findById(id);
        Contract contract = contracts.get();
        if (contract == null) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "This contract is not exist");
        }

        Optional<Staff> stafff = staffRepository.findByUsername(username);
        Staff staff = stafff.get();

        if (staff.getId() != contract.getStaff()) {
            throw new AppException(403, HttpStatus.FORBIDDEN, "This contract is not your permission");
        }

        this.contractRepository.deleteById(id);
        this.adsPanelRepository.deleteById(contract.getAds_panel());
    }

    public void checkExpirationContract() {
        List<Contract> ls = this.contractRepository.getExpireContract();
        for (Contract contract : ls) {
            contract.setState("Đã hết hạn");
        }

        this.contractRepository.saveAll(ls);
    }

    public void rejectContract(Integer id) {
        if (contractRepository.existsById(id)) {
            Contract contract = contractRepository.findById(id).get();
            contract.setState(ContractState.REJECTED.state);
            contractRepository.save(contract);
        } else {
            throw new AppException(400, HttpStatus.FORBIDDEN, "This contract is not exist");
        }
    }
}
