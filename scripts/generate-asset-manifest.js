#!/usr/bin/env node
// Scant /assets en schrijft assets/manifest.json met alle gevonden
// afbeeldingsbestanden. De game leest dit ene bestand (dat altijd bestaat,
// dus nooit een 404 geeft) om te weten welke echte assets al aanwezig zijn,
// i.p.v. elk los bestand te proberen te laden. Draai dit opnieuw nadat je
// een nieuw bestand aan /assets hebt toegevoegd (of laat de GitHub Actions
// Pages-workflow dit automatisch doen bij elke push naar main).
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const assetsDir = path.join(root, 'assets');
const outFile = path.join(assetsDir, 'manifest.json');

function walk(dir, base) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results = results.concat(walk(full, rel));
    } else if (/\.(png|jpg|jpeg|webp)$/i.test(entry.name)) {
      results.push(`assets/${rel}`);
    }
  }
  return results;
}

const files = walk(assetsDir, '').sort();
fs.writeFileSync(outFile, JSON.stringify({ files }, null, 2) + '\n');
console.log(`assets/manifest.json bijgewerkt: ${files.length} bestand(en) gevonden.`);
