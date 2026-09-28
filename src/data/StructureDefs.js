// Definities van alle koopbare structuren. "slot" bepaalt in welke bouwplek
// (front/back/nml) een type past; binnen 1 slot zijn de opties mutueel
// exclusief (zie NOTES.md #19 voor waarom 1 slot per rij i.p.v. meerdere).
const StructureDefs = {
  wall: {
    id: 'wall', label: 'Muur', slot: 'front', icon: 'icon_wall',
    behavior: 'wall', maxLevel: 3,
    levels: [
      { textureKey: 'wall_level1', price: 50, breachReduction: 2 },
      { textureKey: 'wall_level2', price: 90, breachReduction: 4 },
      { textureKey: 'wall_level3', price: 150, breachReduction: 7 },
    ],
    displaySize: { w: 70, h: 100 },
  },
  machinegun: {
    id: 'machinegun', label: 'Mitrailleur', slot: 'front', icon: 'icon_machinegun',
    behavior: 'turret', maxLevel: 3,
    levels: [
      { textureKey: 'machinegun_level1', price: 120, damage: 6, fireIntervalMs: 220 },
      { textureKey: 'machinegun_level2', price: 220, damage: 10, fireIntervalMs: 190 },
      { textureKey: 'machinegun_level3', price: 380, damage: 16, fireIntervalMs: 150 },
    ],
    displaySize: { w: 82, h: 82 },
  },
  flamethrower: {
    id: 'flamethrower', label: 'Vlammenwerper', slot: 'front', icon: 'icon_flamethrower',
    behavior: 'flame', maxLevel: 1,
    levels: [
      { textureKey: 'flamethrower_structure', price: 260, dps: 22, range: 150 },
    ],
    displaySize: { w: 82, h: 82 },
  },
  atgun: {
    id: 'atgun', label: 'AT-kanon', slot: 'back', icon: 'icon_atgun',
    behavior: 'turret', maxLevel: 1,
    levels: [
      { textureKey: 'atgun_level1', price: 320, damage: 45, fireIntervalMs: 900, vsTankMultiplier: 2.5 },
    ],
    displaySize: { w: 82, h: 82 },
  },
  mortarteam: {
    id: 'mortarteam', label: 'Mortierteam', slot: 'back', icon: 'icon_mortarteam',
    behavior: 'mortar', maxLevel: 1,
    levels: [
      { textureKey: 'mortarteam_structure', price: 280, damage: 26, fireIntervalMs: 2200 },
    ],
    displaySize: { w: 82, h: 82 },
  },
  gasmask: {
    id: 'gasmask', label: 'Gasmaskerpost', slot: 'back', icon: 'icon_gasmask',
    behavior: 'gasmask', maxLevel: 1,
    levels: [
      { textureKey: 'gasmask_bunker', price: 150 },
    ],
    displaySize: { w: 76, h: 66 },
  },
  barbedwire: {
    id: 'barbedwire', label: 'Prikkeldraad', slot: 'nml', icon: 'icon_barbedwire',
    behavior: 'barrier', maxLevel: 2,
    levels: [
      { textureKey: 'barbedwire_level1', price: 25, dps: 4, slowFactor: 0.5, tankSlowFactor: 0.85 },
      { textureKey: 'barbedwire_level2', price: 55, dps: 8, slowFactor: 0.35, tankSlowFactor: 0.75 },
    ],
    displaySize: { w: 34, h: 96 },
  },
  tankblocker: {
    id: 'tankblocker', label: 'Tankversperring', slot: 'nml', icon: 'icon_tank_blocker',
    behavior: 'barrier', maxLevel: 1,
    levels: [
      { textureKey: 'tank_blocker', price: 90, dps: 0, slowFactor: 1, tankSlowFactor: 0.4 },
    ],
    displaySize: { w: 34, h: 96 },
  },
  landmineTank: {
    id: 'landmineTank', label: 'Tankmijn', slot: 'nml', icon: 'icon_landmine_tank',
    behavior: 'mine', maxLevel: 1,
    levels: [
      { textureKey: 'landmine_tank', price: 120, damage: 140, targetCategory: 'vehicle' },
    ],
    displaySize: { w: 28, h: 28 },
  },
  landminePersonnel: {
    id: 'landminePersonnel', label: 'Personeelsmijn', slot: 'nml', icon: 'icon_landmine_personnel',
    behavior: 'mine', maxLevel: 1,
    levels: [
      { textureKey: 'landmine_personnel', price: 45, damage: 40, targetCategory: 'infantry' },
    ],
    displaySize: { w: 22, h: 22 },
  },
};

export const SLOT_OPTIONS = {
  front: ['wall', 'machinegun', 'flamethrower'],
  back: ['atgun', 'mortarteam', 'gasmask'],
  nml: ['barbedwire', 'tankblocker', 'landmineTank', 'landminePersonnel'],
};

export default StructureDefs;
