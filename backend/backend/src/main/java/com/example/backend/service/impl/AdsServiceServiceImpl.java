package com.example.backend.service.impl;

import com.example.backend.dto.AddPanelRequest;
import com.example.backend.dto.AddPositionRequest;
import com.example.backend.entity.AdsPanel;
import com.example.backend.entity.AdsPosition;
import com.example.backend.repository.AdsPanelRepository;
import com.example.backend.repository.AdsPositionRepository;
import com.example.backend.service.AdsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdsServiceServiceImpl implements AdsService {

    private final AdsPositionRepository adsPositionRepository;

    private final AdsPanelRepository adsPanelRepository;

    public List<AdsPosition> getAllPosition(){
        return adsPositionRepository.findAll();
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
        return adsPositionRepository.save(ads);
    }

    public Boolean deletePosition(Integer id){
        if(adsPositionRepository.existsById(id)) {
            adsPositionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public AdsPosition updatePosition(Integer id, AddPositionRequest newPosition) {
        Optional<AdsPosition> adsOptional  = adsPositionRepository.findById(id);
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
            adsPositionRepository.save(ads);
            return ads;
        } else {
           throw new RuntimeException("Ads position id not found");
        }
    }
    public  List<AdsPanel> getAllPanels(){
        return adsPanelRepository.findAll();
    }

    public Boolean addNewPanel(AddPanelRequest newPanel) {
        // Bước 1: Lấy AdsPosition từ cơ sở dữ liệu bằng ID
        Optional<AdsPosition> adsPositionOptional = adsPositionRepository.findById(newPanel.getAds_position());

        if (adsPositionOptional.isPresent()) {
            AdsPosition adsPosition = adsPositionOptional.get();

            // Bước 2: Tạo một AdsPanel mới
            AdsPanel panel = new AdsPanel();
            panel.setContract_expiration(newPanel.getContract_expiration());
            panel.setSize(newPanel.getSize());
            panel.setAds_type(newPanel.getAds_type());

            // Bước 3: Liên kết AdsPanel với AdsPosition
            panel.setAds_position(adsPosition);

            // Bước 4: Thêm AdsPanel vào tập hợp của AdsPosition (nếu cần)
            adsPosition.getPanels().add(panel);

            // Bước 5: Lưu lại AdsPosition để cập nhật thay đổi trong cơ sở dữ liệu
            adsPositionRepository.saveAndFlush(adsPosition);

            return true;
        }

        return false; // Trả về false nếu AdsPosition không tồn tại
    }
}
