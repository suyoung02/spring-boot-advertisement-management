package com.example.backend.repository;

import com.example.backend.entity.Report;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
        @Query(value = "SELECT rep, form, pos, panel " +
                        "FROM Report rep " +
                        "JOIN ReportForm form ON rep.reportForm = form.title " +
                        "LEFT JOIN AdsPosition pos ON rep.adsPosition = pos.id " +
                        "LEFT JOIN AdsPanel panel ON rep.adsPanel = panel.id")
        public List<Object[]> getAllReport();

        @Query(value = "SELECT rep, form, pos, panel " +
                        "FROM Report rep " +
                        "JOIN ReportForm form ON rep.reportForm = form.title " +
                        "LEFT JOIN AdsPosition pos ON rep.adsPosition = pos.id " +
                        "LEFT JOIN AdsPanel panel ON rep.adsPanel = panel.id " +
                        "WHERE rep.id = ?1")
        public List<Object[]> getDetailReport(int id);

        @Query(value = "SELECT panel, position FROM AdsPanel panel JOIN AdsPosition position ON position.id = panel.ads_position WHERE panel.id = ?1 ")
        public List<Object[]> getDetailPanel(int id);
}
