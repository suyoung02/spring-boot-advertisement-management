package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name="report")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Report {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "report_form")
    private String reportForm;

    @Column(name = "fullname")
    private String fullName;

    @Column(name="email")
    private String email;


    @Column(name="phone_number")
    private String phoneNumber;

    @Column(name = "content")
    private String content;

    @Column(name = "state")
    private String state;

    @Column(name = "device_id")
    private String deviceId;

    @Column(name = "image_1")
    private String image1;

    @Column(name = "image_2")
    private String image2;

    @Column(name = "solving")
    private String solving;

}
