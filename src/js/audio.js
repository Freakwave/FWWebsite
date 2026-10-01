export function createClickSound(window) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let context;

  return function playClick(frequency = 600, type = 'sine', duration = 0.04) {
    if (!AudioContext) return;
    try {
      context ??= new AudioContext();
      if (context.state === 'suspended') void context.resume();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      gain.gain.setValueAtTime(0.06, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
    } catch {
      // Audio is optional; unsupported devices remain fully functional.
    }
  };
}
