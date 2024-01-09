package com.example.backend.service.impl;

import com.example.backend.dto.*;
import com.example.backend.entity.*;
import com.example.backend.repository.AdsPanelRepository;
import com.example.backend.repository.AdsPositionRepository;
import com.example.backend.repository.AdsTypeRepository;
import com.example.backend.service.AdsService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdsServiceServiceImpl implements AdsService {

    private final AdsPositionRepository adsPositionRepository;

    private final AdsPanelRepository adsPanelRepository;

    private final AdsTypeRepository adsTypeRepository;

    public List<AdsPositionResponse> getAllPosition(){
        List<Object[]> list = adsPositionRepository.getPositionWithState();
        System.out.println(list.get(0)[2]);
        return list.stream()
                .map(objects -> new AdsPositionResponse((AdsPosition) objects[0], (LocationType) objects[1], (AdsForm) objects[2], (PlanningStatus) objects[3]))
                .collect(Collectors.toList());
    }

    public List<AdsPositionResponse> getDetailPosition(Integer id){
        if(adsPositionRepository.existsById(id)){
            List<Object[]> list = adsPositionRepository.getDetailPositionWithState(id);
            List<AdsPanel> panels = adsPanelRepository.getPositionDetailWithPanel(id);
            System.out.println(panels);
            return list.stream()
                    .map(objects -> new AdsPositionResponse((AdsPosition) objects[0], (LocationType) objects[1], (AdsForm) objects[2], (PlanningStatus) objects[3], panels))
                    .collect(Collectors.toList());
        }
        return null;
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
        ads.setPhoto(newPosition.getPhoto());
        ads.setLatitude(newPosition.getLatitude());
        ads.setLongitude(newPosition.getLongitude());
        ads.setIsactived(newPosition.getIs_active());
        ads.setPlace_id(newPosition.getPlace_id());
        return adsPositionRepository.save(ads);
    }

    public Boolean deletePosition(Integer id){
        if(adsPositionRepository.existsById(id)) {
            adsPositionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Boolean deletePanel(Integer id){
        if(adsPanelRepository.existsById(id)) {
            adsPanelRepository.deleteById(id);
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

    public AdsPanel updatePanel(Integer Id, AddPanelRequest newPosition){
        Optional<AdsPanel> adsOptional  = adsPanelRepository.findById(Id);
        if (adsOptional.isPresent()) {
            AdsPanel ads = adsOptional.get();
            // Thực hiện các hành động với ads
            ads.setAds_position(newPosition.getAds_position());
            ads.setAds_type(newPosition.getAds_type());
            ads.setSize(newPosition.getSize());
            ads.setContract_expiration(newPosition.getContract_expiration());
            return ads;
        } else {
            throw new RuntimeException("Ads position id not found");
        }
    }

    public List<AdsPanelResponse> getDetailPanel(Integer id){
        if(adsPanelRepository.existsById(id)){
            List<Object[]> resultList = adsPanelRepository.getDetailPanelWithType(id);
            return resultList.stream()
                    .map(objects -> new AdsPanelResponse((AdsPanel) objects[0], (AdsType) objects[1], (AdsPosition) objects[2]))
                    .collect(Collectors.toList());
        }
        return null;
    }

    public  List<AdsPanelResponse> getAllPanels(){
        List<Object[]> resultList = adsPanelRepository.getAllPanelWithType();

        return resultList.stream()
                .map(objects -> new AdsPanelResponse((AdsPanel) objects[0], (AdsType) objects[1], (AdsPosition) objects[2]))
                .collect(Collectors.toList());
    }

    public Boolean addNewPanel(AddPanelRequest newPanel) {
        AdsPanel ads = new AdsPanel();
        ads.setAds_type(newPanel.getAds_type());
        ads.setSize(newPanel.getSize());
        ads.setContract_expiration(newPanel.getContract_expiration());
        ads.setAds_position(newPanel.getAds_position());
        adsPanelRepository.save(ads);
        return true;
    }

    public List<AdsType> getAllType(){
        return adsTypeRepository.findAll();
    }

    public AdsType addNewType(AdsType adsType){
        return adsTypeRepository.save(adsType);
    }
    @Transactional
    public Boolean deleteTypeAds(String title){
        if(adsTypeRepository.existsAdsTypeByTitle(title)){
            adsTypeRepository.deleteByTitle(title);
             return true;
        }
        return false;
    }

    @Transactional
    public Boolean updateAdsType(String title, AdsType updatedAdsType) {
        if (adsTypeRepository.existsAdsTypeByTitle(title)) {
            AdsType existingAdsType = adsTypeRepository.findByTitle(title);
            if (!existingAdsType.getTitle().equals(updatedAdsType.getTitle())) {
                AdsType detachedAdsType = new AdsType();
                detachedAdsType.setTitle(updatedAdsType.getTitle());
                adsTypeRepository.save(detachedAdsType);
                adsTypeRepository.delete(existingAdsType);
            } else {
                existingAdsType.setTitle(updatedAdsType.getTitle());
                adsTypeRepository.save(existingAdsType);
            }
            return true;
        }
        return false;
    }

    public List<AdsPanelWithImagesDTO> getAllPresentingPanel() {
        List<Object[]> resultList = adsPanelRepository.getPanelWithContractAndImg();

        return resultList.stream()
                .map(objects -> new AdsPanelWithImagesDTO((AdsPanel) objects[0], (AdsImages) objects[1]))
                .collect(Collectors.toList());
    }
}
