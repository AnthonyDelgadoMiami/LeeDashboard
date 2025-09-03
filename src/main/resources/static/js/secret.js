document.addEventListener('DOMContentLoaded', function() {
    // Create more floating hearts
    function createHearts() {
        const container = document.querySelector('.container');
        for (let i = 0; i < 8; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '❤';
            heart.style.left = Math.random() * 90 + 5 + '%';
            heart.style.top = Math.random() * 90 + 5 + '%';
            heart.style.animationDelay = Math.random() * 5 + 's';
            heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
            container.appendChild(heart);
        }
    }

    // Create more fireflies
    function createFireflies() {
        const container = document.querySelector('.container');
        for (let i = 0; i < 5; i++) {
            const firefly = document.createElement('div');
            firefly.classList.add('firefly');
            firefly.style.left = Math.random() * 90 + 5 + '%';
            firefly.style.top = Math.random() * 90 + 5 + '%';
            firefly.style.animationDelay = Math.random() * 5 + 's';
            container.appendChild(firefly);
        }
    }

    // Initialize animations
    createHearts();
    createFireflies();

    // Text animation
    const romanticText = document.querySelector('.romantic-text');
    romanticText.style.opacity = 0;
    romanticText.style.transform = 'translateY(20px)';

    setTimeout(() => {
        romanticText.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
        romanticText.style.opacity = 1;
        romanticText.style.transform = 'translateY(0)';
    }, 500);
});