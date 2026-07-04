# Übung 4 · Eingabe & Charakter-Steuerung I

> Original: `vl05.fla`, `uebung4.fla` (Klasse `CharakterControl`)
> Live-Demo: [`exercises/uebung-04-eingabe-steuerung/`](./index.html) auf GitHub Pages

## Worum es geht

Maus- und Tastatur-Grundlagen, dann fünf unabhängige Charaktere, die sich
jetzt wirklich über die Bühne bewegen (nicht nur ihre Animation ändert
sich) und an den Bildschirmrändern abprallen.

## Was ich übersetzt habe

| Animate/AS3                                              | HTML5 / JavaScript                                    |
|--------------------------------------------------------------------|---------------------------------------------------------------|
| `MouseEvent.CLICK` / `KeyboardEvent.KEY_DOWN` + `Keyboard.LEFT/...`   | `click`-Event / `keydown`-Event + Taste-zu-Richtung-Lookup-Tabelle |
| `MovieClip(this.parent).doNewAction()` am Ende jeder Zeitleisten-Animation | `if (this.t >= this.duration) this.doNewAction();` im Update-Loop |
| `moveHorizontal()` — Randerkennung, Orientierung umdrehen               | identisch übernommen                                          |
| Geschwindigkeit abhängig vom Animationszustand (walk = voll, jump = halb, idle = 0) | identisch übernommen                                          |

## Vom Zufallstimer zur selbstmeldenden Animation

Der wichtigste konzeptionelle Unterschied zu Übung 3: Dort entschied ein
festes Zeitintervall, wann die nächste Zufallsaktion kommt. Hier hat jede
Animation ihre eigene Dauer, und wenn sie abgelaufen ist, wählt sie selbst
die nächste Aktion — im Original, indem die letzte Frame der
Zeitleisten-Animation `doNewAction()` auf dem übergeordneten Objekt
aufruft. Das ist ein saubereres Muster: die Animation "weiß", wann sie
fertig ist, statt dass ein externer Timer raten muss.

## Was man hier lernt

- Tastatur-Richtungslogik als Lookup-Tabelle statt langer `switch`-Kette
- Das Muster "Animation meldet ihr eigenes Ende zurück" als Alternative zu
  einem externen Timer — robuster, weil die Dauer direkt an der Animation
  selbst hängt
- Wie sich Bewegung und Animationszustand sauber trennen lassen: Ein System
  kümmert sich um "wo bin ich" (Position, Ränder), ein anderes um "was mache
  ich gerade" (Idle/Walk/Jump) — verbunden nur über die aktuelle
  Geschwindigkeit

## Dateien

```
uebung-04-eingabe-steuerung/
├── index.html      Lernseite mit 2 Demo-Tabs
├── exercise.css      Tab-Leiste, Ausgabe-Panel
├── exercise.js         CharacterController-Klasse (5 Instanzen)
└── README.md            diese Datei
```
