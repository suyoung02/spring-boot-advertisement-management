package com.example.backend.dto;

import lombok.Data;

@Data
public class LogEntry {
    private String time;
    private String level;
    private String message;
    private String line;
    public LogEntry(String time, String level, String message, String line) {
        this.time = time;
        this.level = level;
        this.message = message;
        this.line = line;
    }
}
