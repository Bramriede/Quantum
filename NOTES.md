# Aannames en technische keuzes

Dit bestand houdt bij welke keuzes ik zelf heb gemaakt waar het concept niet
100% expliciet was, zodat je kan corrigeren waar nodig.

1. **Naam resource**: je noemde de tussen-golf-munt "xp", maar in een WW1-
   loopgraaf-setting past "Voorraad" (Supplies) thematisch beter dan
   "experience points" (dat klinkt als personage-leveling, wat dit spel niet
   heeft). Ik gebruik intern/in de UI "Voorraad" met een munt-icoon, functioneel
   identiek aan wat je bedoelde: verdiend per golf + per kill, uitgegeven aan
   fortificaties/wapens tijdens de pauzefase.
2. **Kleine dynamische effecten** (kogeltracers, mondingsvuur, stofwolken,
   gaswolk-deeltjes, bloedspetters, screenshake) worden met code/Phaser
   Graphics getekend, niet als los ChatGPT-asset. Dit zijn geen "definitieve
   graphics" maar korte visuele feedback — zonder deze feedback voelt combat
   dood aan. Structuren, eenheden, achtergrond en UI blijven wel 100%
   jouw art via `/assets`.
3. **Geen spritesheet-animaties voor eenheden**: AI-beeldgeneratoren zijn niet
   consistent over meerdere frames van dezelfde animatie. Elke eenheid/structuur
   is daarom één los statisch beeld; beweging/"leven" komt van code (lichte
   bob/rotatie, sterven-animatie via tween + rode flash, geen los death-sprite
   nodig tenzij je dat later alsnog wil toevoegen).
4. **Bouwen enkel tijdens pauzefase** (bevestigd): tijdens een actieve golf kan
   niet gebouwd/geüpgraded worden, alleen in de pauze na elke golf. Geen
   geforceerde aftelklok tijdens de pauze — speler start de volgende golf zelf.
5. **Canvas-afmeting** 1000×760, vastgesteld na jouw voorbeeld met langere lanes.
6. **12 golven vaste campagne**, golf 12 = finale. Aantal is mijn keuze binnen
   "10-20 minuten totale speeltijd"; makkelijk aan te passen na eerste playtest.
7. **Geen minimap** (bevestigd, expliciet uitgesloten).
8. **Geen medic/reparatie-gebouw** — alleen de 4 structuren uit je oorspronkelijke
   opzet (Muur, Machinegeweer, Gasmaskerpost, Prikkeldraad), ook al toonden de
   referentiebeelden een rood-kruis-gebouwtje.
9. **Actieve vaardigheden tijdens een golf** (mortier/gas/troepen verplaatsen,
   bevestigd als toevoeging): ik heb dit uitgewerkt als **gratis, cooldown-
   gebaseerd** i.p.v. Voorraad-kosten, om economie (pauzefase) en tactiek
   (tijdens de golf) gescheiden te houden. Exacte cooldowns/duur/schade
   (mortier 25s, gas 35s/6s duur, 3 reserve-troepen/30s) zijn mijn eerste
   balans-inschatting en pas ik makkelijk aan na een eerste speeltest.
