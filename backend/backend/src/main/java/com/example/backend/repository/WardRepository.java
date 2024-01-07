package com.example.backend.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.District;
import com.example.backend.entity.Ward;

import jakarta.transaction.Transactional;

@Repository
public interface WardRepository extends JpaRepository<Ward, Integer> {
    @Query(value = "SELECT w.* FROM WARD w WHERE w.ward = ?1  ", nativeQuery = true)
    Ward findWardByName(String ward);
    @Query(value = "SELECT w.* FROM WARD w", nativeQuery = true)
    List<Ward> findAllWard();
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM WARD w WHERE w.ward = ?1", nativeQuery = true)
    void deleteWard(String ward);
    @Transactional
    @Modifying
    @Query(value = "INSERT INTO WARD (ward) VALUES (?1)", nativeQuery = true)
    void insertWard(String ward);
    @Transactional
    @Modifying
    @Query(value = "UPDATE WARD SET ward = ?1 WHERE ward = ?2", nativeQuery = true)
    void updateWard(String updateWard,String oldWard);
    }