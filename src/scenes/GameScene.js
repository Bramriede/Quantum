import { GAME_WIDTH, GAME_HEIGHT, DEPTH } from '../data/Constants.js';
import LaneSystem from '../systems/LaneSystem.js';
import SpawnSystem from '../systems/SpawnSystem.js';
import MachineGunNest from '../entities/structures/MachineGunNest.js';
import Waves from '../data/Waves.js';
import { floatingText, screenShake } from '../utils/FX.js';

const START_SUPPLIES = 150;
const START_TRENCH_HP = 100;

export default class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'battlefield_bg')
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(DEPTH.BACKGROUND);

    this.laneSystem = new LaneSystem(this);
    this.laneSystem.drawDividers();

    this.supplies = START_SUPPLIES;
    this.trenchHp = START_TRENCH_HP;
    this.trenchMaxHp = START_TRENCH_HP;
    this.waveNumber = 1;
    this.gameOver = false;

    // Fase 2-demo: één machinegeweer alvast geplaatst zodat de kern-loop
    // (spawn -> beweging -> MG-vuur -> dood/doorbraak) te testen is. Het
    // volledige bouwpaneel met economie volgt in Fase 3.
    this.structures = [new MachineGunNest(this, 2, this.laneSystem, 1)];

    this.spawnSystem = new SpawnSystem(this, this.laneSystem);
    this.spawnSystem.startWave(Waves[this.waveNumber - 1]);

    this.events.on('enemy-breach', this._onEnemyBreach, this);
    this.events.on('enemy-killed', this._onEnemyKilled, this);
    this.events.on('wave-complete', this._onWaveComplete, this);

    this.scene.launch('UI');
    this.events.emit('supplies-changed', this.supplies);
    this.events.emit('trench-hp-changed', this.trenchHp, this.trenchMaxHp);
    this.events.emit('wave-changed', this.waveNumber);
  }

  update(time, delta) {
    if (this.gameOver) return;
    this.spawnSystem.update(delta);
    this.structures.forEach((s) => s.update(time, this.spawnSystem.enemies));
  }

  _onEnemyBreach(enemy) {
    if (this.gameOver) return;
    this.trenchHp = Math.max(0, this.trenchHp - enemy.type.breachDamage);
    this.events.emit('trench-hp-changed', this.trenchHp, this.trenchMaxHp);
    floatingText(this, enemy.x, enemy.y, `-${enemy.type.breachDamage} linie`, '#ff8a65');
    screenShake(this, 150, 0.006);
    enemy.destroy();
    if (this.trenchHp <= 0) this._onGameOver();
  }

  _onEnemyKilled(enemy) {
    this.supplies += enemy.type.reward;
    this.events.emit('supplies-changed', this.supplies);
    floatingText(this, enemy.x, enemy.y, `+${enemy.type.reward}`, '#f4e04d');
  }

  _onWaveComplete() {
    if (this.gameOver) return;
    const w = GAME_WIDTH / 2, h = GAME_HEIGHT / 2;
    this.add.text(w, h, `GOLF ${this.waveNumber} VOLTOOID`, {
      fontFamily: 'Georgia, serif', fontSize: '48px', color: '#f4e04d', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(DEPTH.UI).setShadow(0, 4, '#000000', 4, false, true);
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
