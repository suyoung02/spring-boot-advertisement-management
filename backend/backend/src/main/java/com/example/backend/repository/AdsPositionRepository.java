package com.example.backend.repository;

import com.example.backend.entity.AdsPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdsPositionRepository extends JpaRepository<AdsPosition, Integer> {
}
