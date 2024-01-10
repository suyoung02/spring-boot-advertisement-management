package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.LocationType;

@Repository
public interface LocationTypeRepository extends JpaRepository<LocationType, String> {
    boolean existsByTitle(String title);

    LocationType findByTitle(String title);

    void deleteByTitle(String title);
}
