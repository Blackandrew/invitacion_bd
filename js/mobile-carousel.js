/**
 * Mobile Carousel Component
 * Handles touch/swipe gestures and navigation for mobile image carousel
 */

class MobileCarousel {
    constructor(selector) {
        this.carousel = document.querySelector(selector);
        if (!this.carousel) return;
        
        this.track = this.carousel.querySelector('.carousel-track');
        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.prevBtn = this.carousel.querySelector('.carousel-btn-prev');
        this.nextBtn = this.carousel.querySelector('.carousel-btn-next');
        // Dots removed - no longer needed
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isTransitioning = false;
        
        // Touch/swipe properties
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.threshold = 50; // Minimum distance for swipe
        
        this.init();
    }
    
    init() {
        if (!this.track || this.totalSlides === 0) return;
        
        this.setupEventListeners();
        this.updateCarousel();
        
        // Auto-play functionality (optional)
        this.startAutoPlay();
    }
    
    setupEventListeners() {
        // Button navigation
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Dot navigation removed - no longer needed
        
        // Touch events for swipe functionality
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Mouse events for desktop testing
        this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.track.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.track.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // Prevent context menu on long press
        this.track.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Pause auto-play on interaction
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        this.carousel.addEventListener('touchstart', () => this.pauseAutoPlay());
    }
    
    // Touch event handlers
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
        this.pauseAutoPlay();
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        this.currentX = e.touches[0].clientX;
        const diffX = this.startX - this.currentX;
        
        // Prevent default scrolling if horizontal swipe is detected
        if (Math.abs(diffX) > 10) {
            e.preventDefault();
        }
    }
    
    handleTouchEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const diffX = this.startX - this.currentX;
        
        if (Math.abs(diffX) > this.threshold) {
            if (diffX > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
        
        this.startAutoPlay();
    }
    
    // Mouse event handlers (for desktop testing)
    handleMouseDown(e) {
        this.startX = e.clientX;
        this.isDragging = true;
        this.track.style.cursor = 'grabbing';
        e.preventDefault();
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.clientX;
    }
    
    handleMouseUp(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.track.style.cursor = 'grab';
        
        const diffX = this.startX - this.currentX;
        
        if (Math.abs(diffX) > this.threshold) {
            if (diffX > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    // Navigation methods
    nextSlide() {
        if (this.isTransitioning) return;
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }
    
    prevSlide() {
        if (this.isTransitioning) return;
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    updateCarousel() {
        if (!this.track) return;
        
        this.isTransitioning = true;
        
        // Move the track
        const translateX = -this.currentSlide * (100 / this.totalSlides);
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update active states
        this.updateActiveStates();
        
        // Reset transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    updateActiveStates() {
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        // Dots removed - no longer needed
    }
    
    // Auto-play functionality
    startAutoPlay() {
        this.pauseAutoPlay(); // Clear any existing interval
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000); // Change slide every 4 seconds
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    // Public methods for external control
    destroy() {
        this.pauseAutoPlay();
        // Remove event listeners if needed
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on mobile devices or small screens
    const initCarousel = () => {
        if (window.innerWidth <= 768) {
            if (!window.mobileCarousel) {
                window.mobileCarousel = new MobileCarousel('.mobile-carousel');
            }
        } else {
            // Destroy carousel on desktop
            if (window.mobileCarousel) {
                window.mobileCarousel.destroy();
                window.mobileCarousel = null;
            }
        }
    };
    
    // Initialize on load
    initCarousel();
    
    // Re-initialize on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initCarousel, 250);
    });
});
