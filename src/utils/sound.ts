// Declare the global variable for TypeScript
declare global {
  interface Window {
    soundEnabled?: boolean;
  }
}

// Create an audio context for generating sounds
let audioContext: AudioContext | null = null;

// Initialize audio context on first user interaction
const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Play a completion sound when a task is marked as done
 */
export const playCompletionSound = () => {
  // Check if sound is enabled globally
  if (window.soundEnabled === false) return;

  try {
    const context = initAudioContext();

    // Create an oscillator (sound generator)
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    // Connect the oscillator to the gain node and the gain node to the output
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Set the type and frequency for a pleasant "ding" sound
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(830, context.currentTime); // Higher frequency for a cheerful sound

    // Set the volume and create a quick fade out
    gainNode.gain.setValueAtTime(1, context.currentTime); // Lower volume (0-1)
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);

    // Start and stop the sound
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.2);
  } catch (error) {
    console.error("Error playing completion sound:", error);
  }
};

/**
 * Play a different sound when a task is marked as incomplete
 */
export const playUncompleteSound = () => {
  // Check if sound is enabled globally
  if (window.soundEnabled === false) return;

  try {
    const context = initAudioContext();

    // Create an oscillator
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    // Connect the oscillator to the gain node and the gain node to the output
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Set the type and frequency for a lower "undo" sound
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, context.currentTime); // Lower frequency

    // Set the volume and create a quick fade out
    gainNode.gain.setValueAtTime(0.1, context.currentTime); // Lower volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

    // Start and stop the sound
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
  } catch (error) {
    console.error("Error playing uncomplete sound:", error);
  }
};
