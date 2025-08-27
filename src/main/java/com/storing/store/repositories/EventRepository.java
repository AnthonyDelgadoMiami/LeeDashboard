package com.storing.store.repositories;

import com.storing.store.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDate(LocalDate date);
    List<Event> findByDateBetween(LocalDate start, LocalDate end);
}