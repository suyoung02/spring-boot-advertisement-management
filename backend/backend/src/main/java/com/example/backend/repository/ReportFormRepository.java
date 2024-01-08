package com.example.backend.repository;

import com.example.backend.entity.ReportForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportFormRepository extends JpaRepository<ReportForm, String> {
}
