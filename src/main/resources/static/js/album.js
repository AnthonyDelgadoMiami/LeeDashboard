// album-modal.js
document.addEventListener('DOMContentLoaded', function() {
    // Create modal elements
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = 'imageModal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalImage = document.createElement('img');
    modalImage.className = 'modal-image';

    const closeButton = document.createElement('span');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';

    modalContent.appendChild(modalImage);
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);

    document.body.appendChild(modalOverlay);

    // Add click event to all album images
    const imageCards = document.querySelectorAll('.image-card img');
    imageCards.forEach(img => {
        img.addEventListener('click', function() {
            const imageSrc = this.getAttribute('src');
            modalImage.setAttribute('src', imageSrc);
            modalOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close modal when clicking close button
    closeButton.addEventListener('click', closeModal);

    // Close modal when clicking outside the image
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    function closeModal() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
});