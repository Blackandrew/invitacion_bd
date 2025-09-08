document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.image-row');
    const slides = document.querySelectorAll('.image-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    let slideCount = slides.length;
    let visibleSlides = getVisibleSlides();
    let slideWidth = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    // Set initial position
    function updateSlider() {
        visibleSlides = getVisibleSlides();
        slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(slider).gap || '15');
        const maxSlide = Math.max(0, slideCount - visibleSlides);
        currentSlide = Math.min(Math.max(0, currentSlide), maxSlide);
        
        currentTranslate = -currentSlide * slideWidth;
        slider.style.transform = `translateX(${currentTranslate}px)`;
        
        // Update button states
        updateButtons();
    }
    
    function updateButtons() {
        const maxSlide = Math.max(0, slideCount - visibleSlides);
        prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentSlide >= maxSlide ? '0.5' : '1';
        prevBtn.style.pointerEvents = currentSlide === 0 ? 'none' : 'all';
        nextBtn.style.pointerEvents = currentSlide >= maxSlide ? 'none' : 'all';
    }
    
    function getVisibleSlides() {
        if (window.innerWidth <= 640) return 1;  // Mobile: show 1 slide
        if (window.innerWidth <= 1023) return 2; // Tablet: show 2 slides
        return 3;  // Desktop: show 3 slides
    }
    
    // Next slide
    function nextSlide() {
        const maxSlide = Math.max(0, slideCount - visibleSlides);
        if (currentSlide < maxSlide) {
            currentSlide++;
            updateSlider();
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    }
    
    // Touch event handlers
    function touchStart(e) {
        isDragging = true;
        startPos = e.type === 'mousedown' ? e.pageX : e.touches[0].clientX;
        slider.style.cursor = 'grabbing';
        slider.style.transition = 'transform 0.2s ease-out';
        slider.style.willChange = 'transform';
    }
    
    function touchMove(e) {
        if (!isDragging) return;
        const currentPosition = e.type === 'mousemove' ? e.pageX : e.touches[0].clientX;
        const diff = currentPosition - startPos;
        
        // Prevent scrolling when swiping
        if (Math.abs(diff) > 5) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        currentTranslate = prevTranslate + diff;
        slider.style.transform = `translateX(${currentTranslate}px)`;
        
        // Add resistance effect
        const maxTranslate = 0;
        const minTranslate = -(slideCount - visibleSlides) * slideWidth;
        
        if (currentTranslate > maxTranslate + 50 || currentTranslate < minTranslate - 50) {
            currentTranslate = prevTranslate + (diff * 0.3);
        }
    }
    
    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        slider.style.cursor = 'grab';
        slider.style.transition = 'transform 0.5s ease';
        
        const threshold = slideWidth * 0.2;
        const draggedSlides = Math.round(-currentTranslate / slideWidth);
        
        currentSlide = Math.max(0, Math.min(draggedSlides, slideCount - visibleSlides));
        currentTranslate = -currentSlide * slideWidth;
        slider.style.transform = `translateX(${currentTranslate}px)`;
        
        updateButtons();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Mouse events for desktop
    slider.addEventListener('mousedown', touchStart);
    window.addEventListener('mousemove', touchMove);
    window.addEventListener('mouseup', touchEnd);
    
    // Touch events for mobile
    slider.addEventListener('touchstart', touchStart, { passive: true });
    window.addEventListener('touchmove', touchMove, { passive: false });
    window.addEventListener('touchend', touchEnd);
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSlider();
        }, 250);
    });
    
    // Prevent context menu on slider
    slider.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    slider.addEventListener('mouseleave', touchEnd);
    
    // Prevent image drag
    document.querySelectorAll('.image-container img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateSlider();
        }, 250);
    });
    
    // Initialize
    updateSlider();
});
