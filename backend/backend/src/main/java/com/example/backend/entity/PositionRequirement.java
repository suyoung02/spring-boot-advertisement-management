package com.example.backend.entity;

import java.util.Date;

import com.example.backend.enums.Status;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "position_requirement")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PositionRequirement {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Lob
    @Column(name = "new_info", columnDefinition = "TEXT")
    private String new_info;

    @Column(name = "time_submit")
    private Date time_submit;

    @Lob
    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "status")
    private Status status;

    @Column(name = "staff")
    private Integer staff;

    @Column(name = "ads_position")
    private Integer ads_position;
}
