package com.example.backend.service.impl;

import com.example.backend.dto.*;
import com.example.backend.entity.*;
import com.example.backend.enums.IsActived;
import com.example.backend.enums.Role;
import com.example.backend.exception.InvalidAccountException;
import com.example.backend.repository.AdsFormRepository;
import com.example.backend.repository.AdsPanelRepository;
import com.example.backend.repository.AdsPositionRepository;
import com.example.backend.repository.AdsTypeRepository;
import com.example.backend.repository.LocationTypeRepository;
import com.example.backend.repository.PlanningStatusRepository;
import com.example.backend.repository.StaffRepository;
import com.example.backend.service.AdsService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdsServiceServiceImpl implements AdsService {

    private final AdsPositionRepository adsPositionRepository;

    private final AdsPanelRepository adsPanelRepository;

    private final AdsTypeRepository adsTypeRepository;

    private final AdsFormRepository adsFormRepository;

    private final LocationTypeRepository locationTypeRepository;

    private final PlanningStatusRepository planningStatusRepository;

    private final StaffRepository staffRepository;

    public List<AdsPositionResponse> getAllPosition() {
        List<Object[]> list = adsPositionRepository.getPositionWithState();
        System.out.println(list.size());

        return list.stream()
                .map(objects -> new AdsPositionResponse((AdsPosition) objects[0], (LocationType) objects[1],
                        (AdsForm) objects[2], (PlanningStatus) objects[3],
                        adsPanelRepository.getPositionDetailWithPanel(((AdsPosition) objects[0]).getId()),
                        getPanelOfPosition(((AdsPosition) objects[0]).getId()),
                        haveReport(((AdsPosition) objects[0]).getId())))
                .collect(Collectors.toList());

    }

    private Boolean haveReport(Integer id) {
        return adsPositionRepository.countReport(id) > 0;
    }

    private List<AdsPanelResponse> getPanelOfPosition(Integer id) {
        List<Object[]> panels = adsPanelRepository.getDetailWithPanel(id);
        System.out.println(panels);
        return panels.stream()
                .map(objects -> new AdsPanelResponse((AdsPanel) objects[0], (AdsType) objects[2],
                        (AdsPosition) objects[3],
                        (Contract) objects[1]))
                .collect(Collectors.toList());
    }

    public List<AdsPositionResponse> getDetailPosition(Integer id) {
        if (adsPositionRepository.existsById(id)) {
            List<Object[]> list = adsPositionRepository.getDetailPositionWithState(id);
            List<AdsPanel> panels = adsPanelRepository.getPositionDetailWithPanel(id);
            System.out.println(panels);
            return list.stream()
                    .map(objects -> new AdsPositionResponse((AdsPosition) objects[0], (LocationType) objects[1],
                            (AdsForm) objects[2], (PlanningStatus) objects[3], panels, getPanelOfPosition(id)))
                    .collect(Collectors.toList());
        }
        return null;
    }

    public AdsPosition addNewPosition(AddPositionRequest newPosition) {
        AdsPosition ads = new AdsPosition();
        ads.setName(newPosition.getName());
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
        ads.setIs_actived(newPosition.getIs_active());
        ads.setPlace_id(newPosition.getPlace_id());
        return adsPositionRepository.save(ads);
    }

    public Boolean deletePosition(Integer id) {
        if (adsPositionRepository.existsById(id)) {
            adsPositionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Boolean deletePanel(Integer id) {
        if (adsPanelRepository.existsById(id)) {
            adsPanelRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public AdsPosition updatePosition(Integer id, AddPositionRequest newPosition) {
        Optional<AdsPosition> adsOptional = adsPositionRepository.findById(id);
        if (adsOptional.isPresent()) {
            AdsPosition ads = adsOptional.get();
            // Thực hiện các hành động với ads
            ads.setName(newPosition.getName());
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

    public AdsPanel updatePanel(Integer Id, AddPanelRequest newPosition) {
        Optional<AdsPanel> adsOptional = adsPanelRepository.findById(Id);
        if (adsOptional.isPresent()) {
            AdsPanel ads = adsOptional.get();
            // Thực hiện các hành động với ads
            ads.setAds_position(newPosition.getAds_position());
            ads.setAds_type(newPosition.getAds_type());
            ads.setSize(newPosition.getSize());
            adsPanelRepository.save(ads);
            return ads;
        } else {
            throw new RuntimeException("Ads position id not found");
        }
    }

    public List<AdsPanelWithImagesDTO> getDetailPanel(Integer id) {
        if (adsPanelRepository.existsById(id)) {
            List<Object[]> resultList = adsPanelRepository.getDetailPanelWithType(id);
            return resultList.stream()
                    .map(objects -> new AdsPanelWithImagesDTO((AdsPosition) objects[0], (AdsPanel) objects[1],
                            (AdsImages) objects[2], (Contract) objects[3], (AdsType) objects[4]))
                    .collect(Collectors.toList());
        }
        return null;
    }

    public List<AdsPanelResponse> getAllPanels() {
        List<Object[]> resultList = adsPanelRepository.getAllPanelWithType();

        return resultList.stream()
                .map(objects -> new AdsPanelResponse((AdsPanel) objects[0], (AdsType) objects[1],
                        (AdsPosition) objects[2], (Contract) objects[3]))
                .collect(Collectors.toList());
    }

    public Boolean addNewPanel(AddPanelRequest newPanel) {
        AdsPanel ads = new AdsPanel();
        ads.setAds_type(newPanel.getAds_type());
        ads.setSize(newPanel.getSize());
        ads.setAds_position(newPanel.getAds_position());
        adsPanelRepository.save(ads);
        return true;
    }

    public List<AdsType> getAllType() {
        return adsTypeRepository.findAll();
    }

    public AdsType addNewType(AdsType adsType) {
        return adsTypeRepository.save(adsType);
    }

    @Transactional
    public Boolean deleteTypeAds(String title) {
        if (adsTypeRepository.existsAdsTypeByTitle(title)) {
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
                detachedAdsType.setColor(updatedAdsType.getColor());
                detachedAdsType.setIcon(updatedAdsType.getIcon());
                adsTypeRepository.save(detachedAdsType);
                adsTypeRepository.delete(existingAdsType);
            } else {
                existingAdsType.setTitle(updatedAdsType.getTitle());
                existingAdsType.setColor(updatedAdsType.getColor());
                existingAdsType.setIcon(updatedAdsType.getIcon());
                adsTypeRepository.save(existingAdsType);
            }
            return true;
        }
        return false;
    }

    public List<AdsForm> getAllAdsForms() {
        return adsFormRepository.findAll();
    }

    public AdsForm addNewAdsForm(AdsForm adsForm) {
        return adsFormRepository.save(adsForm);
    }

    @Transactional
    public Boolean deleteAdsForm(String title) {
        if (adsFormRepository.existsByTitle(title)) {
            adsFormRepository.deleteByTitle(title);
            return true;
        }
        return false;
    }

    @Transactional
    public Boolean updateAdsForm(String title, AdsForm updatedAdsForm) {
        if (adsFormRepository.existsByTitle(title)) {
            AdsForm existingAdsType = adsFormRepository.findByTitle(title);
            if (!existingAdsType.getTitle().equals(updatedAdsForm.getTitle())) {
                AdsForm detachedAdsType = new AdsForm();
                detachedAdsType.setTitle(updatedAdsForm.getTitle());
                detachedAdsType.setColor(updatedAdsForm.getColor());
                detachedAdsType.setIcon(updatedAdsForm.getIcon());
                adsFormRepository.save(detachedAdsType);
                adsFormRepository.delete(existingAdsType);
            } else {
                existingAdsType.setTitle(updatedAdsForm.getTitle());
                existingAdsType.setColor(updatedAdsForm.getColor());
                existingAdsType.setIcon(updatedAdsForm.getIcon());
                adsFormRepository.save(existingAdsType);
            }
            return true;
        }
        return false;
    }

    public List<LocationType> getAllLocationTypes() {
        return locationTypeRepository.findAll();
    }

    public LocationType addNewLocationType(LocationType locationType) {
        return locationTypeRepository.save(locationType);
    }

    @Transactional
    public Boolean deleteLocationType(String title) {
        if (locationTypeRepository.existsByTitle(title)) {
            locationTypeRepository.deleteByTitle(title);
            return true;
        }
        return false;
    }

    @Transactional
    public Boolean updateLocationType(String title, LocationType updatedLocationType) {
        if (locationTypeRepository.existsByTitle(title)) {
            LocationType existingAdsType = locationTypeRepository.findByTitle(title);
            if (!existingAdsType.getTitle().equals(updatedLocationType.getTitle())) {
                LocationType detachedAdsType = new LocationType();
                detachedAdsType.setTitle(updatedLocationType.getTitle());
                detachedAdsType.setColor(updatedLocationType.getColor());
                detachedAdsType.setIcon(updatedLocationType.getIcon());
                locationTypeRepository.save(detachedAdsType);
                locationTypeRepository.delete(existingAdsType);
            } else {
                existingAdsType.setTitle(updatedLocationType.getTitle());
                existingAdsType.setColor(updatedLocationType.getColor());
                existingAdsType.setIcon(updatedLocationType.getIcon());
                locationTypeRepository.save(existingAdsType);
            }
            return true;
        }
        return false;
    }

    public List<PlanningStatus> getAllPlanningStatus() {
        return planningStatusRepository.findAll();
    }

    public PlanningStatus addNewPlanningStatus(PlanningStatus planningStatus) {
        return planningStatusRepository.save(planningStatus);
    }

    @Transactional
    public Boolean deletePlanningStatus(String title) {
        if (planningStatusRepository.existsByTitle(title)) {
            planningStatusRepository.deleteByTitle(title);
            return true;
        }
        return false;
    }

    @Transactional
    public Boolean updatePlanningStatus(String title, PlanningStatus updatedPlanningStatus) {
        if (planningStatusRepository.existsByTitle(title)) {
            PlanningStatus existingAdsType = planningStatusRepository.findByTitle(title);
            if (!existingAdsType.getTitle().equals(updatedPlanningStatus.getTitle())) {
                PlanningStatus detachedAdsType = new PlanningStatus();
                detachedAdsType.setTitle(updatedPlanningStatus.getTitle());
                detachedAdsType.setColor(updatedPlanningStatus.getColor());
                detachedAdsType.setIcon(updatedPlanningStatus.getIcon());
                planningStatusRepository.save(detachedAdsType);
                planningStatusRepository.delete(existingAdsType);
            } else {
                existingAdsType.setTitle(updatedPlanningStatus.getTitle());
                existingAdsType.setColor(updatedPlanningStatus.getColor());
                existingAdsType.setIcon(updatedPlanningStatus.getIcon());
                planningStatusRepository.save(existingAdsType);
            }
            return true;
        }
        return false;
    }

    public List<AdsPanelWithImagesDTO> getAllPresentingPanel() {
        List<Object[]> resultList = adsPanelRepository.getPanelWithContractAndImg();
        return resultList.stream()
                .map(objects -> new AdsPanelWithImagesDTO((AdsPosition) objects[0], (AdsPanel) objects[1],
                        (AdsImages) objects[2], (Contract) objects[3], (AdsType) objects[4]))
                .collect(Collectors.toList());
    }

    public List<AdsPanelWithImagesDTO> getAllPanelWithPosition(Principal principal) {
        var user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();

        if (user.getRole() == Role.VHTT) {
            return this.getAllPresentingPanel();
        }

        Staff staff = staffRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new InvalidAccountException("Invalid staff"));
        List<Object[]> resultList = adsPanelRepository.getPositionWithPanelWithLoggined(staff.getId());

        return resultList.stream()
                .map(objects -> new AdsPanelWithImagesDTO((AdsPosition) objects[0], (AdsPanel) objects[1],
                        (AdsImages) objects[2], (Contract) objects[3], (AdsType) objects[4]))
                .collect(Collectors.toList());
    }
}
