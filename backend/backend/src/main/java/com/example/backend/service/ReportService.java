package com.example.backend.service;

import com.example.backend.dto.AddReportRequest;
import com.example.backend.entity.Report;

import java.util.List;
import java.util.Optional;

public interface ReportService {
    List<Report> getAllReport();
    Optional<Report> getDetailReport(Integer id);
    Report saveReport(Report newReport);
    Report addReport(AddReportRequest newReport);
    Report updateReport(Integer id, AddReportRequest newReport);
}
