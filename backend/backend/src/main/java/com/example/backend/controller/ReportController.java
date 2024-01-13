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

import org.apache.log4j.Logger;
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
    private static final Logger logger = Logger.getLogger(ReportController.class);
    @Value("${recaptcha.secret}")
    private String recaptchaSecret;

    @Value("${recaptcha.url}")
    private String recaptchaUrl;

    @GetMapping("/all/get-all")
    public ResponseEntity<List<ReportResponse>> getAllReport() {
        logger.info("Access get all report API");
        System.out.println(1);
        List<ReportResponse> result = reportService.getAllReport();
        System.out.println(result);
        String logmsg = String.format("Get all report: %s", result);
        logger.info(logmsg);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/all/get-detail/{id}")
    public ResponseEntity<ReportResponse> getDetailReport(@PathVariable(value = "id") String id) {
        logger.info("Access get detail report API");
        List<ReportResponse> report = reportService.getDetailReport(Integer.parseInt(id));
        if (report != null || report.size() > 0) {
            String logmsg = String.format("Get detail report: %s", report.get(0));
            logger.info(logmsg);
            System.out.println(report);
            return new ResponseEntity<>(report.get(0), HttpStatus.OK);
        }
        logger.warn("Report id not found");
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReportResponse> updateReport(@PathVariable(value = "id") String id,
            @Valid @RequestBody SolvingReport solution) {
        logger.info("Access update report API");
        try {
            ReportResponse result = (reportService.updateReport(Integer.parseInt(id), solution)).get(0);
            String logmsg = String.format("Update report: %s", result);
            logger.info(logmsg);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Update report failed");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping()
    public ResponseEntity<ReportResponse> addReport(@Valid @RequestBody AddReportRequest report,
            HttpServletRequest request) {
        logger.info("Access add report API");
        RestTemplate restTemplate = new RestTemplate();
        String url = recaptchaUrl + "?secret=" + recaptchaSecret + "&response=" +
                report.getToken();
        ReCaptchaResponse response = restTemplate.postForObject(url, null,
                ReCaptchaResponse.class);
        if (response.isSuccess() == false) {
            logger.warn("You are robot");
            throw new AppException(400, HttpStatus.BAD_REQUEST, "You are robot");
        }

        ReportResponse reportResponse = (reportService.addReport(report)).get(0);
        String logmsg = String.format("Add report: %s", reportResponse);
        logger.info(logmsg);
        return new ResponseEntity<>(reportResponse, HttpStatus.OK);
    }

}
