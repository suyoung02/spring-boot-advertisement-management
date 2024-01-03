package com.example.backend.repository;

import com.example.backend.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer> {
    @Query(value = "SELECT c FROM Contract c WHERE c.state = 'Đang hiện diện' AND c.ads_panel = ?1")
    public Contract getLatestContract(int panel);
}
