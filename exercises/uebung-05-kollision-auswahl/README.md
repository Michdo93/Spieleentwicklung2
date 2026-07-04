# Übung 5 · Kollision & Charakter-Auswahl

> Original: `vl6.fla`, `uebung5_neu.fla` (Klasse `CharakterControl` mit `characterSelected`)
> Live-Demo: [`exercises/uebung-05-kollision-auswahl/`](./index.html) auf GitHub Pages

## Worum es geht

Erst die Grundlage jeder Kollisionserkennung (`hitTestObject`), dann der
große Schritt: Charaktere per Klick auswählen und gezielt mit der Tastatur
steuern — alle anderen bleiben derweil im Idle-Zustand.

## Was ich übersetzt habe

| Animate/AS3                                                    | HTML5 / JavaScript                                          |
|--------------------------------------------------------------------------|----------------------------------------------------------------------|
| `circle1_mc.hitTestObject(circle2_mc)` (Bounding-Box)                        | `Math.hypot(dx,dy) < r1+r2` — präziser für Kreise                       |
| `dispatchEvent(new Event("registerCharacter", true))` mit `bubbles=true`       | `bus.dispatchEvent(new CustomEvent("registerCharacter", {detail:this}))` auf einem gemeinsamen `EventTarget` |
| `stage.addEventListener("registerCharacter", ...)` im Root                     | `bus.addEventListener("registerCharacter", ...)` im zentralen Listener  |
| `characterSelected`-Flag pro Charakter                                          | `selected`-Flag pro `SelectableCharacter`-Instanz                        |
| `state = "playing"` blockiert neue Eingaben während des Sprungs                  | identisch übernommen (Sprung läuft ungestört bis `t >= jumpDuration`)   |

## Warum ein Event-Bus statt direkter Referenzen?

Das Original könnte theoretisch auch direkt sagen "Hauptobjekt kennt
Charakter 1, 2, 3". Stattdessen melden sich Charaktere selbst per Event an
(`registerCharacter`) und melden Klicks selbst nach oben
(`characterClicked`) — der Charakter muss nichts über seine Umgebung
wissen. Dieses Entkopplungsprinzip zieht sich durch den Rest des Kurses:
Übung 6 registriert genauso Level-Elemente, Übung 8 zusätzlich Münzen,
jeweils über dasselbe Event-Muster statt über feste Referenzen.

## Was man hier lernt

- Kollisionstests für Kreise sind mit einem einfachen Abstandsvergleich oft
  einfacher und genauer als eine reine Bounding-Box-Prüfung
- Ein Event-Registrierungsmuster als Alternative zu direkten Objektreferenzen
  — besonders nützlich, wenn viele gleichartige Objekte (Charaktere, später
  Münzen, Level-Elemente) sich bei einem zentralen System anmelden sollen
- Warum es wichtig ist, eine laufende Animation (den Sprung) vor
  Unterbrechung zu schützen, bis sie fertig ist

## Dateien

```
uebung-05-kollision-auswahl/
├── index.html      Lernseite mit 2 Demo-Tabs
├── exercise.css      Tab-Leiste
├── exercise.js         SelectableCharacter-Klasse + Event-Bus
└── README.md            diese Datei
```
