package com.example.backend.repository;

import com.example.backend.entity.AdsPanel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdsPanelRepository extends JpaRepository<AdsPanel, Integer> {
    @Query(value = "SELECT position, A, img, c, type FROM AdsPanel A JOIN AdsType type ON A.ads_type = type.title JOIN AdsPosition position ON position.id = A.ads_position JOIN Contract c ON c.ads_panel = A.id JOIN AdsImages img ON img.ads_panel = A.id")
    public List<Object[]> getPanelWithContractAndImg();

    @Query(value = "SELECT position, A, img, c, type FROM AdsPanel A JOIN AdsType type ON A.ads_type = type.title JOIN AdsPosition position ON position.id = A.ads_position JOIN Contract c ON c.ads_panel = A.id JOIN AdsImages img ON img.ads_panel = A.id")
    public List<Object[]> getPositionWithPanelWithLoggined(Integer staff);

    @Query(value = "SELECT panel, type, pos FROM AdsPanel panel JOIN AdsType type ON panel.ads_type = type.title JOIN AdsPosition pos ON pos.id = panel.ads_position ")
    public List<Object[]> getAllPanelWithType();

    @Query(value = "SELECT pos, panel, img, c, type FROM AdsPanel panel JOIN AdsImages img ON img.ads_panel = panel.id JOIN AdsType type ON panel.ads_type = type.title JOIN AdsPosition pos ON pos.id = panel.ads_position JOIN Contract c ON c.ads_panel = panel.id WHERE panel.id = ?1")
    public List<Object[]> getDetailPanelWithType(int id);

    @Query(value = "SELECT panel FROM AdsPosition position JOIN AdsPanel panel ON position.id = panel.ads_position WHERE position.id = ?1 ")
    public List<AdsPanel> getPositionDetailWithPanel(int id);

    @Query(value = "SELECT panel, c, type, position FROM AdsPosition position JOIN AdsPanel panel ON position.id = panel.ads_position JOIN AdsType type ON panel.ads_type = type.title JOIN Contract c ON c.ads_panel = panel.id WHERE position.id = ?1 ")
    public List<Object[]> getDetailWithPanel(int id);
}
