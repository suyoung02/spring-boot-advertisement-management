package com.example.backend.controller;

import com.example.backend.dto.AddReportRequest;
import com.example.backend.dto.ReCaptchaResponse;
import com.example.backend.entity.AdsPosition;
import com.example.backend.entity.Report;
import com.example.backend.exception.AppException;
import com.example.backend.exception.RestExceptionHandler;
import com.example.backend.service.AdsService;
import com.example.backend.service.ReportService;
import com.example.backend.util.EmailUtil;
import com.example.backend.util.OtpUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.mail.MessagingException;
import org.springframework.web.client.RestTemplate;

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

    @Value("${recaptcha.secret}")
    private String recaptchaSecret;

    @Value("${recaptcha.url}")
    private String recaptchaUrl;

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
    public Report addReport(@Valid @RequestBody AddReportRequest report, HttpServletRequest request){
        RestTemplate restTemplate = new RestTemplate();
        String url = recaptchaUrl + "?secret=" + recaptchaSecret + "&response=" + report.getToken();
        ReCaptchaResponse response = restTemplate.postForObject(url, null, ReCaptchaResponse.class);
        if (response.isSuccess() == false) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "You are robot");
        }

        Report dbReport = reportService.addReport(report);
        return dbReport;
    }

}
