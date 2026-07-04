# Übung 1 · Animation-Grundlagen

> Original: `strichmännchen.fla`, `uebung1.fla`, `testAnimSkripting.fla`
> Live-Demo: [`exercises/uebung-01-animation-grundlagen/`](./index.html) auf GitHub Pages

## Worum es geht

Drei grundlegende Animationstechniken aus Adobe Animate, jede mit ihrer
direkten Web-Entsprechung:

1. **Frame-by-Frame** — von Hand gezeichnete Einzelposen, keine Berechnung
   dazwischen (`strichmännchen.fla`)
2. **Klassisches Tweening** — nur Start-/Endzustand festlegen, der Rest wird
   automatisch berechnet (`uebung1.fla`)
3. **Skriptgesteuerte Animation** — Code entscheidet über benannte
   Zustände/Frames (`testAnimSkripting.fla`)

## Was ich übersetzt habe

| Animate/AS3                                          | HTML5 / JavaScript                                    |
|----------------------------------------------------------------|---------------------------------------------------------------|
| vier von Hand gezeichnete Frames, im Bildratentakt gezeigt        | Array von vier Posen + `setInterval()`                          |
| Motion-Tween zwischen zwei Keyframes                                | Easing-Funktion (`easeInOutQuad`) über einen Fortschrittswert `t` |
| `doAction(_action)` + `gotoAndPlay(nextLabel)`                       | `doAction(newAction)` setzt eine Zustandsvariable, der Game-Loop reagiert darauf |

## Warum das wichtig ist

Das `doAction()`-Muster aus `testAnimSkripting.fla` ist keine Eintagsfliege
— es zieht sich durch den **gesamten restlichen Kurs**: ab Übung 3 steuert
genau dieses Muster, ob eine Spielfigur gerade läuft, steht oder springt.
Wer dieses erste, einfache Beispiel verstanden hat, versteht damit schon
die Grundidee hinter der Spielfigur-Steuerung der späteren Übungen.

## Was man hier lernt

- Drei unterschiedliche Animationsphilosophien und wann welche sinnvoll ist
- Dass Tweening im Kern nur eine Interpolationsformel ist, egal ob die
  Software sie automatisch anwendet (Animate) oder man sie selbst schreibt
  (JavaScript)
- Das `doAction(label)`-Zustandsmuster, das im ganzen Kurs wiederkehrt

## Dateien

```
uebung-01-animation-grundlagen/
├── index.html      Lernseite mit 3 Demo-Tabs
├── exercise.css      Tab-Leiste, Action-Buttons
├── exercise.js        alle drei Demos
└── README.md           diese Datei
```
