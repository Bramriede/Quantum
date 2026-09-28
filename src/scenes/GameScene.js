import { GAME_WIDTH, GAME_HEIGHT, DEPTH } from '../data/Constants.js';
import LaneSystem from '../systems/LaneSystem.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'battlefield_bg')
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(DEPTH.BACKGROUND);

    this.laneSystem = new LaneSystem(this);
    this.laneSystem.drawDividers();

    this.scene.launch('UI');

    this.input.keyboard.on('keydown-ESC', () => {
      // Pauzemenu volgt in een latere fase.
    });
  }
}
