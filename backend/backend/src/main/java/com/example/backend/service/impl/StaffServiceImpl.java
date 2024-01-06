package com.example.backend.service.impl;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.example.backend.dto.StaffDto;
import com.example.backend.entity.Staff;
import com.example.backend.entity.User;
import com.example.backend.exception.InvalidAccountException;
import com.example.backend.mapper.StaffMapper;
import com.example.backend.repository.StaffRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.StaffService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;

    // for all staffs
    public StaffDto getPersonalStaff(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Staff staff = staffRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new InvalidAccountException("Invalid staff"));
        StaffDto staffDto = StaffMapper.toStaffDto(staff, user);

        // does not show username and id
        staffDto.setUsername(null);
        staffDto.setId(null);

        return staffDto;
    }

    public String updatePersonalStaff(Principal user) {
        return null;
    }

    // for only VHTT
    public List<StaffDto> getAllStaffsWithoutVHTT() {
        List<StaffDto> listStaffDto = new ArrayList<>();
        List<Staff> listStaff = staffRepository.findAllWithoutVHTT();

        for (Staff staff : listStaff) {
            User user = userRepository.findByUsername(staff.getUsername())
                    .orElseThrow(() -> new InvalidAccountException("Invalid staff"));

            listStaffDto.add(StaffMapper.toStaffDto(staff, user));
        }

        return listStaffDto;
    }

    public StaffDto getStaffByIdWithoutVHTT(int id) {
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new InvalidAccountException("Invalid staff"));
        User user = userRepository.findByUsername(staff.getUsername())
                .orElseThrow(() -> new InvalidAccountException("Invalid staff"));

        // VHTT staff must not get info
        if (user.getRole().name().equals("VHTT")) {
            throw new InvalidAccountException("Invalid staff");
        }

        return StaffMapper.toStaffDto(staff, user);
    }

    public String updateStaff(int id) {
        return null;
    }

    public String removeStaff(int id) {
        return null;
    }
}
