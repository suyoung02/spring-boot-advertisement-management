package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "editing_requirement")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EditingRequirement {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "new_info")
    private String new_info;

    @Column(name = "time_submit")
    private Date time_submit;

    @Column(name = "reason")
    private String reason;

    @Column(name = "status")
    private String status;

    @Column(name = "staff")
    private Integer staff;

    @Column(name = "ads_panel")
    private Integer ads_panel;
}
