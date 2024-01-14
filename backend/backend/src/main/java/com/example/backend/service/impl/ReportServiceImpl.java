package com.example.backend.service.impl;

import com.example.backend.dto.AddReportRequest;
import com.example.backend.dto.AdsPanelResponse;
import com.example.backend.dto.ReportResponse;
import com.example.backend.dto.SolvingReport;
import com.example.backend.entity.AdsPanel;
import com.example.backend.entity.AdsPosition;
import com.example.backend.entity.ProcessingStatus;
import com.example.backend.entity.Report;
import com.example.backend.entity.ReportForm;
import com.example.backend.repository.ReportRepository;
import com.example.backend.service.ReportService;
import com.example.backend.util.EmailUtil;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final ReportRepository reportRepository;
    private final EmailUtil emailUtil;

    @Override
    public List<ReportResponse> getAllReport() {
        List<Object[]> list = reportRepository.getAllReport();
        return list.stream()
                .map(objects -> new ReportResponse((Report) objects[0], (ReportForm) objects[1],
                        (AdsPosition) objects[2], (AdsPanel) objects[3]))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReportResponse> getDetailReport(Integer id) {
        if (reportRepository.existsById(id)) {
            List<Object[]> list = reportRepository.getDetailReport(id);
            return list.stream()
                    .map(objects -> new ReportResponse((Report) objects[0], (ReportForm) objects[1],
                            (AdsPosition) objects[2], (AdsPanel) objects[3]))
                    .collect(Collectors.toList());
        }
        return null;
    }

    @Override
    public Report saveReport(Report newReport) {
        return reportRepository.save(newReport);
    }

    @Override
    public List<ReportResponse> addReport(AddReportRequest newReport) {
        Report res = new Report();

        res.setReportForm(newReport.getReportForm());
        res.setSolving("");
        res.setContent(newReport.getContent());
        res.setEmail(newReport.getEmail());
        res.setAdsPanel(newReport.getAdsPanel());
        res.setState(newReport.getState());
        res.setAdsPosition(newReport.getAdsPosition());
        res.setImage1(newReport.getImage1());
        res.setImage2(newReport.getImage2());
        res.setDeviceId(newReport.getDeviceId());
        res.setFullName(newReport.getFullName());
        res.setPhoneNumber(newReport.getPhoneNumber());

        Report upcoming = reportRepository.save(res);

        List<Object[]> list = reportRepository.getDetailReport(upcoming.getId());
        return list.stream()
                .map(objects -> new ReportResponse((Report) objects[0], (ReportForm) objects[1],
                        (AdsPosition) objects[2], (AdsPanel) objects[3]))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReportResponse> updateReport(Integer id, SolvingReport solution) {
        Optional<Report> res = reportRepository.findById(id);
        if (res.isPresent()) {

            Report dbReport = res.get();

            dbReport.setSolving(solution.getSolving());
            dbReport.setState(solution.getProcessingStatus());

            dbReport = reportRepository.save(dbReport);
            // send gmail
            String mess = dbReport.getSolving();
            String email = dbReport.getEmail();
            String fullname = dbReport.getFullName();
            try {
                emailUtil.sendMessToEmail(email, mess, fullname);
            } catch (MessagingException ex) {
                throw new RuntimeException("Unable to send mess, please try again");
            }

            List<Object[]> list = reportRepository.getDetailReport(dbReport.getId());
            return list.stream()
                    .map(objects -> new ReportResponse((Report) objects[0], (ReportForm) objects[1],
                            (AdsPosition) objects[2], (AdsPanel) objects[3]))
                    .collect(Collectors.toList());

        } else {
            throw new RuntimeException("Report id not found");
        }

    }
}