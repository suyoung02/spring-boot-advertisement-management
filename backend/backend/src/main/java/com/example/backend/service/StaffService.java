package com.example.backend.service;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import com.example.backend.dto.StaffDto;

public interface StaffService {
    // for all staffs
    StaffDto getPersonalStaff(Principal connectedUser);

    String updatePersonalStaffByFields(Principal connectedUser, Map<String, Object> fields);

    // for only VHTT staff
    List<StaffDto> getAllStaffsWithoutVHTT();

    StaffDto getStaffByIdWithoutVHTT(int id);

    String updateStaffByFields(int id, Map<String, Object> fields);

    String removeStaff(int id);
}
