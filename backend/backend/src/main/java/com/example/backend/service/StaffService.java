package com.example.backend.service;

import java.security.Principal;
import java.util.List;

import com.example.backend.dto.StaffDto;

public interface StaffService {
    List<StaffDto> getAllStaffsWithoutVHTT();

    StaffDto getStaffByIdWithoutVHTT(int id);

    String updateStaff(int id);

    String removeStaff(int id);

    StaffDto getPersonalStaff(Principal connectedUser);

    String updatePersonalStaff(Principal connectedUser);
}
