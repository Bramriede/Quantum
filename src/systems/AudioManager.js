import SaveManager from './SaveManager.js';

// Alle geluid via Web Audio API-synthese — geen losse audiobestanden, geen
// copyright-risico (zie PLAN.md). Eén instantie, gedeeld via Phaser's
// registry zodat elke scene hetzelfde AudioManager-object gebruikt.
export default class AudioManager {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.sfxGain = null;
    this.musicGain = null;
    const s = SaveManager.get().settings;
    this.volumes = { master: s.masterVolume, sfx: s.sfxVolume, music: s.musicVolume };
    this._ambientNodes = null;
    this._unlockBound = () => this._unlock();
    ['pointerdown', 'keydown', 'touchstart'].forEach((evt) => {
      window.addEventListener(evt, this._unlockBound, { once: true });
    });
  }

  _unlock() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.volumes.master;
    this.master.connect(this.ctx.destination);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = this.volumes.sfx;
    this.sfxGain.connect(this.master);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = this.volumes.music;
    this.musicGain.connect(this.master);

    this._startAmbient();
  }

  setVolume(kind, value) {
    this.volumes[kind] = value;
    if (!this.ctx) return;
    if (kind === 'master') this.master.gain.setTargetAtTime(value, this.ctx.currentTime, 0.05);
    if (kind === 'sfx') this.sfxGain.gain.setTargetAtTime(value, this.ctx.currentTime, 0.05);
    if (kind === 'music') this.musicGain.gain.setTargetAtTime(value, this.ctx.currentTime, 0.05);
  }

  // ---- korte sfx ----

  _env(node, gain, t0, attack, decay) {
    node.gain.setValueAtTime(0.0001, t0);
    node.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    node.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
  }

  playShot() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.09);
    this._env(gain, 0.5, t, 0.005, 0.09);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(t); osc.stop(t + 0.12);
  }

  playHit() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const noise = this._noiseBuffer(0.08);
    const src = this.ctx.createBufferSource();
    src.buffer = noise;
    const gain = this.ctx.createGain();
    this._env(gain, 0.35, t, 0.002, 0.07);
    src.connect(gain).connect(this.sfxGain);
    src.start(t);
  }

  playExplosion() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const noise = this._noiseBuffer(0.5);
    const src = this.ctx.createBufferSource();
    src.buffer = noise;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.exponentialRampToValueAtTime(80, t + 0.45);
    const gain = this.ctx.createGain();
    this._env(gain, 0.7, t, 0.005, 0.45);
    src.connect(filter).connect(gain).connect(this.sfxGain);
    src.start(t);
  }

  playBreach() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.3);
    this._env(gain, 0.4, t, 0.01, 0.3);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(t); osc.stop(t + 0.35);
  }

  playClick() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(700, t);
    this._env(gain, 0.25, t, 0.002, 0.05);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(t); osc.stop(t + 0.06);
  }

  playCoin() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
    this._env(gain, 0.2, t, 0.005, 0.1);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(t); osc.stop(t + 0.14);
  }

  playAlarm() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const start = t + i * 0.35;
      osc.frequency.setValueAtTime(440, start);
      osc.frequency.linearRampToValueAtTime(660, start + 0.25);
      this._env(gain, 0.3, start, 0.02, 0.28);
      osc.connect(gain).connect(this.sfxGain);
      osc.start(start); osc.stop(start + 0.3);
    }
  }

  _noiseBuffer(duration) {
    const length = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  // ---- ambient achtergrondgeluid: laag gerommel + windruis ----
  _startAmbient() {
    if (this._ambientNodes) return;
    const t = this.ctx.currentTime;

    const drone = this.ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = 55;
    const droneGain = this.ctx.createGain();
    droneGain.gain.value = 0.12;
    drone.connect(droneGain).connect(this.musicGain);
    drone.start(t);

    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = this._noiseBuffer(4);
    noiseSrc.loop = true;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 300;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.05;
    noiseSrc.connect(noiseFilter).connect(noiseGain).connect(this.musicGain);
    noiseSrc.start(t);

    this._ambientNodes = { drone, droneGain, noiseSrc, noiseGain };
  }
}
