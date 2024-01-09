package com.example.backend.controller;

import com.example.backend.dto.LogEntry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.*;
import java.util.*;
import java.io.*;
@RestController
@RequestMapping(value = "/api/logs")
public class LoggerController {


    @GetMapping("")
    public ResponseEntity<List<LogEntry>> getLogs(@RequestParam(value = "level") String level, @RequestParam(value = "date") String date) {
        List<LogEntry> list = new ArrayList<>();
        String folderPath = "C:\\Users\\vinhh\\IdeaProjects\\logs";
        try {
            Files.walk(Paths.get(folderPath))
                    .filter(Files::isRegularFile)
                    .forEach(filePath -> readLogFile(filePath, list, level, date));
        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
        }

        return ResponseEntity.ok(list);
    }

    private void readLogFile(Path filePath, List<LogEntry> list, String level, String date) {
        try (BufferedReader reader = Files.newBufferedReader(filePath)) {
            String strLine;
            while ((strLine = reader.readLine()) != null) {
                String[] words = strLine.split("\\s", 5);
                LogEntry entry = new LogEntry(words[0], words[1], words[4], words[3]);
                if(level.isEmpty() && !date.isEmpty()){
                    String[] time = entry.getTime().split(":", 2);
                    if(date.equals(time[0])){
                        list.add(entry);
                    }
                }
                else if(date.isEmpty() && !level.isEmpty()){
                    if(level.equals(entry.getLevel())){
                        list.add(entry);
                    }
                }
                else if(!date.isEmpty() && !level.isEmpty()){
                    String[] time = entry.getTime().split(":", 2);
                    if(level.equals(entry.getLevel()) && date.equals(time[0])){
                        list.add(entry);
                    }
                }

            }
        } catch (IOException e) {
            System.err.println("Error reading file: " + filePath + "\n" + e.getMessage());
        }
    }
}
