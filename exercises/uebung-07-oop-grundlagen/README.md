# Übung 7 · OOP-Grundlagen

> Original: `Main.as`, `Test.as`, `Circle.as`
> Live-Demo: [`exercises/uebung-07-oop-grundlagen/`](./index.html) auf GitHub Pages

## Worum es geht

Klassen, Konstruktoren, Vererbung und Pakete — die Grundlage für saubere
Spielearchitektur, hier ganz ohne Spiellogik erklärt: eine Basisklasse mit
eigenem Verhalten, eine Unterklasse, die dieses Verhalten erbt, und ein
Wurzelobjekt, das beide erzeugt.

## Was ich übersetzt habe

| Animate/AS3                                          | HTML5 / JavaScript                              |
|-------------------------------------------------------------|----------------------------------------------------|
| `package { public class Test extends MovieClip { ... } }`     | `class Test { ... }` (ES6-Klasse)                     |
| `public class Circle extends Test { ... }`                     | `class Circle extends Test { ... }`                   |
| impliziter `super()`-Aufruf des Basiskonstruktors                | expliziter `super(...)`-Aufruf (in JS Pflicht)         |
| `this.addEventListener(Event.ENTER_FRAME, this.update)`         | `update(dt)`-Methode, vom zentralen Game-Loop aufgerufen |
| `package packages.main.hello { ... }` + Ordnerstruktur            | ES-Module (`export`/`import`) als moderne Entsprechung |

## Was man hier lernt

- AS3-Klassensyntax und ES6-Klassensyntax sind sich so ähnlich, dass sich
  viele Beispiele fast wortgleich übertragen lassen
- Vererbung bedeutet: gemeinsames Verhalten (hier: Bewegung) einmal
  definieren, in der Unterklasse nur das Abweichende ergänzen (hier: die
  Darstellung)
- Die Konstruktor-Reihenfolge bei Vererbung — der Basisklassen-Konstruktor
  läuft immer zuerst, sichtbar im Ausgabe-Panel als "I am test" vor "I am circle"
- Pakete (AS3) und ES-Module (JavaScript) verfolgen dasselbe Ziel
  (Namensräume, Wiederverwendbarkeit über Dateien hinweg) mit
  unterschiedlicher Syntax

## Dateien

```
uebung-07-oop-grundlagen/
├── index.html      Lernseite (Erklärung + interaktive Demo)
├── exercise.css      Ausgabe-Panel-Styles
├── exercise.js         Test-, Circle- und Main-Klassen
└── README.md            diese Datei
```
