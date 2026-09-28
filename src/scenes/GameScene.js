import { GAME_WIDTH, GAME_HEIGHT, DEPTH, TOTAL_WAVES } from '../data/Constants.js';
import LaneSystem from '../systems/LaneSystem.js';
import SpawnSystem from '../systems/SpawnSystem.js';
import EconomySystem from '../systems/EconomySystem.js';
import BuildSystem from '../systems/BuildSystem.js';
import GasHazardSystem from '../systems/GasHazardSystem.js';
import AbilitySystem from '../systems/AbilitySystem.js';
import SaveManager from '../systems/SaveManager.js';
import Waves from '../data/Waves.js';
import { floatingText, screenShake } from '../utils/FX.js';

const START_SUPPLIES = 150;
const START_TRENCH_HP = 100;
const WAVE_END_BONUS = 40;

export default class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    this.audio = this.registry.get('audio');

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'battlefield_bg')
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(DEPTH.BACKGROUND);

    this.laneSystem = new LaneSystem(this);
    this.laneSystem.drawDividers();

    this.trenchHp = START_TRENCH_HP;
    this.trenchMaxHp = START_TRENCH_HP;
    this.waveNumber = 1;
    this.gameOver = false;
    this.phase = 'prep'; // 'prep' | 'combat'
    this.kills = 0;
    this.suppliesEarned = 0;

    this.economy = new EconomySystem(this, START_SUPPLIES);
    this.buildSystem = new BuildSystem(this, this.laneSystem, this.economy);
    this.spawnSystem = new SpawnSystem(this, this.laneSystem);
    this.gasHazard = new GasHazardSystem(this, this.laneSystem);
    this.abilitySystem = new AbilitySystem(this, this.laneSystem);

    this.events.on('enemy-breach', this._onEnemyBreach, this);
    this.events.on('enemy-killed', this._onEnemyKilled, this);
    this.events.on('enemy-ranged-attack', this._onEnemyRangedAttack, this);
    this.events.on('wave-complete', this._onWaveComplete, this);
    this.events.on('request-start-wave', this._startWave, this);
    this.events.on('request-pause', this._openPause, this);
    this.events.on('request-select-build', (defId) => {
      this.abilitySystem.armed = null;
      this.events.emit('ability-armed-changed', null);
      this.buildSystem.selectType(defId);
      if (this.audio) this.audio.playClick();
    });
    this.events.on('request-arm-ability', (key) => {
      this.buildSystem.selectedDefId = null;
      this.events.emit('build-selection-changed', null);
      this.abilitySystem.arm(key);
      if (this.audio) this.audio.playClick();
    });
    this.events.on('ability-impact', this._onAbilityImpact, this);

    this.input.keyboard.on('keydown-ESC', () => this._openPause());

    this.scene.launch('UI');
    this.events.emit('trench-hp-changed', this.trenchHp, this.trenchMaxHp);
    this.events.emit('wave-changed', this.waveNumber, TOTAL_WAVES);
    this.events.emit('phase-changed', this.phase);

    this.events.once('shutdown', () => this._cleanup());
  }

  _cleanup() {
    this.input.keyboard.removeAllListeners('keydown-ESC');
  }

  _openPause() {
    if (this.gameOver) return;
    this.scene.pause('Game');
    this.scene.pause('UI');
    this.scene.launch('Pause');
  }

  update(time, delta) {
    if (this.gameOver) return;
    this.buildSystem.update(time, delta, this.spawnSystem.enemies);
    this.abilitySystem.update(time, delta, this.spawnSystem.enemies);
    if (this.phase === 'combat') {
      this.spawnSystem.update(time, delta);
      this.spawnSystem.enemies.forEach((e) => { e.speedMultiplier = 1; });
      this.gasHazard.update(time, this.waveNumber);
    }
  }

  _startWave() {
    if (this.phase !== 'prep' || this.gameOver) return;
    this.phase = 'combat';
    this.buildSystem.setPrepPhase(false);
    this.events.emit('phase-changed', this.phase);
    this.spawnSystem.startWave(Waves[this.waveNumber - 1]);
    this.gasHazard.reset(this.time.now);
    if (this.audio) this.audio.playAlarm();
  }

  _onEnemyRangedAttack(enemy) {
    if (this.gameOver) return;
    this.trenchHp = Math.max(0, this.trenchHp - enemy.type.rangedAttack.damage);
    this.events.emit('trench-hp-changed', this.trenchHp, this.trenchMaxHp);
    floatingText(this, enemy.laneSystem.trenchFrontX() + 30, enemy.y, `-${enemy.type.rangedAttack.damage} inslag`, '#ff8a65');
    if (this.audio) this.audio.playExplosion();
    if (this.trenchHp <= 0) this._onGameOver();
  }

  _onAbilityImpact({ laneIndex, x, radius, damage }) {
    if (this.audio) this.audio.playExplosion();
    this.spawnSystem.enemies.forEach((e) => {
      if (!e.alive || e.laneIndex !== laneIndex) return;
      if (Math.abs(e.x - x) <= radius) e.takeDamage(damage);
    });
  }

  _onEnemyBreach(enemy) {
    if (this.gameOver) return;
    const reduction = enemy.type.ignoresWallReduction ? 0 : this.buildSystem.breachReductionFor(enemy.laneIndex);
    const dmg = Math.max(1, enemy.type.breachDamage - reduction);
    this.trenchHp = Math.max(0, this.trenchHp - dmg);
    this.events.emit('trench-hp-changed', this.trenchHp, this.trenchMaxHp);
    floatingText(this, enemy.x, enemy.y, `-${dmg} linie`, '#ff8a65');
    screenShake(this, 150, 0.006);
    if (this.audio) this.audio.playBreach();
    enemy.destroy();
    if (this.trenchHp <= 0) this._onGameOver();
  }

  _onEnemyKilled(enemy) {
    this.economy.add(enemy.type.reward);
    this.kills += 1;
    this.suppliesEarned += enemy.type.reward;
    floatingText(this, enemy.x, enemy.y, `+${enemy.type.reward}`, '#f4e04d');
    if (this.audio) this.audio.playCoin();
  }

  _onWaveComplete() {
    if (this.gameOver) return;
    this.economy.add(WAVE_END_BONUS);
    this.suppliesEarned += WAVE_END_BONUS;

    if (this.waveNumber >= Waves.length) {
      this._onAllWavesDone();
      return;
    }

    this.waveNumber += 1;
    this.phase = 'prep';
    this.buildSystem.setPrepPhase(true);
    this.events.emit('wave-changed', this.waveNumber, TOTAL_WAVES);
    this.events.emit('phase-changed', this.phase);

    const w = GAME_WIDTH / 2, h = GAME_HEIGHT / 2;
    const txt = this.add.text(w, h, `GOLF ${this.waveNumber - 1} VOLTOOID\n+${WAVE_END_BONUS} voorraad`, {
      fontFamily: 'Georgia, serif', fontSize: '40px', color: '#f4e04d', fontStyle: 'bold', align: 'center',
    }).setOrigin(0.5).setDepth(DEPTH.UI).setShadow(0, 4, '#000000', 4, false, true);
    this.tweens.add({ targets: txt, alpha: 0, delay: 1200, duration: 500, onComplete: () => txt.destroy() });
  }

  _onAllWavesDone() {
    this.gameOver = true;
    SaveManager.reportRunResult({ waveReached: this.waveNumber, won: true });
    const stats = { kills: this.kills, suppliesEarned: this.suppliesEarned };
    this.time.delayedCall(400, () => {
      this.scene.stop('UI');
      this.scene.stop('Game');
      this.scene.start('Victory', stats);
    });
  }

  _onGameOver() {
    this.gameOver = true;
    SaveManager.reportRunResult({ waveReached: this.waveNumber, won: false });
    const stats = { waveReached: this.waveNumber, kills: this.kills, suppliesEarned: this.suppliesEarned };
    this.time.delayedCall(400, () => {
      this.scene.stop('UI');
      this.scene.stop('Game');
      this.scene.start('GameOver', stats);
    });
  }
}
