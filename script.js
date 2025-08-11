document.addEventListener('DOMContentLoaded', function() {
    // "Welcome!" Popup
    // alert("WELCOME 2 JMKOD.ES!! UR THE 1337th VISITOR!!1!");

    // Sparkle mouse trail
    document.addEventListener('mousemove', function(e) {
        let sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        document.body.appendChild(sparkle);

        // This requires a .sparkle class in CSS, e.g., to make it a small, positioned square.
        // Let's assume .sparkle { position: absolute; width: 10px; height: 10px; background: red; z-index: 9999; }
        // For the effect to be visible, you would need to add styling for .sparkle in your CSS.
        sparkle.style.position = 'absolute';
        sparkle.style.width = '10px';
        sparkle.style.height = '10px';
        sparkle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
        sparkle.style.borderRadius = '50%';
        sparkle.style.zIndex = '9999';
        sparkle.style.pointerEvents = 'none';

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

// Clicky Sound Effects
const clickSound = document.getElementById('click-sound');
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if(clickSound) {
            clickSound.currentTime = 0; // Rewind to the start
            clickSound.play();
        }
    });
});

// Matrix Digital Rain
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()';
const fontSize = 16;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff00'; // Green text
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 33);


// Konami Code Easter Egg
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            konamiIndex = 0; // Reset for next time
            document.body.style.transition = 'transform 1s';
            document.body.style.transform = document.body.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    } else {
        konamiIndex = 0; // Wrong key, reset
    }
});