package com.example.backend.entity;

import com.example.backend.enums.IsActived;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "ads_position")
@Data
public class AdsPosition {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "address")
    private String address;

    @Column(name = "ward")
    private String ward;

    @Column(name = "district")
    private String district;

    @Column(name = "province")
    private String province;

    @Column(name = "location_type")
    private String location_type;

    @Column(name = "ads_form")
    private String ads_form;

    @Column(name = "planning_status")
    private String planning_status;

    @Column(name = "photo")
    private String photo;

    @Column(name = "place_id")
    private String place_id;

    @Column(name = "latidude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "is_active")
    @Enumerated(EnumType.STRING)
    private IsActived is_actived;
}
