package com.example.backend.entity;

import com.example.backend.entity.AdsPosition;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "planning_status")
@Data
public class PlanningStatus {
    @Id
    @Column(name = "title")
    private String title;

    @Column(name = "color")
    private String color;

    @Column(name = "icon")
    private String icon;

//    @OneToMany(cascade = CascadeType.ALL, mappedBy = "planning_status")
//    private List<AdsPosition> planningStatus = new ArrayList<>();
}
