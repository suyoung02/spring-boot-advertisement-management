package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "contract")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Contract {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "enterprise_info")
    private String enterprise_info;

    @Column(name = "enterprise_email")
    private String enterprise_email;

    @Column(name = "enterprise_phone_number")
    private String enterprise_phone_number;

    @Column(name = "contract_begin")
    private Date contract_begin;

    @Column(name = "contract_expiration")
    private Date contract_expiration;

    @Column(name = "ads_panel")
    private Integer ads_panel;

    @Column(name = "state")
    private String state;
}
