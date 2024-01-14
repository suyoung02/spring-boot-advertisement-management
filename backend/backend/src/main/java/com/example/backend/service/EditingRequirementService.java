package com.example.backend.service;

import com.example.backend.dto.EditingRequirementRequest;
import com.example.backend.dto.PositionRequirementRequest;
import com.example.backend.dto.StaffDto;
import com.example.backend.entity.EditingRequirement;
import com.example.backend.entity.PositionRequirement;
import com.example.backend.entity.Staff;
import com.example.backend.entity.User;
import com.example.backend.enums.Role;
import com.example.backend.enums.Status;
import com.example.backend.exception.AppException;
import com.example.backend.exception.InvalidAccountException;
import com.example.backend.mapper.StaffMapper;
import com.example.backend.repository.EditingRequirementRepository;
import com.example.backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class EditingRequirementService {
    private final EditingRequirementRepository editingRequirementRepository;
    private final StaffRepository staffRepository;

    @Autowired
    public EditingRequirementService(EditingRequirementRepository editingRequirementRepository,
            StaffRepository staffRepository) {
        this.editingRequirementRepository = editingRequirementRepository;
        this.staffRepository = staffRepository;
    }

    public List<EditingRequirement> getAllEditingRequirement(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Staff staff = staffRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new InvalidAccountException("Invalid staff"));
        if (user.getRole() == Role.VHTT) {
            return this.editingRequirementRepository.findAll();
        }
        return this.editingRequirementRepository.findAllByStaff(staff.getId());
    }

    public List<EditingRequirement> getAllWaitEditingRequirement() {
        return this.editingRequirementRepository.findAllByStatus(Status.IN_PROGRESS);
    }

    public void createEditingRequirement(EditingRequirementRequest editing, String username) {
        Optional<Staff> stafff = staffRepository.findByUsername(username);
        Staff staff = stafff.get();

        EditingRequirement editingRequirement = new EditingRequirement();
        editingRequirement.setNew_info(editing.getNew_info());
        editingRequirement.setReason(editing.getReason());
        editingRequirement.setStatus(Status.IN_PROGRESS);
        editingRequirement.setStaff(staff.getId());
        editingRequirement.setAds_panel(editing.getAds_panel());
        Date date = new Date();
        editingRequirement.setTime_submit(date);

        editingRequirementRepository.save(editingRequirement);
    }

    public void updateEditingRequirement(EditingRequirementRequest editing, Integer id) {
        Optional<EditingRequirement> editingRequirement = this.editingRequirementRepository.findById(id);
        if (editingRequirement.isPresent()) {
            EditingRequirement _editingRequirement = editingRequirement.get();
            _editingRequirement.setNew_info(editing.getNew_info());
            _editingRequirement.setReason(editing.getReason());
            Date date = new Date();
            _editingRequirement.setTime_submit(date);
            editingRequirementRepository.save(_editingRequirement);
        } else {
            throw new RuntimeException("Ads position id not found");
        }
    }

    public void approveEditingRequirement(Integer id, Status status) {
        Optional<EditingRequirement> editingRequirements = this.editingRequirementRepository.findById(id);
        EditingRequirement editingRequirement = editingRequirements.get();

        if (editingRequirement == null) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "This editing is not exist");
        }

        editingRequirement.setStatus(status);

        this.editingRequirementRepository.save(editingRequirement);
    }

    public void deleteEditingRequirement(Integer id) {
        this.editingRequirementRepository.deleteById(id);
    }
}
