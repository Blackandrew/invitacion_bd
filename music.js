document.addEventListener('DOMContentLoaded', function() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const music = document.getElementById('bgMusic');
    const playIcon = playPauseBtn.querySelector('i');
    
    // Try to play music on user interaction (required by most browsers)
    function enableAudio() {
        if (music.paused) {
            // Check if audio can be loaded
            if (music.readyState >= 2) {
                const playPromise = music.play();
                
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Auto-play was prevented. User interaction required:", error);
                    });
                }
            } else {
                console.log("Audio not ready yet. Loading...");
                music.load(); // Force reload
            }
        }
    }
    
    // Toggle play/pause
    function togglePlayPause() {
        if (music.paused) {
            // Force load if not ready
            if (music.readyState < 2) {
                music.load();
                music.addEventListener('canplay', function() {
                    music.play().then(() => {
                        playIcon.classList.remove('fa-play');
                        playIcon.classList.add('fa-pause');
                        playPauseBtn.classList.add('playing');
                    }).catch(error => {
                        console.log("Play was prevented:", error);
                    });
                }, { once: true });
            } else {
                const playPromise = music.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        playIcon.classList.remove('fa-play');
                        playIcon.classList.add('fa-pause');
                        playPauseBtn.classList.add('playing');
                    }).catch(error => {
                        console.log("Play was prevented:", error);
                    });
                }
            }
        } else {
            music.pause();
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            playPauseBtn.classList.remove('playing');
        }
    }
    
    // Event listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // Try to enable audio on first user interaction with the page
    document.body.addEventListener('click', function enableAudioOnce() {
        enableAudio();
        document.body.removeEventListener('click', enableAudioOnce);
    }, { once: true });
    
    // Update button when song ends (though it's set to loop)
    music.addEventListener('ended', function() {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        playPauseBtn.classList.remove('playing');
    });
    
    // Handle audio errors
    music.addEventListener('error', function(e) {
        console.log("Audio error:", e);
        console.log("Error details:", music.error);
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        playPauseBtn.classList.remove('playing');
        
        // Mostrar mensaje de error en la consola
        if (music.error) {
            switch(music.error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                    console.error('La reproducción fue cancelada');
                    break;
                case MediaError.MEDIA_ERR_NETWORK:
                    console.error('Error de red al cargar el audio');
                    break;
                case MediaError.MEDIA_ERR_DECODE:
                    console.error('Error al decodificar el archivo de audio');
                    break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    console.error('Formato de audio no soportado');
                    break;
                default:
                    console.error('Error de reproducción desconocido');
            }
        }
    });
    
    // Handle loading events
    music.addEventListener('loadstart', function() {
        console.log("Started loading audio");
    });
    
    music.addEventListener('canplay', function() {
        console.log("Audio can start playing");
    });
    
    music.addEventListener('loadeddata', function() {
        console.log("Audio data loaded");
    });
});
