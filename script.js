// globals
let bpm = 0;
let lastClickTime = 0;
let clickCount = 0;
let totalInterval = 0;
let resetTimeout;
let bpmTimeout;

const resetBpmCount = () => {
    bpm = 0;
    lastClickTime = 0;
    clickCount = 0;
    totalInterval = 0;
    // document.getElementById('btn-bpm').classList.remove('active');
    document.getElementById('bpm-display').classList.remove('active');
};

const bpmCount = () => {
    const bpmButton = document.getElementById('btn-bpm');
    const bpmDisplay = document.getElementById('bpm-display');
    if (!bpmDisplay.classList.contains('active')) {
        bpmDisplay.innerHTML = 0;
        bpmDisplay.classList.add('active');
    }
    bpmButton.classList.add('active');
    clearTimeout(bpmTimeout);
    bpmTimeout = setTimeout(() => {
        bpmButton.classList.remove('active');
    }, 500);


    const currentTime = Date.now();

    // Clear existing timeout and set a new one
    clearTimeout(resetTimeout);
    resetTimeout = setTimeout(resetBpmCount, 1000);

    clickCount++;

    if (clickCount === 1) {
        lastClickTime = currentTime;
        return null;
    }

    const elapsedTime = currentTime - lastClickTime;
    totalInterval += elapsedTime;

    if (totalInterval >= 1000) { // Calculate BPM after at least 1 second
        const averageBpm = Math.round((clickCount - 1) / (totalInterval / 60000));

        // Update the running average
        bpm = bpm === 0 ? averageBpm : Math.round((bpm + averageBpm) / 2);

        // Reset for next calculation
        lastClickTime = currentTime;
        clickCount = 1;
        totalInterval = 0;

        return bpm;
    }

    lastClickTime = currentTime;
    return null; // Return null if not enough time has passed to calculate BPM
};

const handleBpmClick = () => {
    const bpm = bpmCount();
    const bpmDisplay = document.getElementById('bpm-display');
    if (bpm) {
        bpmDisplay.innerHTML = `${bpm} / ${Math.round(bpm/2)}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const supportsTouch = 'ontouchend' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    const touchOrClick = supportsTouch ? 'touchstart' : 'mousedown';
    console.log('touchOrClick', touchOrClick);

    const bpmButton = document.getElementById('btn-bpm');
    bpmButton.addEventListener(touchOrClick, handleBpmClick);

    const buttons = document.querySelectorAll('.sound-button');

    buttons.forEach(button => {
        let timeoutId; // Add this line to store the timeout ID
        const soundFile = button.getAttribute('data-sound');
        const audioId = soundFile.split('/').pop().split('.')[0] + '-audio';
        const audio = document.getElementById(audioId);

        // Preload audio
        audio.load();
        audio.preload = 'auto';

        // Create a silent buffer and play it to unlock audio playback
        // const silentBuffer = audio.context.createBuffer(1, 1, 22050);
        // const source = audio.context.createBufferSource();
        // source.buffer = silentBuffer;
        // source.connect(audio.context.destination);
        // source.start();

        const volume = audio.getAttribute('data-volume');
        audio.volume = volume;

        button.addEventListener(touchOrClick, (e) => {
            // prevent default action to avoid page scroll
            e.preventDefault();
            // const soundFile = button.getAttribute('data-sound');
            // const audioId = soundFile.split('/').pop().split('.')[0] + '-audio';
            // const audio = document.getElementById(audioId);


            // Add 'playing' class to the button
            button.classList.add('playing');

            // Check for data-duration attribute
            const duration = audio.getAttribute('data-duration');

            audio.currentTime = 0;
            try {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error('Error playing audio', error);
                    });
                }
            } catch (error) {
                console.error('Error playing audio', error);
            }

            if (duration) {
                // Clear any existing timeout for this button
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                // Set a new timeout and store its ID
                timeoutId = setTimeout(() => {
                    audio.pause();
                    audio.currentTime = 0;
                    button.classList.remove('playing');
                }, parseInt(duration));
            } else {
                // If no data-duration, remove 'playing' class when the audio ends
                audio.onended = () => {
                    button.classList.remove('playing');
                };
            }
        });
    });

});
