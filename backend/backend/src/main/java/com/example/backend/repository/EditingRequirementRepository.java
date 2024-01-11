package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.EditingRequirement;
import com.example.backend.enums.Status;

@Repository
public interface EditingRequirementRepository extends JpaRepository<EditingRequirement, Integer> {
    @Query("SELECT e FROM EditingRequirement e where e.status = ?1")
    List<EditingRequirement> findAllByStatus(Status status);

    @Query("SELECT e FROM EditingRequirement e where e.staff = ?1")
    List<EditingRequirement> findAllByStaff(Integer staff);
}
