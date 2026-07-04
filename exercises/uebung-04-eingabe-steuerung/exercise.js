/**
 * Übung 4 · Eingabe & Charakter-Steuerung I
 * Portierung von Übung 4 (vl05.fla, uebung4.fla)
 *
 * Demo 1 ist die Grundlage jeder Eingabeverarbeitung: Mausklick erkennen,
 * Tastatur-Events auf Richtungen abbilden. Demo 2 baut auf Übung 2/3 auf —
 * fünf unabhängige Charaktere laufen jetzt tatsächlich über die Bühne
 * (nicht nur ihre Animation ändert sich) und prallen an den Bildschirm-
 * rändern ab. Neu ist außerdem: Die Animation selbst meldet ihr Ende an
 * den Controller zurück, der dann die nächste Zufallsaktion auswählt —
 * statt eines festen Zeit-Intervalls wie noch in Übung 3.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");
const log = document.getElementById("action-log");
const logWrap = document.getElementById("action-log-wrap");

function clearStage() { ctx.fillStyle = "#05070a"; ctx.fillRect(0, 0, W, H); }
function trace(msg) { log.textContent = msg + "\n" + log.textContent; }

/* ================================================================== */
/*  Demo 1: vl05.fla — Maus- und Tastatur-Grundlagen                   */
/* ================================================================== */
const demoInput = {
  run() {
    hint.textContent = "Auf das Rechteck klicken, oder Pfeiltasten/WASD drücken.";
    clearStage();
    const rect = { x: W / 2 - 40, y: H / 2 - 30, w: 80, h: 60 };
    ctx.fillStyle = "#5fe0c9";
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

    const onClick = (e) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      if (mx >= rect.x && mx <= rect.x + rect.w && my >= rect.y && my <= rect.y + rect.h) {
        trace("rect_mc.CLICK ausgelöst");
      }
    };
    const onKey = (e) => {
      const map = { ArrowUp: "^", w: "^", ArrowLeft: "<", a: "<", ArrowDown: "`´", s: "`´", ArrowRight: ">", d: ">" };
      if (map[e.key]) trace(`Taste: ${map[e.key]}`);
    };
    canvas.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => { canvas.removeEventListener("click", onClick); window.removeEventListener("keydown", onKey); };
  },
};

/* ================================================================== */
/*  Demo 2: uebung4.fla — mehrere Charaktere, die sich selbst bewegen  */
/*  und deren Animation ihr eigenes Ende an den Controller meldet       */
/* ================================================================== */
class CharacterRig {
  constructor() { this.pose = { hipY: 0, shoulderL: 15, shoulderR: -15, forearmL: 10, forearmR: -10, legL: 8, legR: -8, headTilt: 0 }; }
  poseIdle(t) { const s = Math.sin(t * 2); Object.assign(this.pose, { hipY: s * 2, shoulderL: 12 + s * 3, shoulderR: -12 - s * 3, forearmL: 8, forearmR: -8, legL: 4, legR: -4, headTilt: s * 2 }); }
  poseWalk(t) { const s = Math.sin(t * 8); Object.assign(this.pose, { hipY: Math.abs(Math.cos(t * 8)) * 3, shoulderL: s * 35, shoulderR: -s * 35, forearmL: 15 + s * 15, forearmR: -15 - s * 15, legL: -s * 35, legR: s * 35, headTilt: s * 3 }); }
  poseJump(t, duration) { const arc = Math.sin(Math.min(t / duration, 1) * Math.PI); Object.assign(this.pose, { hipY: -arc * 30, shoulderL: 150 - arc * 40, shoulderR: -150 + arc * 40, forearmL: 10, forearmR: -10, legL: 45 * arc, legR: -45 * arc, headTilt: 0 }); }
  draw(ctx, x, y, scaleX) {
    const p = this.pose;
    ctx.save();
    ctx.translate(x, y + p.hipY);
    ctx.scale(scaleX, 1);
    ctx.strokeStyle = "#5fe0c9"; ctx.fillStyle = "#5fe0c9"; ctx.lineWidth = 4; ctx.lineCap = "round";
    this.limb(ctx, p.legL, 28); this.limb(ctx, p.legR, 28);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -36); ctx.stroke();
    this.arm(ctx, p.shoulderL, p.forearmL); this.arm(ctx, p.shoulderR, p.forearmR);
    ctx.save(); ctx.translate(0, -36); ctx.rotate((p.headTilt * Math.PI) / 180);
    ctx.beginPath(); ctx.arc(0, -9, 8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.restore();
  }
  limb(ctx, angleDeg, length) { ctx.save(); ctx.rotate((angleDeg * Math.PI) / 180); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, length); ctx.stroke(); ctx.restore(); }
  arm(ctx, shoulderAngle, forearmAngle) {
    ctx.save(); ctx.translate(0, -34); ctx.rotate((shoulderAngle * Math.PI) / 180);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 17); ctx.stroke();
    ctx.translate(0, 17); ctx.rotate((forearmAngle * Math.PI) / 180);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 16); ctx.stroke();
    ctx.restore();
  }
}

// entspricht CharakterControl.xml — init(), moveHorizontal(), doNewAction()
class CharacterController {
  constructor(x, name) {
    this.x = x;
    this.name = name;
    this.orientation = "right";
    this.width = 60;
    this.speed = this.width * 0.05 * 60; // Original: this.width*0.05 (px/Frame) -> px/s
    this.borderLeft = this.width / 2;
    this.borderRight = W - this.width / 2;
    this.rig = new CharacterRig();
    this.currentAnimation = null;
    this.t = 0;
    this.doNewAction();
  }

  // entspricht doNewAction() — dieselben Zufallsschwellen wie Übung 3
  doNewAction() {
    const random = Math.random();
    let action, duration;
    if (random <= 0.7) { action = "walk"; duration = 0.9 + Math.random() * 0.6; }
    else if (random <= 0.9) { action = "idle"; duration = 1.0 + Math.random() * 0.8; }
    else { action = "jump"; duration = 0.7; }
    this.currentAnimation = action;
    this.duration = duration;
    this.t = 0;
  }

  update(dt) {
    this.t += dt;

    // entspricht moveHorizontal() — Bewegung + Randerkennung
    const nextPosition = this.x + (this.orientation === "right" ? this.speed : -this.speed) * dt;
    if (nextPosition > this.borderRight || nextPosition < this.borderLeft) {
      this.orientation = this.orientation === "right" ? "left" : "right";
    }

    // entspricht update() — Bewegung hängt vom currentAnimation-Zustand ab
    if (this.currentAnimation === "walk") {
      this.x += (this.orientation === "right" ? 1 : -1) * this.speed * dt;
      this.rig.poseWalk(this.t);
    } else if (this.currentAnimation === "jump") {
      this.x += (this.orientation === "right" ? 0.5 : -0.5) * this.speed * dt;
      this.rig.poseJump(this.t, this.duration);
    } else {
      this.rig.poseIdle(this.t);
    }

    // die Animation "meldet" ihr Ende selbst — entspricht z.B.
    // "MovieClip(this.parent).doNewAction();" am Ende der Walk/Idle/Jump-Zeitleiste
    if (this.t >= this.duration) this.doNewAction();
  }

  draw(ctx) {
    this.rig.draw(ctx, this.x, H - 30, this.orientation === "right" ? 1 : -1);
  }
}

const demoCharacters = {
  run() {
    hint.textContent = "5 unabhängige Charaktere — jede Animation meldet selbst ihr Ende und löst die nächste Zufallsaktion aus.";
    const characters = [0, 1, 2, 3, 4].map(i => new CharacterController(80 + i * 90, "character" + i));

    let lastTime = 0, raf;
    const frame = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05) || 0.016;
      lastTime = now;
      clearStage();
      characters.forEach(c => { c.update(dt); c.draw(ctx); });
      ctx.fillStyle = "#5b6b7d";
      ctx.font = "12px 'JetBrains Mono'";
      characters.forEach((c, i) => ctx.fillText(`${c.name}: ${c.currentAnimation}`, 14, 20 + i * 16));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  },
};

const DEMOS = { input: demoInput, characters: demoCharacters };
let cleanup = null;
function load(key) {
  if (cleanup) cleanup();
  logWrap.style.display = key === "input" ? "block" : "none";
  log.textContent = "";
  cleanup = DEMOS[key].run() || null;
}
buttons.forEach(b => b.addEventListener("click", () => {
  buttons.forEach(x => x.classList.remove("btn-active"));
  b.classList.add("btn-active");
  load(b.dataset.demo);
}));
load("input");
