# LOOPGRAAF 1917 — Ontwikkelplan

Een top-down WW1 loopgraafverdediging. Je verdedigt een stuk front tegen golven
Duitse aanvallers die van bovenaan het scherm (no man's land) naar jouw loopgraaf
onderaan marcheren. Geen personage om te besturen: je speelt als bevelhebber die
met een budget per golf muren, machinegeweren, gasmaskerposten en prikkeldraad
plaatst en upgrade. Vaste campagne van golven, eindigend in een overwinning.

## Kernbeslissingen (bevestigd met speler)
- **Besturing**: puur base-building met de muis/touch — geen bestuurbaar personage.
  Geplaatste structuren vuren/werken automatisch.
- **Layout (gecorrigeerd na referentiebeeld)**: de loopgraaf staat **verticaal**
  aan de **linkerkant** van het scherm. Vijanden spawnen aan de **rechterkant**
  en marcheren **horizontaal naar links** door 5 vaste **horizontale** stroken
  (lanes) die onder elkaar liggen. Dit is de reden dat een breed/landscape
  canvas goed past: de aanvalsrichting zelf is horizontaal, dus een brede
  canvas geeft een lange aanlooproute. (Eerdere aanname was verticale lanes
  met loopgraaf onderaan — gecorrigeerd op basis van een referentiescreenshot.)
- **Verlies-conditie**: gedeelde loopgraaf-integriteit (HP). Elke vijand die een
  lane-doorbraak veroorzaakt kost HP. Game over bij 0.
- **Structuur**: vaste campagne van 12 golven met oplopende moeilijkheid, golf 12
  is de zware finale golf. Overwinningsscherm na golf 12.
- **Golf-cyclus (bevestigd)**: tijdens een golf loopt een live voortgangsindicator/
  timer mee. Zodra de golf voorbij is (alle vijanden dood/doorgebroken) **pauzeert**
  het spel volledig en opent het bouw-/winkelpaneel: geen nieuwe vijanden, geen
  timer-druk. De speler geeft dan verzamelde munten uit aan nieuwe/upgrade
  fortificaties en wapens, en start de volgende golf zelf met een knop (geen
  geforceerde aftelklok die de speler onder druk zet om te kopen). Tijdens de golf
  zelf kan niet gebouwd worden — alleen tijdens deze pauzefase.
- **Geen minimap.**

## Belangrijke aanname over art (zie ook NOTES.md)
Alle **definitieve** graphics (personages, structuren, achtergronden, UI-knoppen/
panelen, iconen) komen van de speler, gegenereerd met een externe AI-tool (bv.
ChatGPT) en geüpload in `/assets` met de exacte bestandsnamen uit ASSETS.md.
Tot die tijd toont de game nette placeholders (gekleurd vlak + bestandsnaam).
Kleine **dynamische** effecten (kogelspoor/tracer, mondingsvuur-flits, stofwolken,
gaswolk-deeltjes, hit-sparkles, screenshake) worden wél met code/Phaser Graphics
getekend — dit zijn geen los te leveren art-assets maar korte visuele feedback,
en zonder deze feedback voelt combat dood aan. Dit is mijn technische aanname;
laat het weten als je dit ook door ChatGPT-assets wilt laten vervangen.

## Technische fundamenten
- Phaser 3 via CDN, geen build-stap, `index.html` in de root, statisch via GitHub Pages.
- ES modules, code opgesplitst in `scenes/`, `entities/`, `systems/`, `data/`, `utils/`.
- Asset-pipeline: `AssetManifest.js` beschrijft elke afbeelding (key, pad, breedte,
  hoogte, alpha-nodig). `PreloadScene` probeert elk bestand te laden; bij een
  laadfout (404, want bestand ontbreekt nog) genereert `PlaceholderGenerator` een
  vervangende texture (gekleurd vlak + bestandsnaam als tekst) met exact dezelfde
  key en afmetingen. De rest van de code gebruikt altijd alleen de texture-key, dus
  zodra een echt bestand met de juiste naam verschijnt laadt Phaser die automatisch
  in plaats van de placeholder — geen enkele codewijziging nodig.
- Geluid: eenvoudige sfx (schoten, explosies, alarmsirene, ambient wind/artillerie)
  via Web Audio API-synthese — geen losse audiobestanden nodig, geen copyright-risico.
- Input: muis + klik voor desktop, tap voor touch. Layout is responsive via
  `Phaser.Scale.FIT`.
- Voortgang/instellingen (volume, laatst gehaalde golf) via `localStorage`.

## Speelveld-indeling (per golf, statisch, geen scrolling nodig — gecorrigeerd)
- Canvas 1600×900 breedbeeld.
- Bovenste HUD-balk (~60px): golfnummer, voorraad (currency), loopgraaf-HP-balk.
- Vaardighedenbalk (~50px, altijd zichtbaar, ook tijdens een golf): de 3
  actieve vaardigheden (mortier/gas/reserves) met cooldown-indicatie.
- Slagveld (y 110-760, hoogte 650px, volle breedte 1600px min marges):
  - **Loopgraaf-linie**: verticale strook aan de **linkerkant** (x ~40-220px),
    in **2 rijen** (bevestigd): **voorste rij** (dicht bij no man's land) met
    Muur (1 slot) en Machinegeweer (2 sloten — "extra mg" = tweede nest in
    dezelfde lane) en de nieuwe Vlammenwerper-structuur (1 slot); **achterste
    rij** (verder terug) met AT-kanon (1 slot), de nieuwe Mortierteam-
    structuur (1 slot) en Gasmaskerpost (1 slot).
  - **No man's land**: rest van de breedte (x ~220-1560px, ruim 1300px lang) —
    dit is de aanlooproute waarover vijanden van rechts naar links marcheren.
    Ruim genoeg zodat MG's/AT-kanon meerdere keren kunnen vuren voor een
    vijand de linie bereikt. Prikkeldraad-bouwplek vlak voor de loopgraaf
    (verticale strook, net als de vijandelijke bewegingsrichting loodrecht
    doorkruist).
  - **Spawn-rand**: uiterst rechts (x ~1560-1600), per lane een spawnpunt.
  - 5 horizontale lanes van ~130px hoog, gestapeld van y=110 tot y=760.
- Onderste bouw-/shoppaneel (~140px): alleen zichtbaar/actief tijdens de
  pauzefase — knoppen om bouwtype te selecteren, prijs, en "Start volgende
  golf"-knop.

## Structuren & economie
- **Voorraad (Supplies)**: startbudget + vast bedrag per voltooide golf + bonus
  per gedode vijand. Uitgeven kan **alleen tijdens de pauzefase** na een golf
  (zie golf-cyclus hierboven) — niet tijdens een actieve golf.
- **Muur (Zandzakken)**: passieve structuur, 3 niveaus. Verhoogt hoeveel schade
  een lane kan opvangen voordat een doorbraak de loopgraaf-HP raakt.
- **Machinegeweer**: actieve structuur, vuurt automatisch op de dichtstbijzijnde
  vijand in zijn lane binnen bereik. Max 2 per lane (elk apart te bouwen/upgraden,
  3 niveaus elk voor schade/vuursnelheid).
- **Gasmaskerpost**: beschermt de structuren/verdediging in die lane tijdens een
  mosterdgas-aanval (zie hieronder). Zonder post: MG's in die lane vallen tijdelijk
  stil en de lane lijdt extra schade bij doorbraak.
- **Prikkeldraad**: geplaatst in no man's land vlak voor de loopgraaf, 2 niveaus.
  Vertraagt vijanden en doet langzaam schade terwijl ze erdoorheen lopen. Tanks
  breken niveau 1 sneller af (minder effect); niveau 2 houdt langer stand.
- **AT-kanon** (nieuw, bevestigd, achterste rij): 1 slot per lane, duur, traag
  vuurtempo maar hoge schade per schot met een forse bonus tegen tanks — het
  logische antwoord op de tank-dreiging vanaf golf 8. Historisch gebaseerd op
  WW1-veldkanonnen in directe-vuur-rol tegen tanks (zoals bij Cambrai, 1917) en
  het Duitse Tankgewehr M1918-antitankgeweer — geen Panzerfaust (dat is WO2).
- **Vlammenwerper-structuur** (nieuw, bevestigd, voorste rij): korte reikwijdte
  maar hoge schade-over-tijd, effectief tegen groepen dichtbij; historisch
  bestonden er ook Duitse/geallieerde vaste vlammenwerper-installaties in
  loopgraafverdediging, dus authentiek genoeg voor 1917.
- **Mortierteam-structuur** (nieuw, bevestigd, achterste rij): 3-koppige
  bemanning met een kleine mortier (visuele stijl à la Company of Heroes),
  vuurt automatisch indirect op vijanden verderop in de lane. Bestaat naast de
  actieve mortier-vaardigheid (die blijft gratis/cooldown-gebaseerd), niet in
  plaats daarvan.
- **No man's land-plaatsbaar (nieuw, bevestigd)**: 2 bouwplekken per lane in
  no man's land (ver + dichtbij de loopgraaf), elk met keuze uit Prikkeldraad
  (permanent, 2 niveaus), **Tankversperring** (permanent, blokkeert/vertraagt
  alleen tanks), **Tankmijn** (eenmalig, alleen tegen tanks, verdwijnt na
  gebruik) of **Personeelsmijn** (eenmalig, alleen tegen infanterie-achtige
  eenheden, verdwijnt na gebruik).

## Actieve vaardigheden tijdens een golf (bevestigd: speler wil invloed tijdens het gevecht)
Naast het bouwpaneel (alleen in de pauze) krijgt de speler een aparte, altijd
zichtbare vaardighedenbalk met 3 tactische acties die **tijdens een golf**
ingezet kunnen worden. Geen Voorraad-kosten — puur cooldown-gebaseerd, zodat
spelers en economie los van elkaar blijven en de speler tijdens het gevecht
niet hoeft te rekenen:
- **Mortierinzet**: klik op een lane → na ~1,5s inslagvertraging (voelbaar via
  een dreigende markering + geluid) volgt een explosie die alle vijanden in dat
  deel van de lane fors beschadigt. Cooldown ~25s.
- **Mosterdgas-inzet**: klik op een lane → eigen gaswolk verschijnt en blijft
  ~6s hangen, doet damage-over-time en vertraagt vijanden in die lane (zelfde
  gas-mechanic als het vijandelijke gasgevaar, nu offensief ingezet). Cooldown
  ~35s (zwaarder middel, langere cooldown).
- **Troepen verplaatsen**: een kleine pool reserve-infanterie (start op 3) kan
  per klik tijdelijk (~30s) aan een bedreigde lane toegewezen worden voor extra
  vuurkracht, en keert daarna terug naar de pool om elders ingezet te worden.
  Zo kan de speler live bijsturen naar de lane die dreigt door te breken.

Dit is een eigen `AbilitySystem`, los van `EconomySystem`/`LaneSystem` (die
gaan over de permanente pauze-aankopen).

## Vijanden & gevaren (moeilijkheidscurve over 12 golven, uitgebreid)
1. **Sturmtruppen** (gewone schutters, basis infanterie) — golf 1+, laag HP, matige snelheid.
2. **Granaatwerpers** (nieuw, bevestigd) — golf 3+, gooien handgranaten met een
   boog die deels over Muur/Prikkeldraad heen gaan en rechtstreeks de loopgraaf-
   linie raken; moeten snel neergehaald worden voor ze in werp-bereik komen.
3. **Vlammenwerper-troepen** (nieuw, bevestigd) — golf 5+, traag maar zeer
   gevaarlijk van dichtbij: zetten Muur/Prikkeldraad in brand (versnelde
   vervalschade aan die structuur) als ze de linie bereiken. Kwetsbaar op
   afstand door hun lage snelheid.
4. **Vijandelijk mortierteam** (nieuw, bevestigd) — golf 6+, blijft ver naar
   rechts (achteraan) staan en beschiet structuren direct met indirect vuur —
   dwingt de speler om ook doelen verderop in de lane te raken, niet alleen de
   dichtstbijzijnde vijand.
5. **Stoottroepen** (assault) — golf 4+, meer HP, iets sneller, meer schade bij doorbraak.
6. **Mosterdgas-aanval** — periodiek gevaar vanaf golf 5, raakt 1-3 willekeurige
   lanes tijdelijk; lanes zonder gasmaskerpost verliezen tijdelijk MG-effectiviteit
   en de loopgraaf lijdt extra schade als er in die lane doorbraken gebeuren.
7. **Tanks** — golf 8+, hoog HP, langzaam, negeren een deel van prikkeldraad-vertraging,
   vereisen geconcentreerd MG/AT-kanonvuur.
8. **Golf 12 (finale)**: gemengde zware golf — meerdere tanks, volle breedte gasaanval,
   granaatwerpers, vlammenwerpers en Stoottroepen door elkaar — climax voor het
   overwinningsscherm.

## Scenes
- `BootScene` → start `PreloadScene`.
- `PreloadScene` → laadt/placeholdert alle assets, laadbalk.
- `TitleScene` → titel, start, instellingen, (later) laatste-golf-record.
- `GameScene` → het slagveld: lanes, spawn-systeem, structuren, economie, HUD-koppeling.
- `UIScene` → HUD (voorraad, loopgraaf-HP, golfnummer) + bouwpaneel, parallel aan GameScene.
- `PauseScene` → verder/instellingen/stoppen.
- `SettingsScene` → volumesliders (master/sfx/muziek).
- `GameOverScene` → gehaalde golf, aantal kills, terug naar titel.
- `VictoryScene` → eindstand na golf 12, terug naar titel.

## Systemen
- `AssetManifest` + `PlaceholderGenerator` — asset-pipeline zoals hierboven.
- `LaneSystem` — beheert de 5 lanes, bouwplekken en welke structuur waar staat.
- `SpawnSystem` — golf-definities, spawnt vijanden per lane volgens schema.
- `EconomySystem` — voorraad bijhouden, kosten/upgrades valideren en afschrijven.
- `GasHazardSystem` — plant en voert vijandelijke mosterdgas-aanvallen uit vanaf golf 5.
- `AbilitySystem` — beheert de 3 speler-vaardigheden (mortier, eigen gasinzet,
  troepen verplaatsen), cooldowns en targeting-klikken op een lane.
- `CombatSystem` — machinegeweren zoeken doelen/vuren, schade, vijand-dood, doorbraak-afhandeling.
- `AudioManager` — Web Audio synth sfx + ambient geluid.
- `SaveManager` — localStorage voor instellingen en laatst gehaalde golf/hoogste golf.
- `InputManager` — muis/touch input voor bouwpaneel en plaatsing.

## Fasering
1. **Speelbare kern**: Phaser boot, placeholder-asset-pipeline werkend, statisch
   slagveld met 5 lanes, HUD-skelet, TitleScene → GameScene.
2. **Vijanden en combat**: SpawnSystem golf 1 (Sturmtruppen), machinegeweer-structuur
   die automatisch vuurt, schade/dood, doorbraak → loopgraaf-HP, game over bij 0.
3. **Economie en structuren**: voorraad-economie, bouwpaneel met Muur/MG/Gasmaskerpost/
   Prikkeldraad, upgrades, LaneSystem volledig, wave-complete/voorbereidingsfase.
4. **Volledige golf-campagne**: alle 12 golven met oplopende moeilijkheid,
   Stoottroepen, tanks, mosterdgas-gevaar + gasmaskerpost-interactie, VictoryScene.
5. **Menu's en polish**: PauseScene, SettingsScene (volume), GameOverScene met
   statistieken, audio (sfx + ambient), juice (screenshake, tracers, particles,
   hit-flash), balans-tuning zodat een volledige run ~10-20 minuten duurt.
6. **Asset-integratie en afwerking**: ASSETS.md volledig bijgewerkt, alle
   placeholders getest, README.md, GitHub Actions Pages-deploy workflow.

Na elke fase: testen met headless Playwright (laadt zonder console-errors,
placeholders tonen correct, basisgameplay werkt) en committen.

## Balans-richtlijnen
- Startvoorraad: 150. Golf-bonus: 40 + 8 per gedode vijand.
- Sturmtruppen: 20 HP, snelheid laag. Stoottroepen: 45 HP, iets sneller.
- Tank: 250 HP, traag, 20 schade bij doorbraak (infanterie: 5 schade).
- Loopgraaf-HP: 100. Een volledige run (golf 1-12 + bouwtijd) ≈ 10-20 minuten.

## Tooling voor testen
- Lokale statische server (`python3 -m http.server`) + headless Chromium via
  `playwright-core` (pre-installed browser, lokaal geïnstalleerd in scratchpad)
  om console-errors en page-errors te vangen na elke fase.
