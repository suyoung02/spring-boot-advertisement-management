package com.example.backend.mapper;

import com.example.backend.dto.StaffDto;
import com.example.backend.entity.Staff;
import com.example.backend.entity.User;

public class StaffMapper {
    public static StaffDto toStaffDto(Staff staff, User user) {
        StaffDto tmp = new StaffDto();

        tmp.setId(staff.getId());
        tmp.setFullname(staff.getFullname());
        tmp.setDob(staff.getDob());
        tmp.setEmail(staff.getEmail());
        tmp.setPhoneNumber(staff.getPhoneNumber());
        tmp.setUsername(staff.getUsername());
        tmp.setRole(user.getRole());
        tmp.setWard(user.getWard());
        tmp.setDistrict(user.getDistrict());

        return tmp;
    }
}
