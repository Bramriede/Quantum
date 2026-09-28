import { DEPTH } from '../data/Constants.js';

// Kleine, code-getekende visuele feedback (zie NOTES.md: dit zijn geen losse
// ChatGPT-assets maar korte dynamische effecten).

export function tracer(scene, x1, y1, x2, y2, color = 0xffe27a) {
  const g = scene.add.graphics();
  g.setDepth(DEPTH.PROJECTILE);
  g.lineStyle(2, color, 0.9);
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2, y2);
  g.strokePath();
  scene.tweens.add({
    targets: g,
    alpha: 0,
    duration: 110,
    onComplete: () => g.destroy(),
  });
}

export function hitFlash(scene, sprite) {
  sprite.setTintFill(0xffffff);
  scene.time.delayedCall(60, () => {
    if (sprite.active) sprite.clearTint();
  });
}

export function hitBurst(scene, x, y, color = 0xd8453b, count = 6) {
  for (let i = 0; i < count; i++) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const dist = Phaser.Math.FloatBetween(8, 22);
    const dot = scene.add.circle(x, y, Phaser.Math.Between(2, 4), color, 0.9);
    dot.setDepth(DEPTH.PARTICLE);
    scene.tweens.add({
      targets: dot,
      x: x + Math.cos(angle) * dist,
      y: y + Math.sin(angle) * dist,
      alpha: 0,
      duration: Phaser.Math.Between(180, 320),
      onComplete: () => dot.destroy(),
    });
  }
}

export function screenShake(scene, duration = 90, intensity = 0.004) {
  scene.cameras.main.shake(duration, intensity);
}

export function floatingText(scene, x, y, text, color = '#f4e04d') {
  const t = scene.add.text(x, y, text, {
    fontFamily: 'Georgia, serif', fontSize: '16px', color, fontStyle: 'bold',
  }).setOrigin(0.5).setDepth(DEPTH.PARTICLE + 1);
  scene.tweens.add({
    targets: t,
    y: y - 30,
    alpha: 0,
    duration: 700,
    onComplete: () => t.destroy(),
  });
}

export default { tracer, hitFlash, hitBurst, screenShake, floatingText };
