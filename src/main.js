import { GAME_WIDTH, GAME_HEIGHT } from './data/Constants.js';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import TitleScene from './scenes/TitleScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';
import PauseScene from './scenes/PauseScene.js';
import SettingsScene from './scenes/SettingsScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import VictoryScene from './scenes/VictoryScene.js';
import AudioManager from './systems/AudioManager.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#14120f',
  pixelArt: false,
  antialias: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [BootScene, PreloadScene, TitleScene, GameScene, UIScene, PauseScene, SettingsScene, GameOverScene, VictoryScene],
};

const loadingFallback = document.getElementById('loading-fallback');
if (loadingFallback) loadingFallback.remove();

window.game = new Phaser.Game(config);
window.game.registry.set('audio', new AudioManager());
