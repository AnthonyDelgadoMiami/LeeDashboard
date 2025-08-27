package com.storing.store.services;

import com.storing.store.models.Event;
import com.storing.store.repositories.EventRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getEventsForDate(LocalDate date) {
        return eventRepository.findByDate(date);
    }

    public void addEvent(Event event) {
        eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Map<LocalDate, Integer> getEventCountsForMonth(YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();

        List<Event> events = eventRepository.findByDateBetween(start, end);
        Map<LocalDate, Integer> counts = new HashMap<>();

        for (Event event : events) {
            counts.put(event.getDate(), counts.getOrDefault(event.getDate(), 0) + 1);
        }

        return counts;
    }
}