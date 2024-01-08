package com.example.backend.controller;

import com.example.backend.dto.AddReportRequest;
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
@CrossOrigin
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
    public ResponseEntity<?> getDetailReport(@PathVariable(value = "id") Integer id){
        Optional<Report> report = reportService.getDetailReport(id);
        if(report != null){
            return new ResponseEntity<>(report, HttpStatus.OK);
        }
        return new ResponseEntity<>("Id Not found", HttpStatus.NOT_FOUND);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Report> updateReport(@PathVariable (value = "id") Integer id,@Valid @RequestBody AddReportRequest newReport){



        try {
            Report result = reportService.updateReport(id, newReport);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    @PostMapping()
    public Report addReport(@Valid @RequestBody AddReportRequest report){

        Report dbReport = reportService.addReport(report);
        return dbReport;
    }

}
