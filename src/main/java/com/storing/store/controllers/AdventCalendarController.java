package com.storing.store.controllers;

import com.storing.store.models.Event;
import com.storing.store.repositories.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/surprises")
public class AdventCalendarController {
    private final EventService eventService;

    @Autowired
    public AdventCalendarController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public String showCalendar(
            @RequestParam(required = false) String yearMonth,
            Model model) {

        YearMonth currentMonth = yearMonth != null
                ? YearMonth.parse(yearMonth, DateTimeFormatter.ofPattern("yyyy-MM"))
                : YearMonth.now();

        YearMonth prevMonth = currentMonth.minusMonths(1);
        YearMonth nextMonth = currentMonth.plusMonths(1);

        List<List<LocalDate>> weeks = generateCalendar(currentMonth);

        model.addAttribute("currentMonth", currentMonth);
        model.addAttribute("monthName", currentMonth.getMonth().toString());
        model.addAttribute("year", currentMonth.getYear());
        model.addAttribute("weeks", weeks);
        model.addAttribute("prevMonth", prevMonth.format(DateTimeFormatter.ofPattern("yyyy-MM")));
        model.addAttribute("nextMonth", nextMonth.format(DateTimeFormatter.ofPattern("yyyy-MM")));

        return "surprises/calendar";
    }

    private List<List<LocalDate>> generateCalendar(YearMonth month) {
        List<List<LocalDate>> weeks = new ArrayList<>();
        LocalDate firstOfMonth = month.atDay(1);
        LocalDate firstDayOfWeek = firstOfMonth.minusDays(firstOfMonth.getDayOfWeek().getValue() - 1);

        for (int i = 0; i < 6; i++) { // Maximum 6 weeks to display
            LocalDate weekStart = firstDayOfWeek.plusWeeks(i);
            List<LocalDate> week = new ArrayList<>();

            for (int j = 0; j < 7; j++) {
                week.add(weekStart.plusDays(j));
            }

            // Don't add weeks that don't contain any days from the current month
            if (week.stream().anyMatch(date -> date.getMonth() == month.getMonth())) {
                weeks.add(week);
            }
        }

        return weeks;
    }

//    @PostMapping("/events")
//    @ResponseBody
//    public ResponseEntity<?> addEvent(@RequestBody Event event) {
//        eventService.addEvent(event);
//        return ResponseEntity.ok().build();
//    }
//
//    @GetMapping("/events")
//    @ResponseBody
//    public List<Event> getEvents(@RequestParam String date) {
//        return eventService.getEventsForDate(LocalDate.parse(date));
//    }
}