# ASSETS.md — Beeldmateriaal LOOPGRAAF 1917

Alle afbeeldingen hieronder ontbreken nu nog. De game toont tot die tijd een
placeholder: een gekleurd vlak met de bestandsnaam erop, exact op de opgegeven
afmetingen. Zodra jij een bestand met **exact deze naam** in `/assets` plaatst
(zelfde map/bestandsnaam, `.png`), laadt de game dat automatisch in plaats van
de placeholder — er is geen enkele codewijziging nodig.

**Formaat**: PNG. Gebruik transparantie (alpha-kanaal) waar aangegeven, zodat
sprites los over de achtergrond heen vallen zonder vierkante rand.

## Vaste stijlzin (gebruik in élke prompt voor consistentie)

> Top-down (bird's-eye view) 2D game asset, detailed painterly pixel-art World
> War 1 military style similar to a Command & Conquer-style RTS, desaturated
> muddy war color palette (khaki, mud brown, olive drab, grey, rust, dull
> green), crisp readable silhouette, soft top-down ambient shading, no
> photorealism, no text, no watermark, no drop shadow baked in, lit from
> directly above.

De onderstaande prompts bevatten deze stijlzin al verwerkt — gewoon kopiëren
en plakken per rij.

## Achtergronden & schermen

| Bestandsnaam | Pad | Doel | Afmetingen | Transparant | Prompt |
|---|---|---|---|---|---|
| `title_bg.png` | `/assets/backgrounds/title_bg.png` | Volledige achtergrond titelscherm | 1600×900 | Nee | "Top-down (bird's-eye view) 2D game background, detailed painterly pixel-art WW1 military style similar to a Command & Conquer-style RTS, desaturated muddy war color palette, wide establishing shot of a misty WW1 no-man's-land battlefield at dawn with distant trench lines, shell craters, barbed wire silhouettes, faint smoke on the horizon, moody and atmospheric, no soldiers in focus, no text, no watermark, suitable as a full-screen widescreen background behind a game title." |
| `battlefield_bg.png` | `/assets/backgrounds/battlefield_bg.png` | Volledige speelveld-achtergrond tijdens gameplay (onder alle sprites) | 1600×900 | Nee | "Top-down (bird's-eye view) 2D game background, detailed painterly pixel-art WW1 military style similar to a Command & Conquer-style RTS, desaturated muddy war color palette (khaki, mud brown, olive drab, grey), a long, tall muddy no-man's-land strip seen directly from above, wider than it is tall overall but with a long vertical no-man's-land stretch: shell craters, scattered barbed wire remnants, dead trees, mud tracks, small debris, subtle variation in terrain texture, no soldiers, no UI, no text, seamless full-frame battlefield ready to have unit sprites placed on top." |
| `panel_bg.png` | `/assets/ui/panel_bg.png` | Achtergrondbalk onderste bouw-/winkelpaneel | 1600×140 | Nee | "Top-down 2D game UI asset, detailed painterly pixel-art WW1 military RTS style, a dark weathered metal-and-wood horizontal UI panel bar with rivets and subtle battle wear, matching a Command & Conquer-style HUD, flat horizontal strip suitable as a bottom toolbar background, no icons, no text, no watermark." |
| `hud_top_bg.png` | `/assets/ui/hud_top_bg.png` | Achtergrondbalk bovenste HUD-balk | 1600×60 | Nee | "Top-down 2D game UI asset, detailed painterly pixel-art WW1 military RTS style, a slim dark weathered metal horizontal HUD bar with subtle rivets, matching a Command & Conquer-style top status bar, flat thin horizontal strip, no icons, no text, no watermark." |
| `ability_bar_bg.png` | `/assets/ui/ability_bar_bg.png` | Achtergrondbalk vaardighedenbalk (mortier/gas/reserves), altijd zichtbaar | 1600×50 | Nee | "Top-down 2D game UI asset, detailed painterly pixel-art WW1 military RTS style, a slim dark weathered metal horizontal HUD bar with subtle rivets, matching a Command & Conquer-style ability toolbar, flat thin horizontal strip, no icons, no text, no watermark." |

## Knoppen & iconen

| Bestandsnaam | Pad | Doel | Afmetingen | Transparant | Prompt |
|---|---|---|---|---|---|
| `button_frame.png` | `/assets/ui/button_frame.png` | Generieke menuknop (titel/pauze/instellingen), wordt geschaald | 400×100 | Ja | "Top-down 2D game UI asset, detailed painterly pixel-art WW1 military RTS style, a rectangular military-stencil-style button frame with riveted metal edges and rounded corners, empty center (no label), suitable for overlaying text, isolated on transparent background, no text, no watermark." |
| `icon_wall.png` | `/assets/ui/icon_wall.png` | Bouwpaneel-icoon: Muur/Zandzakken | 128×128 | Ja | "Top-down 2D game UI icon, detailed painterly pixel-art WW1 military RTS style, a stack of sandbags forming a small defensive wall, viewed from a three-quarter top-down angle like an RTS build icon, isolated on transparent background, no text, no watermark." |
| `icon_machinegun.png` | `/assets/ui/icon_machinegun.png` | Bouwpaneel-icoon: Machinegeweer | 128×128 | Ja | "Top-down 2D game UI icon, detailed painterly pixel-art WW1 military RTS style, a WW1-era tripod-mounted machine gun (Maxim/Vickers style), viewed from a three-quarter top-down angle like an RTS build icon, isolated on transparent background, no text, no watermark." |
| `icon_gasmask.png` | `/assets/ui/icon_gasmask.png` | Bouwpaneel-icoon: Gasmaskerpost | 128×128 | Ja | "Top-down 2D game UI icon, detailed painterly pixel-art WW1 military RTS style, a small reinforced wooden-and-sandbag bunker entrance with a WW1 gas mask symbol above the doorway, viewed from a three-quarter top-down angle like an RTS build icon, isolated on transparent background, no text, no watermark." |
| `icon_barbedwire.png` | `/assets/ui/icon_barbedwire.png` | Bouwpaneel-icoon: Prikkeldraad | 128×128 | Ja | "Top-down 2D game UI icon, detailed painterly pixel-art WW1 military RTS style, coiled barbed wire on wooden X-shaped stakes (a knife rest / chevaux de frise), viewed from a three-quarter top-down angle like an RTS build icon, isolated on transparent background, no text, no watermark." |
| `icon_supplies.png` | `/assets/ui/icon_supplies.png` | Valuta-icoon (voorraad) in HUD en prijskaartjes | 64×64 | Ja | "Top-down 2D game UI icon, detailed painterly pixel-art WW1 military RTS style, a small brass military ammo/supply crate token or brass coin stamped with a crossed-rifles emblem, used as a currency icon, isolated on transparent background, no text, no watermark." |
| `icon_wave.png` | `/assets/ui/icon_wave.png` | Klein icoon naast golfnummer in HUD | 64×64 | Ja | "Top-down 2D game UI icon, detailed painterly pixel-art WW1 military RTS style, a small iron cross military rank emblem, used as a wave-counter icon, isolated on transparent background, no text, no watermark." |
| `healthbar_frame.png` | `/assets/ui/healthbar_frame.png` | Metalen frame om de loopgraaf-HP-balk (vulling wordt met code getekend) | 420×40 | Ja | "Top-down 2D game UI asset, detailed painterly pixel-art WW1 military RTS style, an empty riveted metal gauge/bar frame (hollow center, no fill), horizontal, suitable as a health bar container, isolated on transparent background, no text, no watermark." |
| `ability_mortar.png` | `/assets/ui/ability_mortar.png` | Vaardigheden-icoon: Mortierinzet | 96×96 | Ja | "Top-down 2D game UI icon, detailed painterly pixel-art WW1 military RTS style, a WW1 trench mortar (Stokes mortar) viewed from a three-quarter top-down angle like an RTS ability icon, isolated on transparent background, no text, no watermark." |
| `ability_gas.png` | `/assets/ui/ability_gas.png` | Vaardigheden-icoon: Eigen mosterdgas-inzet | 96×96 | Ja | "Top-down 2D game UI icon, detailed painterly pixel-art WW1 military RTS style, a WW1 gas artillery shell with a faint sickly green gas wisp curling from its tip, viewed from a three-quarter top-down angle like an RTS ability icon, isolated on transparent background, no text, no watermark." |
| `ability_reserves.png` | `/assets/ui/ability_reserves.png` | Vaardigheden-icoon: Troepen verplaatsen | 96×96 | Ja | "Top-down 2D game UI icon, detailed painterly pixel-art WW1 military RTS style, two crossed rifles behind a small directional arrow, symbolizing reserve troops being redeployed, viewed like an RTS ability icon, isolated on transparent background, no text, no watermark." |

## Vijanden

| Bestandsnaam | Pad | Doel | Afmetingen | Transparant | Prompt |
|---|---|---|---|---|---|
| `soldier_infantry_enemy.png` | `/assets/units/soldier_infantry_enemy.png` | Basis Duitse infanterie (golf 1+) | 64×64 | Ja | "Top-down (bird's-eye view) 2D game character sprite, detailed painterly pixel-art WW1 military style similar to a Command & Conquer-style RTS, a single German WW1 infantry soldier (Stahlhelm helmet, grey-green uniform, rifle) seen directly from above walking forward, isolated on transparent background, no shadow baked in except a very subtle contact shadow, no text, no watermark." |
| `soldier_assault_enemy.png` | `/assets/units/soldier_assault_enemy.png` | Zwaardere Duitse stoottroep (golf 4+) | 64×64 | Ja | "Top-down (bird's-eye view) 2D game character sprite, detailed painterly pixel-art WW1 military style similar to a Command & Conquer-style RTS, a single German WW1 Stosstruppen assault soldier (Stahlhelm, stick grenades on belt, submachine gun, slightly bulkier silhouette than a regular infantryman) seen directly from above walking forward, isolated on transparent background, subtle contact shadow only, no text, no watermark." |
| `tank_enemy.png` | `/assets/units/tank_enemy.png` | Vijandelijke tank (golf 8+) | 128×128 | Ja | "Top-down (bird's-eye view) 2D game vehicle sprite, detailed painterly pixel-art WW1 military style similar to a Command & Conquer-style RTS, a WW1-era rhomboid tank (Mark IV style, riveted metal hull, side tracks wrapping fully around the body) seen directly from above facing downward, isolated on transparent background, subtle contact shadow only, no text, no watermark." |

## Structuren (speler-defensie)

| Bestandsnaam | Pad | Doel | Afmetingen | Transparant | Prompt |
|---|---|---|---|---|---|
| `wall_level1.png` | `/assets/structures/wall_level1.png` | Muur niveau 1 in loopgraaf-slot | 160×120 | Ja | "Top-down (bird's-eye view) 2D game structure sprite, detailed painterly pixel-art WW1 military RTS style, a low, thin single row of sandbags forming a basic defensive wall segment for a trench, seen directly from above, isolated on transparent background, subtle contact shadow only, no text, no watermark." |
| `wall_level2.png` | `/assets/structures/wall_level2.png` | Muur niveau 2 (upgrade) | 160×120 | Ja | "Top-down (bird's-eye view) 2D game structure sprite, detailed painterly pixel-art WW1 military RTS style, a reinforced double-thick sandbag wall segment with some wooden support beams, seen directly from above, isolated on transparent background, subtle contact shadow only, no text, no watermark." |
| `wall_level3.png` | `/assets/structures/wall_level3.png` | Muur niveau 3 (max upgrade) | 160×120 | Ja | "Top-down (bird's-eye view) 2D game structure sprite, detailed painterly pixel-art WW1 military RTS style, a heavily reinforced sandbag-and-concrete wall segment with steel plating and sandbag stacks, seen directly from above, isolated on transparent background, subtle contact shadow only, no text, no watermark." |
| `machinegun_level1.png` | `/assets/structures/machinegun_level1.png` | MG-nest niveau 1 | 140×140 | Ja | "Top-down (bird's-eye view) 2D game structure sprite, detailed painterly pixel-art WW1 military RTS style, a small sandbag machine gun nest with a single tripod-mounted Maxim-style machine gun and one crewman, seen directly from above, isolated on transparent background, subtle contact shadow only, no text, no watermark." |
| `machinegun_level2.png` | `/assets/structures/machinegun_level2.png` | MG-nest niveau 2 (upgrade) | 140×140 | Ja | "Top-down (bird's-eye view) 2D game structure sprite, detailed painterly pixel-art WW1 military RTS style, a reinforced sandbag machine gun nest with a heavier machine gun, ammo crates stacked beside it, and one crewman, seen directly from above, isolated on transparent background, subtle contact shadow only, no text, no watermark." |
| `machinegun_level3.png` | `/assets/structures/machinegun_level3.png` | MG-nest niveau 3 (max upgrade) | 140×140 | Ja | "Top-down (bird's-eye view) 2D game structure sprite, detailed painterly pixel-art WW1 military RTS style, a heavily fortified concrete-and-sandbag machine gun emplacement with twin machine guns and two crewmen, seen directly from above, isolated on transparent background, subtle contact shadow only, no text, no watermark." |
| `gasmask_bunker.png` | `/assets/structures/gasmask_bunker.png` | Gasmaskerpost (1 niveau) | 140×120 | Ja | "Top-down (bird's-eye view) 2D game structure sprite, detailed painterly pixel-art WW1 military RTS style, a small reinforced wooden-and-sandbag dugout bunker with crates of gas masks stacked at the entrance, seen directly from above, isolated on transparent background, subtle contact shadow only, no text, no watermark." |
| `barbedwire_level1.png` | `/assets/structures/barbedwire_level1.png` | Prikkeldraad niveau 1, geplaatst in no man's land | 170×60 | Ja | "Top-down (bird's-eye view) 2D game structure sprite, detailed painterly pixel-art WW1 military RTS style, a single low row of barbed wire strung between wooden stakes stretching horizontally, seen directly from above, isolated on transparent background, subtle contact shadow only, no text, no watermark." |
| `barbedwire_level2.png` | `/assets/structures/barbedwire_level2.png` | Prikkeldraad niveau 2 (upgrade) | 170×60 | Ja | "Top-down (bird's-eye view) 2D game structure sprite, detailed painterly pixel-art WW1 military RTS style, a dense double row of tangled barbed wire on reinforced wooden knife-rest stakes stretching horizontally, seen directly from above, isolated on transparent background, subtle contact shadow only, no text, no watermark." |

## Niet als los asset (bewust, zie NOTES.md)
Kogeltracers, mondingsvuur, stofwolken/explosie-rook, gaswolk-deeltjes,
bloedspetters en screenshake worden door code (Phaser Graphics/particles)
getekend, niet als los ChatGPT-plaatje.
