package com.storing.store.repositories;

import com.storing.store.models.Event;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EventService {
    private final Map<LocalDate, List<Event>> eventsByDate = new HashMap<>();
    private long nextId = 1;

    public void addEvent(Event event) {
        event.setId(nextId++);
        eventsByDate.computeIfAbsent(event.getDate(), k -> new ArrayList<>()).add(event);
    }

    public List<Event> getEventsForDate(LocalDate date) {
        return eventsByDate.getOrDefault(date, new ArrayList<>());
    }

    public void deleteEvent(Long eventId) {
        eventsByDate.values().forEach(events ->
                events.removeIf(event -> event.getId().equals(eventId)));
    }
}