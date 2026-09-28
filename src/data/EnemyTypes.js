// Statistieken per vijandtype. Zie PLAN.md "Vijanden & gevaren".
const EnemyTypes = {
  infantry: {
    key: 'infantry',
    textureKey: 'soldier_infantry_enemy',
    category: 'infantry',
    hp: 20,
    speed: 42,
    breachDamage: 5,
    reward: 8,
    displaySize: 40,
  },
  grenadier: {
    key: 'grenadier',
    textureKey: 'soldier_grenadier_enemy',
    category: 'infantry',
    hp: 26,
    speed: 38,
    breachDamage: 9,
    ignoresWallReduction: true, // granaten gaan deels over de muur heen
    reward: 12,
    displaySize: 40,
  },
  flamethrower: {
    key: 'flamethrower',
    textureKey: 'soldier_flamethrower_enemy',
    category: 'infantry',
    hp: 55,
    speed: 24,
    breachDamage: 14, // beschadigt structuren bij het bereiken van de linie
    reward: 18,
    displaySize: 42,
  },
  assault: {
    key: 'assault',
    textureKey: 'soldier_assault_enemy',
    category: 'infantry',
    hp: 45,
    speed: 55,
    breachDamage: 7,
    reward: 14,
    displaySize: 42,
  },
  mortarTeam: {
    key: 'mortarTeam',
    textureKey: 'mortar_team_enemy',
    category: 'support',
    hp: 30,
    speed: 30,
    stationaryOffsetX: 320, // stopt op deze afstand van de spawn-rand
    rangedAttack: { damage: 6, intervalMs: 2600 },
    breachDamage: 0,
    reward: 20,
    displaySize: 52,
  },
  tank: {
    key: 'tank',
    textureKey: 'tank_enemy',
    category: 'vehicle',
    hp: 260,
    speed: 20,
    breachDamage: 22,
    reward: 45,
    displaySize: 64,
  },
};

export default EnemyTypes;
