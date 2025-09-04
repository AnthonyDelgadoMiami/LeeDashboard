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

// album-edit.js
document.addEventListener('DOMContentLoaded', function() {
    // Function to get CSRF token and header name from the page
    function getCsrfInfo() {
        // Try to get token from meta tag
        const tokenMeta = document.querySelector('meta[name="_csrf"]');
        const headerMeta = document.querySelector('meta[name="_csrf_header"]');

        if (tokenMeta && headerMeta) {
            return {
                token: tokenMeta.getAttribute('content'),
                headerName: headerMeta.getAttribute('content')
            };
        }

        // Try to get token from input field (less common)
        const tokenInput = document.querySelector('input[name="_csrf"]');
        if (tokenInput) {
            return {
                token: tokenInput.value,
                headerName: 'X-CSRF-TOKEN'
            };
        }

        // If no token found, return empty values
        console.warn('CSRF token not found');
        return { token: '', headerName: '' };
    }

    // Edit title functionality
    const titleEditToggle = document.getElementById('titleEditToggle');
    const titleView = document.getElementById('titleView');
    const titleEditForm = document.getElementById('titleEditForm');
    const titleInput = document.getElementById('titleInput');
    const saveTitleBtn = document.getElementById('saveTitleBtn');
    const cancelTitleBtn = document.getElementById('cancelTitleBtn');

    if (titleEditToggle) {
        titleEditToggle.addEventListener('click', function() {
            titleInput.value = titleView.textContent;
            titleEditForm.classList.add('active');
            titleView.parentElement.classList.add('edit-mode');
        });

        saveTitleBtn.addEventListener('click', function() {
            const newTitle = titleInput.value.trim();
            if (newTitle) {
                updateAlbumField('title', newTitle, function(success, errorMessage) {
                    if (success) {
                        titleView.textContent = newTitle;
                        exitEditMode(titleEditForm, titleView.parentElement);
                    } else {
                        showAlert(errorMessage || 'Error saving changes. Please try again.', 'error');
                    }
                });
            }
        });

        cancelTitleBtn.addEventListener('click', function() {
            exitEditMode(titleEditForm, titleView.parentElement);
        });
    }

    // Edit description functionality
    const descEditToggle = document.getElementById('descEditToggle');
    const descView = document.getElementById('descView');
    const descEditForm = document.getElementById('descEditForm');
    const descInput = document.getElementById('descInput');
    const saveDescBtn = document.getElementById('saveDescBtn');
    const cancelDescBtn = document.getElementById('cancelDescBtn');

    if (descEditToggle) {
        descEditToggle.addEventListener('click', function() {
            descInput.value = descView.textContent;
            descEditForm.classList.add('active');
            descView.parentElement.classList.add('edit-mode');
        });

        saveDescBtn.addEventListener('click', function() {
            const newDesc = descInput.value.trim();
            updateAlbumField('description', newDesc, function(success, errorMessage) {
                if (success) {
                    descView.textContent = newDesc;
                    exitEditMode(descEditForm, descView.parentElement);
                } else {
                    showAlert(errorMessage || 'Error saving changes. Please try again.', 'error');
                }
            });
        });

        cancelDescBtn.addEventListener('click', function() {
            exitEditMode(descEditForm, descView.parentElement);
        });
    }

    function exitEditMode(editForm, parentElement) {
        editForm.classList.remove('active');
        parentElement.classList.remove('edit-mode');
    }

    function updateAlbumField(field, value, callback) {
        const pathParts = window.location.pathname.split('/');
        const albumId = pathParts[pathParts.length - 1];

        // Get CSRF info
        const csrfInfo = getCsrfInfo();

        // Prepare headers
        const headers = {
            'Content-Type': 'application/json'
        };

        // Add CSRF token to headers if available
        if (csrfInfo.token && csrfInfo.headerName) {
            headers[csrfInfo.headerName] = csrfInfo.token;
        }

        console.log('Sending request with headers:', headers);

        fetch(`/galleria/album/${albumId}/edit`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                field: field,
                value: value
            })
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (response.ok) {
                return response.json();
            }
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        })
        .then(data => {
            console.log('Response data:', data);
            if (data.success) {
                // Show success message
                showAlert('Changes saved successfully!', 'success');
                callback(true);
            } else {
                callback(false, data.message || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            callback(false, error.message);
        });
    }

    function showAlert(message, type) {
        // Remove any existing alerts first
        const existingAlerts = document.querySelectorAll('.edit-alert');
        existingAlerts.forEach(alert => alert.remove());

        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `edit-alert alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            <span>${message}</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Insert at the top of the container
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                const bsAlert = new bootstrap.Alert(alertDiv);
                bsAlert.close();
            }
        }, 5000);
    }

    // Debug: Log CSRF info
    const csrfInfo = getCsrfInfo();
    console.log('CSRF Token:', csrfInfo.token);
    console.log('CSRF Header Name:', csrfInfo.headerName);
});