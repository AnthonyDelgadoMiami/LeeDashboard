document.addEventListener('DOMContentLoaded', function() {
    // Create hamburger menu button
    const hamburgerMenu = document.createElement('button');
    hamburgerMenu.className = 'hamburger-menu';
    hamburgerMenu.innerHTML = '<span></span><span></span><span></span>';
    hamburgerMenu.setAttribute('aria-label', 'Toggle navigation menu');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';

    // Find the navbar and insert the hamburger button
    const navbar = document.querySelector('.navbar');
    const container = document.querySelector('.container-fluid');

    if (navbar && container) {
        container.appendChild(hamburgerMenu);
        document.body.appendChild(overlay);

        const navMenu = document.querySelector('.navbar-nav');

        // Toggle menu function
        function toggleMenu() {
            hamburgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            overlay.classList.toggle('active');

            // Prevent body scrolling when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }

        // Event listeners
        hamburgerMenu.addEventListener('click', toggleMenu);

        overlay.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 700 && navMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 700 && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    // Add touch feedback for mobile devices
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('touchstart', function() {
            this.classList.add('active');
        });

        link.addEventListener('touchend', function() {
            this.classList.remove('active');
        });
    });

    // Make navbar slightly transparent when scrolled
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(5px)';
        } else {
            navbar.style.backgroundColor = '';
            navbar.style.backdropFilter = '';
        }
    });
});