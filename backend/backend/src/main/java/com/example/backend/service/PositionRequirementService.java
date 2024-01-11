package com.example.backend.service;

import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.example.backend.dto.PositionRequirementRequest;
import com.example.backend.entity.AdsPosition;
import com.example.backend.entity.PositionRequirement;
import com.example.backend.entity.Staff;
import com.example.backend.entity.User;
import com.example.backend.enums.Role;
import com.example.backend.enums.Status;
import com.example.backend.exception.AppException;
import com.example.backend.exception.InvalidAccountException;
import com.example.backend.repository.PositionRequirementRepository;
import com.example.backend.repository.StaffRepository;

@Service
public class PositionRequirementService {
    private final PositionRequirementRepository positionRequirementRepository;
    private final StaffRepository staffRepository;

    @Autowired
    public PositionRequirementService(PositionRequirementRepository positionRequirementRepository,
            StaffRepository staffRepository) {
        this.positionRequirementRepository = positionRequirementRepository;
        this.staffRepository = staffRepository;
    }

    public List<PositionRequirement> getAllEditingRequirement(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Staff staff = staffRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new InvalidAccountException("Invalid staff"));
        if (user.getRole() == Role.VHTT) {
            return this.positionRequirementRepository.findAll();
        }
        return this.positionRequirementRepository.findAllByStaff(staff.getId());
    }

    public List<PositionRequirement> getAllWaitEditingRequirement() {
        return this.positionRequirementRepository.findAllByStatus(Status.IN_PROGRESS);
    }

    public void createEditingRequirement(PositionRequirementRequest editing, String username) {
        Optional<Staff> stafff = staffRepository.findByUsername(username);
        Staff staff = stafff.get();

        PositionRequirement positionRequirement = new PositionRequirement();
        positionRequirement.setNew_info(editing.getNew_info());
        positionRequirement.setReason(editing.getReason());
        positionRequirement.setStatus(Status.IN_PROGRESS);
        positionRequirement.setStaff(staff.getId());
        positionRequirement.setAds_position(editing.getAds_position());
        Date date = new Date();
        positionRequirement.setTime_submit(date);

        System.out.println(positionRequirement);

        positionRequirementRepository.save(positionRequirement);
    }

    public void updateEditingRequirement(PositionRequirementRequest editing, Integer id) {
        Optional<PositionRequirement> positionRequirement = this.positionRequirementRepository.findById(id);
        if (positionRequirement.isPresent()) {
            PositionRequirement _positionRequirement = positionRequirement.get();
            _positionRequirement.setNew_info(editing.getNew_info());
            _positionRequirement.setReason(editing.getReason());
            Date date = new Date();
            _positionRequirement.setTime_submit(date);
            positionRequirementRepository.save(_positionRequirement);
        } else {
            throw new RuntimeException("Ads position id not found");
        }
    }

    public void approveEditingRequirement(Integer id, Status status) {
        Optional<PositionRequirement> positionRequirements = this.positionRequirementRepository.findById(id);
        PositionRequirement positionRequirement = positionRequirements.get();

        if (positionRequirement == null) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "This editing is not exist");
        }

        positionRequirement.setStatus(status);

        this.positionRequirementRepository.save(positionRequirement);
    }

    public void deleteEditingRequirement(Integer id) {
        this.positionRequirementRepository.deleteById(id);
    }
}
