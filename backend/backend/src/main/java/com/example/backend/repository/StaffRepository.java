package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.Staff;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {
    Optional<Staff> findByEmail(String email);

    Optional<Staff> findByUsername(String username);

    // @Query(value = "SELECT s.* FROM STAFF s INNER JOIN User u ON s.username =
    // u.username WHERE u.role <> 'VHTT'", nativeQuery = true)
    // List<Staff> findAllWithoutVHTT();
}
