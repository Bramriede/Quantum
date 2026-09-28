import { GAME_WIDTH, GAME_HEIGHT, DEPTH } from '../data/Constants.js';

export default class PauseScene extends Phaser.Scene {
  constructor() { super('Pause'); }

  create() {
    const w = GAME_WIDTH, h = GAME_HEIGHT;
    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.6).setDepth(DEPTH.UI);
    this.add.text(w / 2, h / 2 - 160, 'GEPAUZEERD', {
      fontFamily: 'Georgia, serif', fontSize: '44px', color: '#f0e6c8', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(DEPTH.UI + 1);

    this._button(w / 2, h / 2 - 50, 'VERDER', () => this._resume());
    this._button(w / 2, h / 2 + 40, 'INSTELLINGEN', () => {
      this.scene.launch('Settings', { returnScene: 'Pause' });
      this.scene.sleep();
    });
    this._button(w / 2, h / 2 + 130, 'STOPPEN', () => {
      this.scene.stop('UI');
      this.scene.stop('Game');
      this.scene.stop('Pause');
      this.scene.start('Title');
    });

    this.input.keyboard.on('keydown-ESC', () => this._resume());
  }

  _resume() {
    this.scene.resume('Game');
    this.scene.resume('UI');
    this.scene.stop('Pause');
  }

  _button(x, y, label, onClick) {
    const frame = this.add.image(x, y, 'button_frame').setDisplaySize(320, 80)
      .setDepth(DEPTH.UI + 1).setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#f0e6c8', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(DEPTH.UI + 2);
    frame.on('pointerover', () => frame.setTint(0xdddddd));
    frame.on('pointerout', () => frame.clearTint());
    frame.on('pointerdown', () => {
      const audio = this.registry.get('audio');
      if (audio) audio.playClick();
      onClick();
    });
    return frame;
  }
}
