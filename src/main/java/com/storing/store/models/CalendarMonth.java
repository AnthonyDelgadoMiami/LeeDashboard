package com.storing.store.models;

import com.storing.store.models.Event;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class CalendarMonth {
    private int year;
    private int month;
    private List<Event> events;
    private List<List<LocalDate>> weeks;

    public CalendarMonth(int year, int month, List<Event> events) {
        this.year = year;
        this.month = month;
        this.events = events;
        this.weeks = generateWeeks();
    }

    private List<List<LocalDate>> generateWeeks() {
        // Implementation will go here
        return null; // placeholder
    }

    // Getters and setters
    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }

    public List<List<LocalDate>> getWeeks() {
        return weeks;
    }

    public void setWeeks(List<List<LocalDate>> weeks) {
        this.weeks = weeks;
    }

    public List<Event> getEventsForDay(LocalDate date) {
        return events.stream()
                .filter(e -> e.getDate().equals(date))
                .collect(Collectors.toList());
    }
}