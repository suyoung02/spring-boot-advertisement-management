package com.example.backend.service;

import com.example.backend.dto.ContractRequest;
import com.example.backend.entity.AdsImages;
import com.example.backend.entity.AdsPanel;
import com.example.backend.entity.Contract;
import com.example.backend.entity.Staff;
import com.example.backend.enums.ContractState;
import com.example.backend.exception.AppException;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContractService {
    private final ContractRepository contractRepository;
    private final AdsImagesRepository adsImagesRepository;
    private final StaffRepository staffRepository;
    private final AdsPanelRepository adsPanelRepository;
    @Autowired
    public ContractService(ContractRepository contractRepository, AdsImagesRepository adsImagesRepository, StaffRepository staffRepository, AdsPanelRepository adsPanelRepository) {
        this.contractRepository = contractRepository;
        this.adsImagesRepository = adsImagesRepository;
        this.staffRepository = staffRepository;
        this.adsPanelRepository = adsPanelRepository;
    }

    public List<Contract> getAllContract() {
        return this.contractRepository.findAll();
    }

    public void createContract(ContractRequest contractRequest, String username) {
        AdsPanel adsPanel = new AdsPanel();
        adsPanel.setAds_type(contractRequest.getAds_type());
        adsPanel.setContract_expiration(contractRequest.getContract_expiration());
        adsPanel.setSize(contractRequest.getSize());
        adsPanel.setAds_position(contractRequest.getAds_position());
        adsPanel = this.adsPanelRepository.save(adsPanel);

        AdsImages adsImages = new AdsImages();
        adsImages.setAds_panel(adsPanel.getId());
        adsImages.setAds_image(contractRequest.getAds_img());
        this.adsImagesRepository.save(adsImages);

        contractRequest.setAds_panel(adsPanel.getId());
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
        contract.setState(ContractState.APPROVED.state);

        this.contractRepository.save(old);
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
        if(contractRepository.existsById(id)) {
            Contract contract = contractRepository.findById(id).get();
            contract.setState(ContractState.REJECTED.state);
            contractRepository.save(contract);
        } else {
            throw new AppException(400, HttpStatus.FORBIDDEN, "This contract is not exist");
        }
    }
}
