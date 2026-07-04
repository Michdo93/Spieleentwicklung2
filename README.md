# Animate/AS3 → HTML5 Game Dev Lab

Dieses Repo portiert ein komplettes **Adobe Animate / ActionScript-3-Kursmaterial**
Übung für Übung nach **HTML5 Canvas + Vanilla JavaScript** — lauffähig direkt
im Browser, ganz ohne Flash Player, ohne Build-Schritt, gehostet über
GitHub Pages.

**Ziel:** derselbe Lernpfad wie im Original-Kurs — von der ersten
Frame-Animation bis zum fertigen, komponentenbasierten Mini-Plattformer —
nur eben mit Web-Technik statt Animate/Flash.

▶ **[Alle Übungen ansehen](./index.html)**

## Wie das Repo aufgebaut ist

```
/
├── index.html                     Übersichtsseite, verlinkt alle Übungen
├── assets/
│   ├── css/site.css                gemeinsames Stylesheet für die ganze Seite
│   └── js/exercises-data.js        Übungs-Register (Titel, Status, Beschreibung)
└── exercises/
    ├── uebung-01-animation-grundlagen/
    │   ├── index.html               Lernseite: Erklärung + eingebettete Demo
    │   ├── exercise.css              übungsspezifisches Styling
    │   ├── exercise.js               die eigentliche Portierung
    │   └── README.md                 dieselbe Erklärung als Markdown (für GitHub)
    └── ... (gleiche Struktur pro Übung)
```

Jede Übung ist **eigenständig lauffähig** und bringt zwei parallele
Erklärungs-Ebenen mit: `README.md` für GitHub, `index.html` für die
GitHub-Pages-Lernseite mit eingebetteter Demo und Animate/AS3-vs-JS-Codevergleich.

## Der Lernpfad

| # | Übung | Worum es geht |
|---|-------|-----------------|
| 01 | Animation-Grundlagen | Frame-by-Frame, Tweening, das `doAction()`-Zustandsmuster |
| 02 | Charakter-Rig bauen | Eine Figur aus Einzelteilen mit Idle/Walk/Jump-Zyklen |
| 03 | Event-Listener & Zustände | ENTER_FRAME-Transformationen, zufällige Aktionen |
| 04 | Eingabe & Charakter-Steuerung I | Maus/Tastatur, mehrere unabhängige Charaktere |
| 05 | Kollision & Charakter-Auswahl | hitTestObject, Charakter per Klick auswählen |
| 06 | Schwerkraft & Level-Kollision | Prallphysik, Collider/LevelBox-Bausteine |
| 07 | OOP-Grundlagen | Klassen, Vererbung, Pakete |
| 08 | Plattformer-Projekt | Das Kursprojekt: Münzen, Schwerkraft, mehrere Charaktere |
| 09 | Sound, UI & Server | Soundeffekte, native UI-Komponenten, Server-Kommunikation |
| 10 | Richtungs-Sprites (Movement) | Ein Charakter mit vier Blickrichtungen |

Der aktuelle Stand steht auch live oben auf der [Übersichtsseite](./index.html).

## Portierungsprinzipien

- **Kein Build-Schritt.** Reines HTML/CSS/JS.
- **Derselbe Charakter zieht sich durch den Kurs.** Genau wie im Original
  wird die in Übung 2 gebaute Spielfigur ab Übung 3 immer weiter erweitert
  (Steuerung, Kollision, Level-Interaktion) statt jedes Mal neu erfunden.
- **Wiederkehrende Muster bleiben erkennbar.** `doAction(label)` für
  Animationszustände, benutzerdefinierte Events fürs Registrieren von
  Charakteren/Collidern — dieselben Muster wie im AS3-Original, nur als
  JavaScript-Klassen bzw. `CustomEvent`.
- **Assets wo möglich übernommen.** Eingebettete Sounds (z. B. der
  Footstep-Effekt) wurden aus den Original-FLA-Dateien extrahiert und nach
  MP3 konvertiert.

## Lokal ansehen

```bash
python3 -m http.server 8000
# dann: http://localhost:8000
```

## Quelle

Original-Kursmaterial: Adobe Animate / ActionScript 3 (Übungen 1–9 +
Bonus-Projekt "Movement"). Diese Portierung ersetzt Animate/Flash
vollständig durch HTML5 Canvas + Vanilla JS.
