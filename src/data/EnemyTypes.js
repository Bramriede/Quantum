// Statistieken per vijandtype. Meer types (Stoottroepen, Tank) volgen in
// Fase 4 zodra de golf-campagne wordt uitgebreid — zie PLAN.md.
const EnemyTypes = {
  infantry: {
    key: 'infantry',
    textureKey: 'soldier_infantry_enemy',
    category: 'infantry',
    hp: 20,
    speed: 42, // px/s
    breachDamage: 5,
    reward: 8,
    displaySize: 40,
  },
};

export default EnemyTypes;
