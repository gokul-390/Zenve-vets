// Web Audio API Sound Manager for Instagram-style Video Shorts & Reels
class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.currentPostId = null;
    this.gainNode = null;
    this.activeOscillators = [];
    this.melodyTimer = null;
    this.listeners = new Set();
    this.setupUserUnlock();
  }

  // Pre-unlock audio context on user gesture
  setupUserUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      this.init();
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
  }

  // Subscribe to changes in active playing post
  subscribe(listener) {
    this.listeners.add(listener);
    // Notify immediate state
    listener(this.currentPostId);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.currentPostId);
      } catch (err) {
        console.error('SoundManager subscriber error:', err);
      }
    });
  }

  async init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
      } catch {
        // ignore
      }
    }
    return this.audioCtx;
  }

  // Play ambient Instagram reel style melody
  async playReelSound(postId, theme = 'calm') {
    await this.init();
    if (!this.audioCtx) return;

    // Stop any existing sound first
    this.stopReelSound(false);

    this.currentPostId = postId;
    this.notify();

    const ctx = this.audioCtx;
    // Set master volume clearly audible (0.32)
    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.32, ctx.currentTime);
    this.gainNode.connect(ctx.destination);

    // Theme note frequencies & tempos
    // Themes: 'playful' (sweet_Sneha), 'calm' (Dr. Priya), 'equine' (Dr. Sanjay)
    let notes = [];
    let bassNotes = [];
    let beatInterval = 320; // ms

    if (theme === 'playful') {
      // Upbeat cheerful groove: C5 - E5 - G5 - A5 - G5 - E5 - D5 - C5
      notes = [523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25];
      bassNotes = [130.81, 130.81, 164.81, 196.0];
      beatInterval = 280;
    } else if (theme === 'calm') {
      // Relaxing lofi chime: A4 - C5 - E5 - G5 - E5 - C5 - D5 - B4
      notes = [440.0, 523.25, 659.25, 783.99, 659.25, 523.25, 587.33, 493.88];
      bassNotes = [110.0, 110.0, 146.83, 164.81];
      beatInterval = 360;
    } else {
      // Stately / rhythmic equine gallop tempo
      notes = [293.66, 369.99, 440.0, 587.33, 440.0, 369.99, 329.63, 293.66];
      bassNotes = [73.42, 98.0, 110.0, 73.42];
      beatInterval = 300;
    }

    let step = 0;

    const playStep = () => {
      if (!this.currentPostId || !this.audioCtx || !this.gainNode) return;

      const now = ctx.currentTime;

      // 1. Lead melody note
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const freq = notes[step % notes.length];

      osc.type = theme === 'playful' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.24, now + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.005, now + 0.35);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + 0.38);
      this.activeOscillators.push(osc);

      // 2. Bass note every 2 steps
      if (step % 2 === 0) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        const bassFreq = bassNotes[(step / 2) % bassNotes.length];

        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0, now);
        bassGain.gain.linearRampToValueAtTime(0.26, now + 0.04);
        bassGain.gain.exponentialRampToValueAtTime(0.005, now + 0.5);

        bassOsc.connect(bassGain);
        bassGain.connect(this.gainNode);

        bassOsc.start(now);
        bassOsc.stop(now + 0.52);
        this.activeOscillators.push(bassOsc);
      }

      // 3. Subtle rhythmic percussion click / hi-hat
      const percOsc = ctx.createOscillator();
      const percGain = ctx.createGain();
      percOsc.type = 'square';
      percOsc.frequency.setValueAtTime(step % 4 === 0 ? 180 : 380, now);

      percGain.gain.setValueAtTime(0.08, now);
      percGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      percOsc.connect(percGain);
      percGain.connect(this.gainNode);

      percOsc.start(now);
      percOsc.stop(now + 0.06);
      this.activeOscillators.push(percOsc);

      // Garbage collect stopped oscillators
      if (this.activeOscillators.length > 30) {
        this.activeOscillators = this.activeOscillators.slice(-10);
      }

      step++;
      this.melodyTimer = setTimeout(playStep, beatInterval);
    };

    playStep();
  }

  stopReelSound(notifyListeners = true) {
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // already stopped
      }
    });
    this.activeOscillators = [];

    if (this.gainNode && this.audioCtx) {
      try {
        this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
        this.gainNode.disconnect();
      } catch {
        // ignore
      }
      this.gainNode = null;
    }

    this.currentPostId = null;
    if (notifyListeners) {
      this.notify();
    }
  }

  toggleSound(postId, theme = 'calm') {
    if (this.currentPostId === postId) {
      this.stopReelSound(true);
      return false;
    } else {
      this.playReelSound(postId, theme);
      return true;
    }
  }
}

export const soundManager = new SoundManager();
export default soundManager;
