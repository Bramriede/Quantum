// Genereert een placeholder-texture (gekleurd vlak + bestandsnaam) voor elk
// asset dat nog niet in /assets staat. Zodra de speler het echte bestand met
// dezelfde naam uploadt, laadt Phaser dat gewoon in plaats hiervan — deze
// generator wordt dan simpelweg niet meer aangeroepen voor die key.

const CATEGORY_COLORS = {
  background: '#3a4a3f',
  ui: '#2c3e50',
  icon: '#5b4636',
  unit: '#6b2f2f',
  structure: '#4a5d3a',
  default: '#444444',
};

function wrapText(ctx, text, maxWidth) {
  const words = text.replace(/\.png$/, '').split(/[_\-]/);
  const lines = [];
  let current = '';
  words.forEach((word) => {
    const test = current ? `${current}_${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });
  if (current) lines.push(current);
  return lines;
}

export function createPlaceholderTexture(scene, asset) {
  const { key, w, h, transparent, category, path } = asset;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const base = CATEGORY_COLORS[category] || CATEGORY_COLORS.default;

  if (transparent) {
    ctx.fillStyle = base + 'aa';
  } else {
    ctx.fillStyle = base;
  }
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = Math.max(2, Math.min(w, h) * 0.02);
  ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth);

  // diagonale strepen zodat placeholders duidelijk herkenbaar zijn
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 3;
  const step = Math.max(16, Math.min(w, h) * 0.12);
  for (let x = -h; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + h, h);
    ctx.stroke();
  }
  ctx.restore();

  const fontSize = Math.max(9, Math.min(20, Math.floor(Math.min(w, h) / 6)));
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const maxWidth = w * 0.86;
  const lines = wrapText(ctx, key, maxWidth);
  const lineHeight = fontSize * 1.25;
  const startY = h / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, w / 2, startY + i * lineHeight);
  });

  if (h > 60) {
    ctx.font = `${Math.max(8, fontSize * 0.55)}px monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillText('placeholder', w / 2, h - fontSize * 0.7);
  }

  if (scene.textures.exists(key)) scene.textures.remove(key);
  scene.textures.addCanvas(key, canvas);
}

export default { createPlaceholderTexture };
