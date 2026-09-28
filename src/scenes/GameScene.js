import { GAME_WIDTH, GAME_HEIGHT, DEPTH, TOTAL_WAVES } from '../data/Constants.js';
import LaneSystem from '../systems/LaneSystem.js';
import SpawnSystem from '../systems/SpawnSystem.js';
import EconomySystem from '../systems/EconomySystem.js';
import BuildSystem from '../systems/BuildSystem.js';
import Waves from '../data/Waves.js';
import { floatingText, screenShake } from '../utils/FX.js';

const START_SUPPLIES = 150;
const START_TRENCH_HP = 100;
const WAVE_END_BONUS = 40;

export default class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
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

    this.economy = new EconomySystem(this, START_SUPPLIES);
    this.buildSystem = new BuildSystem(this, this.laneSystem, this.economy);
    this.spawnSystem = new SpawnSystem(this, this.laneSystem);

    this.events.on('enemy-breach', this._onEnemyBreach, this);
    this.events.on('enemy-killed', this._onEnemyKilled, this);
    this.events.on('wave-complete', this._onWaveComplete, this);
    this.events.on('request-start-wave', this._startWave, this);
    this.events.on('request-select-build', (defId) => this.buildSystem.selectType(defId));

    this.scene.launch('UI');
    this.events.emit('trench-hp-changed', this.trenchHp, this.trenchMaxHp);
    this.events.emit('wave-changed', this.waveNumber, TOTAL_WAVES);
    this.events.emit('phase-changed', this.phase);
  }

  update(time, delta) {
    if (this.gameOver) return;
    this.buildSystem.update(time, delta, this.spawnSystem.enemies);
    if (this.phase === 'combat') {
      this.spawnSystem.update(delta);
      this.spawnSystem.enemies.forEach((e) => { e.speedMultiplier = 1; });
    }
  }

  _startWave() {
    if (this.phase !== 'prep' || this.gameOver) return;
    this.phase = 'combat';
    this.buildSystem.setPrepPhase(false);
    this.events.emit('phase-changed', this.phase);
    this.spawnSystem.startWave(Waves[this.waveNumber - 1]);
  }

  _onEnemyBreach(enemy) {
    if (this.gameOver) return;
    const reduction = this.buildSystem.breachReductionFor(enemy.laneIndex);
    const dmg = Math.max(1, enemy.type.breachDamage - reduction);
    this.trenchHp = Math.max(0, this.trenchHp - dmg);
    this.events.emit('trench-hp-changed', this.trenchHp, this.trenchMaxHp);
    floatingText(this, enemy.x, enemy.y, `-${dmg} linie`, '#ff8a65');
    screenShake(this, 150, 0.006);
    enemy.destroy();
    if (this.trenchHp <= 0) this._onGameOver();
  }

  _onEnemyKilled(enemy) {
    this.economy.add(enemy.type.reward);
    floatingText(this, enemy.x, enemy.y, `+${enemy.type.reward}`, '#f4e04d');
  }

  _onWaveComplete() {
    if (this.gameOver) return;
    this.economy.add(WAVE_END_BONUS);

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
    const w = GAME_WIDTH / 2, h = GAME_HEIGHT / 2;
    this.add.rectangle(w, h, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.55).setDepth(DEPTH.UI);
    this.add.text(w, h, 'DE LINIE HEEFT STANDGEHOUDEN', {
      fontFamily: 'Georgia, serif', fontSize: '48px', color: '#f4e04d', fontStyle: 'bold', align: 'center',
    }).setOrigin(0.5).setDepth(DEPTH.UI + 1).setShadow(0, 4, '#000000', 4, false, true);
  }

  _onGameOver() {
    this.gameOver = true;
    const w = GAME_WIDTH / 2, h = GAME_HEIGHT / 2;
    this.add.rectangle(w, h, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.55).setDepth(DEPTH.UI);
    this.add.text(w, h, 'DE LINIE IS DOORBROKEN', {
      fontFamily: 'Georgia, serif', fontSize: '52px', color: '#d8453b', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(DEPTH.UI + 1).setShadow(0, 4, '#000000', 4, false, true);
  }
}
