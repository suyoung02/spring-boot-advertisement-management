package com.example.backend.service;

import com.example.backend.dto.ReportFormRequest;
import com.example.backend.entity.ReportForm;
import com.example.backend.repository.ReportFormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportFormService {
    private final ReportFormRepository reportFormRepository;

    @Autowired
    public ReportFormService(ReportFormRepository reportFormRepository) {
        this.reportFormRepository = reportFormRepository;
    }

    public List<ReportForm> getAll(){
        return reportFormRepository.findAll();
    }

    public ReportForm getDetail(String title) {
        Optional<ReportForm> a = reportFormRepository.findById(title);
        return a.get();
    }

    public void deleteReportForm(String title) {
        reportFormRepository.deleteById(title);
    }

    public void updateReportForm(String title,ReportFormRequest request) {
        Optional<ReportForm> a = reportFormRepository.findById(title);

        ReportForm reportForm = a.get();
        reportForm.setTitle(request.getTitle());
        reportForm.setColor(request.getColor());
        reportForm.setIcon(request.getIcon());
        reportFormRepository.save(reportForm);
    }

    public void addReportForm(ReportFormRequest request) {
        ReportForm reportForm = new ReportForm(request.getTitle(), request.getColor(), request.getIcon());
        reportFormRepository.save(reportForm);
    }
}
