/**
 * Übung 7 · OOP-Grundlagen
 * Portierung von Übung 7 (Main.as, Test.as, Circle.as)
 *
 * Das Original zeigt die Grundidee objektorientierter Programmierung ganz
 * ohne Spiellogik: eine Basisklasse mit eigenem Verhalten (Test bewegt sich
 * selbst per ENTER_FRAME), eine Unterklasse, die dieses Verhalten erbt
 * (Circle extends Test), und ein Wurzelobjekt (Main), das beides erzeugt.
 * ES6-Klassen bilden dasselbe Konzept praktisch wortgleich ab.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const log = document.getElementById("action-log");
const restartBtn = document.getElementById("restart-btn");

function trace(msg) { log.textContent += msg + "\n"; log.scrollTop = log.scrollHeight; }
function clearStage() { ctx.fillStyle = "#05070a"; ctx.fillRect(0, 0, W, H); }

/* ---------------------------------------------------------------- */
/* Test — entspricht Test.as: eine Basisklasse mit eigenem Verhalten */
/* ---------------------------------------------------------------- */
class Test {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    trace("I am test");
  }

  // entspricht update(_event: Event) — jede Instanz bewegt sich selbst
  update(dt) {
    this.x += 90 * dt;
    if (this.x > W) this.x = 0;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - 15, this.y - 15, 30, 30);
  }
}

/* ---------------------------------------------------------------- */
/* Circle — entspricht Circle.as: public class Circle extends Test   */
/* Erbt update() unverändert, überschreibt nur die Darstellung        */
/* ---------------------------------------------------------------- */
class Circle extends Test {
  constructor(x, y, color) {
    super(x, y, color); // entspricht implizitem super()-Aufruf in AS3
    trace("I am circle");
  }

  // Methode überschrieben (Override) — Bewegung bleibt geerbt
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 16, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ---------------------------------------------------------------- */
/* Main — entspricht Main.as: das Wurzelobjekt, das Instanzen erzeugt */
/* ---------------------------------------------------------------- */
class Main {
  constructor() {
    trace("I am root");
    this.objects = [];
    this.objects.push(new Test(40, 60, "#ffb84d"));
    this.objects.push(new Circle(40, 120, "#5fe0c9"));
  }

  update(dt) { this.objects.forEach(o => o.update(dt)); }
  draw(ctx) { this.objects.forEach(o => o.draw(ctx)); }
}

/* ---------------------------------------------------------------- */
let main;
let lastTime = 0, raf;

function start() {
  log.textContent = "";
  cancelAnimationFrame(raf);
  main = new Main();
  lastTime = 0;
  raf = requestAnimationFrame(loop);
}

function loop(now) {
  const dt = lastTime === 0 ? 0.016 : Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  clearStage();
  main.update(dt);
  main.draw(ctx);
  ctx.fillStyle = "#5b6b7d";
  ctx.font = "12px 'JetBrains Mono'";
  ctx.fillText("Test (Quadrat) und Circle (Kreis, erbt von Test)", 14, H - 14);
  raf = requestAnimationFrame(loop);
}

restartBtn.addEventListener("click", start);
start();
