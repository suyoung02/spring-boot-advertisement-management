package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.PlanningStatus;

@Repository
public interface PlanningStatusRepository extends JpaRepository<PlanningStatus, String> {
    boolean existsByTitle(String title);

    PlanningStatus findByTitle(String title);

    void deleteByTitle(String title);
}
