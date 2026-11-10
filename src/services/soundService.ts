/**
 * Procedural Audio Synthesizer and Thai Speech Synthesis
 * No external MP3 dependencies - completely standalone and ultra-reliable.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: any = null;
  private isMuted: boolean = false;
  private isVoiceEnabled: boolean = true;
  private isHapticEnabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.bgmGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

        this.bgmGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(muted ? 0 : 0.12, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(muted ? 0 : 0.35, this.ctx.currentTime);
    }
  }

  public getIsMuted() {
    return this.isMuted;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.isVoiceEnabled = enabled;
  }

  public getIsVoiceEnabled() {
    return this.isVoiceEnabled;
  }

  public setHapticEnabled(enabled: boolean) {
    this.isHapticEnabled = enabled;
  }

  public getIsHapticEnabled() {
    return this.isHapticEnabled;
  }

  /**
   * Haptic vibration for mobile / devices that support it
   */
  public vibrate(pattern: number[] = [200, 100, 200]) {
    if (!this.isHapticEnabled) return;
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // ignore
    }
  }

  /**
   * Cute ambient BGM loop (Gentle kawaii marimba arpeggio)
   */
  public startBGM() {
    this.initContext();
    if (this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
    this.isBgmPlaying = true;

    // Pentatonic scale frequencies: C5, D5, E5, G5, A5, C6
    const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    let step = 0;

    const playNote = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain || this.isMuted) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Gentle marimba timbre: sine with short transient
      osc.type = 'sine';
      const freq = scale[step % scale.length];
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(noteGain);
      noteGain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + 0.38);

      // Play soft bass root on beat
      if (step % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(freq / 4, now);
        bassGain.gain.setValueAtTime(0.15, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGain);
        bassOsc.start(now);
        bassOsc.stop(now + 0.65);
      }

      step = (step + 1) % 16;
    };

    this.bgmIntervalId = setInterval(playNote, 420);
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  /**
   * Sound effect: Sizzle on the charcoal grill
   */
  public playGrillSizzle() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.45;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Filtered white noise with crackle
      for (let i = 0; i < bufferSize; i++) {
        const crackle = Math.random() > 0.94 ? (Math.random() * 2 - 1) * 1.5 : (Math.random() * 2 - 1) * 0.4;
        data[i] = crackle;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(now);
    } catch {
      // audio safety
    }
  }

  /**
   * Sound effect: New customer order incoming bell chime
   */
  public playOrderChime() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [659.25, 880.00, 1174.66]; // E5, A5, D6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.4, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.52);
    });
  }

  /**
   * Sound effect: Viewer helps grill squids
   */
  public playHelperChime() {
    this.initContext();
    this.playGrillSizzle();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.42);
    });
  }

  /**
   * Sound effect: Jackpot / Mishka Bear Celebration
   */
  public playJackpotFlourish() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime + idx * 0.07;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.6);
    });
  }

  /**
   * Sound effect: Tap screen / heart like
   */
  public playLikePop() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 300, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Text to Speech in Thai using Web SpeechSynthesis
   */
  public speakThai(text: string) {
    if (!this.isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      // Cancel previous speech if backlog gets too long
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = 1.05;
      utterance.pitch = 1.2; // cute higher friendly pitch

      // Pick Thai voice if available
      const voices = window.speechSynthesis.getVoices();
      const thaiVoice = voices.find(v => v.lang.includes('th') || v.lang.includes('TH'));
      if (thaiVoice) {
        utterance.voice = thaiVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if speech is blocked by browser policy
    }
  }

  /**
   * Speak Order Notification in Thai
   */
  public speakOrder(nickname: string, skewers: number, giftName: string) {
    const text = `คุณ ${nickname} สั่งปลาหมึกย่าง ${skewers} ไม้ ขอบคุณมากนะคะ!`;
    this.speakThai(text);
  }

  /**
   * Speak Grill Help Notification in Thai
   */
  public speakHelper(nickname: string, skewers: number, giftName: string) {
    const text = `ขอบคุณคุณ ${nickname} ช่วยย่างปลาหมึก ${skewers} ไม้ สุดยอดเลยค่ะ!`;
    this.speakThai(text);
  }
}

export const soundService = new SoundService();
