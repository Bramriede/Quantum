import { DEPTH } from '../data/Constants.js';
import { hitBurst, screenShake, tracer } from '../utils/FX.js';

const ABILITY_CFG = {
  mortar: { cooldownMs: 25000, delayMs: 900, damage: 60, radius: 85 },
  gas: { cooldownMs: 35000, durationMs: 6000, dps: 14, slowFactor: 0.45, radius: 90 },
  reserves: { poolMax: 3, durationMs: 30000, rechargeMs: 20000, fireRateBoost: 0.5 },
};

// Actieve vaardigheden tijdens een golf: gratis, cooldown-gebaseerd, apart
// van de bouw-economie (zie PLAN.md). Klik een icoon in de vaardighedenbalk
// (UIScene) om te "wapenen", klik daarna op een lane in het slagveld.
export default class AbilitySystem {
  constructor(scene, laneSystem) {
    this.scene = scene;
    this.laneSystem = laneSystem;
    this.armed = null;
    this.cooldowns = { mortar: 0, gas: 0, reserves: 0 };
    this.reservesPool = ABILITY_CFG.reserves.poolMax;
    this.activeGasZones = [];

    scene.input.on('pointerdown', (pointer) => this._onPointerDown(pointer));
    this._emitCooldowns(0);
  }

  arm(key) {
    if (this.cooldowns[key] > 0) return;
    if (key === 'reserves' && this.reservesPool <= 0) return;
    this.armed = this.armed === key ? null : key;
    this.scene.events.emit('ability-armed-changed', this.armed);
  }

  update(time, delta, enemies) {
    Object.keys(this.cooldowns).forEach((k) => {
      if (this.cooldowns[k] > 0) this.cooldowns[k] = Math.max(0, this.cooldowns[k] - delta);
    });
    this._emitCooldowns(time);

    // Offensieve gaswolken: DPS + vertraging op vijanden binnen bereik.
    this.activeGasZones.forEach((zone) => {
      enemies.forEach((e) => {
        if (!e.alive || e.laneIndex !== zone.laneIndex) return;
        if (Math.abs(e.x - zone.x) > ABILITY_CFG.gas.radius) return;
        e.speedMultiplier = Math.min(e.speedMultiplier, ABILITY_CFG.gas.slowFactor);
        e.takeDamage((ABILITY_CFG.gas.dps * delta) / 1000);
      });
    });
  }

  _onPointerDown(pointer) {
    if (!this.armed) return;
    const laneIndex = this._laneAtY(pointer.y);
    if (laneIndex === null) return;
    if (pointer.x < this.laneSystem.trenchFrontX()) return; // alleen in no man's land targetten

    const key = this.armed;
    this.armed = null;
    this.scene.events.emit('ability-armed-changed', null);

    if (key === 'mortar') this._useMortar(laneIndex, pointer.x);
    else if (key === 'gas') this._useGas(laneIndex, pointer.x);
    else if (key === 'reserves') this._useReserves(laneIndex);
  }

  _laneAtY(y) {
    for (const lane of this.laneSystem.lanes) {
      if (y >= lane.top && y <= lane.bottom) return lane.index;
    }
    return null;
  }

  _useMortar(laneIndex, x) {
    this.cooldowns.mortar = ABILITY_CFG.mortar.cooldownMs;
    const lane = this.laneSystem.lanes[laneIndex];
    const marker = this.scene.add.circle(x, lane.centerY, 14, 0xff4d4d, 0.5);
    marker.setDepth(DEPTH.HAZARD);
    this.scene.tweens.add({ targets: marker, radius: 24, alpha: 0, duration: ABILITY_CFG.mortar.delayMs });

    this.scene.time.delayedCall(ABILITY_CFG.mortar.delayMs, () => {
      marker.destroy();
      hitBurst(this.scene, x, lane.centerY, 0xd8453b, 16);
      screenShake(this.scene, 180, 0.006);
      this.scene.events.emit('ability-impact', { key: 'mortar', laneIndex, x, radius: ABILITY_CFG.mortar.radius, damage: ABILITY_CFG.mortar.damage });
    });
  }

  _useGas(laneIndex, x) {
    this.cooldowns.gas = ABILITY_CFG.gas.cooldownMs;
    const lane = this.laneSystem.lanes[laneIndex];
    const zone = { laneIndex, x };
    this.activeGasZones.push(zone);

    const dots = [];
    for (let i = 0; i < 8; i++) {
      const c = this.scene.add.circle(x + Phaser.Math.Between(-50, 50), lane.centerY + Phaser.Math.Between(-25, 25), Phaser.Math.Between(18, 30), 0xd9c23f, 0.24);
      c.setDepth(DEPTH.HAZARD);
      dots.push(c);
    }
    this.scene.time.delayedCall(ABILITY_CFG.gas.durationMs, () => {
      dots.forEach((d) => d.destroy());
      this.activeGasZones = this.activeGasZones.filter((z) => z !== zone);
    });
  }

  _useReserves(laneIndex) {
    if (this.reservesPool <= 0) return;
    this.reservesPool -= 1;
    const lane = this.laneSystem.lanes[laneIndex];
    lane.reserveBoostUntil = this.scene.time.now + ABILITY_CFG.reserves.durationMs;

    const badge = this.scene.add.text(lane.frontSlot.x, lane.top + 14, '★', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#f4e04d',
    }).setOrigin(0.5).setDepth(DEPTH.UI);
    this.scene.time.delayedCall(ABILITY_CFG.reserves.durationMs, () => badge.destroy());

    this.scene.time.delayedCall(ABILITY_CFG.reserves.rechargeMs, () => {
      this.reservesPool = Math.min(ABILITY_CFG.reserves.poolMax, this.reservesPool + 1);
    });
  }

  _emitCooldowns() {
    this.scene.events.emit('ability-cooldowns-changed', {
      mortar: this.cooldowns.mortar / ABILITY_CFG.mortar.cooldownMs,
      gas: this.cooldowns.gas / ABILITY_CFG.gas.cooldownMs,
      reservesPool: this.reservesPool,
      reservesMax: ABILITY_CFG.reserves.poolMax,
    });
  }
}

export { ABILITY_CFG };
