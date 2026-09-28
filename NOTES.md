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
10. **Layout-correctie (belangrijk)**: op basis van een referentiescreenshot is
    de speelveld-oriëntatie gecorrigeerd. Eerdere aanname (Fase 1): verticale
    lanes, loopgraaf onderaan, vijanden van boven naar beneden. **Nu correct**:
    horizontale lanes (gestapeld), loopgraaf verticaal links, vijanden spawnen
    rechts en marcheren naar links. Fase 1-layoutcode (Constants.js,
    LaneSystem.js, GameScene.js) wordt hierop aangepast.
11. **AT-kanon** (nieuw, bevestigd): 5e structuur, WW1-authentiek gebaseerd op
    veldkanonnen in antitank-rol en het Tankgewehr M1918-antitankgeweer. Géén
    Panzerfaust — dat bestond nog niet in 1917 (WO2-wapen).
12. **Nieuwe vijandtypen** (Granaatwerpers, Vlammenwerper-troepen, vijandelijk
    mortierteam) toegevoegd zoals gevraagd. Golfnummers waarop ze verschijnen
    (golf 3/5/6) zijn mijn eerste balans-inschatting.
13. **Soldaat-weergave**: eenheden worden kleiner/talrijker weergegeven op het
    slagveld (in-game renderschaal verkleind t.o.v. de brongrootte in
    ASSETS.md) voor een drukker, dichter ogend slagveld — de bron-pixelgrootte
    in ASSETS.md blijft ongewijzigd (voor voldoende tekendetail), alleen de
    schaal waarop Phaser het toont wordt kleiner.
15. **Loopgraaf in 2 rijen structuren** (bevestigd, dit gaat over de SPELER's
    eigen loopgraaf, niet over vijand-formaties): voorste rij (dicht bij no
    man's land) = Muur, nieuwe Vlammenwerper-structuur, Machinegeweer (2
    sloten); achterste rij (verder terug) = AT-kanon, nieuwe Mortierteam-
    structuur (3-koppige bemanning met een kleine mortier, visuele stijl à la
    Company of Heroes), Gasmaskerpost. De losse actieve mortier-vaardigheid
    (gratis, cooldown, 1 gerichte inzet) blijft ook bestaan naast deze
    permanente structuur — allebei tegelijk, niet in plaats van elkaar.
16. **Mijnen en tankversperringen** (bevestigd): naast Prikkeldraad kunnen
    Tankmijn (eenmalig, alleen tanks), Personeelsmijn (eenmalig, alleen
    infanterie-achtige eenheden) en Tankversperring (permanent, alleen tanks)
    gekocht en geplaatst worden in no man's land. Ik implementeer dit als 2
    bouwplekken per lane in no man's land (ver + dichtbij de loopgraaf) i.p.v.
    volledig vrije plaatsing, om de UI/balans behapbaar te houden.
17. **Scope-fasering**: dit uitgebreide rooster (fase-1-toevoegingen 15+16)
    wordt vastgelegd in PLAN.md/ASSETS.md maar pas **gebouwd in Fase 4**
    ("volledige golf-campagne"). Fase 2/3 blijven bewust bij de kern-loop
    (golf 1 infanterie + Muur/MG/Gasmaskerpost/Prikkeldraad) zodat er steeds
    een werkend, testbaar tussenresultaat blijft i.p.v. alles tegelijk bouwen.
14. **Eenheden/structuren die een richting hebben** (soldaten, tank, muur,
    prikkeldraad): ik laat ChatGPT deze altijd in een vaste standaardpose
    genereren (recht van boven, "kijkend"/bewegend naar de bovenkant van het
    plaatje) en roteer/flip ze zelf in code naar de juiste richting op het
    slagveld (naar links voor vijanden, verticaal voor loopgraaf-structuren).
    Dat is betrouwbaarder dan een beeldgenerator vragen om een exacte
    kijkrichting, en betekent dat prompts in ASSETS.md een vaste oriëntatie
    beschrijven i.p.v. "naar links lopend".
