package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "location_type")
@Data
public class LocationType {
    @Id
    @Column(name = "title", unique = true, nullable = false)
    private String title;

    @Column(name = "color")
    private String color;

    @Lob
    @Column(name = "icon", columnDefinition = "TEXT")
    private String icon;

    // @OneToMany(cascade = CascadeType.ALL, mappedBy = "location_type")
    // private List<AdsPosition> locationTypes = new ArrayList<>();
}
