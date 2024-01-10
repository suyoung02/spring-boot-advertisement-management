package com.example.backend.service;

import com.example.backend.dto.AddReportRequest;
import com.example.backend.dto.ReportResponse;
import com.example.backend.dto.SolvingReport;
import com.example.backend.entity.Report;

import java.util.List;

public interface ReportService {
    List<ReportResponse> getAllReport();

    List<ReportResponse> getDetailReport(Integer id);

    Report saveReport(Report newReport);

    List<ReportResponse> addReport(AddReportRequest newReport);

    List<ReportResponse> updateReport(Integer id, SolvingReport solution);
}
