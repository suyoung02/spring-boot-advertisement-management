package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "ads_panel")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdsPanel {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ads_type")
    private String ads_type;

    @Column(name = "size")
    private String size;

    @Column(name = "contract_id")
    private Integer contract_id;

    @Column(name = "ads_position")
    private Integer ads_position;

    @Lob
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;
}
