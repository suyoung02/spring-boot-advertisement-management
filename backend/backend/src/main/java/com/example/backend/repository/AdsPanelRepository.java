package com.example.backend.repository;

import com.example.backend.entity.AdsPanel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdsPanelRepository extends JpaRepository<AdsPanel, Integer> {
    @Query(value = "SELECT position, A, img, c FROM AdsPanel A JOIN AdsImages img ON img.ads_panel = A.id JOIN AdsPosition position ON position.id = A.ads_position JOIN Contract c ON c.ads_panel = A.id WHERE c.state = 'Đang hiện diện'")
    public List<Object[]> getPanelWithContractAndImg();

    @Query(value = "SELECT position, A, img, c FROM AdsPanel A JOIN AdsImages img ON img.ads_panel = A.id JOIN AdsPosition position ON position.id = A.ads_position JOIN Contract c ON c.ads_panel = A.id ")
    public List<Object[]> getPositionWithPanelWithLoggined();

    @Query(value = "SELECT panel, type, pos FROM AdsPanel panel JOIN AdsType type ON panel.ads_type = type.title JOIN AdsPosition pos ON pos.id = panel.ads_position ")
    public List<Object[]> getAllPanelWithType();

    @Query(value = "SELECT panel, type, pos FROM AdsPanel panel JOIN AdsType type ON panel.ads_type = type.title JOIN AdsPosition pos ON pos.id = panel.ads_position WHERE panel.id = ?1")
    public List<Object[]> getDetailPanelWithType(int id);

    @Query(value = "SELECT panel FROM AdsPosition position JOIN AdsPanel panel ON position.id = panel.ads_position WHERE position.id = ?1 ")
    public List<AdsPanel> getPositionDetailWithPanel(int id);
}
