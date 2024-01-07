package com.example.backend.repository;

import com.example.backend.entity.AdsImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdsImagesRepository extends JpaRepository<AdsImages, Integer> {
}
