package com.example.backend.controller;

import com.example.backend.dto.AddReportRequest;
import com.example.backend.dto.ReCaptchaResponse;
import com.example.backend.dto.ReportResponse;
import com.example.backend.dto.SolvingReport;
import com.example.backend.entity.Report;
import com.example.backend.exception.AppException;
import com.example.backend.service.ReportService;
import com.example.backend.util.EmailUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/v1/report")
// @CrossOrigin(origins = "http://localhost:5173")
public class ReportController {
    private final ReportService reportService;
    private final EmailUtil emailUtil;

    @Value("${recaptcha.secret}")
    private String recaptchaSecret;

    @Value("${recaptcha.url}")
    private String recaptchaUrl;

    @GetMapping("/all/get-all")
    public ResponseEntity<List<ReportResponse>> getAllReport() {
        System.out.println(1);
        List<ReportResponse> result = reportService.getAllReport();
        System.out.println(result);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/all/get-detail/{id}")
    public ResponseEntity<ReportResponse> getDetailReport(@PathVariable(value = "id") Integer id) {
        List<ReportResponse> report = reportService.getDetailReport(id);
        if (report != null) {
            return new ResponseEntity<>(report.get(0), HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReportResponse> updateReport(@PathVariable(value = "id") Integer id,
            @Valid @RequestBody SolvingReport solution) {

        try {
            ReportResponse result = (reportService.updateReport(id, solution)).get(0);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping()
    public ResponseEntity<ReportResponse> addReport(@Valid @RequestBody AddReportRequest report,
            HttpServletRequest request) {
        RestTemplate restTemplate = new RestTemplate();
        String url = recaptchaUrl + "?secret=" + recaptchaSecret + "&response=" +
                report.getToken();
        ReCaptchaResponse response = restTemplate.postForObject(url, null,
                ReCaptchaResponse.class);
        if (response.isSuccess() == false) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "You are robot");
        }

        ReportResponse reportResponse = (reportService.addReport(report)).get(0);

        return new ResponseEntity<>(reportResponse, HttpStatus.OK);
    }

}
