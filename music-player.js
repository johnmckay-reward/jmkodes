// --- 1. SETUP ---
const audio1 = document.getElementById('audio1');
const audio2 = document.getElementById('audio2');
const playPauseBtn = document.getElementById('play-pause-btn');

const songsDirectory = 'songs/';

// Add all your song file names to this list
const songs = [
    songsDirectory + 'one.mp3',
    songsDirectory + 'two.mp3',
    songsDirectory + 'three.mp3',
    songsDirectory + 'four.mp3',
    songsDirectory + 'five.mp3',
    songsDirectory + 'six.mp3',
    songsDirectory + 'seven.mp3',
    songsDirectory + 'eight.mp3',
    songsDirectory + 'nine.mp3',
];
// --- CONFIGURATION ---
const FADE_DURATION = 2; // How long to fade in/out (in seconds)

// --- STATE MANAGEMENT ---
let shuffledPlaylist = [...songs];
let currentTrackIndex = 0;
let activeAudio = audio1; // The player that is currently or will be playing
let inactiveAudio = audio2; // The player that is waiting
let isFading = false;
let isPlaying = false;


// --- 2. HELPER FUNCTIONS ---

// The Fisher-Yates Shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to smoothly fade volume with clamping to prevent errors
function fadeVolume(audioElement, to, duration, onComplete) {
    const from = audioElement.volume;
    const steps = duration * 20;
    const stepValue = (to - from) / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
        if (currentStep >= steps) {
            clearInterval(fadeInterval);
            audioElement.volume = to;
            if (onComplete) onComplete();
            return;
        }
        let newVolume = audioElement.volume + stepValue;
        audioElement.volume = Math.max(0, Math.min(1, newVolume)); // Clamp value
        currentStep++;
    }, 50);
}

// --- 3. CORE PLAYER LOGIC ---

function crossfade() {
    if (isFading) return;
    isFading = true;

    currentTrackIndex++;
    if (currentTrackIndex >= shuffledPlaylist.length) {
        currentTrackIndex = 0;
        shuffle(shuffledPlaylist);
    }
    
    inactiveAudio.src = shuffledPlaylist[currentTrackIndex];
    inactiveAudio.volume = 0;
    inactiveAudio.play();

    fadeVolume(activeAudio, 0, FADE_DURATION, () => {
        activeAudio.pause();
    });

    fadeVolume(inactiveAudio, 1, FADE_DURATION, () => {
        let temp = activeAudio;
        activeAudio = inactiveAudio;
        inactiveAudio = temp;
        isFading = false;
    });
}

// --- 4. EVENT LISTENERS & INTERVALS ---

// A single, persistent interval to check for the end of a track
setInterval(() => {
    if (isPlaying && !isFading && activeAudio.duration > 0) {
        if ((activeAudio.duration - activeAudio.currentTime) < FADE_DURATION) {
            crossfade();
        }
    }
}, 250);

// Play/Pause button functionality
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        activeAudio.pause();
        isPlaying = false;
        playPauseBtn.textContent = '🎵 PLAY MUSIC';
    } else {
        if (activeAudio.currentTime === 0) {
            activeAudio.volume = 0;
            fadeVolume(activeAudio, 1, FADE_DURATION);
        }
        activeAudio.play();
        isPlaying = true;
        playPauseBtn.textContent = '🎵 PAUSE MUSIC';
    }
});

// --- 5. INITIALIZATION ---
shuffle(shuffledPlaylist);
activeAudio.src = shuffledPlaylist[currentTrackIndex];