// Beschrijft elk extern beeld dat de speler zelf aanlevert (zie ASSETS.md).
// key   = texture-key waarmee de rest van de code de afbeelding aanspreekt.
// path  = pad in /assets waar het echte bestand moet komen.
// w, h  = exacte afmetingen (moet overeenkomen met ASSETS.md).
// transparent = of het een PNG met alpha-kanaal moet zijn.
// category = alleen gebruikt om placeholders een herkenbare kleur te geven.

const A = 'assets';

const manifest = [
  // Achtergronden & UI-balken
  { key: 'title_bg', path: `${A}/backgrounds/title_bg.png`, w: 1600, h: 900, transparent: false, category: 'background' },
  { key: 'battlefield_bg', path: `${A}/backgrounds/battlefield_bg.png`, w: 1600, h: 900, transparent: false, category: 'background' },
  { key: 'panel_bg', path: `${A}/ui/panel_bg.png`, w: 1600, h: 140, transparent: false, category: 'ui' },
  { key: 'hud_top_bg', path: `${A}/ui/hud_top_bg.png`, w: 1600, h: 60, transparent: false, category: 'ui' },
  { key: 'ability_bar_bg', path: `${A}/ui/ability_bar_bg.png`, w: 1600, h: 50, transparent: false, category: 'ui' },
  { key: 'button_frame', path: `${A}/ui/button_frame.png`, w: 400, h: 100, transparent: true, category: 'ui' },
  { key: 'healthbar_frame', path: `${A}/ui/healthbar_frame.png`, w: 420, h: 40, transparent: true, category: 'ui' },

  // Iconen
  { key: 'icon_wall', path: `${A}/ui/icon_wall.png`, w: 128, h: 128, transparent: true, category: 'icon' },
  { key: 'icon_machinegun', path: `${A}/ui/icon_machinegun.png`, w: 128, h: 128, transparent: true, category: 'icon' },
  { key: 'icon_gasmask', path: `${A}/ui/icon_gasmask.png`, w: 128, h: 128, transparent: true, category: 'icon' },
  { key: 'icon_barbedwire', path: `${A}/ui/icon_barbedwire.png`, w: 128, h: 128, transparent: true, category: 'icon' },
  { key: 'icon_atgun', path: `${A}/ui/icon_atgun.png`, w: 128, h: 128, transparent: true, category: 'icon' },
  { key: 'icon_flamethrower', path: `${A}/ui/icon_flamethrower.png`, w: 128, h: 128, transparent: true, category: 'icon' },
  { key: 'icon_mortarteam', path: `${A}/ui/icon_mortarteam.png`, w: 128, h: 128, transparent: true, category: 'icon' },
  { key: 'icon_tank_blocker', path: `${A}/ui/icon_tank_blocker.png`, w: 128, h: 128, transparent: true, category: 'icon' },
  { key: 'icon_landmine_tank', path: `${A}/ui/icon_landmine_tank.png`, w: 128, h: 128, transparent: true, category: 'icon' },
  { key: 'icon_landmine_personnel', path: `${A}/ui/icon_landmine_personnel.png`, w: 128, h: 128, transparent: true, category: 'icon' },
  { key: 'icon_supplies', path: `${A}/ui/icon_supplies.png`, w: 64, h: 64, transparent: true, category: 'icon' },
  { key: 'icon_wave', path: `${A}/ui/icon_wave.png`, w: 64, h: 64, transparent: true, category: 'icon' },
  { key: 'ability_mortar', path: `${A}/ui/ability_mortar.png`, w: 96, h: 96, transparent: true, category: 'icon' },
  { key: 'ability_gas', path: `${A}/ui/ability_gas.png`, w: 96, h: 96, transparent: true, category: 'icon' },
  { key: 'ability_reserves', path: `${A}/ui/ability_reserves.png`, w: 96, h: 96, transparent: true, category: 'icon' },

  // Vijanden
  { key: 'soldier_infantry_enemy', path: `${A}/units/soldier_infantry_enemy.png`, w: 64, h: 64, transparent: true, category: 'unit' },
  { key: 'soldier_grenadier_enemy', path: `${A}/units/soldier_grenadier_enemy.png`, w: 64, h: 64, transparent: true, category: 'unit' },
  { key: 'soldier_flamethrower_enemy', path: `${A}/units/soldier_flamethrower_enemy.png`, w: 64, h: 64, transparent: true, category: 'unit' },
  { key: 'mortar_team_enemy', path: `${A}/units/mortar_team_enemy.png`, w: 96, h: 96, transparent: true, category: 'unit' },
  { key: 'soldier_assault_enemy', path: `${A}/units/soldier_assault_enemy.png`, w: 64, h: 64, transparent: true, category: 'unit' },
  { key: 'tank_enemy', path: `${A}/units/tank_enemy.png`, w: 128, h: 128, transparent: true, category: 'unit' },

  // Structuren
  { key: 'wall_level1', path: `${A}/structures/wall_level1.png`, w: 120, h: 160, transparent: true, category: 'structure' },
  { key: 'wall_level2', path: `${A}/structures/wall_level2.png`, w: 120, h: 160, transparent: true, category: 'structure' },
  { key: 'wall_level3', path: `${A}/structures/wall_level3.png`, w: 120, h: 160, transparent: true, category: 'structure' },
  { key: 'machinegun_level1', path: `${A}/structures/machinegun_level1.png`, w: 140, h: 140, transparent: true, category: 'structure' },
  { key: 'machinegun_level2', path: `${A}/structures/machinegun_level2.png`, w: 140, h: 140, transparent: true, category: 'structure' },
  { key: 'machinegun_level3', path: `${A}/structures/machinegun_level3.png`, w: 140, h: 140, transparent: true, category: 'structure' },
  { key: 'atgun_level1', path: `${A}/structures/atgun_level1.png`, w: 150, h: 150, transparent: true, category: 'structure' },
  { key: 'gasmask_bunker', path: `${A}/structures/gasmask_bunker.png`, w: 140, h: 120, transparent: true, category: 'structure' },
  { key: 'barbedwire_level1', path: `${A}/structures/barbedwire_level1.png`, w: 60, h: 170, transparent: true, category: 'structure' },
  { key: 'barbedwire_level2', path: `${A}/structures/barbedwire_level2.png`, w: 60, h: 170, transparent: true, category: 'structure' },
];

export default manifest;
