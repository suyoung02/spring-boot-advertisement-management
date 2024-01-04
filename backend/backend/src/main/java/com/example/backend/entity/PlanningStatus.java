package com.example.backend.entity;

import com.example.backend.entity.AdsPosition;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "planning_status")
public class PlanningStatus {
    @Id
    @Column(name = "title")
    private String title;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "planning_status")
    private List<AdsPosition> planningStatus = new ArrayList<>();
}
