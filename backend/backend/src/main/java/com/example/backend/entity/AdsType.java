package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "ads_type")
@Data
public class AdsType {
    @Id
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "color")
    private String color;

    @Column(name = "icon")
    private String icon;

}