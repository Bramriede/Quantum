import {
  GAME_WIDTH, LANE_COUNT, ZONES, LANE_HEIGHT,
  TRENCH_X, TRENCH_WIDTH, NO_MANS_LAND_X, SPAWN_X, DEPTH,
} from '../data/Constants.js';

// Beheert de 5 horizontale stroken (lanes), gestapeld van boven naar beneden.
// De loopgraaf staat verticaal aan de linkerkant; vijanden spawnen rechts
// (SPAWN_X) en marcheren naar links richting de loopgraaf (TRENCH_X + TRENCH_WIDTH).
export default class LaneSystem {
  constructor(scene) {
    this.scene = scene;
    this.lanes = [];
    for (let i = 0; i < LANE_COUNT; i++) {
      const top = ZONES.battlefield.y + LANE_HEIGHT * i;
      this.lanes.push({
        index: i,
        top,
        bottom: top + LANE_HEIGHT,
        centerY: top + LANE_HEIGHT / 2,
        trenchFrontX: TRENCH_X + TRENCH_WIDTH, // x-positie waar een vijand de linie bereikt
        spawnX: SPAWN_X,
      });
    }
  }

  laneCenterY(index) {
    return this.lanes[index].centerY;
  }

  trenchFrontX() {
    return TRENCH_X + TRENCH_WIDTH;
  }

  drawDividers() {
    const g = this.scene.add.graphics();
    g.setDepth(DEPTH.GROUND_FX);
    const left = NO_MANS_LAND_X;
    const right = GAME_WIDTH - 40;
    g.lineStyle(3, 0xffffff, 0.35);
    for (let i = 1; i < LANE_COUNT; i++) {
      const y = ZONES.battlefield.y + LANE_HEIGHT * i;
      this._drawDashedLine(g, left, y, right, y, 14, 12);
    }
    return g;
  }

  _drawDashedLine(g, x1, y1, x2, y2, dashLen, gapLen) {
    const totalLen = Phaser.Math.Distance.Between(x1, y1, x2, y2);
    const dirX = (x2 - x1) / totalLen;
    const dirY = (y2 - y1) / totalLen;
    let drawn = 0;
    let atGap = false;
    let cx = x1, cy = y1;
    while (drawn < totalLen) {
      const segLen = Math.min(atGap ? gapLen : dashLen, totalLen - drawn);
      const nx = cx + dirX * segLen;
      const ny = cy + dirY * segLen;
      if (!atGap) {
        g.beginPath();
        g.moveTo(cx, cy);
        g.lineTo(nx, ny);
        g.strokePath();
      }
      cx = nx; cy = ny;
      drawn += segLen;
      atGap = !atGap;
    }
  }
}
