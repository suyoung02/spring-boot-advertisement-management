package com.example.backend.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.dto.AddPositionRequest;
import com.example.backend.entity.District;
import com.example.backend.entity.Ward;

import jakarta.transaction.Transactional;

@Repository
public interface DistrictRepository extends JpaRepository<District, Integer> {
    Optional<District> findById(Integer id);

    @Query(value = "SELECT d.* FROM DISTRICT d WHERE d.ward = ?1  ORDER BY id ", nativeQuery = true)
    List<District> findAllDistrictList(String ward);
    
    @Transactional
    @Modifying
    @Query(value = "UPDATE DISTRICT SET district = ?2 , ward = ?3 WHERE id = ?1", nativeQuery = true)
    void updateWard(Integer id,String district, String ward);
}