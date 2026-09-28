import { GAME_WIDTH, GAME_HEIGHT, TOTAL_WAVES } from '../data/Constants.js';
import SaveManager from '../systems/SaveManager.js';

export default class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    const w = GAME_WIDTH, h = GAME_HEIGHT;
    this.audio = this.registry.get('audio');
    this.cameras.main.fadeIn(250, 0, 0, 0);

    this.add.image(w / 2, h / 2, 'title_bg').setDisplaySize(w, h);
    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.25);

    this.add.text(w / 2, h / 2 - 220, 'LOOPGRAAF 1917', {
      fontFamily: 'Georgia, serif', fontSize: '72px', color: '#e8d8a8', fontStyle: 'bold',
    }).setOrigin(0.5).setShadow(0, 5, '#000000', 6, false, true);

    this.add.text(w / 2, h / 2 - 150, 'Houd de linie. Verdedig tot de laatste golf.', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#c9b896',
    }).setOrigin(0.5);

    const save = SaveManager.get();
    if (save.bestWave > 0) {
      this.add.text(w / 2, h / 2 - 112, `Beste resultaat: golf ${save.bestWave} / ${TOTAL_WAVES}${save.victories > 0 ? `  ·  Overwinningen: ${save.victories}` : ''}`, {
        fontFamily: 'Georgia, serif', fontSize: '16px', color: '#d9b45c',
      }).setOrigin(0.5);
    }

    this._makeButton(w / 2, h / 2 - 20, 'HOUD DE LINIE', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Game'));
    });

    this._makeButton(w / 2, h / 2 + 100, 'INSTELLINGEN', () => {
      this.scene.launch('Settings', { returnScene: 'Title' });
      this.scene.pause();
    });

    this.add.text(w / 2, h - 34, 'Muis/klik om te bouwen en te richten · Touch: tap', {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#8a7a5c',
    }).setOrigin(0.5);
  }

  _makeButton(x, y, label, onClick) {
    const frame = this.add.image(x, y, 'button_frame').setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, {
      fontFamily: 'Georgia, serif', fontSize: '26px', color: '#f0e6c8', fontStyle: 'bold',
    }).setOrigin(0.5);
    frame.on('pointerover', () => frame.setTint(0xdddddd));
    frame.on('pointerout', () => frame.clearTint());
    frame.on('pointerdown', () => {
      if (this.audio) this.audio.playClick();
      onClick();
    });
    return { frame, text };
  }
}
