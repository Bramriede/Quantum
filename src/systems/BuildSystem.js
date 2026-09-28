import StructureDefs from '../data/StructureDefs.js';
import Structure from '../entities/structures/Structure.js';
import { DEPTH } from '../data/Constants.js';

// Bouwlogica: tijdens de pauzefase kan de speler een structuurtype selecteren
// (vanuit het bouwpaneel) en op een lege/eigen bouwplek in het slagveld
// klikken om te plaatsen of te upgraden. Zie NOTES.md #19 voor het
// 3-sloten-per-lane model (front/back/nml).
export default class BuildSystem {
  constructor(scene, laneSystem, economy) {
    this.scene = scene;
    this.laneSystem = laneSystem;
    this.economy = economy;
    this.selectedDefId = null;
    this.structures = [];
    this.prepPhase = true;

    this.slotMarkers = scene.add.graphics().setDepth(DEPTH.STRUCTURE - 1);
    this._drawSlotMarkers();

    scene.input.on('pointerdown', (pointer) => this._onPointerDown(pointer));
  }

  selectType(defId) {
    if (!this.prepPhase) return;
    this.selectedDefId = this.selectedDefId === defId ? null : defId;
    this.scene.events.emit('build-selection-changed', this.selectedDefId);
  }

  setPrepPhase(active) {
    this.prepPhase = active;
    if (!active) {
      this.selectedDefId = null;
      this.scene.events.emit('build-selection-changed', null);
    }
    this._drawSlotMarkers();
  }

  update(time, delta, enemies) {
    this.structures.forEach((s) => s.update(time, delta, enemies));
  }

  breachReductionFor(laneIndex) {
    const front = this.laneSystem.lanes[laneIndex].frontSlot.structure;
    if (front && front.def.behavior === 'wall') return front.levelCfg.breachReduction;
    return 0;
  }

  _onPointerDown(pointer) {
    if (!this.prepPhase || !this.selectedDefId) return;
    const def = StructureDefs[this.selectedDefId];
    const laneIndex = this._laneAtY(pointer.y);
    if (laneIndex === null) return;

    const lane = this.laneSystem.lanes[laneIndex];
    const slot = lane[`${def.slot}Slot`];
    const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, slot.x, slot.y);
    if (dist > 60) return; // niet dicht genoeg bij deze bouwplek geklikt

    if (slot.structure && slot.structure.defId === this.selectedDefId) {
      this._tryUpgrade(slot.structure);
    } else if (!slot.structure) {
      this._tryPlace(laneIndex, def, slot);
    }
  }

  _laneAtY(y) {
    for (const lane of this.laneSystem.lanes) {
      if (y >= lane.top && y <= lane.bottom) return lane.index;
    }
    return null;
  }

  _tryPlace(laneIndex, def, slot) {
    const cost = def.levels[0].price;
    if (!this.economy.spend(cost)) return;
    const structure = new Structure(this.scene, laneIndex, this.laneSystem, def.slot, def.id, 1);
    this.structures.push(structure);
    this._drawSlotMarkers();
    const audio = this.scene.registry.get('audio');
    if (audio) audio.playCoin();
  }

  _tryUpgrade(structure) {
    if (structure.level >= structure.def.maxLevel) return;
    const nextCfg = structure.def.levels[structure.level];
    if (!this.economy.spend(nextCfg.price)) return;
    structure.upgrade();
    const audio = this.scene.registry.get('audio');
    if (audio) audio.playCoin();
  }

  _drawSlotMarkers() {
    this.slotMarkers.clear();
    if (!this.prepPhase) return;
    this.laneSystem.lanes.forEach((lane) => {
      ['frontSlot', 'backSlot', 'nmlSlot'].forEach((key) => {
        const slot = lane[key];
        if (slot.structure) return;
        this.slotMarkers.lineStyle(2, 0xf4e04d, 0.5);
        this.slotMarkers.strokeCircle(slot.x, slot.y, 30);
      });
    });
  }
}
