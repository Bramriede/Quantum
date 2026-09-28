import { GAME_WIDTH, ZONES, DEPTH } from '../data/Constants.js';

const BUILD_OPTIONS = [
  { key: 'icon_wall', label: 'Muur', price: 50 },
  { key: 'icon_machinegun', label: 'Mitrailleur', price: 350 },
  { key: 'icon_gasmask', label: 'Gasmaskerpost', price: 150 },
  { key: 'icon_barbedwire', label: 'Prikkeldraad', price: 25 },
];

const ABILITIES = [
  { key: 'ability_mortar', label: 'Mortier' },
  { key: 'ability_gas', label: 'Gasinzet' },
  { key: 'ability_reserves', label: 'Reserves' },
];

export default class UIScene extends Phaser.Scene {
  constructor() { super('UI'); }

  create() {
    this._buildTopHud();
    this._buildAbilityBar();
    this._buildBottomPanel();
  }

  _buildTopHud() {
    const { y, height } = ZONES.hud;
    this.add.image(GAME_WIDTH / 2, y + height / 2, 'hud_top_bg')
      .setDisplaySize(GAME_WIDTH, height).setDepth(DEPTH.UI);

    this.add.image(60, y + height / 2, 'icon_supplies').setDisplaySize(32, 32).setDepth(DEPTH.UI);
    this.suppliesText = this.add.text(90, y + height / 2, '150', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#f0e6c8',
    }).setOrigin(0, 0.5).setDepth(DEPTH.UI);

    this.add.image(GAME_WIDTH / 2 - 170, y + height / 2, 'healthbar_frame')
      .setDisplaySize(340, 32).setDepth(DEPTH.UI);
    this.hpBar = this.add.rectangle(GAME_WIDTH / 2 - 330, y + height / 2, 320, 20, 0x5fae4a)
      .setOrigin(0, 0.5).setDepth(DEPTH.UI);
    this.add.text(GAME_WIDTH / 2, y + height / 2, 'LOOPGRAAF', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#f0e6c8',
    }).setOrigin(0.5).setDepth(DEPTH.UI + 1);

    this.add.image(GAME_WIDTH - 250, y + height / 2, 'icon_wave').setDisplaySize(28, 28).setDepth(DEPTH.UI);
    this.waveText = this.add.text(GAME_WIDTH - 225, y + height / 2, 'GOLF 1 / 12', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#f0e6c8',
    }).setOrigin(0, 0.5).setDepth(DEPTH.UI);
  }

  _buildAbilityBar() {
    const { y, height } = ZONES.abilityBar;
    this.add.image(GAME_WIDTH / 2, y + height / 2, 'ability_bar_bg')
      .setDisplaySize(GAME_WIDTH, height).setDepth(DEPTH.UI);

    const startX = GAME_WIDTH / 2 - (ABILITIES.length - 1) * 70;
    ABILITIES.forEach((ab, i) => {
      const x = startX + i * 140;
      const icon = this.add.image(x, y + height / 2, ab.key)
        .setDisplaySize(38, 38).setDepth(DEPTH.UI).setInteractive({ useHandCursor: true });
      this.add.text(x + 26, y + height / 2, ab.label, {
        fontFamily: 'Georgia, serif', fontSize: '13px', color: '#c9b896',
      }).setOrigin(0, 0.5).setDepth(DEPTH.UI);
      icon.on('pointerover', () => icon.setTint(0xdddddd));
      icon.on('pointerout', () => icon.clearTint());
    });
  }

  _buildBottomPanel() {
    const { y, height } = ZONES.buildPanel;
    this.add.image(GAME_WIDTH / 2, y + height / 2, 'panel_bg')
      .setDisplaySize(GAME_WIDTH, height).setDepth(DEPTH.UI);

    const totalWidth = BUILD_OPTIONS.length * 220;
    const startX = GAME_WIDTH / 2 - totalWidth / 2 + 110;

    BUILD_OPTIONS.forEach((opt, i) => {
      const x = startX + i * 220;
      const cy = y + height / 2;
      const icon = this.add.image(x, cy - 14, opt.key)
        .setDisplaySize(64, 64).setDepth(DEPTH.UI).setInteractive({ useHandCursor: true });
      this.add.text(x, cy + 30, opt.label, {
        fontFamily: 'Georgia, serif', fontSize: '14px', color: '#f0e6c8',
      }).setOrigin(0.5).setDepth(DEPTH.UI);
      this.add.image(x - 34, cy + 52, 'icon_supplies').setDisplaySize(18, 18).setDepth(DEPTH.UI);
      this.add.text(x - 20, cy + 52, `${opt.price}`, {
        fontFamily: 'Georgia, serif', fontSize: '14px', color: '#d9b45c',
      }).setOrigin(0, 0.5).setDepth(DEPTH.UI);
      icon.on('pointerover', () => icon.setTint(0xdddddd));
      icon.on('pointerout', () => icon.clearTint());
    });
  }
}
