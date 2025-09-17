// Love Story Timeline
class LoveTimeline {
    constructor() {
        this.timelineData = [
            {
                year: '2015',
                title: 'Nuestro Primer Encuentro',
                description: 'El destino nos unió en el momento perfecto, cuando menos lo esperábamos.',
                icon: '💫',
                image: './imagen_timeline/primer_encuentro.jpg',
                side: 'left'
            },
            {
                year: '2021',
                title: 'Primera Cita',
                description: 'Una tarde mágica que marcó el inicio de nuestra hermosa historia de amor.',
                icon: '❤️',
                image: './imagen_timeline/primer_cita2.jpg',
                side: 'right'
            },
            {
                year: '2022',
                title: 'Oficialmente Novios',
                description: 'Decidimos caminar juntos hacia el futuro, unidos por el amor verdadero.',
                icon: '💍',
                image: './imagen_timeline/novios3.JPG',
                side: 'left'
            },
            {
                year: '2025',
                title: 'Nuestra Boda',
                description: '¡El día que tanto hemos esperado! Celebraremos nuestro amor eterno.',
                icon: '💒',
                image: './imagen_timeline/gran_dia.jpg',
                side: 'right',
                isSpecial: true
            }
        ];
        
        this.currentIndex = 0;
        this.init();
    }
    
    init() {
        this.createTimeline();
        this.setupScrollAnimation();
        this.setupInteractivity();
    }
    
    createTimeline() {
        const timelineSection = document.createElement('section');
        timelineSection.className = 'love-timeline-section fade-in-up';
        timelineSection.innerHTML = `
          
            <div class="timeline-header">
                <h2 class="section-title shimmer-text">Nuestra Historia de Amor</h2>
                <p class="section-subtitle fade-in-up">Cada momento nos ha llevado hasta aquí</p>
            </div>
            
            <div class="timeline-container">
                <div class="timeline-line"></div>
                <div class="timeline-progress"></div>
                
                ${this.timelineData.map((item, index) => this.createTimelineItem(item, index)).join('')}
            </div>
            
        `;
        
        // Insert after the sponsors section
        const sponsorsSection = document.querySelector('.sponsors-section2');
        if (sponsorsSection) {
            sponsorsSection.parentNode.insertBefore(timelineSection, sponsorsSection.nextSibling);
        } else {
            // Fallback: insert before event sections
            const eventSection = document.querySelector('.event-section');
            if (eventSection) {
                eventSection.parentNode.insertBefore(timelineSection, eventSection);
            }
        }
    }
    
    createTimelineItem(item, index) {
        return `
            <div class="timeline-item ${item.side} ${item.isSpecial ? 'special' : ''}" data-index="${index}">
                <div class="timeline-dot-container">
                    <div class="timeline-dot-main">
                        <span class="timeline-icon">${item.icon}</span>
                    </div>
                </div>
                
                <div class="timeline-content">
                    <div class="timeline-card enhanced-hover">
                        <div class="timeline-image">
                            <img src="${item.image}" alt="${item.title}" loading="lazy">
                            <div class="image-overlay-timeline">
                                <div class="timeline-year">${item.year}</div>
                            </div>
                        </div>
                        
                        <div class="timeline-text">
                            <h3 class="timeline-title">${item.title}</h3>
                            <p class="timeline-description">${item.description}</p>
                            
                            ${item.isSpecial ? `
                                <div class="special-badge">
                                    <span>¡El Gran Día!</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupScrollAnimation() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineProgress = document.querySelector('.timeline-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Update progress line
                    const index = parseInt(entry.target.dataset.index);
                    const progress = ((index + 1) / this.timelineData.length) * 100;
                    timelineProgress.style.height = `${progress}%`;
                    
                    // Update navigation
                    this.updateNavigation(index);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });
        
        timelineItems.forEach(item => observer.observe(item));
    }
    
    setupInteractivity() {
        // Navigation removed
        
        // Card hover effects
        const timelineCards = document.querySelectorAll('.timeline-card');
        timelineCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hovered');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hovered');
            });
        });
        
        // Image click for modal (if gallery exists)
        const timelineImages = document.querySelectorAll('.timeline-image img');
        timelineImages.forEach(img => {
            img.addEventListener('click', () => {
                // Create a simple image modal for timeline
                this.openImageModal(img.src, img.alt);
            });
        });
    }
    
    navigateTimeline(direction) {
        this.currentIndex += direction;
        this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.timelineData.length - 1));
        this.scrollToTimelineItem(this.currentIndex);
    }
    
    scrollToTimelineItem(index) {
        const item = document.querySelector(`.timeline-item[data-index="${index}"]`);
        if (item) {
            item.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            this.updateNavigation(index);
        }
    }
    
    updateNavigation(index) {
        this.currentIndex = index;
        
        // Update dots
        document.querySelectorAll('.timeline-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Update button states
        const prevBtn = document.querySelector('.prev-timeline');
        const nextBtn = document.querySelector('.next-timeline');
        
        prevBtn.style.opacity = index === 0 ? '0.5' : '1';
        nextBtn.style.opacity = index === this.timelineData.length - 1 ? '0.5' : '1';
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === this.timelineData.length - 1;
    }
    
    openImageModal(src, alt) {
        const modal = document.createElement('div');
        modal.className = 'simple-image-modal';
        modal.innerHTML = `
            <div class="simple-modal-overlay">
                <div class="simple-modal-content">
                    <button class="simple-modal-close">&times;</button>
                    <img src="${src}" alt="${alt}">
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal events
        modal.querySelector('.simple-modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.simple-modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modal.remove();
            }
        });
        
        // Keyboard close
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }
}

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other components to load
    setTimeout(() => {
        new LoveTimeline();
    }, 500);
});
