import { DEPTH } from '../data/Constants.js';
import { hitFlash, hitBurst } from '../utils/FX.js';

// Vijand die van rechts naar links marcheert (zie NOTES.md voor de
// oriëntatie-correctie). Bron-art staat "naar boven gericht" getekend; de
// sprite wordt in code -90° gedraaid zodat hij naar links kijkt/beweegt.
export default class Enemy {
  constructor(scene, laneIndex, laneSystem, typeConfig) {
    this.scene = scene;
    this.laneIndex = laneIndex;
    this.laneSystem = laneSystem;
    this.type = typeConfig;
    this.hp = typeConfig.hp;
    this.maxHp = typeConfig.hp;
    this.alive = true;
    this.reachedTrench = false;

    const y = laneSystem.laneCenterY(laneIndex);
    const x = laneSystem.lanes[laneIndex].spawnX;

    this.sprite = scene.add.image(x, y, typeConfig.textureKey);
    this.sprite.setDisplaySize(typeConfig.displaySize, typeConfig.displaySize);
    this.sprite.setAngle(-90);
    this.sprite.setDepth(DEPTH.UNIT);
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }

  update(delta) {
    if (!this.alive || this.reachedTrench) return;
    const dx = (this.type.speed * delta) / 1000;
    this.sprite.x -= dx;

    const frontX = this.laneSystem.trenchFrontX();
    if (this.sprite.x <= frontX) {
      this.sprite.x = frontX;
      this.reachedTrench = true;
      this.scene.events.emit('enemy-breach', this);
    }
  }

  takeDamage(amount) {
    if (!this.alive) return;
    this.hp -= amount;
    hitFlash(this.scene, this.sprite);
    hitBurst(this.scene, this.sprite.x, this.sprite.y);
    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    if (!this.alive) return;
    this.alive = false;
    this.scene.events.emit('enemy-killed', this);
    // Val-animatie i.p.v. direct verdwijnen (zie NOTES.md: geen los
    // "dood"-plaatje nodig, dit lost code-side op).
    this.scene.tweens.add({
      targets: this.sprite,
      angle: this.sprite.angle + Phaser.Math.Between(70, 110),
      alpha: 0,
      scale: this.sprite.scale * 0.85,
      duration: 420,
      ease: 'Cubic.easeOut',
      onComplete: () => this.destroy(),
    });
  }

  destroy() {
    this.sprite.destroy();
  }
}
