package com.storing.store.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.client.RestTemplate;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.time.LocalDate;
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
                "I love to make you happy and cared for"
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


}
