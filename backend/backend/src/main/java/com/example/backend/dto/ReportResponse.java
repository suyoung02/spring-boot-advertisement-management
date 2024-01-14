package com.example.backend.dto;

import com.example.backend.entity.AdsPanel;
import com.example.backend.entity.AdsPosition;
import com.example.backend.entity.ProcessingStatus;
import com.example.backend.entity.Report;
import com.example.backend.entity.ReportForm;
import com.example.backend.entity.Staff;

import lombok.Data;

@Data
public class ReportResponse {
    private Report report;
    private ReportForm reportForm;
    private AdsPosition adsPosition;
    private AdsPanel adsPanel;

    public ReportResponse(Report report, ReportForm reportForm, AdsPosition adsPosition,
            AdsPanel adsPanel) {
        this.report = report;
        this.reportForm = reportForm;
        this.adsPosition = adsPosition;
        this.adsPanel = adsPanel;
    }
}
