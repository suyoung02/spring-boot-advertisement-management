package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "ads_form")
@Data
public class AdsForm {
    @Id
    @Column(name = "title")
    private String title;

    @Column(name = "color")
    private String color;

    @Lob
    @Column(name = "icon", columnDefinition = "TEXT")
    private String icon;
    //
    // @OneToMany(cascade = CascadeType.ALL, mappedBy = "ads_form")
    // private List<AdsPosition> positions = new ArrayList<>();
}
