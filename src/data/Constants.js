// Centrale spelconstantes — zie PLAN.md "Speelveld-indeling"
export const GAME_WIDTH = 1600;
export const GAME_HEIGHT = 900;

export const LANE_COUNT = 5;
export const SIDE_MARGIN = 40;
export const LANE_WIDTH = (GAME_WIDTH - SIDE_MARGIN * 2) / LANE_COUNT;

export const ZONES = {
  hud: { y: 0, height: 60 },
  abilityBar: { y: 60, height: 50 },
  noMansLand: { y: 110, height: 500 },
  trench: { y: 610, height: 150 },
  buildPanel: { y: 760, height: 140 },
};

export const DEPTH = {
  BACKGROUND: 0,
  BARBED_WIRE: 2,
  GROUND_FX: 3,
  STRUCTURE: 5,
  UNIT: 10,
  PROJECTILE: 14,
  PARTICLE: 20,
  HAZARD: 22,
  UI: 100,
};

export const SAVE_KEY = 'loopgraaf1917_save_v1';

export const TOTAL_WAVES = 12;

export default {
  GAME_WIDTH, GAME_HEIGHT, LANE_COUNT, SIDE_MARGIN, LANE_WIDTH, ZONES, DEPTH, SAVE_KEY, TOTAL_WAVES,
};
