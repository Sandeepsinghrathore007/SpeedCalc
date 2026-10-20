// Web Audio API Synthesizer (Zero External Audio Assets, Zero Latency)

class AudioEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    const saved = localStorage.getItem('speedmath_sound');
    if (saved !== null) {
      this.soundEnabled = saved === '1';
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    localStorage.setItem('speedmath_sound', enabled ? '1' : '0');
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playTone(freq: number, type: OscillatorType, duration: number, gainStart: number, gainEnd: number) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainStart, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(gainEnd, 0.0001), this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore audio policy errors
    }
  }

  public playSuccess() {
    if (!this.soundEnabled) return;
    // Pleasant 3-note ascending arpeggio: C5 (523Hz), E5 (659Hz), G5 (784Hz)
    this.playTone(523.25, 'sine', 0.08, 0.14, 0.01);
    setTimeout(() => this.playTone(659.25, 'sine', 0.08, 0.16, 0.01), 60);
    setTimeout(() => this.playTone(783.99, 'sine', 0.14, 0.18, 0.001), 120);
  }

  public playError() {
    if (!this.soundEnabled) return;
    // Low sawtooth buzz
    this.playTone(145, 'sawtooth', 0.16, 0.15, 0.005);
  }

  public playStreakMilestone() {
    if (!this.soundEnabled) return;
    // Celebratory bright chime
    const notes = [659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.15, 0.2, 0.001);
      }, idx * 70);
    });
  }

  public playLevelUp() {
    if (!this.soundEnabled) return;
    const fanfare = [523.25, 659.25, 783.99, 1046.50];
    fanfare.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.25, 0.22, 0.01), i * 90);
    });
  }

  public playKeyClick() {
    if (!this.soundEnabled) return;
    this.playTone(800, 'sine', 0.02, 0.05, 0.001);
  }
}

export const audioEngine = new AudioEngine();
