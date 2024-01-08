package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name="report_form")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReportForm {
    @Id
    @Column(name = "title")
    private String title;

    @Column(name = "color")
    private String color;

    @Column(name = "icon")
    private String icon;
}
