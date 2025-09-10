// Elegant Preloader for Wedding Invitation
class WeddingPreloader {
    constructor() {
        this.preloader = null;
        this.progress = 0;
        this.targetProgress = 0;
        this.init();
    }
    
    init() {
        this.createPreloader();
        this.simulateLoading();
        this.checkRealLoading();
    }
    
    createPreloader() {
        this.preloader = document.createElement('div');
        this.preloader.className = 'wedding-preloader';
        this.preloader.innerHTML = `
            <div class="preloader-content">
                <!-- Removed flower animation -->
                
                <div class="loading-text">
                    <h2 class="couple-names">
                        <span class="name-bertha">Bertha</span>
                        <span class="ampersand">&</span>
                        <span class="name-marlon">Marlon</span>
                    </h2>
                    <p class="loading-message">Preparando nuestra invitación especial...</p>
                </div>
                
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <span class="progress-text">0%</span>
                </div>
                
                <!-- Removed floating hearts -->
            </div>
        `;
        
        // Insert at the beginning of body
        document.body.insertBefore(this.preloader, document.body.firstChild);
    }
    
    simulateLoading() {
        const messages = [
            'Preparando nuestra invitación especial...',
            'Cargando momentos especiales...',
            'Organizando los detalles de nuestra boda...',
            'Casi listo para mostrar nuestro amor...'
        ];
        
        let messageIndex = 0;
        const messageElement = this.preloader.querySelector('.loading-message');
        
        const updateProgress = () => {
            if (this.progress < this.targetProgress) {
                this.progress += Math.random() * 2 + 0.5;
                this.progress = Math.min(this.progress, this.targetProgress);
                
                this.updateProgressBar(this.progress);
                
                // Change message at certain progress points
                const newMessageIndex = Math.floor(this.progress / 25);
                if (newMessageIndex !== messageIndex && newMessageIndex < messages.length) {
                    messageIndex = newMessageIndex;
                    this.fadeInNewMessage(messageElement, messages[messageIndex]);
                }
                
                requestAnimationFrame(updateProgress);
            }
        };
        
        // Simulate loading stages
        setTimeout(() => { this.targetProgress = 25; updateProgress(); }, 500);
        setTimeout(() => { this.targetProgress = 50; }, 1500);
        setTimeout(() => { this.targetProgress = 75; }, 2500);
        setTimeout(() => { this.targetProgress = 90; }, 3500);
    }
    
    fadeInNewMessage(element, newText) {
        element.style.opacity = '0';
        setTimeout(() => {
            element.textContent = newText;
            element.style.opacity = '1';
        }, 300);
    }
    
    updateProgressBar(progress) {
        const progressFill = this.preloader.querySelector('.progress-fill');
        const progressText = this.preloader.querySelector('.progress-text');
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
        
        // Add color transition based on progress
        if (progress < 30) {
            progressFill.style.background = 'linear-gradient(90deg, #ff6b6b, #feca57)';
        } else if (progress < 70) {
            progressFill.style.background = 'linear-gradient(90deg, #feca57, #48cae4)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #48cae4, #06ffa5)';
        }
    }
    
    checkRealLoading() {
        // Check if all critical resources are loaded
        const checkLoaded = () => {
            const images = document.querySelectorAll('img');
            const fonts = document.fonts;
            
            Promise.all([
                this.checkImagesLoaded(images),
                fonts.ready
            ]).then(() => {
                this.targetProgress = 100;
                setTimeout(() => {
                    this.completeLoading();
                }, 1000);
            });
        };
        
        if (document.readyState === 'complete') {
            checkLoaded();
        } else {
            window.addEventListener('load', checkLoaded);
        }
    }
    
    checkImagesLoaded(images) {
        return Promise.all(Array.from(images).map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = resolve;
                    img.onerror = resolve; // Resolve even on error to continue
                }
            });
        }));
    }
    
    completeLoading() {
        this.updateProgressBar(100);
        
        setTimeout(() => {
            this.preloader.classList.add('fade-out');
            
            setTimeout(() => {
                this.preloader.remove();
                document.body.classList.add('loaded');
                
                // Trigger entrance animations
                this.triggerEntranceAnimations();
            }, 800);
        }, 500);
    }
    
    triggerEntranceAnimations() {
        // Add entrance animations to main elements
        const heroContent = document.querySelector('.hero-content');
        const guestFinder = document.querySelector('#guest-finder');
        
        if (heroContent) {
            heroContent.classList.add('entrance-animation');
        }
        
        if (guestFinder) {
            guestFinder.classList.add('entrance-animation');
        }
        
        // Stagger animation for other elements
        const elements = document.querySelectorAll('.fade-in-up, .scale-in');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-in');
            }, index * 100);
        });
    }
}

// Initialize preloader immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new WeddingPreloader();
    });
} else {
    new WeddingPreloader();
}
