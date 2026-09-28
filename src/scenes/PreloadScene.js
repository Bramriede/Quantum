import ASSET_MANIFEST from '../data/AssetManifest.js';
import { createPlaceholderTexture } from '../utils/PlaceholderGenerator.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../data/Constants.js';

// Belangrijk: we laten Phaser's loader nooit een bestand proberen te laden
// waarvan we niet al zeker weten dat het bestaat — een mislukte aanvraag
// (404) logt de browser altijd zelf als console-error, wat we willen
// vermijden. In plaats daarvan lezen we één klein `assets/manifest.json`
// (dat altijd bestaat, dus nooit 404 geeft) waarin staat welke echte
// bestanden er al in /assets staan. Zie scripts/generate-asset-manifest.js.
export default class PreloadScene extends Phaser.Scene {
  constructor() { super('Preload'); }

  create() {
    const w = GAME_WIDTH, h = GAME_HEIGHT;
    const box = this.add.graphics();
    box.fillStyle(0x1b1b1b, 1).fillRoundedRect(w / 2 - 200, h / 2 - 22, 400, 44, 10);
    const bar = this.add.graphics();
    this.add.text(w / 2, h / 2 - 55, 'Voorraden worden aangevoerd…', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#c9b896',
    }).setOrigin(0.5);

    this._runPipeline(bar, w, h);
  }

  async _runPipeline(bar, w, h) {
    let existingPaths = new Set();
    try {
      const res = await fetch('assets/manifest.json', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        existingPaths = new Set(data.files || []);
      }
    } catch (e) {
      // manifest ontbreekt (bv. allereerste run) -> alles blijft placeholder.
    }

    const existing = ASSET_MANIFEST.filter((a) => existingPaths.has(a.path));
    const missing = ASSET_MANIFEST.filter((a) => !existingPaths.has(a.path));

    missing.forEach((asset) => createPlaceholderTexture(this, asset));

    if (existing.length === 0) {
      this._finish();
      return;
    }

    this.load.on('progress', (value) => {
      bar.clear();
      bar.fillStyle(0xb08d3e, 1).fillRoundedRect(w / 2 - 196, h / 2 - 18, 392 * value, 36, 8);
    });
    // Veiligheidsnet: staat een asset in het manifest maar faalt het laden
    // toch (bv. corrupt bestand), val dan terug op een placeholder.
    this.load.on('loaderror', (file) => {
      const asset = ASSET_MANIFEST.find((a) => a.key === file.key);
      if (asset) createPlaceholderTexture(this, asset);
    });

    existing.forEach((asset) => this.load.image(asset.key, asset.path));
    this.load.once('complete', () => this._finish());
    this.load.start();
  }

  _finish() {
    this.scene.start('Title');
  }
}
