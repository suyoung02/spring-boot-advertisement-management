package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "location_type")
@Data
public class LocationType {
    @Id
    @Column(name = "title", unique = true, nullable = false)
    private String title;

    @Column(name = "color")
    private String color;

    @Column(name = "icon")
    private String icon;

//    @OneToMany(cascade = CascadeType.ALL, mappedBy = "location_type")
//    private List<AdsPosition> locationTypes = new ArrayList<>();
}
