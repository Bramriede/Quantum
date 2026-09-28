// Volledige campagne van 12 golven (zie PLAN.md "Vijanden & gevaren" voor de
// moeilijkheidscurve). Mosterdgas-gevaar wordt apart door GasHazardSystem
// vanaf golf 5 aangestuurd (niet hier).
const Waves = [
  { number: 1, spawns: [
    { type: 'infantry', count: 8, interval: 1400, startDelay: 800 },
  ] },
  { number: 2, spawns: [
    { type: 'infantry', count: 13, interval: 1150, startDelay: 600 },
  ] },
  { number: 3, spawns: [
    { type: 'infantry', count: 8, interval: 1100, startDelay: 500 },
    { type: 'grenadier', count: 4, interval: 1900, startDelay: 1800 },
  ] },
  { number: 4, spawns: [
    { type: 'infantry', count: 8, interval: 1050, startDelay: 500 },
    { type: 'grenadier', count: 4, interval: 1800, startDelay: 1600 },
    { type: 'assault', count: 4, interval: 2000, startDelay: 2600 },
  ] },
  { number: 5, spawns: [
    { type: 'infantry', count: 7, interval: 1000, startDelay: 400 },
    { type: 'grenadier', count: 4, interval: 1700, startDelay: 1500 },
    { type: 'assault', count: 4, interval: 1900, startDelay: 2400 },
    { type: 'flamethrower', count: 3, interval: 2400, startDelay: 3200 },
  ] },
  { number: 6, spawns: [
    { type: 'infantry', count: 7, interval: 950, startDelay: 400 },
    { type: 'grenadier', count: 4, interval: 1650, startDelay: 1400 },
    { type: 'assault', count: 4, interval: 1850, startDelay: 2200 },
    { type: 'flamethrower', count: 3, interval: 2300, startDelay: 3000 },
    { type: 'mortarTeam', count: 2, interval: 3000, startDelay: 1000 },
  ] },
  { number: 7, spawns: [
    { type: 'infantry', count: 8, interval: 900, startDelay: 400 },
    { type: 'grenadier', count: 5, interval: 1600, startDelay: 1300 },
    { type: 'assault', count: 5, interval: 1800, startDelay: 2000 },
    { type: 'flamethrower', count: 3, interval: 2200, startDelay: 2800 },
    { type: 'mortarTeam', count: 2, interval: 2800, startDelay: 900 },
  ] },
  { number: 8, spawns: [
    { type: 'infantry', count: 6, interval: 900, startDelay: 400 },
    { type: 'grenadier', count: 5, interval: 1550, startDelay: 1300 },
    { type: 'assault', count: 5, interval: 1750, startDelay: 2000 },
    { type: 'flamethrower', count: 3, interval: 2100, startDelay: 2700 },
    { type: 'mortarTeam', count: 2, interval: 2700, startDelay: 900 },
    { type: 'tank', count: 2, interval: 4200, startDelay: 3600 },
  ] },
  { number: 9, spawns: [
    { type: 'infantry', count: 8, interval: 850, startDelay: 400 },
    { type: 'grenadier', count: 6, interval: 1500, startDelay: 1200 },
    { type: 'assault', count: 6, interval: 1700, startDelay: 1900 },
    { type: 'flamethrower', count: 4, interval: 2000, startDelay: 2600 },
    { type: 'mortarTeam', count: 3, interval: 2600, startDelay: 900 },
    { type: 'tank', count: 2, interval: 4000, startDelay: 3400 },
  ] },
  { number: 10, spawns: [
    { type: 'infantry', count: 8, interval: 800, startDelay: 400 },
    { type: 'grenadier', count: 6, interval: 1450, startDelay: 1100 },
    { type: 'assault', count: 7, interval: 1650, startDelay: 1800 },
    { type: 'flamethrower', count: 4, interval: 1950, startDelay: 2500 },
    { type: 'mortarTeam', count: 3, interval: 2500, startDelay: 900 },
    { type: 'tank', count: 3, interval: 3800, startDelay: 3200 },
  ] },
  { number: 11, spawns: [
    { type: 'infantry', count: 10, interval: 780, startDelay: 400 },
    { type: 'grenadier', count: 7, interval: 1400, startDelay: 1100 },
    { type: 'assault', count: 8, interval: 1600, startDelay: 1700 },
    { type: 'flamethrower', count: 5, interval: 1900, startDelay: 2400 },
    { type: 'mortarTeam', count: 3, interval: 2400, startDelay: 900 },
    { type: 'tank', count: 3, interval: 3600, startDelay: 3000 },
  ] },
  { number: 12, spawns: [
    { type: 'infantry', count: 10, interval: 700, startDelay: 300 },
    { type: 'grenadier', count: 8, interval: 1300, startDelay: 1000 },
    { type: 'assault', count: 8, interval: 1500, startDelay: 1600 },
    { type: 'flamethrower', count: 6, interval: 1800, startDelay: 2200 },
    { type: 'mortarTeam', count: 4, interval: 2200, startDelay: 800 },
    { type: 'tank', count: 5, interval: 3200, startDelay: 2800 },
  ] },
];

export default Waves;
