# Übung 2 · Charakter-Rig bauen

> Original: `Charakter.fla` (Figur, Body, Neck, Shoulder_Left/Right, Forearm_Left/Right, Hand, Leg) — reines Rigging, kein Code
> Live-Demo: [`exercises/uebung-02-charakter-rig/`](./index.html) auf GitHub Pages

## Worum es geht

Eine Figur aus Einzelteilen zusammensetzen (Kopf, Rumpf, zweiteilige Arme,
Beine) und ihr drei Zustände geben: Idle, Walk, Jump. Diese Figur ist die
Basis für praktisch den gesamten restlichen Kurs.

## Was ich übersetzt habe

| Animate/AS3                                              | HTML5 / JavaScript                                      |
|--------------------------------------------------------------------|------------------------------------------------------------------|
| verschachtelte MovieClips, jedes mit eigenem Drehpunkt                | verschachtelte `ctx.translate()`/`ctx.rotate()`-Aufrufe             |
| von Hand animierte Keyframes für Idle/Walk/Jump                       | eine Sinusfunktion pro Körperteil, unterschiedliche Amplitude/Geschwindigkeit je Zustand |
| Idle/Walk als Endlosschleife, Jump als einmalige Zeitleisten-Animation | `state`-Variable + Fortschrittswert `t`, Jump kehrt nach Abschluss automatisch zu Idle zurück |

## Warum keine echten Bilddateien?

Die Figur bestand im Original ausschließlich aus in Animate gezeichneten
Vektorformen (keine Fotos oder Bitmaps) — es gibt also keine Originaldatei
zu übernehmen. Die Portierung zeichnet stattdessen ein einfaches
Strichfiguren-Rig direkt auf dem Canvas, mit derselben Gelenk-Hierarchie
wie im Original.

## Was man hier lernt

- Wie sich "verschachtelte Objekte mit eigenem Drehpunkt" (die Grundidee
  hinter jedem 2D-Skelett-Rig) mit einfachen Canvas-Transformationen
  nachbauen lässt
- Dass viele handgemachte Keyframe-Animationen sich durch eine einzige
  parametrisierte Funktion (hier: Sinus) ersetzen lassen — kürzerer Code,
  leicht einstellbare Geschwindigkeit/Amplitude
- Den Unterschied zwischen Endlosschleifen-Animationen (Idle, Walk) und
  einmaligen Animationen, die danach automatisch in einen anderen Zustand
  zurückfallen (Jump) — wichtig für Übung 5

## Dateien

```
uebung-02-charakter-rig/
├── index.html      Lernseite (Erklärung + interaktives Rig)
├── exercise.css      Tab-Leiste
├── exercise.js        CharacterRig-Klasse
└── README.md           diese Datei
```
