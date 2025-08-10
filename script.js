document.addEventListener('DOMContentLoaded', function() {
    // Sparkle mouse trail
    document.addEventListener('mousemove', function(e) {
        let sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        document.body.appendChild(sparkle);

        sparkle.style.left = (e.pageX - 5) + 'px';
        sparkle.style.top = (e.pageY - 5) + 'px';

        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    });

    // Music Player
    const music = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');

    if (music && playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            if (music.paused) {
                music.play();
                playPauseBtn.textContent = '🎵 PAUSE MUSIC';
            } else {
                music.pause();
                playPauseBtn.textContent = '🎵 PLAY MUSIC';
            }
        });
    }
});
