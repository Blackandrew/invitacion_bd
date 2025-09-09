// Enhanced Music Player with Visualizer
class EnhancedMusicPlayer {
    constructor() {
        this.playlist = [
            {
                title: 'Wildes',
                artist: 'Artista Romántico',
                src: 'audio/Wildes.mp3'
            },
            {
                title: 'Tu Lo Tienes Todo',
                artist: 'Canción de Amor',
                src: 'audio/tu_lo_tienen_todo.mp3'
            }
        ];
        
        this.currentTrack = 0;
        this.isPlaying = false;
        this.audio = null;
        this.canvas = null;
        this.ctx = null;
        this.analyser = null;
        this.audioContext = null;
        this.source = null;
        this.dataArray = null;
        this.player = null;
        
        this.init();
    }
    
    init() {
        this.createEnhancedPlayer();
        this.setupAudioContext();
        this.setupEventListeners();
        this.createVisualizer();
    }
    
    createEnhancedPlayer() {
        // Remove existing music player
        const existingPlayer = document.querySelector('.music-player');
        if (existingPlayer) {
            existingPlayer.remove();
        }
        
        this.player = document.createElement('div');
        this.player.className = 'enhanced-music-player';
        this.player.innerHTML = `
            <div class="player-container">
                <div class="player-toggle">
                    <button class="toggle-player-btn">
                        <i class="fas fa-music"></i>
                    </button>
                </div>
                
                <div class="player-content">
                    <div class="visualizer-container">
                        <canvas class="audio-visualizer" width="200" height="60"></canvas>
                    </div>
                    
                    <div class="track-info">
                        <div class="track-title">${this.playlist[0].title}</div>
                        <div class="track-artist">${this.playlist[0].artist}</div>
                    </div>
                    
                    <div class="player-controls">
                        <button class="prev-track" aria-label="Canción anterior">
                            <i class="fas fa-step-backward"></i>
                        </button>
                        <button class="play-pause" aria-label="Reproducir/Pausar">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="next-track" aria-label="Siguiente canción">
                            <i class="fas fa-step-forward"></i>
                        </button>
                    </div>
                    
                    <div class="progress-container">
                        <span class="time-current">0:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                            <div class="progress-handle"></div>
                        </div>
                        <span class="time-duration">0:00</span>
                    </div>
                    
                    <div class="volume-container">
                        <i class="fas fa-volume-up"></i>
                        <input type="range" class="volume-slider" min="0" max="100" value="70">
                    </div>
                    
                    <div class="playlist-container">
                        <button class="playlist-toggle">
                            <i class="fas fa-list"></i>
                        </button>
                        <div class="playlist">
                            ${this.playlist.map((track, index) => `
                                <div class="playlist-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                                    <div class="track-number">${index + 1}</div>
                                    <div class="track-details">
                                        <div class="track-name">${track.title}</div>
                                        <div class="track-artist-small">${track.artist}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <audio preload="auto" loop>
                <source src="${this.playlist[0].src}" type="audio/mp3">
                Tu navegador no soporta el elemento de audio.
            </audio>
        `;
        
        document.body.appendChild(this.player);
        this.audio = this.player.querySelector('audio');
        this.canvas = this.player.querySelector('.audio-visualizer');
        this.ctx = this.canvas.getContext('2d');
    }
    
    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            
            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        } catch (error) {
            console.log('Web Audio API not supported');
        }
    }
    
    setupEventListeners() {
        // Player toggle
        this.player.querySelector('.toggle-player-btn').addEventListener('click', () => {
            this.togglePlayer();
        });
        
        // Play/pause
        this.player.querySelector('.play-pause').addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        // Previous/next track
        this.player.querySelector('.prev-track').addEventListener('click', () => {
            this.previousTrack();
        });
        
        this.player.querySelector('.next-track').addEventListener('click', () => {
            this.nextTrack();
        });
        
        // Progress bar
        const progressBar = this.player.querySelector('.progress-bar');
        progressBar.addEventListener('click', (e) => {
            this.seekTo(e);
        });
        
        // Volume control
        const volumeSlider = this.player.querySelector('.volume-slider');
        volumeSlider.addEventListener('input', (e) => {
            this.setVolume(e.target.value);
        });
        
        // Playlist toggle
        this.player.querySelector('.playlist-toggle').addEventListener('click', () => {
            this.togglePlaylist();
        });
        
        // Playlist items
        this.player.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                this.playTrack(parseInt(item.dataset.index));
            });
        });
        
        // Audio events
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });
        
        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });
        
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });
        
        // Enable audio on user interaction
        document.body.addEventListener('click', () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
    }
    
    createVisualizer() {
        if (!this.analyser) return;
        
        const draw = () => {
            requestAnimationFrame(draw);
            
            if (!this.isPlaying) {
                this.drawStaticVisualizer();
                return;
            }
            
            this.analyser.getByteFrequencyData(this.dataArray);
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            const barWidth = this.canvas.width / this.dataArray.length * 2;
            let x = 0;
            
            for (let i = 0; i < this.dataArray.length; i++) {
                const barHeight = (this.dataArray[i] / 255) * this.canvas.height * 0.8;
                
                const gradient = this.ctx.createLinearGradient(0, this.canvas.height, 0, this.canvas.height - barHeight);
                gradient.addColorStop(0, '#8B9A7A');
                gradient.addColorStop(1, '#D4C79B');
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
        };
        
        draw();
    }
    
    drawStaticVisualizer() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const barCount = 32;
        const barWidth = this.canvas.width / barCount;
        
        for (let i = 0; i < barCount; i++) {
            const barHeight = Math.random() * 20 + 5;
            
            this.ctx.fillStyle = `rgba(139, 154, 122, ${0.3 + Math.random() * 0.4})`;
            this.ctx.fillRect(i * barWidth, this.canvas.height - barHeight, barWidth - 1, barHeight);
        }
    }
    
    togglePlayer() {
        this.player.classList.toggle('expanded');
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.updatePlayButton();
            }).catch(error => {
                console.log('Play was prevented');
            });
        }
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }
    
    updatePlayButton() {
        const playBtn = this.player.querySelector('.play-pause i');
        if (this.isPlaying) {
            playBtn.className = 'fas fa-pause';
        } else {
            playBtn.className = 'fas fa-play';
        }
    }
    
    previousTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack();
    }
    
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadTrack();
    }
    
    playTrack(index) {
        this.currentTrack = index;
        this.loadTrack();
        this.play();
    }
    
    loadTrack() {
        const track = this.playlist[this.currentTrack];
        this.audio.src = track.src;
        
        // Update track info
        this.player.querySelector('.track-title').textContent = track.title;
        this.player.querySelector('.track-artist').textContent = track.artist;
        
        // Update playlist
        this.player.querySelectorAll('.playlist-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentTrack);
        });
    }
    
    seekTo(e) {
        const progressBar = e.currentTarget;
        const clickX = e.offsetX;
        const width = progressBar.offsetWidth;
        const duration = this.audio.duration;
        
        if (duration) {
            this.audio.currentTime = (clickX / width) * duration;
        }
    }
    
    updateProgress() {
        const current = this.audio.currentTime;
        const duration = this.audio.duration;
        
        if (duration) {
            const progressPercent = (current / duration) * 100;
            this.player.querySelector('.progress-fill').style.width = `${progressPercent}%`;
            this.player.querySelector('.progress-handle').style.left = `${progressPercent}%`;
        }
        
        this.player.querySelector('.time-current').textContent = this.formatTime(current);
    }
    
    updateDuration() {
        const duration = this.audio.duration;
        this.player.querySelector('.time-duration').textContent = this.formatTime(duration);
    }
    
    setVolume(value) {
        this.audio.volume = value / 100;
    }
    
    togglePlaylist() {
        this.player.classList.toggle('playlist-open');
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize enhanced music player
document.addEventListener('DOMContentLoaded', () => {
    // Wait for page to load
    setTimeout(() => {
        new EnhancedMusicPlayer();
    }, 1500);
});
