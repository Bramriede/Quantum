import { GAME_WIDTH, GAME_HEIGHT, DEPTH } from '../data/Constants.js';
import SaveManager from '../systems/SaveManager.js';

const SLIDERS = [
  { key: 'masterVolume', kind: 'master', label: 'Hoofdvolume' },
  { key: 'sfxVolume', kind: 'sfx', label: 'Geluidseffecten' },
  { key: 'musicVolume', kind: 'music', label: 'Achtergrondgeluid' },
];

const BAR_WIDTH = 420;

export default class SettingsScene extends Phaser.Scene {
  constructor() { super('Settings'); }

  init(data) {
    this.returnScene = (data && data.returnScene) || 'Title';
  }

  create() {
    const w = GAME_WIDTH, h = GAME_HEIGHT;
    this.audio = this.registry.get('audio');
    const settings = SaveManager.get().settings;

    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.72).setDepth(DEPTH.UI);
    this.add.text(w / 2, h / 2 - 200, 'INSTELLINGEN', {
      fontFamily: 'Georgia, serif', fontSize: '38px', color: '#f0e6c8', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(DEPTH.UI + 1);

    this.bars = {};
    SLIDERS.forEach((slider, i) => {
      const y = h / 2 - 90 + i * 90;
      this.add.text(w / 2, y - 26, slider.label, {
        fontFamily: 'Georgia, serif', fontSize: '18px', color: '#c9b896',
      }).setOrigin(0.5).setDepth(DEPTH.UI + 1);

      const trackX = w / 2 - BAR_WIDTH / 2;
      const track = this.add.rectangle(w / 2, y, BAR_WIDTH, 18, 0x2c3e50).setDepth(DEPTH.UI + 1)
        .setInteractive({ useHandCursor: true });
      const fill = this.add.rectangle(trackX, y, BAR_WIDTH * settings[slider.key], 18, 0xd9a441)
        .setOrigin(0, 0.5).setDepth(DEPTH.UI + 2);

      const setFromPointerX = (px) => {
        const value = Phaser.Math.Clamp((px - trackX) / BAR_WIDTH, 0, 1);
        fill.width = BAR_WIDTH * value;
        if (this.audio) this.audio.setVolume(slider.kind, value);
        SaveManager.saveSettings({ [slider.key]: value });
        return value;
      };

      track.on('pointerdown', (p) => setFromPointerX(p.x));
      track.on('pointermove', (p) => { if (p.isDown) setFromPointerX(p.x); });

      this.bars[slider.key] = { track, fill };
    });

    const backFrame = this.add.image(w / 2, h / 2 + 220, 'button_frame').setDisplaySize(260, 72)
      .setDepth(DEPTH.UI + 1).setInteractive({ useHandCursor: true });
    this.add.text(w / 2, h / 2 + 220, 'TERUG', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#f0e6c8', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(DEPTH.UI + 2);
    backFrame.on('pointerover', () => backFrame.setTint(0xdddddd));
    backFrame.on('pointerout', () => backFrame.clearTint());
    backFrame.on('pointerdown', () => this._back());

    this.input.keyboard.on('keydown-ESC', () => this._back());
  }

  _back() {
    if (this.audio) this.audio.playClick();
    this.scene.stop('Settings');
    if (this.scene.isSleeping(this.returnScene)) {
      this.scene.wake(this.returnScene);
    } else {
      this.scene.resume(this.returnScene);
    }
  }
}
