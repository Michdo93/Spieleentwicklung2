# Übung 6 · Schwerkraft & Level-Kollision

> Original: `vl7.fla`, `vl7_2.fla`, `uebung6.fla` (Collider, LevelBox, LevelStage, CharakterControl)
> Live-Demo: [`exercises/uebung-06-schwerkraft-level/`](./index.html) auf GitHub Pages

## Worum es geht

Drei Bausteine: Schwerkraft mit Abprallen, Raster-Interaktion (Klick
entfernt ein Element), und die Charakter-Auswahl aus Übung 5 mit echter
Boden-/Plattform-Kollision.

## Was ich übersetzt habe

| Animate/AS3                                                    | HTML5 / JavaScript                                          |
|--------------------------------------------------------------------------|----------------------------------------------------------------------|
| `deltaY += 1` pro Frame, `hitTestObject()` gegen Level-Kinder                | identisches Prinzip, AABB-Kollisionstest, zeitbasiert skaliert          |
| Raster aus `Rect`-Instanzen, `removeChild(_event.target)` bei Klick          | Array aus Zellobjekten, `alive`-Flag statt tatsächlichem Entfernen       |
| `Collider`/`LevelBox` → `RegisterCollider`-Event → `LevelStage` reicht als `RegisterLevelElement` weiter | `LevelPlatform`-Klasse meldet sich direkt per `RegisterLevelElement` auf dem gemeinsamen Event-Bus an |
| `checkHit()`/`hitTestCollider()` — Fußpunkt gegen registrierte Elemente        | `footHitsPlatform(footY)` — derselbe Test, ohne `localToGlobal`-Umweg (keine verschachtelten Koordinatensysteme im Canvas) |

## Warum die zweistufige Registrierung vereinfacht wurde

Im Original melden sich `Collider`/`LevelBox`-Objekte erst beim
`LevelStage`-Container an, der das Event dann *noch einmal* nach oben
weiterreicht (`RegisterCollider` → `RegisterLevelElement`) — nötig, weil
Flashs Anzeigeliste hierarchisch ist und Events durch mehrere
Container-Ebenen bubbeln müssen. Im Canvas gibt es diese Verschachtelung
nicht: Eine `LevelPlatform` meldet sich direkt beim gemeinsamen Event-Bus
an. Das Ergebnis ist dasselbe (der Charakter-Controller bekommt eine Liste
aller Level-Elemente), nur ohne den Umweg über eine Zwischenebene.

## Was man hier lernt

- Schwerkraft ist im Kern nur eine sich akkumulierende Geschwindigkeit
  (`deltaY`), die jeden Frame zur Position addiert wird
- Ein Klick-zu-Entfernen-Muster für Raster — Grundlage vieler Puzzle- und
  Inventar-Mechaniken
- Wie sich eine mehrstufige Event-Registrierungskette vereinfachen lässt,
  wenn die zugrundeliegende Umgebung (Canvas statt verschachtelter
  Anzeigeliste) diese Verschachtelung gar nicht braucht — ohne das
  Grundprinzip (Objekte melden sich selbst an) zu verlieren

## Dateien

```
uebung-06-schwerkraft-level/
├── index.html      Lernseite mit 3 Demo-Tabs
├── exercise.css      Tab-Leiste
├── exercise.js         LevelCharacter-Klasse, LevelPlatform, Bounce-/Grid-Demo
└── README.md            diese Datei
```
