// Flower Petals Particle System
class FlowerPetals {
    constructor() {
        this.container = null;
        this.petals = [];
        this.isRunning = false;
        this.init();
    }
    
    init() {
        this.createContainer();
        this.startAnimation();
        this.handleVisibilityChange();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'flower-petals';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        document.body.appendChild(this.container);
    }
    
    createPetal() {
        const petal = document.createElement('div');
        const colors = ['#ffb6c1', '#ff69b4', '#ffc0cb', '#f0e68c', '#dda0dd'];
        const shapes = ['🌸', '🌺', '🌼', '🌻', '🌷'];
        
        // Random properties
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const size = Math.random() * 15 + 10;
        const duration = Math.random() * 8 + 5;
        const delay = Math.random() * 2;
        const horizontalMovement = Math.random() * 100 - 50;
        
        petal.textContent = shape;
        petal.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: -20px;
            font-size: ${size}px;
            animation: petalFall ${duration}s linear infinite;
            animation-delay: ${delay}s;
            opacity: ${Math.random() * 0.7 + 0.3};
            transform-origin: center;
        `;
        
        // Add CSS animation keyframes dynamically
        const keyframes = `
            @keyframes petalFall {
                0% {
                    transform: translateY(-20px) rotateZ(0deg) translateX(0px);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotateZ(360deg) translateX(${horizontalMovement}px);
                    opacity: 0;
                }
            }
        `;
        
        this.container.appendChild(petal);
        
        // Remove petal after animation
        setTimeout(() => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
            }
        }, (duration + delay) * 1000);
        
        return petal;
    }
    
    startAnimation() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        const createPetalInterval = () => {
            if (this.isRunning) {
                this.createPetal();
                setTimeout(createPetalInterval, Math.random() * 2000 + 1000);
            }
        };
        
        createPetalInterval();
    }
    
    stopAnimation() {
        this.isRunning = false;
    }
    
    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else {
                this.startAnimation();
            }
        });
    }
    
    destroy() {
        this.stopAnimation();
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// Enhanced Background Particles
class BackgroundParticles {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.createParticles();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.3;
        `;
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    createParticles() {
        const particleCount = Math.min(50, window.innerWidth / 20);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: `hsl(${Math.random() * 60 + 40}, 50%, 70%)`
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.01;
                particle.vy -= (dy / distance) * force * 0.01;
            }
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
            
            // Draw connections
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = particle.color;
                    this.ctx.globalAlpha = (150 - distance) / 150 * 0.3;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a delay to ensure the page is fully loaded
    setTimeout(() => {
        new FlowerPetals();
        
        // Only initialize background particles on desktop for performance
        if (window.innerWidth > 768) {
            new BackgroundParticles();
        }
    }, 1000);
});
