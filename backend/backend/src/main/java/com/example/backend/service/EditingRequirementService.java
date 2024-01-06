package com.example.backend.service;

import com.example.backend.dto.EditingRequirementRequest;
import com.example.backend.entity.EditingRequirement;
import com.example.backend.entity.Staff;
import com.example.backend.exception.AppException;
import com.example.backend.repository.EditingRequirementRepository;
import com.example.backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class EditingRequirementService {
    private final EditingRequirementRepository editingRequirementRepository;
    private final StaffRepository staffRepository;

    @Autowired
    public EditingRequirementService(EditingRequirementRepository editingRequirementRepository, StaffRepository staffRepository) {
        this.editingRequirementRepository = editingRequirementRepository;
        this.staffRepository = staffRepository;
    }


    public List<EditingRequirement> getAllEditingRequirement() {
        return this.editingRequirementRepository.findAll();
    }

    public List<EditingRequirement> getAllWaitEditingRequirement() {
        return this.editingRequirementRepository.getAllWaitEditingRequirement();
    }

    public void createEditingRequirement(EditingRequirementRequest editing, String username) {
        Optional<Staff> stafff = staffRepository.findByUsername(username);
        Staff staff = stafff.get();

        EditingRequirement editingRequirement = new EditingRequirement();
        editingRequirement.setNew_info(editingRequirement.getNew_info());
        editingRequirement.setReason(editingRequirement.getReason());
        editingRequirement.setStatus("Đã gửi");
        editingRequirement.setStaff(staff.getId());
        editingRequirement.setAds_panel(editingRequirement.getAds_panel());
        Date date = new Date();
        editingRequirement.setTime_submit(date);

        editingRequirementRepository.save(editingRequirement);
    }

    public void approveEditingRequirement(Integer id) {
        Optional<EditingRequirement> editingRequirements = this.editingRequirementRepository.findById(id);
        EditingRequirement editingRequirement = editingRequirements.get();

        if (editingRequirement == null) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "This editing is not exist");
        }

        editingRequirement.setStatus("Đã xử lý");

        this.editingRequirementRepository.save(editingRequirement);
    }

    public void deleteEditingRequirement(Integer id) {
        this.editingRequirementRepository.deleteById(id);
    }
}
