document.addEventListener('DOMContentLoaded', () => {
    const supportsTouch = 'ontouchend' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    const touchOrClick = supportsTouch ? 'touchstart' : 'mousedown';
    console.log('touchOrClick', touchOrClick);
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
