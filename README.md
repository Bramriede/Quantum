# Loopgraaf 1917

Een top-down WW1 loopgraafverdediging, rechtstreeks in de browser — geen
installatie, geen build-stap. Verdedig je linie tegen 12 golven Duitse
aanvallers met muren, machinegeweren, een AT-kanon, een vlammenwerper, een
mortierteam, gasmaskerposten, prikkeldraad, tankversperringen en mijnen.
Tussen elke golf koop je nieuwe verdediging met verzamelde voorraad; tijdens
een golf kun je een mortierinzet, een gasaanval of reserve-troepen inzetten.

**[Speel de laatste versie op GitHub Pages →](../../)** *(link wordt automatisch
bijgewerkt zodra deze repo naar `main` gepusht wordt — zie hieronder)*

## Hoe speel je het

- De loopgraaf staat **verticaal aan de linkerkant**, vijanden komen van
  **rechts** en marcheren door 5 horizontale stroken (lanes) naar je linie.
- **Tussen golven** (pauzefase): kies een structuur onderin het scherm en
  klik op een lege bouwplek in het slagveld om te plaatsen. Klik nogmaals op
  hetzelfde type op een bestaande structuur om te upgraden. Klik daarna op
  **START GOLF**.
- **Tijdens een golf**: het bouwpaneel is gedimd (niet actief), maar de 3
  vaardigheden bovenin (Mortier / Gasinzet / Reserves) blijven bruikbaar —
  selecteer er een en klik in no man's land om te targetten.
- Elke vijand die je linie bereikt (een "doorbraak") kost loopgraaf-HP. Bij 0
  HP is de run voorbij. Houd alle 12 golven stand voor de overwinning.
- **Besturing**: muis/klik op desktop, tap op mobiel/touch — verder niets
  nodig. `ESC` of het pauze-icoon rechtsboven pauzeert het spel.

## Technisch

- Pure HTML5 + JavaScript, [Phaser 3](https://phaser.io) via CDN — geen
  build-stap, geen `npm install` nodig om te spelen. Open gewoon `index.html`
  via een (lokale) webserver.
- Geen enkele externe afbeelding: alle definitieve graphics worden apart
  aangeleverd (zie hieronder) en tot die tijd toont de game nette
  placeholders. Alle geluid wordt live gesynthetiseerd met de Web Audio API —
  geen losse audiobestanden, geen copyright-risico.
- Voortgang (volume-instellingen, beste golf, aantal overwinningen) wordt
  lokaal bewaard via `localStorage`.
- Code is opgesplitst in `scenes/`, `entities/`, `systems/`, `data/` en
  `utils/` — zie `src/`.

### Lokaal draaien

```bash
python3 -m http.server 8000
# of: npx serve .
```

Open daarna `http://localhost:8000`. Direct openen via `file://` werkt niet
volledig (de asset-pipeline gebruikt `fetch()`, dat vereist http(s)).

### Eigen graphics toevoegen

Alle benodigde afbeeldingen (bestandsnaam, map, exacte afmetingen en een
kant-en-klare beeldgenerator-prompt) staan in [`ASSETS.md`](ASSETS.md). Zet
een bestand met **exact** de opgegeven naam in `/assets/...` en de game
gebruikt het automatisch in plaats van de placeholder — geen codewijziging
nodig. Draai daarna (of laat de GitHub Actions-workflow het automatisch
doen bij elke push naar `main`):

```bash
node scripts/generate-asset-manifest.js
```

Dit schrijft `assets/manifest.json`, dat de game gebruikt om te weten welke
echte bestanden er al staan (zonder dit bestand blijft alles placeholder,
maar de game blijft altijd volledig speelbaar).

### Deployen

`.github/workflows/deploy.yml` bouwt en publiceert de site automatisch naar
GitHub Pages bij elke push naar `main` (inclusief het regenereren van
`assets/manifest.json`, zodat net geüploade art meteen live gebruikt wordt).
Zet Pages in de repository-instellingen op bron "GitHub Actions" om dit te
activeren.

## Documentatie

- [`PLAN.md`](PLAN.md) — volledig ontwerp: golf-cyclus, structuren,
  vijandtypen, vaardigheden, fasering.
- [`ASSETS.md`](ASSETS.md) — alle benodigde afbeeldingen met prompts.
- [`NOTES.md`](NOTES.md) — technische aannames en ontwerpbeslissingen.
