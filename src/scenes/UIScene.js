import { GAME_WIDTH, ZONES, DEPTH, TOTAL_WAVES } from '../data/Constants.js';
import StructureDefs, { SLOT_OPTIONS } from '../data/StructureDefs.js';

const BUILD_ORDER = [...SLOT_OPTIONS.front, ...SLOT_OPTIONS.back, ...SLOT_OPTIONS.nml];

const ABILITIES = [
  { id: 'mortar', key: 'ability_mortar', label: 'Mortier' },
  { id: 'gas', key: 'ability_gas', label: 'Gasinzet' },
  { id: 'reserves', key: 'ability_reserves', label: 'Reserves' },
];

export default class UIScene extends Phaser.Scene {
  constructor() { super('UI'); }

  create() {
    this.buildIcons = {};
    this._buildTopHud();
    this._buildAbilityBar();
    this._buildBottomPanel();

    const gameScene = this.scene.get('Game');
    this.gameScene = gameScene;

    gameScene.events.on('trench-hp-changed', (hp, maxHp) => {
      const pct = Phaser.Math.Clamp(hp / maxHp, 0, 1);
      this.hpBar.width = 320 * pct;
      this.hpBar.setFillStyle(pct > 0.5 ? 0x5fae4a : pct > 0.2 ? 0xd9a441 : 0xd8453b);
    });
    gameScene.events.on('wave-changed', (wave, total) => {
      this.waveText.setText(`GOLF ${wave} / ${total || TOTAL_WAVES}`);
    });
    gameScene.events.on('supplies-changed', (value) => {
      this.suppliesText.setText(`${value}`);
    });
    gameScene.events.on('phase-changed', (phase) => this._onPhaseChanged(phase));
    gameScene.events.on('build-selection-changed', (defId) => this._onSelectionChanged(defId));
    gameScene.events.on('ability-armed-changed', (armed) => this._onAbilityArmedChanged(armed));
    gameScene.events.on('ability-cooldowns-changed', (cd) => this._onCooldownsChanged(cd));

    this._onPhaseChanged('prep');
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

    const pauseBtn = this.add.text(GAME_WIDTH - 30, y + height / 2, '⏸', {
      fontFamily: 'Georgia, serif', fontSize: '26px', color: '#f0e6c8',
    }).setOrigin(0.5).setDepth(DEPTH.UI).setInteractive({ useHandCursor: true });
    pauseBtn.on('pointerover', () => pauseBtn.setColor('#ffffff'));
    pauseBtn.on('pointerout', () => pauseBtn.setColor('#f0e6c8'));
    pauseBtn.on('pointerdown', () => this.gameScene.events.emit('request-pause'));
  }

  _buildAbilityBar() {
    const { y, height } = ZONES.abilityBar;
    this.add.image(GAME_WIDTH / 2, y + height / 2, 'ability_bar_bg')
      .setDisplaySize(GAME_WIDTH, height).setDepth(DEPTH.UI);

    this.abilityIcons = {};
    const startX = GAME_WIDTH / 2 - (ABILITIES.length - 1) * 70;
    ABILITIES.forEach((ab, i) => {
      const x = startX + i * 140;
      const cy = y + height / 2;
      const icon = this.add.image(x, cy, ab.key)
        .setDisplaySize(38, 38).setDepth(DEPTH.UI).setInteractive({ useHandCursor: true });
      const label = this.add.text(x + 26, cy, ab.label, {
        fontFamily: 'Georgia, serif', fontSize: '13px', color: '#c9b896',
      }).setOrigin(0, 0.5).setDepth(DEPTH.UI);
      const ring = this.add.circle(x, cy, 24).setStrokeStyle(2, 0xf4e04d, 0).setDepth(DEPTH.UI);
      const cooldownOverlay = this.add.rectangle(x, cy, 38, 38, 0x000000, 0.6).setDepth(DEPTH.UI + 1).setVisible(false);

      icon.on('pointerover', () => icon.setTint(0xdddddd));
      icon.on('pointerout', () => icon.clearTint());
      icon.on('pointerdown', () => this.gameScene.events.emit('request-arm-ability', ab.id));

      this.abilityIcons[ab.id] = { icon, label, ring, cooldownOverlay, baseLabel: ab.label };
    });
  }

  _buildBottomPanel() {
    const { y, height } = ZONES.buildPanel;
    this.add.image(GAME_WIDTH / 2, y + height / 2, 'panel_bg')
      .setDisplaySize(GAME_WIDTH, height).setDepth(DEPTH.UI);

    const cy = y + height / 2;
    BUILD_ORDER.forEach((defId, i) => {
      const def = StructureDefs[defId];
      const x = 70 + i * 128;
      const icon = this.add.image(x, cy - 22, def.icon)
        .setDisplaySize(48, 48).setDepth(DEPTH.UI).setInteractive({ useHandCursor: true });
      const label = this.add.text(x, cy + 10, def.label, {
        fontFamily: 'Georgia, serif', fontSize: '11px', color: '#f0e6c8', align: 'center',
        wordWrap: { width: 118 },
      }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
      const priceText = this.add.text(x, cy + 42, `${def.levels[0].price}`, {
        fontFamily: 'Georgia, serif', fontSize: '13px', color: '#d9b45c',
      }).setOrigin(0.5).setDepth(DEPTH.UI);
      const ring = this.add.circle(x, cy - 22, 30).setStrokeStyle(2, 0xf4e04d, 0).setDepth(DEPTH.UI);

      icon.on('pointerover', () => icon.setTint(0xdddddd));
      icon.on('pointerout', () => icon.clearTint());
      icon.on('pointerdown', () => this.gameScene.events.emit('request-select-build', defId));

      this.buildIcons[defId] = { icon, label, priceText, ring };
    });

    this.startWaveBtn = this.add.image(GAME_WIDTH - 110, cy, 'button_frame')
      .setDisplaySize(180, 64).setDepth(DEPTH.UI).setInteractive({ useHandCursor: true });
    this.startWaveText = this.add.text(GAME_WIDTH - 110, cy, 'START GOLF', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(DEPTH.UI + 1);
    this.startWaveBtn.on('pointerover', () => this.startWaveBtn.setTint(0xdddddd));
    this.startWaveBtn.on('pointerout', () => this.startWaveBtn.clearTint());
    this.startWaveBtn.on('pointerdown', () => this.gameScene.events.emit('request-start-wave'));
  }

  _onAbilityArmedChanged(armed) {
    Object.entries(this.abilityIcons).forEach(([id, refs]) => {
      refs.ring.setStrokeStyle(2, 0xf4e04d, id === armed ? 1 : 0);
    });
  }

  _onCooldownsChanged({ mortar, gas, reservesPool, reservesMax }) {
    this.abilityIcons.mortar.cooldownOverlay.setVisible(mortar > 0);
    this.abilityIcons.gas.cooldownOverlay.setVisible(gas > 0);
    this.abilityIcons.reserves.label.setText(`Reserves ${reservesPool}/${reservesMax}`);
    this.abilityIcons.reserves.cooldownOverlay.setVisible(reservesPool <= 0);
  }

  _onSelectionChanged(selectedDefId) {
    Object.entries(this.buildIcons).forEach(([defId, refs]) => {
      refs.ring.setStrokeStyle(2, 0xf4e04d, defId === selectedDefId ? 1 : 0);
    });
  }

  _onPhaseChanged(phase) {
    const prep = phase === 'prep';
    const alpha = prep ? 1 : 0.4;
    Object.values(this.buildIcons).forEach(({ icon, priceText }) => {
      icon.setAlpha(alpha);
      priceText.setAlpha(alpha);
    });
    this.startWaveBtn.setVisible(prep);
    this.startWaveText.setVisible(prep);
    if (!prep) this._onSelectionChanged(null);
  }
}
