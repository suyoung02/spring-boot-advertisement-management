package com.example.backend.repository;

import com.example.backend.entity.AdsPanel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdsPanelRepository extends JpaRepository<AdsPanel, Integer> {
    @Query(value = "SELECT A, img FROM AdsPanel A JOIN AdsImages img ON img.ads_panel = A.id JOIN Contract c ON c.ads_panel = A.id WHERE c.state = 'Đang hiện diện'")
    public List<Object[]> getPanelWithContractAndImg();
}
