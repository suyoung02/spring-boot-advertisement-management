package com.example.backend.service.impl;

import com.example.backend.dto.AddReportRequest;
import com.example.backend.entity.Report;
import com.example.backend.repository.ReportRepository;
import com.example.backend.service.ReportService;
import com.example.backend.util.EmailUtil;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private  final ReportRepository reportRepository;
    private final EmailUtil emailUtil;
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

    @Override
    public Report addReport(AddReportRequest newReport) {
        Report res=new Report();
        res.setId(0);
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
        return reportRepository.save(res);
    }

    @Override
    public Report updateReport(Integer id, AddReportRequest newReport) {
        Optional<Report> res =reportRepository.findById(id);
        if(res.isPresent()){

            Report dbReport = res.get();
            System.out.println(dbReport);
            dbReport.setSolving(newReport.getSolving());
            dbReport.setContent(newReport.getContent());
            dbReport.setState(newReport.getState());
            reportRepository.save(dbReport);
            // send gmail
            String mess = dbReport.getSolving();
            String email= dbReport.getEmail();
            String fullname =dbReport.getFullName();
            try {
                emailUtil.sendMessToEmail(email, mess, fullname);
            } catch (MessagingException ex) {
                throw new RuntimeException("Unable to send mess, please try again");
            }
            return dbReport;
        }else{
            throw new RuntimeException("Report id not found");
        }

    }


}
