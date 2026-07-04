# Movement · Richtungs-Sprites

> Original: `movement.fla` + `ninja_front/back/left/right.swf`
> Live-Demo: [`exercises/movement-richtungssprites/`](./index.html) auf GitHub Pages

## Worum es geht

Das kompakteste Beispiel im ganzen Kurs: eine Figur, die pro Tastendruck
ihre Position **und** ihre Blickrichtung ändert — komplett ohne Game-Loop.

## Was ich übersetzt habe

| Animate/AS3                                          | HTML5 / JavaScript                              |
|-------------------------------------------------------------|------------------------------------------------------|
| Bewegung direkt im `KeyboardEvent.KEY_DOWN`-Handler, kein `ENTER_FRAME` | identisch übernommen — Bewegung direkt im `keydown`-Handler |
| `character_mc.gotoAndStop("left"/"right"/"up"/"down")`         | vier gezeichnete Blickrichtungen, per `if`/`else` ausgewählt |
| vier `ninja_*.swf`-Bibliotheksgrafiken                          | selbst gezeichnete Figuren (Original-Vektorgrafiken ohne extrahierbare Bilddaten) |

## Warum kein Game-Loop?

Im Gegensatz zu praktisch jeder anderen Übung in diesem Kurs bewegt sich
die Figur hier nicht zeitbasiert pro Frame, sondern direkt bei jedem
Tastendruck-Ereignis um einen festen Betrag. Das koppelt die
Bewegungsgeschwindigkeit an die Tastatur-Wiederholrate des Betriebssystems
statt an die Bildwiederholrate — für ein derart kleines Demo ist das
völlig ausreichend und deutlich einfacher als ein vollständiger Loop.

## Was man hier lernt

- Nicht jede Bewegung braucht einen Game-Loop — manchmal reicht die direkte
  Reaktion auf ein Ereignis
- Der klassische "vier feste Blickrichtungen" statt "eine frei rotierende
  Figur"-Ansatz für Top-Down-Spiele (Zelda-Stil)
- Wieder ein Fall, in dem die Original-Grafiken (winzige Vektorformen ohne
  extrahierbare Bilddaten) durch eigene, funktional gleichwertige Zeichnungen
  ersetzt werden mussten

## Dateien

```
movement-richtungssprites/
├── index.html      Lernseite (Erklärung + interaktive Demo)
├── exercise.css      minimal
├── exercise.js         Bewegungslogik + vier gezeichnete Blickrichtungen
└── README.md            diese Datei
```

## Steuerung

`WASD` oder Pfeiltasten.
