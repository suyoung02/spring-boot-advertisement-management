package com.example.backend.controller;

import com.example.backend.entity.AdsPosition;
import com.example.backend.entity.Report;
import com.example.backend.exception.RestExceptionHandler;
import com.example.backend.service.AdsService;
import com.example.backend.service.ReportService;
import com.example.backend.util.EmailUtil;
import com.example.backend.util.OtpUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.mail.MessagingException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/report")
//@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {
    private final ReportService reportService;
    private final EmailUtil emailUtil;

    @GetMapping("")
    public ResponseEntity<List<Report>> getAllReport(){
        System.out.println(1);
        List<Report> result = reportService.getAllReport();
        System.out.println(result);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetailPosition(@PathVariable(value = "id") Integer id){
        Optional<Report> report = reportService.getDetailReport(id);
        if(report != null){
            return new ResponseEntity<>(report, HttpStatus.OK);
        }
        return new ResponseEntity<>("Id Not found", HttpStatus.NOT_FOUND);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Report> updateFilm(@PathVariable (value = "id") Integer id,@Valid @RequestBody Report report){

        Optional<Report> dbReport =reportService.getDetailReport(id);
        if(dbReport!=null){
            report.setId(id);
//            if(task.getDescription()==null){
//                task.setDescription(dbTask.getDescription());
//            }

            Report res=reportService.saveReport(report);
            String mess = report.getSolving();
            String email= report.getEmail();
            String fullname =report.getFullName();
            try {
                emailUtil.sendMessToEmail(email, mess, fullname);
            } catch (MessagingException ex) {
                throw new RuntimeException("Unable to send mess, please try again");
            }

        }


        return ResponseEntity.ok(report);
    }
    @PostMapping()
    public Report addReport(@Valid @RequestBody Report report){

        report.setId(0);
        report.setSolving("");
        Report dbReport = reportService.saveReport(report);
        return dbReport;
    }

}
