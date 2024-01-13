package com.example.backend.repository;

import com.example.backend.entity.Report;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    @Query(value = "SELECT rep, form, state, pos, panel " +
            "FROM Report rep " +
            "JOIN ReportForm form ON rep.reportForm = form.title " +
            "JOIN ProcessingStatus state ON rep.state = state.title " +
            "LEFT JOIN AdsPosition pos ON rep.adsPosition = pos.id " +
            "LEFT JOIN AdsPanel panel ON rep.adsPanel = panel.id")
    public List<Object[]> getAllReport();

    @Query(value = "SELECT rep, form, state, pos, panel " +
            "FROM Report rep " +
            "JOIN ReportForm form ON rep.reportForm = form.title " +
            "JOIN ProcessingStatus state ON rep.state = state.title " +
            "LEFT JOIN AdsPosition pos ON rep.adsPosition = pos.id " +
            "LEFT JOIN AdsPanel panel ON rep.adsPanel = panel.id " +
            "WHERE rep.id = ?1")
    public List<Object[]> getDetailReport(int id);
}
