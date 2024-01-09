package com.example.backend.service.impl;

import com.example.backend.entity.Ward;
import com.example.backend.dto.AddPositionRequest;
import com.example.backend.entity.District;
import com.example.backend.repository.DistrictRepository;
import com.example.backend.repository.WardRepository;
import com.example.backend.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationServiceImpl implements LocationService {

    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;

    @Autowired
    public LocationServiceImpl(DistrictRepository districtRepository, WardRepository wardRepository) {
        this.districtRepository = districtRepository;
        this.wardRepository = wardRepository;
    }

    @Override
    public List<Ward> getAllWards() {
        return wardRepository.findAllWard();
    }

    @Override
    public List<District> getAllDistricts(AddPositionRequest ward) {
        return districtRepository.findAllDistrictList(ward.getWard());
    }

    @Override
    public void addWard(AddPositionRequest ward) {
        wardRepository.insertWard(ward.getWard());
    }

    @Override
    public void updateWard(Ward updatedWard, Ward oldWard) {
        wardRepository.updateWard(updatedWard.getWard(), oldWard.getWard());
    }

    @Override
    public void deleteWard(AddPositionRequest ward) {
        wardRepository.deleteWard(ward.getWard());
    }

    @Override
    public Optional<District> getDistrictById(Integer id) {
        return districtRepository.findById(id);
    }

    @Override
    public Ward findWardByName(String ward) {
        return wardRepository.findWardByName(ward);
    }

    @Override
    public void addDistrict(District district) {
        districtRepository.save(district);
    }

    @Override
    public void updateDistrict(Integer id, District updatedDistrict) {
        districtRepository.updateWard(id, updatedDistrict.getDistrict(), updatedDistrict.getWard());
    }

    @Override
    public void deleteDistrict(Integer id) {
        districtRepository.deleteById(id);
    }

}
