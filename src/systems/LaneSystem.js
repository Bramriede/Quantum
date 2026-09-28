import { GAME_WIDTH, LANE_COUNT, SIDE_MARGIN, LANE_WIDTH, ZONES, DEPTH } from '../data/Constants.js';

// Beheert de 5 verticale stroken (lanes) van het slagveld: geometrie nu,
// bouwplekken/structuren volgen in een latere fase.
export default class LaneSystem {
  constructor(scene) {
    this.scene = scene;
    this.lanes = [];
    for (let i = 0; i < LANE_COUNT; i++) {
      const centerX = SIDE_MARGIN + LANE_WIDTH * i + LANE_WIDTH / 2;
      this.lanes.push({
        index: i,
        centerX,
        left: SIDE_MARGIN + LANE_WIDTH * i,
        right: SIDE_MARGIN + LANE_WIDTH * (i + 1),
      });
    }
  }

  laneCenterX(index) {
    return this.lanes[index].centerX;
  }

  drawDividers() {
    const g = this.scene.add.graphics();
    g.setDepth(DEPTH.GROUND_FX);
    const top = ZONES.noMansLand.y;
    const bottom = ZONES.trench.y + ZONES.trench.height;
    g.lineStyle(3, 0xffffff, 0.35);
    for (let i = 1; i < LANE_COUNT; i++) {
      const x = SIDE_MARGIN + LANE_WIDTH * i;
      this._drawDashedLine(g, x, top, x, bottom, 14, 12);
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
