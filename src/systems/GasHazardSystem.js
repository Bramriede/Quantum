import { DEPTH } from '../data/Constants.js';

const MIN_INTERVAL = 14000;
const MAX_INTERVAL = 22000;
const GAS_DURATION = 6500;

// Periodiek mosterdgas-gevaar vanaf golf 5 (zie PLAN.md). Geen los asset
// nodig: de wolk is een groepje code-getekende, driftende semi-transparante
// cirkels (zie NOTES.md).
export default class GasHazardSystem {
  constructor(scene, laneSystem) {
    this.scene = scene;
    this.laneSystem = laneSystem;
    this.active = false;
    this._nextEventAt = null;
  }

  reset(startWaveTime) {
    this._nextEventAt = startWaveTime + Phaser.Math.Between(MIN_INTERVAL, MAX_INTERVAL);
  }

  update(time, waveNumber) {
    if (waveNumber < 5 || this._nextEventAt === null) return;
    if (this.active || time < this._nextEventAt) return;
    this._trigger(time);
  }

  _trigger(time) {
    this.active = true;
    const laneCount = Phaser.Math.Between(1, 3);
    const lanes = Phaser.Utils.Array.Shuffle(this.laneSystem.lanes.map((l) => l.index)).slice(0, laneCount);

    lanes.forEach((laneIndex) => {
      const lane = this.laneSystem.lanes[laneIndex];
      lane.gassed = true;
      this._spawnCloud(lane);
    });

    this.scene.time.delayedCall(GAS_DURATION, () => {
      lanes.forEach((laneIndex) => { this.laneSystem.lanes[laneIndex].gassed = false; });
      this.active = false;
      this._nextEventAt = time + GAS_DURATION + Phaser.Math.Between(MIN_INTERVAL, MAX_INTERVAL);
    });
  }

  _spawnCloud(lane) {
    const centerX = Phaser.Math.Between(this.laneSystem.trenchFrontX() + 200, this.laneSystem.trenchFrontX() + 600);
    const dots = [];
    for (let i = 0; i < 10; i++) {
      const dx = Phaser.Math.Between(-70, 70);
      const dy = Phaser.Math.Between(-30, 30);
      const c = this.scene.add.circle(centerX + dx, lane.centerY + dy, Phaser.Math.Between(20, 34), 0x9acb4f, 0.22);
      c.setDepth(DEPTH.HAZARD);
      dots.push(c);
      this.scene.tweens.add({
        targets: c,
        x: c.x - 90,
        alpha: { from: 0.22, to: 0.08 },
        duration: GAS_DURATION,
        ease: 'Sine.easeInOut',
      });
    }
    this.scene.time.delayedCall(GAS_DURATION, () => dots.forEach((d) => d.destroy()));

    // Gasmasker-indicatie: als de lane al een Gasmaskerpost heeft, toon een
    // beschermend icoontje boven de structuren i.p.v. een nieuw "soldaat met
    // masker"-plaatje (hergebruikt icon_gasmask, zie NOTES.md).
    if (lane.backSlot.structure && lane.backSlot.structure.defId === 'gasmask') {
      const shield = this.scene.add.image(lane.backSlot.x, lane.backSlot.y - 40, 'icon_gasmask').setDisplaySize(28, 28);
      shield.setDepth(DEPTH.HAZARD + 1).setAlpha(0.9);
      this.scene.tweens.add({ targets: shield, y: shield.y - 10, duration: GAS_DURATION, onComplete: () => shield.destroy() });
    }
  }
}
