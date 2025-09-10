// Advanced Animations for Wedding Invitation
document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for staggered animations
                if (entry.target.classList.contains('stagger-parent')) {
                    animateStaggeredChildren(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
        '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .stagger-parent, .rotate-in'
    );
    animatableElements.forEach(el => observer.observe(el));
    
    // Staggered animation for children
    function animateStaggeredChildren(parent) {
        const children = parent.querySelectorAll('.stagger-item');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('animate-in');
            }, index * 150);
        });
    }
    
    // Parallax effect for hero section
    function initParallax() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Floating animation for decorative elements
    function initFloatingElements() {
        const floatingElements = document.querySelectorAll('.float-animation');
        floatingElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.5}s`;
        });
    }
    
    // Hearts floating animation
    function createFloatingHearts() {
        const heartsContainer = document.createElement('div');
        heartsContainer.className = 'floating-hearts-container';
        document.body.appendChild(heartsContainer);
        
        setInterval(() => {
            createHeart(heartsContainer);
        }, 3000);
    }
    
    function createHeart(container) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '&#127807';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }
    
    // Typewriter effect for quotes
    function initTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            if (element.dataset.typewriterProcessed) return; // Evitar procesamiento múltiple
            element.dataset.typewriterProcessed = 'true';
            
            const text = element.textContent.trim();
            element.textContent = '';
            element.style.borderRight = '2px solid #c5a47e';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 500);
                }
            }, 50); // Más rápido
        });
    }
    
    // Magical sparkle effect
    function createSparkleEffect(element) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * element.offsetWidth + 'px';
        sparkle.style.top = Math.random() * element.offsetHeight + 'px';
        element.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
    
    // Add sparkle effect to hero content
    function initSparkleEffect() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            setInterval(() => {
                createSparkleEffect(heroContent);
            }, 2000);
        }
    }
    
    // Smooth scroll for navigation links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Initialize all animations
    initParallax();
    initFloatingElements();
    createFloatingHearts();
    initSparkleEffect();
    initSmoothScroll();
    
    // Delay typewriter effect until elements are visible
    setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initTypewriterEffect();
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.typewriter').forEach(el => observer.observe(el));
    }, 1000);
});
