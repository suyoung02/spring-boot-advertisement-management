package com.example.backend.repository;

import com.example.backend.entity.AdsPanel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdsPanelRepository extends JpaRepository<AdsPanel, Integer> {
}
