package com.example.backend.dto;

import com.example.backend.entity.AdsPanel;
import com.example.backend.entity.AdsPosition;
import com.example.backend.entity.ProcessingStatus;
import com.example.backend.entity.Report;
import com.example.backend.entity.ReportForm;

import lombok.Data;

@Data
public class ReportResponse {
    private Report report;
    private ReportForm reportForm;
    private ProcessingStatus state;
    private AdsPosition adsPosition;
    private AdsPanel adsPanel;

    public ReportResponse(Report report, ReportForm reportForm, ProcessingStatus state, AdsPosition adsPosition,
            AdsPanel adsPanel) {
        this.report = report;
        this.reportForm = reportForm;
        this.state = state;
        this.adsPosition = adsPosition;
        this.adsPanel = adsPanel;
    }
}
