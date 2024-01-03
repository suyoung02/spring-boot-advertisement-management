package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ads_position")
@Data
public class AdsPosition {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name ="address")
    private String address;

    @Column(name ="ward")
    private String ward;

    @Column(name ="district")
    private String district;

    @Column(name="province")
    private String province;

    @Column(name = "location_type")
    private String location_type;

    @Column(name = "ads_form")
    private String ads_form;

    @Column(name ="planning_status")
    private String planning_status;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "ads_position")
    private List<AdsPanel> panels = new ArrayList<>();
}
