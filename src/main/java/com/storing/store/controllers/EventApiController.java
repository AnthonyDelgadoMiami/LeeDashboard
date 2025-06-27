package com.storing.store.controllers;

import com.storing.store.models.Event;
import com.storing.store.repositories.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/surprises")
public class EventApiController {

    private final EventService eventService;

    @Autowired
    public EventApiController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping("/events")
    public ResponseEntity<Map<String, String>> addEvent(@RequestBody Event event) {
        eventService.addEvent(event);
        return ResponseEntity.ok().body(Collections.singletonMap("status", "success"));
    }

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getEvents(@RequestParam String date) {
        return ResponseEntity.ok(eventService.getEventsForDate(LocalDate.parse(date)));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok().body(Collections.singletonMap("status", "success"));
    }
}