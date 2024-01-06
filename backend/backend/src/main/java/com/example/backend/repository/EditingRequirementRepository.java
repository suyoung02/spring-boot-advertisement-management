package com.example.backend.repository;

import com.example.backend.entity.EditingRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EditingRequirementRepository extends JpaRepository<EditingRequirement, Integer> {
    @Query(value = "SELECT e FROM EditingRequirement e where e.status = 'Đã gửi'")
    List<EditingRequirement> getAllWaitEditingRequirement();
}
