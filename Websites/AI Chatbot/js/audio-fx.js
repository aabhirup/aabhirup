/**
 * Soft Apple Interface Audio Synthesizer
 * Generates delicate haptic chimes and message pops via Web Audio API.
 */

class AppleChatAudio {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('apple_audio_enabled') === 'true';
    this.initContext();
  }

  initContext() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('apple_audio_enabled', this.enabled);
    if (this.enabled) {
      this.initContext();
      this.resume();
      this.playSend();
    }
    return this.enabled;
  }

  playSend() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.05);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      // Audio suppressed
    }
  }

  playReceive() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.resume();
      const now = this.ctx.currentTime;
      const notes = [587.33, 880]; // D5 -> A5 gentle chime

      notes.forEach((note, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, now + i * 0.06);

        gain.gain.setValueAtTime(0.025, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.18);
      });
    } catch (e) {
      // Audio suppressed
    }
  }
}

window.appleAudio = new AppleChatAudio();
