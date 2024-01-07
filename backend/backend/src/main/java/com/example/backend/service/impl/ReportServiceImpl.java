package com.example.backend.service.impl;

import com.example.backend.entity.Report;
import com.example.backend.repository.ReportRepository;
import com.example.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private  final ReportRepository reportRepository;
    @Override
    public List<Report> getAllReport() {
        return reportRepository.findAll();
    }

    @Override
    public Optional<Report> getDetailReport(Integer id) {

        if(reportRepository.existsById(id)){
            return reportRepository.findById(id);
        }
        return null;
    }

    @Override
    public Report saveReport(Report newReport) {
        return reportRepository.save(newReport);
    }


}
