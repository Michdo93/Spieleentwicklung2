# Übung 8 · Plattformer-Projekt

> Original: `Main.as`, `CharacterController.as`, `CharacterAnimationController.as`, `CoinController.as`, `Collider.as`, `LevelBox.as`, `LevelStage.as`
> Live-Demo: [`exercises/uebung-08-plattformer-projekt/`](./index.html) auf GitHub Pages

## Worum es geht

Das Kursprojekt: alles aus Übung 1–7 kommt hier zusammen — drei per Klick
auswählbare Charaktere mit echter Schwerkraft und Plattform-Kollision, plus
neu: zehn fallende Münzen, die eingesammelt werden können, und eine
Punkteanzeige.

## Die Klassenaufteilung (1:1 aus dem Original übernommen)

| Klasse | Aufgabe |
|--------|---------|
| `Game` (entspricht `Main`) | Spielleitung: erzeugt Charaktere/Münzen/Level, hält Punktestand und Tastatur-Zustand |
| `CharacterController` | Position, Bewegung, Schwerkraft, Level-/Münz-Kollision |
| `CharacterAnimationController` | reine Zustandsmaschine (Idle/Walk/Jump), kennt keine Physik |
| `CoinController` | fällt mit Schwerkraft, landet auf Plattformen, kann eingesammelt werden |
| `LevelPlatform` (entspricht `Collider`/`LevelBox`) | meldet sich beim Spiel als Plattform an |

## Was ich übersetzt habe

| Animate/AS3                                            | HTML5 / JavaScript                                    |
|------------------------------------------------------------------|---------------------------------------------------------------|
| `checkCoins()` — `hitTestObject()` gegen jede Münze                  | `Math.hypot()`-Abstandstest, `collected`-Flag statt `removeChild()` |
| `Main(parent).countedCoins++` + `TextField`-Update                   | `game.addScore(1)` + direktes Setzen von `scoreEl.textContent`   |
| Getrennte Klassen für Bewegung/Physik vs. Animation                    | identische Trennung: `CharacterController` vs. `CharacterAnimationController` |
| `registerCoin`/`registerCharacter`/`registerLevelElement`-Events        | identisches Muster auf einem gemeinsamen `EventTarget` (`game.bus`) |

## Der Vorteil der Event-Architektur wird hier sichtbar

Charaktere, Münzen und Plattformen kennen sich nicht direkt — alle melden
sich beim gemeinsamen `game.bus` an. Das zahlte sich beim Hinzufügen der
Münzen aus: Kein bestehender Code musste geändert werden, nur eine neue
`CoinController`-Klasse und ein neuer Event-Name (`registerCoin`). Dasselbe
Muster, das in Übung 5 für Charaktere eingeführt wurde, trägt jetzt auch
Münzen und Level-Elemente.

## Was man hier lernt

- Wie sich eine größere Anwendung in klar abgegrenzte Klassen mit jeweils
  einer Verantwortung aufteilen lässt (Single-Responsibility-Prinzip in
  der Praxis)
- Dass ein gutes Entkopplungsmuster (Event-Registrierung statt direkter
  Referenzen) sich auszahlt, sobald neue Objekttypen dazukommen
- Wie viele kleine Bausteine aus den vorigen acht Übungen (Rig, Zustände,
  Steuerung, Kollision, Schwerkraft, OOP) sich zu einem vollständigen,
  spielbaren Prototyp zusammenfügen

## Dateien

```
uebung-08-plattformer-projekt/
├── index.html      Lernseite (Erklärung + spielbarer Prototyp)
├── exercise.css      Overlay-/HUD-Styles
├── exercise.js         Game/CharacterController/CoinController/LevelPlatform-Klassen
└── README.md            diese Datei
```

## Steuerung

Charakter anklicken zum Auswählen, `←`/`→` laufen, `Leertaste` springt.
