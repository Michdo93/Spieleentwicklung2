# Übung 9 · Sound, UI & Server

> Original: `vl10.fla`, `vl10_2.fla`, `vl11.fla`, `footstep.as`
> Live-Demo: [`exercises/uebung-09-sound-ui-server/`](./index.html) auf GitHub Pages
> ⚠️ Demo 3 braucht eine Internetverbindung (öffentlicher Test-Server).

## Worum es geht

Drei für sich stehende Themen, die zu jeder echten Anwendung dazugehören:
fertige UI-Bausteine, Soundeffekte (eingebettet und gestreamt), und
Kommunikation mit einem Server.

## Was ich übersetzt habe

| Animate/AS3                                                | HTML5 / JavaScript                                      |
|------------------------------------------------------------------|--------------------------------------------------------------|
| Stepper/Button/CheckBox/ColorPicker/Slider-Komponenten               | native `<input type="number"/"color"/"range">`, `<button>`, `<input type="checkbox">` |
| `footstep`-Klasse (`extends Sound`, eingebetteter Sound)              | `new Audio("assets/footstep.mp3")` — Original-Asset, aus der FLA extrahiert |
| `Sound`/`SoundChannel`/`SoundTransform` für gestreamten Loop            | `new Audio("assets/SlowLoop.mp3")` mit `.loop = true`, `.volume` |
| `URLVariables` + `URLRequest` + `URLLoader`                            | `fetch()` mit `POST`, `JSON.stringify()` als Body             |

## Warum ein anderer Server?

Das Original sendet Daten an einen eigenen PHP-Endpunkt auf dem
Hochschul-Webspace des Kursautors. Für eine Demo, die dauerhaft und für
alle funktioniert, wurde stattdessen der öffentliche Test-Server
`httpbin.org` verwendet, der Anfragen einfach zurück-echot — das Prinzip
(Daten senden, Antwort verarbeiten) bleibt exakt gleich, nur der Endpunkt
ist austauschbar.

## Original-Audiodateien

`footstep.mp3` und `SlowLoop.mp3` waren im Original als eingebettete WAV-
Dateien in den FLA-Paketen enthalten (Animate speichert eingebettete Assets
im FLA-eigenen ZIP-Container). Beide wurden extrahiert und nach MP3
konvertiert — inhaltlich unverändert.

## Was man hier lernt

- Für praktisch jede Flash-UI-Komponente gibt es ein natives HTML-Element —
  oft sogar mit besserer Barrierefreiheit ohne zusätzlichen Code
- Im Web verschwimmt der Unterschied zwischen "eingebettetem" und
  "gestreamtem" Sound, den AS3 noch über verschiedene APIs abbildete —
  beides ist einfach eine Audiodatei
- `fetch()` mit `async`/`await` als direkte, deutlich kompaktere
  Entsprechung zu `URLLoader` + Event-Listener

## Dateien

```
uebung-09-sound-ui-server/
├── index.html      Lernseite mit 3 Demo-Tabs
├── exercise.css      Formular-/Panel-Styles
├── exercise.js         alle drei Demos
├── assets/
│   ├── footstep.mp3     Original-Audio, aus der FLA extrahiert
│   └── SlowLoop.mp3     Original-Audio, aus der FLA extrahiert
└── README.md            diese Datei
```
