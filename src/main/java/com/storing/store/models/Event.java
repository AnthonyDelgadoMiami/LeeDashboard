package com.storing.store.models;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "calendar_events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    // Constructors
    public Event() {}

    public Event(LocalDate date, String name, String description) {
        this.date = date;
        this.name = name;
        this.description = description;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}