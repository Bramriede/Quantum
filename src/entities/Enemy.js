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
    this.gasImpaired = false;
    this._lastRangedAttack = 0;

    const y = laneSystem.laneCenterY(laneIndex);
    const x = laneSystem.lanes[laneIndex].spawnX;
    this.stopX = typeConfig.stationaryOffsetX ? x - typeConfig.stationaryOffsetX : null;

    this.sprite = scene.add.image(x, y, typeConfig.textureKey);
    this.sprite.setDisplaySize(typeConfig.displaySize, typeConfig.displaySize);
    this.sprite.setAngle(-90);
    this.sprite.setDepth(DEPTH.UNIT);
    this.baseY = y;
    this.speedMultiplier = 1;
    this._walkPhase = Phaser.Math.FloatBetween(0, Math.PI * 2);
    this._dustTimer = 0;
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }

  update(delta, time) {
    if (!this.alive || this.reachedTrench) return;

    const stationaryHere = this.stopX !== null && this.sprite.x <= this.stopX;
    if (!stationaryHere) {
      const dx = (this.type.speed * this.speedMultiplier * delta) / 1000;
      this.sprite.x -= dx;
    }

    // Lichte "waggel" i.p.v. een echte loop-cyclus (zie NOTES.md).
    this._walkPhase += delta * 0.012;
    this.sprite.y = this.baseY + Math.sin(this._walkPhase) * 2.2;
    this.sprite.setAngle(-90 + Math.sin(this._walkPhase * 0.9) * 5);

    if (this.type.category === 'vehicle') {
      this._dustTimer += delta;
      if (this._dustTimer > 140) {
        this._dustTimer = 0;
        const d = this.scene.add.circle(this.sprite.x + 18, this.sprite.y + 6, 5, 0x8a7a5c, 0.5);
        d.setDepth(DEPTH.PARTICLE);
        this.scene.tweens.add({
          targets: d, x: d.x + 14, alpha: 0, radius: 12, duration: 500, onComplete: () => d.destroy(),
        });
      }
    }

    if (stationaryHere && this.type.rangedAttack) {
      if (time - this._lastRangedAttack > this.type.rangedAttack.intervalMs) {
        this._lastRangedAttack = time;
        this.scene.events.emit('enemy-ranged-attack', this);
      }
      return;
    }

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
    } else {
      const audio = this.scene.registry.get('audio');
      if (audio && Math.random() < 0.35) audio.playHit();
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
