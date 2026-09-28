// Centrale spelconstantes — zie PLAN.md "Speelveld-indeling" (gecorrigeerde
// oriëntatie: loopgraaf verticaal links, vijanden komen van rechts).
export const GAME_WIDTH = 1600;
export const GAME_HEIGHT = 900;

export const LANE_COUNT = 5;
export const SIDE_MARGIN = 40;

export const ZONES = {
  hud: { y: 0, height: 60 },
  abilityBar: { y: 60, height: 50 },
  battlefield: { y: 110, height: 650 },
  buildPanel: { y: 760, height: 140 },
};

export const LANE_HEIGHT = ZONES.battlefield.height / LANE_COUNT;

export const TRENCH_WIDTH = 180;
export const TRENCH_X = SIDE_MARGIN;
export const NO_MANS_LAND_X = SIDE_MARGIN + TRENCH_WIDTH;
export const NO_MANS_LAND_WIDTH = GAME_WIDTH - SIDE_MARGIN * 2 - TRENCH_WIDTH;
export const SPAWN_X = GAME_WIDTH - SIDE_MARGIN;

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
  GAME_WIDTH, GAME_HEIGHT, LANE_COUNT, SIDE_MARGIN, ZONES, LANE_HEIGHT,
  TRENCH_WIDTH, TRENCH_X, NO_MANS_LAND_X, NO_MANS_LAND_WIDTH, SPAWN_X,
  DEPTH, SAVE_KEY, TOTAL_WAVES,
};
