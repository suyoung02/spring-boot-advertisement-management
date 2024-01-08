package com.example.backend.controller;

import com.example.backend.dto.ReportFormRequest;
import com.example.backend.entity.ReportForm;
import com.example.backend.service.ReportFormService;
import jakarta.validation.Valid;
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

    @Autowired
    public ReportFormController(ReportFormService reportFormService) {
        this.reportFormService = reportFormService;
    }

    @GetMapping("")
    public List<ReportForm> getAll() {
        return reportFormService.getAll();
    }

    @GetMapping("/{title}")
    public ResponseEntity<ReportForm> getDetail(@PathVariable(value = "title") String title) {
        return new ResponseEntity<>(reportFormService.getDetail(title), HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<String> addReportForm(@RequestBody @Valid ReportFormRequest reportFormRequest) {
        reportFormService.addReportForm(reportFormRequest);
        return new ResponseEntity<>("Add report form success", HttpStatus.OK);
    }

    @PostMapping("/{title}")
    public ResponseEntity<String> updateReportForm(@PathVariable(value = "title") String title, @RequestBody @Valid ReportFormRequest reportFormRequest) {
        reportFormService.updateReportForm(title, reportFormRequest);
        return new ResponseEntity<>("Update report form success", HttpStatus.OK);
    }

    @DeleteMapping("/{title}")
    public ResponseEntity<String> deleteReportForm(@PathVariable(value = "title") String title) {
        reportFormService.deleteReportForm(title);
        return new ResponseEntity<>("Delete report form success", HttpStatus.OK);
    }
}
