import EnemyTypes from '../data/EnemyTypes.js';
import Enemy from '../entities/Enemy.js';
import { LANE_COUNT } from '../data/Constants.js';

// Spawnt vijanden voor de huidige golf, verspreid over willekeurige lanes,
// en meldt wanneer de golf klaar is (alles gespawned + alles dood/doorgebroken).
export default class SpawnSystem {
  constructor(scene, laneSystem) {
    this.scene = scene;
    this.laneSystem = laneSystem;
    this.enemies = [];
    this.pendingSpawns = [];
    this.spawningDone = false;
    this.waveActive = false;
  }

  startWave(waveDef) {
    this.waveActive = true;
    this.spawningDone = false;
    this.pendingSpawns = [];

    waveDef.spawns.forEach((group) => {
      let t = group.startDelay || 0;
      for (let i = 0; i < group.count; i++) {
        this.pendingSpawns.push({ time: t, type: group.type });
        t += group.interval;
      }
    });
    this.pendingSpawns.sort((a, b) => a.time - b.time);
    this._elapsed = 0;
  }

  update(time, delta) {
    if (!this.waveActive) return;
    this._elapsed += delta;

    while (this.pendingSpawns.length && this.pendingSpawns[0].time <= this._elapsed) {
      const spawn = this.pendingSpawns.shift();
      this._spawnEnemy(spawn.type);
    }
    if (this.pendingSpawns.length === 0) this.spawningDone = true;

    this.enemies.forEach((e) => e.update(delta, time));
    this.enemies = this.enemies.filter((e) => e.alive && !e.reachedTrench);

    if (this.spawningDone && this.enemies.length === 0 && this.waveActive) {
      this.waveActive = false;
      this.scene.events.emit('wave-complete');
    }
  }

  _spawnEnemy(typeKey) {
    const laneIndex = Phaser.Math.Between(0, LANE_COUNT - 1);
    const typeConfig = EnemyTypes[typeKey];
    const enemy = new Enemy(this.scene, laneIndex, this.laneSystem, typeConfig);
    this.enemies.push(enemy);
  }
}
