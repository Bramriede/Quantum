// Golf-definities. Fase 2 bevat alleen golf 1 om de kern-loop te testen;
// de volledige campagne van 12 golven (Stoottroepen, tanks, gasgevaar) komt
// in Fase 4 (zie PLAN.md).
const Waves = [
  {
    number: 1,
    spawns: [
      { type: 'infantry', count: 8, interval: 1400, startDelay: 800 },
    ],
  },
];

export default Waves;
