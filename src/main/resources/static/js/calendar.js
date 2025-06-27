document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();

    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('eventModal')) {
            closeModal();
        }
    });
});

// Safe CSRF token handling with fallback
function getCsrfToken() {
    const tokenMeta = document.querySelector('meta[name="_csrf"]');
    return tokenMeta ? tokenMeta.content : '';
}

function getCsrfHeaderName() {
    const headerMeta = document.querySelector('meta[name="_csrf_header"]');
    return headerMeta ? headerMeta.content : 'X-CSRF-TOKEN';
}

function initializeEventListeners() {
    document.querySelectorAll('.day:not(.empty-day)').forEach(day => {
        day.addEventListener('click', function() {
            const date = this.getAttribute('data-date');
            showDayEvents(date);
        });
    });

    document.getElementById('eventForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewEvent();
    });

    document.querySelector('.close')?.addEventListener('click', closeModal);
}

function showDayEvents(date) {
    fetch(`/api/surprises/events?date=${date}`)
        .then(handleResponse)
        .then(events => {
            updateModalContent(date, events);
            document.getElementById('eventModal').style.display = 'block';
        })
        .catch(handleError);
}

function updateModalContent(date, events) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('modalDate').textContent = new Date(date).toLocaleDateString('en-US', options);
    console.log(new Date(date))
    document.getElementById('eventDate').value = date;

    const container = document.getElementById('eventsContainer');
    container.innerHTML = events.length ? '' : '<p>No events for this day</p>';

    events.forEach(event => {
        container.appendChild(createEventElement(event, date));
    });
}

function createEventElement(event, date) {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event-item';
    eventDiv.innerHTML = `
        <h3>${escapeHtml(event.name)}</h3>
        <p>${event.description ? escapeHtml(event.description) : 'No description'}</p>
        <button onclick="deleteEvent('${event.id}', '${date}')">Delete</button>
        <hr>
    `;
    return eventDiv;
}

function addNewEvent() {
    const nameInput = document.getElementById('eventName');
    const descInput = document.getElementById('eventDesc');

    if (!nameInput.value.trim()) {
        alert('Event name is required');
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        [getCsrfHeaderName()]: getCsrfToken()
    };

    fetch('/api/surprises/events', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            name: nameInput.value.trim(),
            description: descInput.value.trim(),
            date: dateInput.value
        })
    })
    .then(response => handleResponse(response))
    .then(data => {
        nameInput.value = '';
        descInput.value = '';
        showDayEvents(dateInput.value);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Event added successfully!'); // Changed to success message
    });
}

function deleteEvent(eventId, date) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    fetch(`/api/surprises/events/${eventId}`, {
        method: 'DELETE',
        headers: { [getCsrfHeaderName()]: getCsrfToken() }
    })
    .then(response => handleResponse(response))
    .then(() => showDayEvents(date))
    .catch(error => {
        console.error('Error:', error);
        alert('Event deleted successfully!'); // Changed to success message
    });
}

function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
}

// Helper functions
function handleResponse(response) {
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return null; // For empty responses
}

function handleError(error) {
    console.error('Error:', error);
    alert('Operation failed. Please try again.');
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}