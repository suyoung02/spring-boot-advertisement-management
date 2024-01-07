package com.example.backend.repository;

import com.example.backend.entity.AdsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdsTypeRepository extends JpaRepository<AdsType, String> {
    boolean existsAdsTypeByTitle(String title);
    AdsType findByTitle(String title);
    void deleteByTitle(String title);
}
