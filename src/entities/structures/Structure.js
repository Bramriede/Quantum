import { DEPTH } from '../../data/Constants.js';
import StructureDefs from '../../data/StructureDefs.js';
import { tracer, hitBurst, screenShake } from '../../utils/FX.js';

const ROTATE_RIGHT = new Set(['turret', 'flame', 'mortar']);

// Generieke structuur-entiteit: gedrag wordt bepaald door StructureDefs
// (zie NOTES.md #19 voor het vereenvoudigde 3-sloten-per-lane model).
export default class Structure {
  constructor(scene, laneIndex, laneSystem, slotType, defId, level = 1) {
    this.scene = scene;
    this.laneIndex = laneIndex;
    this.laneSystem = laneSystem;
    this.slotType = slotType; // 'front' | 'back' | 'nml'
    this.defId = defId;
    this.level = level;
    this.def = StructureDefs[defId];
    this.lastFireTime = 0;
    this.destroyed = false;

    const slot = this._slot();
    this.x = slot.x;
    this.y = slot.y;

    const cfg = this.levelCfg;
    this.sprite = scene.add.image(this.x, this.y, cfg.textureKey);
    this.sprite.setDisplaySize(this.def.displaySize.w, this.def.displaySize.h);
    this.sprite.setAngle(ROTATE_RIGHT.has(this.def.behavior) ? 90 : 0);
    this.sprite.setDepth(DEPTH.STRUCTURE);

    slot.structure = this;
  }

  get levelCfg() { return this.def.levels[this.level - 1]; }

  _slot() {
    const lane = this.laneSystem.lanes[this.laneIndex];
    return lane[`${this.slotType}Slot`];
  }

  upgrade() {
    if (this.level >= this.def.maxLevel) return false;
    this.level += 1;
    this.sprite.setTexture(this.levelCfg.textureKey);
    return true;
  }

  update(time, delta, enemies) {
    if (this.destroyed) return;
    switch (this.def.behavior) {
      case 'turret': this._updateTurret(time, enemies); break;
      case 'flame': this._updateFlame(delta, enemies); break;
      case 'mortar': this._updateMortar(time, enemies); break;
      case 'barrier': this._updateBarrier(delta, enemies); break;
      case 'mine': this._updateMine(enemies); break;
      default: break;
    }
  }

  _lane_enemies_ahead(enemies) {
    return enemies.filter((e) => e.alive && e.laneIndex === this.laneIndex && e.x - this.x > -10);
  }

  _updateTurret(time, enemies) {
    if (time - this.lastFireTime < this.levelCfg.fireIntervalMs) return;
    const candidates = this._lane_enemies_ahead(enemies);
    if (candidates.length === 0) return;
    const target = candidates.reduce((a, b) => (a.x < b.x ? a : b));
    this.lastFireTime = time;
    let dmg = this.levelCfg.damage;
    if (this.levelCfg.vsTankMultiplier && target.type.category === 'vehicle') {
      dmg *= this.levelCfg.vsTankMultiplier;
    }
    target.takeDamage(dmg);
    tracer(this.scene, this.x, this.y, target.x, target.y, 0xffe27a);
    screenShake(this.scene, 40, this.def.id === 'atgun' ? 0.004 : 0.0008);
  }

  _updateFlame(delta, enemies) {
    const candidates = this._lane_enemies_ahead(enemies)
      .filter((e) => e.x - this.x <= this.levelCfg.range);
    if (candidates.length === 0) return;
    const target = candidates.reduce((a, b) => (a.x < b.x ? a : b));
    target.takeDamage((this.levelCfg.dps * delta) / 1000);
    if (Math.random() < 0.25) hitBurst(this.scene, target.x, target.y, 0xff8a3d, 3);
  }

  _updateMortar(time, enemies) {
    if (time - this.lastFireTime < this.levelCfg.fireIntervalMs) return;
    const candidates = this._lane_enemies_ahead(enemies);
    if (candidates.length === 0) return;
    const target = Phaser.Utils.Array.GetRandom(candidates);
    this.lastFireTime = time;

    const shell = this.scene.add.circle(this.x, this.y, 4, 0x2b2018);
    shell.setDepth(DEPTH.PROJECTILE);
    this.scene.tweens.add({
      targets: shell,
      x: target.x,
      y: target.y,
      duration: 380,
      onComplete: () => {
        shell.destroy();
        if (target.alive) target.takeDamage(this.levelCfg.damage);
        hitBurst(this.scene, target.x, target.y, 0xd8453b, 10);
        screenShake(this.scene, 90, 0.003);
      },
    });
  }

  _updateBarrier(delta, enemies) {
    const band = 26;
    enemies.forEach((e) => {
      if (!e.alive || e.laneIndex !== this.laneIndex) return;
      if (Math.abs(e.x - this.x) > band) return;
      const slow = e.type.category === 'vehicle' ? this.levelCfg.tankSlowFactor : this.levelCfg.slowFactor;
      e.speedMultiplier = Math.min(e.speedMultiplier, slow);
      if (this.levelCfg.dps > 0) e.takeDamage((this.levelCfg.dps * delta) / 1000);
    });
  }

  _updateMine(enemies) {
    const target = enemies.find((e) => e.alive && e.laneIndex === this.laneIndex
      && e.type.category === this.levelCfg.targetCategory
      && Math.abs(e.x - this.x) <= 14);
    if (!target) return;
    target.takeDamage(this.levelCfg.damage);
    hitBurst(this.scene, this.x, this.y, 0xffb84d, 14);
    screenShake(this.scene, 160, 0.006);
    this.destroy();
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    const slot = this._slot();
    if (slot.structure === this) slot.structure = null;
    this.sprite.destroy();
  }
}
