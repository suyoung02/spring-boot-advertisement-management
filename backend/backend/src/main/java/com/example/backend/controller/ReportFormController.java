package com.example.backend.controller;

import com.example.backend.dto.ReportFormRequest;
import com.example.backend.entity.ReportForm;
import com.example.backend.service.ReportFormService;
import jakarta.validation.Valid;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/report-form")
public class ReportFormController {

    private final ReportFormService reportFormService;
    private static final Logger logger = Logger.getLogger(ReportFormController.class);
    @Autowired
    public ReportFormController(ReportFormService reportFormService) {
        this.reportFormService = reportFormService;
    }

    @GetMapping("")
    public List<ReportForm> getAll() {
        logger.info("Access get all report form API");
        return reportFormService.getAll();
    }

    @GetMapping("/{title}")
    public ResponseEntity<ReportForm> getDetail(@PathVariable(value = "title") String title) {
        String logmsg =String.format("Get detail report form: %s", title);
        logger.info(logmsg);
        return new ResponseEntity<>(reportFormService.getDetail(title), HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<String> addReportForm(@RequestBody @Valid ReportFormRequest reportFormRequest) {
        logger.info("Access add report form API");
        reportFormService.addReportForm(reportFormRequest);
        String logmsg =String.format("Add report form: %s", reportFormRequest);
        logger.info(logmsg);
        return new ResponseEntity<>("Add report form success", HttpStatus.OK);
    }

    @PostMapping("/{title}")
    public ResponseEntity<String> updateReportForm(@PathVariable(value = "title") String title, @RequestBody @Valid ReportFormRequest reportFormRequest) {
        String logmsg =String.format("Update report form: %s", title);
        logger.info(logmsg);
        reportFormService.updateReportForm(title, reportFormRequest);
        String logmsg2 =String.format("Update report form: %s success", reportFormRequest);
        logger.info(logmsg2);
        return new ResponseEntity<>("Update report form success", HttpStatus.OK);
    }

    @DeleteMapping("/{title}")
    public ResponseEntity<String> deleteReportForm(@PathVariable(value = "title") String title) {
        String logmsg =String.format("Delete report form: %s", title);
        logger.info(logmsg);
        reportFormService.deleteReportForm(title);
        String logmsg2 =String.format("Delete report form: %s success", title);
        logger.info(logmsg2);
        return new ResponseEntity<>("Delete report form success", HttpStatus.OK);
    }
}
