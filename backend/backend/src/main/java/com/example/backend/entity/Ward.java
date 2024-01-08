package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "ward")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Ward {
    @Id
    @Column(name = "ward", unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String ward;

    public void setWard(String ward) {
        this.ward = ward;
    }


}
