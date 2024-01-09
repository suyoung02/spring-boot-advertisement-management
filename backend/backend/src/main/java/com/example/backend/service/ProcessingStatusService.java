package com.example.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.entity.ProcessingStatus;
import com.example.backend.repository.ProcessingStatusRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProcessingStatusService {
    private final ProcessingStatusRepository processingStatusRepository;

    public List<ProcessingStatus> getAll() {
        return processingStatusRepository.findAll();
    }
}
