import { SAVE_KEY } from '../data/Constants.js';

const DEFAULTS = {
  settings: { masterVolume: 0.8, sfxVolume: 0.9, musicVolume: 0.6 },
  bestWave: 0,
  victories: 0,
};

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...DEFAULTS, settings: { ...DEFAULTS.settings } };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULTS,
      ...parsed,
      settings: { ...DEFAULTS.settings, ...(parsed.settings || {}) },
    };
  } catch (e) {
    return { ...DEFAULTS, settings: { ...DEFAULTS.settings } };
  }
}

function save(data) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    // localStorage kan onbeschikbaar zijn (bv. privémodus) — negeer stil.
  }
}

const SaveManager = {
  get() { return load(); },
  saveSettings(settings) {
    const data = load();
    data.settings = { ...data.settings, ...settings };
    save(data);
    return data;
  },
  reportRunResult({ waveReached, won }) {
    const data = load();
    data.bestWave = Math.max(data.bestWave, waveReached);
    if (won) data.victories += 1;
    save(data);
    return data;
  },
};

export default SaveManager;
