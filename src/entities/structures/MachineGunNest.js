import { DEPTH, TRENCH_X, TRENCH_WIDTH } from '../../data/Constants.js';
import { tracer, screenShake } from '../../utils/FX.js';

const LEVELS = [
  null,
  { textureKey: 'machinegun_level1', damage: 6, fireIntervalMs: 220 },
  { textureKey: 'machinegun_level2', damage: 10, fireIntervalMs: 190 },
  { textureKey: 'machinegun_level3', damage: 16, fireIntervalMs: 150 },
];

// Machinegeweer-nest: voorste rij van de loopgraaf, vuurt automatisch op de
// dichtstbijzijnde levende vijand in zijn eigen lane.
export default class MachineGunNest {
  constructor(scene, laneIndex, laneSystem, level = 1) {
    this.scene = scene;
    this.laneIndex = laneIndex;
    this.laneSystem = laneSystem;
    this.level = level;
    this.lastFireTime = 0;

    const x = TRENCH_X + TRENCH_WIDTH * 0.75;
    const y = laneSystem.laneCenterY(laneIndex);
    this.x = x;
    this.y = y;

    const cfg = LEVELS[level];
    this.sprite = scene.add.image(x, y, cfg.textureKey);
    this.sprite.setDisplaySize(56, 56);
    this.sprite.setAngle(90); // wijst naar rechts, richting no man's land
    this.sprite.setDepth(DEPTH.STRUCTURE);
  }

  get config() { return LEVELS[this.level]; }

  update(time, enemies) {
    const target = this._findTarget(enemies);
    if (!target) return;
    if (time - this.lastFireTime < this.config.fireIntervalMs) return;

    this.lastFireTime = time;
    target.takeDamage(this.config.damage);
    tracer(this.scene, this.x, this.y, target.x, target.y);
    this.scene.tweens.add({
      targets: this.sprite, angle: 90 + Phaser.Math.Between(-2, 2), duration: 40, yoyo: true,
    });
    screenShake(this.scene, 40, 0.0008);
  }

  _findTarget(enemies) {
    let nearest = null;
    let nearestDist = Infinity;
    for (const enemy of enemies) {
      if (!enemy.alive || enemy.laneIndex !== this.laneIndex) continue;
      const dist = enemy.x - this.x;
      if (dist < -10) continue; // al voorbij het nest
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = enemy;
      }
    }
    return nearest;
  }

  destroy() {
    this.sprite.destroy();
  }
}
