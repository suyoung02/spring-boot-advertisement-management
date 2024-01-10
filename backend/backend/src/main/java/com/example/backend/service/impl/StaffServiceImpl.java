package com.example.backend.service.impl;

import java.lang.reflect.Field;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;

import com.example.backend.dto.StaffDto;
import com.example.backend.entity.Staff;
import com.example.backend.entity.User;
import com.example.backend.enums.Role;
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

    public String updatePersonalStaffByFields(Principal connectedUser, Map<String, Object> fields) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Staff staff = staffRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new InvalidAccountException("Invalid staff"));

        fields.forEach((key, value) -> {
            try {
                Field field = ReflectionUtils.findField(Staff.class, key);
                field.setAccessible(true);

                switch (key) {
                    case "fullname": {
                        ReflectionUtils.setField(field, staff, value);
                        break;
                    }

                    case "dob": {
                        ReflectionUtils.setField(field, staff, value);
                        break;
                    }

                    case "email": {
                        // check email is exist
                        Staff checkStaff = staffRepository.findByEmail(String.valueOf(value)).orElse(null);
                        if (checkStaff == null)
                            ReflectionUtils.setField(field, staff, value);
                        break;
                    }

                    case "phone_number": {
                        ReflectionUtils.setField(field, staff, value);
                        break;
                    }

                    default:
                        break;
                }
            } catch (Exception e) {
                e.getStackTrace();
            }
        });

        staffRepository.save(staff);

        return "Your update success";
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
        if (user.getRole().name().equals(Role.VHTT.name())) {
            throw new InvalidAccountException("Invalid staff");
        }

        return StaffMapper.toStaffDto(staff, user);
    }

    public String updateStaffByFields(int id, Map<String, Object> fields) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new InvalidAccountException("Invalid staff"));
        User user = userRepository.findByUsername(staff.getUsername())
                .orElseThrow(() -> new InvalidAccountException("Invalid staff"));

        fields.forEach((key, value) -> {
            try {
                Field fieldStaff = ReflectionUtils.findField(Staff.class, key);
                fieldStaff.setAccessible(true);

                switch (key) {
                    case "fullname": {
                        ReflectionUtils.setField(fieldStaff, staff, value);
                        break;
                    }

                    case "dob": {
                        ReflectionUtils.setField(fieldStaff, staff, value);
                        break;
                    }

                    case "email": {
                        // check email is exist
                        Staff checkStaff = staffRepository.findByEmail(String.valueOf(value)).orElse(null);
                        if (checkStaff == null)
                            ReflectionUtils.setField(fieldStaff, staff, value);
                        break;
                    }

                    case "phone_number": {
                        ReflectionUtils.setField(fieldStaff, staff, value);
                        break;
                    }

                    default:
                        break;
                }
            } catch (NullPointerException e) {
                e.printStackTrace();
            }

            try {
                Field fieldUser = ReflectionUtils.findField(User.class, key);
                fieldUser.setAccessible(true);

                switch (key) {
                    case "role": {
                        ReflectionUtils.setField(fieldUser, user, Role.valueOf(value.toString()));
                        break;
                    }

                    case "ward": {
                        ReflectionUtils.setField(fieldUser, user, value);
                        break;
                    }

                    case "district": {
                        ReflectionUtils.setField(fieldUser, user, value);
                        break;
                    }

                    default:
                        break;
                }
            } catch (NullPointerException e) {
                e.printStackTrace();
            }

        });

        staffRepository.save(staff);
        userRepository.save(user);

        return "Your update success";
    }

    public String removeStaff(int id) {
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new InvalidAccountException("Invalid staff"));
        User user = userRepository.findByUsername(staff.getUsername())
                .orElseThrow(() -> new InvalidAccountException("Invalid staff"));

        // must not remove the VHTT staff
        if (user.getRole().name().equals(Role.VHTT.name())) {
            throw new InvalidAccountException("Invalid staff");
        }

        staffRepository.delete(staff);
        userRepository.delete(user);

        return "Staff has been removed";
    }
}
