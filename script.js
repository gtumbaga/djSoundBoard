document.addEventListener('DOMContentLoaded', () => {
    const supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    const touchOrClick = supportsTouch ? 'touchstart' : 'mousedown';
    console.log('touchOrClick', touchOrClick);
    const buttons = document.querySelectorAll('.sound-button');
    let hornTimeout;

    buttons.forEach(button => {
        let timeoutId; // Add this line to store the timeout ID

        button.addEventListener(touchOrClick, () => {
            const soundFile = button.getAttribute('data-sound');
            const audioId = soundFile.split('/').pop().split('.')[0] + '-audio';
            const audio = document.getElementById(audioId);
            const volume = audio.getAttribute('data-volume');
            audio.volume = volume;

            // Add 'playing' class to the button
            button.classList.add('playing');

            // Check for data-duration attribute
            const duration = audio.getAttribute('data-duration');

            audio.currentTime = 0;
            audio.play();

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
