package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Staff;

public interface StaffRepository extends JpaRepository<Staff, Integer> {

}
