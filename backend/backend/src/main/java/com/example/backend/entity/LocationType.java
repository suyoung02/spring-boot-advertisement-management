package com.example.backend.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "location_type")
public class LocationType {
    @Id
    @Column(name = "title", unique = true, nullable = false)
    private String title;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "location_type")
    private List<AdsPosition> locationTypes = new ArrayList<>();
}
