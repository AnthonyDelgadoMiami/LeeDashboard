package com.storing.store.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.client.RestTemplate;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Controller
public class HomeController {

    public HomeController(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    @GetMapping("/")
    public String index(Model model) {
        int nextAniyear = LocalDate.now().getYear();
        LocalDate anniversary = LocalDate.of(nextAniyear, 5, 23);
        long daysUntil = ChronoUnit.DAYS.between(LocalDate.now(), anniversary);
        if (daysUntil < 0){
            anniversary = LocalDate.of(nextAniyear+1, 5, 23);
        }
        daysUntil = ChronoUnit.DAYS.between(LocalDate.now(), anniversary);
        model.addAttribute("daysUntilAnniversary", daysUntil);

        // Add reminders
        String reminderMessage = getDailyReminder();
        model.addAttribute("dailyReminder", reminderMessage);

        // Get weather data her house: 26.642874, -80.066658
        WeatherData weather = getWeatherData("26.642874", "-80.066658");
        model.addAttribute("weather", weather);
        return "index";
    }

    @GetMapping("/secret")
    public String secretPage(Model model) {
        model.addAttribute("message",
                "Emily, this is our private digital garden. " +
                        "No one else can see this but you and me ❤️");
        return "secret";
    }

    @GetMapping("/interactive")
    public String interactive(Model model) {
        List<String> compliments = Arrays.asList(
                "You have the best smile",
                "You make every day brighter",
                "I love your empathy",
                "You're my good girl",
                "I'm probably missing you right now",
                "I wish I could hold you now",
                "You are so pretty, I could (and do) stare at you for hours",
                "Probably thinking of kissing you right now",
                "My hand misses your hand (and your throat)",
                "I love to make you happy and cared for",
                "You’re the best part of my day",
                "I love how your smile lingers in my head",
                "My favorite place is always close you",
                "You make me want to be better every day",
                "I love the way you see the world",
                "You’re the most beautiful thought I have",
                "I crave your voice more than white rice",
                "I never get tired of you, not for a second",
                "You’re my safest place and my wildest dream",
                "I’m addicted to the way you look at me",
                "Your happiness is my favorite mission",
                "Even silence with you feels perfect",
                "I’d choose you in every lifetime",
                "My tongue remember yours too well",
                "You’re the best surprise life ever gave me",
                "The thought of you still gives me butterflies (I struggle to eat)",
                "Your touch calms my whole body",
                "Every night, I wish you were here beside me"
        );

        // Convert to JSON and add directly to model
        ObjectMapper mapper = new ObjectMapper();
        try {
            String json = mapper.writeValueAsString(compliments);
            model.addAttribute("complimentsJson", json);
        } catch (JsonProcessingException e) {
            model.addAttribute("complimentsJson", "[]");
        }

        return "interactive";
    }

    @GetMapping("/open-when")
    public String openWhenLetters() {
        return "open-when";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    private String getViewName() {
        return "index.html";
    }

    private final RestTemplate restTemplate;

    private WeatherData getWeatherData(String latitude, String longitude) {
        String url = String.format("https://api.open-meteo.com/v1/forecast?latitude=%s&longitude=%s&current_weather=true",
                latitude, longitude);

        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> currentWeather = (Map<String, Object>) response.getBody().get("current_weather");

                WeatherData weather = new WeatherData();
                weather.setTemperature(currentWeather.get("temperature").toString());
                weather.setWeatherCode(Integer.parseInt(currentWeather.get("weathercode").toString()));
                weather.setWindSpeed(currentWeather.get("windspeed").toString());

                return weather;
            }
        } catch (Exception e) {
            // Fallback to default weather if API fails
            WeatherData weather = new WeatherData();
            weather.setTemperature("72");
            weather.setWeatherCode(1); // 1 = partly cloudy
            return weather;
        }

        return null;
    }

    public static class WeatherData {
        private String temperature;
        private int weatherCode;
        private String windSpeed;

        // Getters and setters
        public String getTemperature() { return temperature; }
        public void setTemperature(String temperature) { this.temperature = temperature; }
        public int getWeatherCode() { return weatherCode; }
        public void setWeatherCode(int weatherCode) { this.weatherCode = weatherCode; }
        public String getWindSpeed() { return windSpeed; }
        public void setWindSpeed(String windSpeed) { this.windSpeed = windSpeed; }

        public String getWeatherEmoji() {
            // Map weather codes to emojis
            switch(weatherCode) {
                case 0: return "☀️"; // Clear sky
                case 1: return "🌤"; // Mainly clear
                case 2: return "⛅"; // Partly cloudy
                case 3: return "☁️"; // Overcast
                case 45: case 48: return "🌫"; // Fog
                case 51: case 53: case 55: return "🌧"; // Drizzle
                case 56: case 57: return "🌧❄️"; // Freezing drizzle
                case 61: case 63: case 65: return "🌧"; // Rain
                case 66: case 67: return "🌧❄️"; // Freezing rain
                case 71: case 73: case 75: return "❄️"; // Snow
                case 77: return "🌨"; // Snow grains
                case 80: case 81: case 82: return "🌧"; // Rain showers
                case 85: case 86: return "🌨"; // Snow showers
                case 95: case 96: case 99: return "⛈"; // Thunderstorm
                default: return "🌈";
            }
        }
    }

    private String getDailyReminder() {
        DayOfWeek day = LocalDate.now().getDayOfWeek();
        int hour = LocalTime.now().getHour();

        // Morning (6 AM - 11 AM)
        if (hour >= 6 && hour < 12) {
            switch(day) {
                case MONDAY: case THURSDAY: return "Good morning my love, remember to take your vitamins";
                case TUESDAY: case WEDNESDAY: return "Good morning mi amor, remember to take your vitamins and to get ready for school";
                case FRIDAY: return "Good morning my love, remember to take your vitamins, you'll see me so soon";
                case SATURDAY: case SUNDAY: return "Weekend morning is the best, best likelihood of seeing you";
                default: return "Rise and shine, my love! Thinking of you this morning.";
            }
        }
        // Afternoon (12 AM - 1 PM)
        else if (hour >= 12 && hour < 13) {
            switch(day) {
                case MONDAY: case TUESDAY: case WEDNESDAY: case THURSDAY: case FRIDAY: return "AT LUNCH, please call me instead, I miss you";
                case SATURDAY: case SUNDAY: return "50 bucks says you are with me or thinking of me I bet";
                default: return "Hope your day is going well, my love! Thinking of you this afternoon.";
            }
        }
        // Afternoon (1 PM - 4 PM)
        else if (hour >= 13 && hour < 16) {
            switch(day) {
                case MONDAY: case THURSDAY: return "I'm at work still, but I miss you";
                case TUESDAY: case WEDNESDAY: return "Good luck at school mi vida, I'm just at work";
                case FRIDAY: return "I'm at work, but only for now, you'll see me soon";
                case SATURDAY: case SUNDAY: return "50 bucks says you are with me or thinking of me";
                default: return "Hope your day is going well, my love! Thinking of you this afternoon.";
            }
        }
        // Evening (5 PM - 8 PM)
        else if (hour >= 16 && hour < 21) {
            switch(day) {
                case MONDAY: case THURSDAY: return "Working out, I know you are working so hard right now";
                case TUESDAY: case WEDNESDAY: return "Working out, I know you are working so hard right now in class right now";
                case FRIDAY: return "I'm driving to you now, don't worry";
                case SATURDAY: case SUNDAY: return "50 bucks says you are with me or thinking of me";
                default: return "Hope your day is going well, my love! Thinking of you this afternoon.";
            }
        }
        // Night (9 PM - 4 AM)
        else {
            switch(day) {
                case MONDAY: case TUESDAY: case WEDNESDAY: case THURSDAY: case FRIDAY: return "Good night mi vida, you'll see me soon, your eyes should be closed";
                case SATURDAY: case SUNDAY: return "Let's have a good night, I always have fun with you";
                default: return "Hope your day is going well, my love! Thinking of you this afternoon.";
            }
        }
    }


}
