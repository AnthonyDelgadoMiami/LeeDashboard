function showDay(dateString) {
    const modal = document.getElementById('eventModal');
    const modalDate = document.getElementById('modalDate');
    const eventDateInput = document.getElementById('eventDate');

    modalDate.textContent = formatDate(dateString);
    eventDateInput.value = dateString;

    // Load events for this date
    loadEvents(dateString);
    fetchEventsForSummary(dateString);

    modal.style.display = 'block';
}
function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
}

function formatDate(dateString) {
    // Parse as local date without timezone conversion
    const date = new Date(dateString + 'T12:00:00'); // Use noon to avoid DST issues

    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function loadEvents(date) {
    const eventsContainer = document.getElementById('eventsContainer');
    eventsContainer.innerHTML = '<p>Loading events...</p>';

    fetch(`/surprises/events?date=${date}`, {
        headers: {
            'Content-Type': 'application/json',
            [document.querySelector('meta[name="_csrf_header"]').content]:
                document.querySelector('meta[name="_csrf"]').content
        }
    })
    .then(response => response.json())
    .then(events => {
        if (events.length === 0) {
            eventsContainer.innerHTML = '<p>No events for this day.</p>';
        } else {
            eventsContainer.innerHTML = events.map(event => `
                <div class="event-item" data-event-id="${event.id}">
                    <button class="delete-btn" onclick="deleteEvent(${event.id}, '${date}')">X</button>
                    <div class="event-content">
                        <h4>${event.name}</h4>
                        <p>${event.description || 'No description'}</p>
                    </div>
                </div>
            `).join('');
        }
    })
    .catch(error => {
        eventsContainer.innerHTML = '<p>Error loading events.</p>';
        console.error('Error:', error);
    });
}

function deleteEvent(eventId, date) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }

    fetch(`/surprises/events/${eventId}`, {
        method: 'DELETE',
        headers: {
            [document.querySelector('meta[name="_csrf_header"]').content]:
                document.querySelector('meta[name="_csrf"]').content
        }
    })
    .then(response => {
        if (response.ok) {
            // Reload events after successful deletion
            loadEvents(date);
        } else {
            alert('Error deleting event');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error deleting event');
    });
}

// Event form submission
document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const eventData = {
        date: document.getElementById('eventDate').value,
        name: document.getElementById('eventName').value,
        description: document.getElementById('eventDesc').value
    };

    fetch('/surprises/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [document.querySelector('meta[name="_csrf_header"]').content]:
                document.querySelector('meta[name="_csrf"]').content
        },
        body: JSON.stringify(eventData)
    })
    .then(response => {
        if (response.ok) {
            // Reload events and reset form
            loadEvents(eventData.date);
            document.getElementById('eventForm').reset();
        }
    })
    .catch(error => console.error('Error:', error));
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('eventModal');
    if (event.target === modal) {
        closeModal();
    }
}

function updateEventsSummary(events, dateString) {
    const todayEventsContainer = document.getElementById('todayEvents');
    const formattedDate = formatDate(dateString);

    if (events.length === 0) {
        todayEventsContainer.innerHTML = `
            <p class="no-events">No events for ${formattedDate}</p>
        `;
    } else {
        todayEventsContainer.innerHTML = events.map(event => `
            <div class="event-item">
                <div class="event-title">${event.name}</div>
                <div class="event-description">${event.description || 'No description'}</div>
            </div>
        `).join('');
    }
}

function fetchEventsForSummary(dateString) {
    // Update the title first
    updateEventsSummaryTitle(dateString);

    // Then fetch events as before
    fetch(`/surprises/events?date=${dateString}`, {
        headers: {
            'Content-Type': 'application/json',
            [document.querySelector('meta[name="_csrf_header"]').content]:
                document.querySelector('meta[name="_csrf"]').content
        }
    })
    .then(response => response.json())
    .then(events => {
        updateEventsSummary(events, dateString);
    })
    .catch(error => {
        console.error('Error loading events for summary:', error);
        document.getElementById('todayEvents').innerHTML = `
            <p class="text-muted">Error loading events</p>
        `;
    });
}

function updateEventsSummaryTitle(dateString) {
    const titleElement = document.getElementById('eventsSummaryTitle');
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const isToday = dateString === todayString;

    titleElement.textContent = isToday ? "Today's Events" : `${formatDate(dateString)}'s Events`;
}

// Optional: Load today's events when page loads
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    fetchEventsForSummary(todayString);
});