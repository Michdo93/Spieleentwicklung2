/**
 * Übungs-Register für das Animate/AS3 → HTML5 Game Dev Lab (Kurs-Edition).
 *
 * Jeder Eintrag entspricht einer "Übung" aus dem Original-Kursmaterial
 * (Adobe Animate / ActionScript 3, Vorlesungsbegleitung "Spiele2D").
 * Die Übungen bauen bewusst aufeinander auf: Animation-Grundlagen →
 * Event-Handling → Eingabe → Kollision → OOP → komponentenbasiertes
 * Spiel → Sound/UI/Server. Dieselbe Charakterfigur (aus Übung 2) wird
 * ab Übung 3 immer wieder erweitert und wiederverwendet.
 *
 * status: "live"    -> bereits als HTML5/JS-Portierung im Repo vorhanden
 *         "planned" -> noch nicht portiert (Karte im Index ist deaktiviert)
 */

const CHAPTERS = [
  { num: 1, slug: "uebung-01-animation-grundlagen", title: "Animation-Grundlagen", original: "Übung 1",
    desc: "Frame-by-Frame-Animation, klassisches Tweening, und das doAction()-Zustandsmuster für gesteuerte Animationen.",
    status: "live" },
  { num: 2, slug: "uebung-02-charakter-rig", title: "Charakter-Rig bauen", original: "Übung 2",
    desc: "Eine Figur aus Einzelteilen (Kopf, Rumpf, Arme, Beine) mit Idle/Walk/Jump-Zyklen — die Basis für den Rest des Kurses.",
    status: "live" },
  { num: 3, slug: "uebung-03-event-listener", title: "Event-Listener & Zustände", original: "Übung 3",
    desc: "ENTER_FRAME-Transformationen (Position/Rotation/Skalierung) und zufällig ausgelöste Aktionen.",
    status: "live" },
  { num: 4, slug: "uebung-04-eingabe-steuerung", title: "Eingabe & Charakter-Steuerung I", original: "Übung 4",
    desc: "Maus- und Tastatur-Events, mehrere unabhängige Charaktere mit eigenem Verhalten.",
    status: "live" },
  { num: 5, slug: "uebung-05-kollision-auswahl", title: "Kollision & Charakter-Auswahl", original: "Übung 5",
    desc: "hitTestObject-Kollision, Charakter per Klick auswählen und mit der Tastatur steuern.",
    status: "live" },
  { num: 6, slug: "uebung-06-schwerkraft-level", title: "Schwerkraft & Level-Kollision", original: "Übung 6",
    desc: "Prallphysik, Grid-Interaktion, und Level-Bausteine (Collider/LevelBox) für echte Bodenkollision.",
    status: "live" },
  { num: 7, slug: "uebung-07-oop-grundlagen", title: "OOP-Grundlagen", original: "Übung 7",
    desc: "Klassen, Konstruktoren, Vererbung und Pakete — die Basis für saubere Spielearchitektur.",
    status: "live" },
  { num: 8, slug: "uebung-08-plattformer-projekt", title: "Plattformer-Projekt", original: "Übung 8",
    desc: "Das Kursprojekt: komponentenbasierter Mini-Plattformer mit Münzen, Schwerkraft, Kollision und mehreren Charakteren.",
    status: "live" },
  { num: 9, slug: "uebung-09-sound-ui-server", title: "Sound, UI & Server", original: "Übung 9",
    desc: "Soundeffekte und Loops, native UI-Komponenten (Slider, Checkbox, ...), Kommunikation mit einem Server.",
    status: "live" },
  { num: 10, slug: "movement-richtungssprites", title: "Richtungs-Sprites", original: "Movement",
    desc: "Ein Charakter mit vier Blickrichtungen, gesteuert per WASD/Pfeiltasten.",
    status: "planned" },
];

if (typeof module !== "undefined") module.exports = { CHAPTERS };
