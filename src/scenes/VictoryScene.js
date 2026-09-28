import { GAME_WIDTH, GAME_HEIGHT, DEPTH, TOTAL_WAVES } from '../data/Constants.js';

export default class VictoryScene extends Phaser.Scene {
  constructor() { super('Victory'); }

  init(data) {
    this.stats = data || {};
  }

  create() {
    const w = GAME_WIDTH, h = GAME_HEIGHT;
    const audio = this.registry.get('audio');
    if (audio) audio.playCoin();

    this.add.image(w / 2, h / 2, 'title_bg').setDisplaySize(w, h).setDepth(DEPTH.UI - 1);
    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.4).setDepth(DEPTH.UI);

    this.add.text(w / 2, h / 2 - 190, 'DE LINIE HEEFT STANDGEHOUDEN', {
      fontFamily: 'Georgia, serif', fontSize: '42px', color: '#f4e04d', fontStyle: 'bold', align: 'center',
    }).setOrigin(0.5).setDepth(DEPTH.UI + 1).setShadow(0, 4, '#000000', 4, false, true);

    const stats = [
      `Alle ${TOTAL_WAVES} golven overleefd`,
      `Vijanden verslagen: ${this.stats.kills || 0}`,
      `Voorraad verzameld: ${this.stats.suppliesEarned || 0}`,
    ];
    this.add.text(w / 2, h / 2 - 80, stats.join('\n'), {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#f0e6c8', align: 'center', lineSpacing: 10,
    }).setOrigin(0.5).setDepth(DEPTH.UI + 1);

    this._button(w / 2, h / 2 + 140, 'OPNIEUW SPELEN', () => {
      this.scene.stop('Victory');
      this.scene.start('Game');
    });
    this._button(w / 2, h / 2 + 230, 'TERUG NAAR TITEL', () => {
      this.scene.stop('Victory');
      this.scene.start('Title');
    });
  }

  _button(x, y, label, onClick) {
    const frame = this.add.image(x, y, 'button_frame').setDisplaySize(340, 74)
      .setDepth(DEPTH.UI + 1).setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#f0e6c8', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(DEPTH.UI + 2);
    frame.on('pointerover', () => frame.setTint(0xdddddd));
    frame.on('pointerout', () => frame.clearTint());
    frame.on('pointerdown', () => {
      const audio = this.registry.get('audio');
      if (audio) audio.playClick();
      onClick();
    });
  }
}
