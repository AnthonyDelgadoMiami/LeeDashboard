class AlbumUploader {
    constructor() {
        this.files = [];
        this.initElements();
        this.setupEventListeners();
    }

    initElements() {
        this.imageInput = document.getElementById('imageInput');
        this.addImagesBtn = document.getElementById('addImagesBtn');
        this.imagePreviews = document.getElementById('imagePreviews');
        this.albumForm = document.getElementById('albumForm');
    }

    setupEventListeners() {
        this.imageInput.addEventListener('change', () => this.handleFileSelection());
        this.addImagesBtn.addEventListener('click', () => this.imageInput.click());
        this.albumForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    handleFileSelection() {
        Array.from(this.imageInput.files).forEach(file => {
            this.files.push(file);
            this.createPreview(file);
        });
        this.imageInput.value = '';
    }

    createPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewDiv = document.createElement('div');
            previewDiv.className = 'image-preview';

            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-image';
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', () => this.removeImage(file, previewDiv));

            previewDiv.appendChild(img);
            previewDiv.appendChild(removeBtn);
            this.imagePreviews.appendChild(previewDiv);
        };
        reader.readAsDataURL(file);
    }

    removeImage(file, previewDiv) {
        previewDiv.remove();
        this.files = this.files.filter(f => f.name !== file.name);
    }

    handleFormSubmit(e) {
        if (this.files.length === 0) {
            e.preventDefault();
            alert('Please add at least one image to the album');
            return;
        }

        // Create a new FormData object and append all files
        const formData = new FormData(this.albumForm);
        this.files.forEach(file => {
            formData.append('images', file);
        });

        // Submit the form with AJAX
        fetch(this.albumForm.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

        e.preventDefault(); // Prevent default form submission
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AlbumUploader();
});