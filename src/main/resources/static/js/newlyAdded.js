
// Function for featured tracks (most played & last played)
function playFeaturedTrack(button, playerId) {
    const playerContainer = document.getElementById(playerId);
    const isVisible = playerContainer.style.display === 'block';

    // Close all featured track players
    document.querySelectorAll('.spotify-player-container').forEach(container => {
        if (container.id.includes('popular') || container.id.includes('played')) {
            container.style.display = 'none';
        }
    });

    // Toggle this player
    if (!isVisible) {
        playerContainer.style.display = 'block';
        button.innerHTML = '<i class="bi bi-spotify"></i> Hide';
        button.classList.remove('btn-success');
        button.classList.add('btn-outline-success');

        // Scroll into view if needed
        playerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        playerContainer.style.display = 'none';
        button.innerHTML = '<i class="bi bi-spotify"></i> Play';
        button.classList.remove('btn-outline-success');
        button.classList.add('btn-success');
    }
}

// Keep your existing JavaScript for the recent tracks section
let currentlyExpandedTrack = null;

function toggleSpotifyPlayer(button) {
    const trackIndex = button.getAttribute('data-track-index');
    const playerContainer = document.getElementById('recent-player-container-' + trackIndex);
    const trackElement = document.getElementById('recent-track-' + trackIndex);
    const playerText = button.querySelector('.player-text');

    if (playerContainer.style.display === 'none') {
        // Close any other open players
        if (currentlyExpandedTrack !== null && currentlyExpandedTrack !== trackIndex) {
            closePlayer(currentlyExpandedTrack);
        }

        // Open this player
        playerContainer.style.display = 'block';
        playerText.textContent = 'Hide';
        button.classList.remove('btn-success');
        button.classList.add('btn-outline-success');
        trackElement.classList.add('track-expanded');
        currentlyExpandedTrack = trackIndex;

        // Scroll into view if needed
        playerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        closePlayer(trackIndex);
    }
}

function closePlayer(trackIndex) {
    const playerContainer = document.getElementById('recent-player-container-' + trackIndex);
    const button = document.querySelector(`[data-track-index="${trackIndex}"]`);
    const trackElement = document.getElementById('recent-track-' + trackIndex);

    if (playerContainer) playerContainer.style.display = 'none';
    if (button) {
        button.querySelector('.player-text').textContent = 'Play';
        button.classList.remove('btn-outline-success');
        button.classList.add('btn-success');
    }
    if (trackElement) trackElement.classList.remove('track-expanded');

    if (currentlyExpandedTrack === trackIndex) {
        currentlyExpandedTrack = null;
    }
}

// Close player when clicking outside
document.addEventListener('click', function(event) {
    if (currentlyExpandedTrack !== null) {
        const playerContainer = document.getElementById('recent-player-container-' + currentlyExpandedTrack);
        const button = document.querySelector(`[data-track-index="${currentlyExpandedTrack}"]`);

        if (playerContainer && button &&
            !playerContainer.contains(event.target) &&
            !button.contains(event.target)) {
            closePlayer(currentlyExpandedTrack);
        }
    }
});
