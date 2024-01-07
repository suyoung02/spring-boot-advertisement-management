package com.example.backend.service;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.backend.dto.AddPositionRequest;
import com.example.backend.dto.DistrictDto;
import com.example.backend.dto.WardDto;
import com.example.backend.entity.District;
import com.example.backend.entity.Ward;

public interface LocationService {
    List<Ward> getAllWards();
    List<District> getAllDistricts(AddPositionRequest ward);
    void addWard(AddPositionRequest ward);
    void updateWard(Ward updatedWard,Ward oldWard);
    Ward findWardByName(String ward);
    void deleteWard(AddPositionRequest ward);
    Optional<District> getDistrictById(Integer id);
    void addDistrict(District district);
    void updateDistrict(Integer id, District updatedDistrict);
    void deleteDistrict(Integer id);
}
