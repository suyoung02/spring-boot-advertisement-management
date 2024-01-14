package com.example.backend.repository;

import com.example.backend.entity.AdsPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdsPositionRepository extends JpaRepository<AdsPosition, Integer> {
    @Query(value = "SELECT position,location,adsFrom,status FROM AdsPosition position LEFT JOIN LocationType location ON location.title = position.location_type LEFT JOIN AdsForm adsFrom ON adsFrom.title = position.ads_form LEFT JOIN PlanningStatus status ON status.title=position.planning_status")
    public List<Object[]> getPositionWithState();

    @Query(value = "SELECT position,location,adsFrom,status FROM AdsPosition position JOIN LocationType location ON location.title = position.location_type JOIN AdsForm adsFrom ON adsFrom.title = position.ads_form JOIN PlanningStatus status ON status.title=position.planning_status WHERE position.id = ?1")
    public List<Object[]> getDetailPositionWithState(int id);

    @Query(value = "SELECT COUNT(report) FROM AdsPosition position JOIN Report report ON position.id = report.adsPosition WHERE position.id = ?1 ")
    public Integer countReport(int id);
}
