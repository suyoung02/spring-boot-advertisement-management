package com.example.backend.service.impl;

import com.example.backend.dto.AddPositionRequest;
import com.example.backend.entity.AdsPosition;
import com.example.backend.repository.AdsRepository;
import com.example.backend.service.AdsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdsServiceServiceImpl implements AdsService {

    private final AdsRepository adsRepository;

    public List<AdsPosition> getAllPosition(){
        return adsRepository.findAll();
    }

    public AdsPosition addNewPosition(AddPositionRequest newPosition){
        AdsPosition ads = new AdsPosition();
        ads.setAddress(newPosition.getAddress());
        ads.setAds_form(newPosition.getAds_form());
        ads.setDistrict(newPosition.getDistrict());
        ads.setWard(newPosition.getWard());
        ads.setLocation_type(newPosition.getLocation_type());
        ads.setPlanning_status(newPosition.getPlanning_status());
        ads.setProvince(newPosition.getProvince());
        return adsRepository.save(ads);
    }

    public Boolean deletePosition(Integer id){
        if(adsRepository.existsById(id)) {
            adsRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public AdsPosition updatePosition(Integer id, AddPositionRequest newPosition) {
        Optional<AdsPosition> adsOptional  = adsRepository.findById(id);
        if (adsOptional.isPresent()) {
            AdsPosition ads = adsOptional.get();
            // Thực hiện các hành động với ads
            ads.setAddress(newPosition.getAddress());
            ads.setAds_form(newPosition.getAds_form());
            ads.setProvince(newPosition.getProvince());
            ads.setWard(newPosition.getWard());
            ads.setDistrict(newPosition.getDistrict());
            ads.setLocation_type(newPosition.getLocation_type());
            ads.setPlanning_status(newPosition.getPlanning_status());
            adsRepository.save(ads);
            return ads;
        } else {
           throw new RuntimeException("Ads position id not found");
        }
    }
}
