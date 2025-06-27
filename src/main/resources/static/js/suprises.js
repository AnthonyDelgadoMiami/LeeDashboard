<script>
  document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".calendar-cell");
    const detailSection = document.getElementById("day-detail");
    const selectedDaySpan = document.getElementById("selected-day");
    const eventDateInput = document.getElementById("event-date-input");
    const eventList = document.getElementById("event-list");

    // Store all events in JS (from Thymeleaf)
    const eventsByDate = /*[[${events}]]*/ {};

    cells.forEach(cell => {
      cell.addEventListener("click", () => {
        // Deselect all
        cells.forEach(c => c.classList.remove("selected"));
        // Select clicked
        cell.classList.add("selected");

        const date = cell.getAttribute("data-date");
        selectedDaySpan.textContent = date;
        eventDateInput.value = date;

        // Display events
        const events = eventsByDate[date] || [];
        eventList.innerHTML = "";
        events.forEach(evt => {
          const li = document.createElement("li");
          li.textContent = evt.name + ": " + evt.description;
          eventList.appendChild(li);
        });

        detailSection.style.display = "block";
      });
    });
  });
</script>
