# Übung 3 · Event-Listener & Zustände

> Original: `eventListener.fla`, `uebung3.fla`
> Live-Demo: [`exercises/uebung-03-event-listener/`](./index.html) auf GitHub Pages

## Worum es geht

Zwei Demos: ein Quadrat, das per `ENTER_FRAME` kontinuierlich bewegt,
gedreht und (ab einem Winkel) verkleinert wird, mit Bildschirm-Wrapping —
und die Charakterfigur aus Übung 2, die zum ersten Mal von Code statt von
Buttons gesteuert wird: ein Zufallsgenerator ruft `doAction()` auf.

## Was ich übersetzt habe

| Animate/AS3                                       | HTML5 / JavaScript                              |
|-------------------------------------------------------|--------------------------------------------------------|
| `Event.ENTER_FRAME`                                      | `requestAnimationFrame`                                  |
| `square_mc.rotation == 180` (exakter Vergleich)            | Intervall-Prüfung (`rotation >= 180 && rotation < 193`) — nötig, weil unsere Zeitschritte nicht exakt auf 180° treffen |
| `Math.random()`-Schwellenwerte (0.7/0.9) für walk/idle/jump  | identisch übernommen                                    |
| `doAction()` — wechselt nur bei tatsächlicher Änderung        | identisch übernommen (`if (this.currentAnimation !== action)`) |

## Warum der Rotationsvergleich angepasst wurde

Das Original erhöht die Rotation in festen 30°-Schritten pro Frame — ein
exakter Vergleich `== 180` trifft dadurch garantiert genau einmal. Bei
zeitbasierter Bewegung mit variablen Schrittgrößen (abhängig von der
tatsächlichen Framerate) würde ein exakter Vergleich fast nie zutreffen.
Die Portierung prüft deshalb ein kleines Intervall um 180° — ein kleines,
aber lehrreiches Beispiel dafür, worauf man beim Übergang von
frame-gezählten zu zeitbasierten Animationen achten muss.

## Was man hier lernt

- `ENTER_FRAME` und `requestAnimationFrame` sind praktisch austauschbar —
  beide bedeuten "rufe diese Funktion bei jedem gezeichneten Bild auf"
- Warum exakte Zahlenvergleiche bei zeitbasierter (statt frame-gezählter)
  Bewegung zu Fallstricken werden können
- Das erste Mal, dass Code (nicht der Benutzer) eine Animation auswählt —
  der konzeptionelle Vorläufer jeder Spiel-KI

## Dateien

```
uebung-03-event-listener/
├── index.html      Lernseite mit 2 Demo-Tabs
├── exercise.css      Tab-Leiste, Ausgabe-Panel
├── exercise.js         beide Demos + CharacterRig-Klasse
└── README.md            diese Datei
```
