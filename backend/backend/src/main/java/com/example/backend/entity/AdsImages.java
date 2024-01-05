package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ads_images")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AdsImages {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ads_panel")
    private Integer ads_panel;

    @Column(name = "ads_image")
    private String ads_image;
}
