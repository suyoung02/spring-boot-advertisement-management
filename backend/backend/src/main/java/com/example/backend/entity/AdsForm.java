package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ads_form")
@Data
public class AdsForm {
    @Id
    @Column(name = "title")
    private String title;


    @Column(name="color")
    private String color;

    @Column(name = "icon")
    private String icon;
//
//    @OneToMany(cascade = CascadeType.ALL, mappedBy = "ads_form")
//    private List<AdsPosition> positions = new ArrayList<>();
}
