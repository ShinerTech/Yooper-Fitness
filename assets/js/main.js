/**
 * Yooper Fitness - Modern Theme JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });

        // Close menu when clicking or tapping outside
        const closeMenu = (event) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        };

        document.addEventListener('click', closeMenu);
        document.addEventListener('touchstart', closeMenu);
    }

    // Hero Slideshow
    // Hero Slideshow
    const slides = document.querySelectorAll('.hero-slider img');
    if (slides.length > 0) {
        let current = 0;
        const nextHeroSlide = () => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        };
        setInterval(nextHeroSlide, 5000);
    }

    // Testimonial Slider
    const slider = document.querySelector('.testimonial-slider');
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');

    if (slider && track && cards.length > 0) {
        let currentIndex = 0;
        let visibleCards = getVisibleCards();
        const totalCards = cards.length;

        function getVisibleCards() {
            if (window.innerWidth >= 992) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }

        // Create dots
        const createDots = () => {
            dotsContainer.innerHTML = '';
            const dotCount = Math.ceil(totalCards / visibleCards);
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        };

        const updateSlider = () => {
            if (!cards[0]) return;
            const cardWidth = cards[0].offsetWidth;
            const gap = 32; // 2rem = 32px
            const offset = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${offset}px)`;

            // Update dots
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === Math.floor(currentIndex / visibleCards));
            });
        };

        const goToSlide = (index) => {
            currentIndex = index * visibleCards;
            updateSlider();
        };

        const nextSlide = () => {
            const maxIndex = totalCards - visibleCards;
            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex = Math.min(currentIndex + visibleCards, maxIndex);
            }
            updateSlider();
        };

        const prevSlide = () => {
            if (currentIndex <= 0) {
                currentIndex = Math.max(0, totalCards - visibleCards);
            } else {
                currentIndex = Math.max(currentIndex - visibleCards, 0);
            }
            updateSlider();
        };

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto-slide
        let interval = setInterval(nextSlide, 6000);

        slider.addEventListener('mouseenter', () => clearInterval(interval));
        slider.addEventListener('mouseleave', () => interval = setInterval(nextSlide, 6000));

        // Resize handling with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newVisible = getVisibleCards();
                if (newVisible !== visibleCards) {
                    visibleCards = newVisible;
                    currentIndex = 0;
                    createDots();
                }
                updateSlider();
            }, 150);
        });

        createDots();
        updateSlider();
    }
});

