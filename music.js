document.addEventListener('DOMContentLoaded', function() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const music = document.getElementById('bgMusic');
    const playIcon = playPauseBtn.querySelector('i');
    
    // Try to play music on user interaction (required by most browsers)
    function enableAudio() {
        if (music.paused) {
            const playPromise = music.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Auto-play was prevented. User interaction required.");
                });
            }
        }
    }
    
    // Toggle play/pause
    function togglePlayPause() {
        if (music.paused) {
            const playPromise = music.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    playIcon.classList.remove('fa-play');
                    playIcon.classList.add('fa-pause');
                    playPauseBtn.classList.add('playing');
                }).catch(error => {
                    console.log("Play was prevented.");
                });
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
});
