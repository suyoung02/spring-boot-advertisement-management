package com.example.backend.controller;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.ProcessingStatus;
import com.example.backend.service.ProcessingStatusService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/v1/processing-status")
public class ProcessingStatusController {
    private final ProcessingStatusService processingStatusService;
    private static final Logger logger = Logger.getLogger(ProcessingStatusController.class);
    @GetMapping("")
    public List<ProcessingStatus> getAll() {
        logger.info("Access get all processing status API");
        return processingStatusService.getAll();
    }
}
