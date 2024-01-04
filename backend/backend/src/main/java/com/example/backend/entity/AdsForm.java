package com.example.backend.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ads_form")
public class AdsForm {
    @Id
    @Column(name = "title")
    private String title;
//
//    @OneToMany(cascade = CascadeType.ALL, mappedBy = "ads_form")
//    private List<AdsPosition> positions = new ArrayList<>();
}
