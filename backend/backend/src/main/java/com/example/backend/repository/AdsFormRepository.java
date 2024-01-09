package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.AdsForm;

@Repository
public interface AdsFormRepository extends JpaRepository<AdsForm, String> {
    boolean existsByTitle(String title);

    AdsForm findByTitle(String title);

    void deleteByTitle(String title);
}
