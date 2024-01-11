package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.PositionRequirement;
import com.example.backend.enums.Status;

@Repository
public interface PositionRequirementRepository extends JpaRepository<PositionRequirement, Integer> {
    @Query("SELECT e FROM PositionRequirement e where e.status = ?1")
    List<PositionRequirement> findAllByStatus(Status status);

    @Query("SELECT e FROM PositionRequirement e where e.staff = ?1")
    List<PositionRequirement> findAllByStaff(Integer staff);
}
