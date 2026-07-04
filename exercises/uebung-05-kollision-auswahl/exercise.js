/**
 * Übung 5 · Kollision & Charakter-Auswahl
 * Portierung von Übung 5 (vl6.fla, uebung5_neu.fla)
 *
 * Demo 1: die Maus steuert einen Kreis, der mit einem zweiten kollidiert
 * (hitTestObject). Demo 2 ist der große Schritt in diesem Kurs: statt dass
 * alle Charaktere gleichzeitig zufällig agieren (Übung 3/4), kann jetzt
 * genau EINER pro Klick ausgewählt und mit der Tastatur gesteuert werden —
 * über dasselbe custom-Event-Registrierungsmuster wie im Original
 * (dispatchEvent("registerCharacter"/"characterClicked"), hier über einen
 * gemeinsamen EventTarget-"Bus" nachgebaut).
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");

function clearStage() { ctx.fillStyle = "#05070a"; ctx.fillRect(0, 0, W, H); }

/* ================================================================== */
/*  Demo 1: vl6.fla — hitTestObject-Kollision                          */
/* ================================================================== */
const demoHitTest = {
  run() {
    hint.textContent = "Maus über die Bühne bewegen — hitTestObject() prüft die Überlappung.";
    const circle2 = { x: W / 2 + 60, y: H / 2, r: 40 };
    let mx = W / 2 - 60, my = H / 2;
    const move = (e) => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    canvas.addEventListener("mousemove", move);

    let raf;
    const frame = () => {
      clearStage();
      // entspricht circle1_mc.hitTestObject(circle2_mc) — Kreis-Kreis-Kollision
      const dist = Math.hypot(mx - circle2.x, my - circle2.y);
      const hit = dist < 40 + 30;

      ctx.fillStyle = hit ? "rgba(95,224,201,0.5)" : "rgba(255,107,107,0.35)";
      ctx.beginPath(); ctx.arc(circle2.x, circle2.y, 40, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#8fa0b3"; ctx.lineWidth = 2; ctx.stroke();

      ctx.fillStyle = hit ? "#5fe0c9" : "#ffb84d";
      ctx.beginPath(); ctx.arc(mx, my, 30, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = "#5b6b7d";
      ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`hit = ${hit}`, 14, 24);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { canvas.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  },
};

/* ================================================================== */
/*  Demo 2: uebung5_neu.fla — Charakter-Auswahl per Klick + Steuerung  */
/* ================================================================== */
class CharacterRig {
  constructor() { this.pose = { hipY: 0, shoulderL: 15, shoulderR: -15, forearmL: 10, forearmR: -10, legL: 8, legR: -8, headTilt: 0 }; }
  poseIdle(t) { const s = Math.sin(t * 2); Object.assign(this.pose, { hipY: s * 2, shoulderL: 12 + s * 3, shoulderR: -12 - s * 3, forearmL: 8, forearmR: -8, legL: 4, legR: -4, headTilt: s * 2 }); }
  poseWalk(t) { const s = Math.sin(t * 8); Object.assign(this.pose, { hipY: Math.abs(Math.cos(t * 8)) * 3, shoulderL: s * 35, shoulderR: -s * 35, forearmL: 15 + s * 15, forearmR: -15 - s * 15, legL: -s * 35, legR: s * 35, headTilt: s * 3 }); }
  poseJump(t, duration) { const arc = Math.sin(Math.min(t / duration, 1) * Math.PI); Object.assign(this.pose, { hipY: -arc * 30, shoulderL: 150 - arc * 40, shoulderR: -150 + arc * 40, forearmL: 10, forearmR: -10, legL: 45 * arc, legR: -45 * arc, headTilt: 0 }); }
  draw(ctx, x, y, scaleX, selected) {
    const p = this.pose;
    ctx.save();
    ctx.translate(x, y + p.hipY);
    if (selected) {
      ctx.save();
      ctx.strokeStyle = "#ffb84d"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.ellipse(0, -20, 24, 44, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    ctx.scale(scaleX, 1);
    ctx.strokeStyle = selected ? "#ffb84d" : "#5fe0c9";
    ctx.fillStyle = selected ? "#ffb84d" : "#5fe0c9";
    ctx.lineWidth = 5; ctx.lineCap = "round";
    this.limb(ctx, p.legL, 32); this.limb(ctx, p.legR, 32);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -42); ctx.stroke();
    this.arm(ctx, p.shoulderL, p.forearmL); this.arm(ctx, p.shoulderR, p.forearmR);
    ctx.save(); ctx.translate(0, -42); ctx.rotate((p.headTilt * Math.PI) / 180);
    ctx.beginPath(); ctx.arc(0, -10, 10, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.restore();
  }
  limb(ctx, angleDeg, length) { ctx.save(); ctx.rotate((angleDeg * Math.PI) / 180); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, length); ctx.stroke(); ctx.restore(); }
  arm(ctx, shoulderAngle, forearmAngle) {
    ctx.save(); ctx.translate(0, -40); ctx.rotate((shoulderAngle * Math.PI) / 180);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 20); ctx.stroke();
    ctx.translate(0, 20); ctx.rotate((forearmAngle * Math.PI) / 180);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 18); ctx.stroke();
    ctx.restore();
  }
}

// entspricht CharakterControl.xml aus uebung5_neu.fla — jetzt mit
// characterSelected-Flag, das entscheidet, ob Tastatur oder Zufall gilt
class SelectableCharacter {
  constructor(bus, x, id) {
    this.bus = bus;
    this.x = x;
    this.id = id;
    this.name = "character" + id;
    this.orientation = "right";
    this.width = 60;
    this.speed = this.width * 0.05 * 60;
    this.borderLeft = this.width / 2;
    this.borderRight = W - this.width / 2;
    this.rig = new CharacterRig();
    this.currentAnimation = "idle";
    this.t = 0;
    this.selected = false;

    // entspricht init(): dispatchEvent(new Event("registerCharacter", true))
    this.bus.dispatchEvent(new CustomEvent("registerCharacter", { detail: this }));
  }

  // entspricht clicked() -> dispatchEvent("characterClicked")
  handleClick() {
    this.bus.dispatchEvent(new CustomEvent("characterClicked", { detail: this }));
  }

  hitTest(mx, my, y) {
    return mx > this.x - this.width / 2 && mx < this.x + this.width / 2 && my > y - 90 && my < y;
  }

  update(dt, keys) {
    this.t += dt;

    if (this.selected) {
      // per Tastatur gesteuert
      if (keys.left || keys.right) {
        this.orientation = keys.left ? "left" : "right";
        this.x += (this.orientation === "right" ? 1 : -1) * this.speed * dt;
        this.currentAnimation = this.currentAnimation === "jump" ? this.currentAnimation : "walk";
      } else if (this.currentAnimation !== "jump") {
        this.currentAnimation = "idle";
      }
      if (keys.jump && this.currentAnimation !== "jump") {
        this.currentAnimation = "jump"; this.t = 0; this.jumpDuration = 0.7;
      }
      if (this.currentAnimation === "jump" && this.t >= this.jumpDuration) {
        this.currentAnimation = keys.left || keys.right ? "walk" : "idle";
        this.t = 0;
      }
    } else {
      // nicht ausgewählt: bleibt einfach im Idle stehen (wartet auf Klick)
      this.currentAnimation = "idle";
    }

    this.x = Math.max(this.borderLeft, Math.min(this.borderRight, this.x));

    if (this.currentAnimation === "walk") this.rig.poseWalk(this.t);
    else if (this.currentAnimation === "jump") this.rig.poseJump(this.t, this.jumpDuration || 0.7);
    else this.rig.poseIdle(this.t);
  }

  draw(ctx, y) {
    this.rig.draw(ctx, this.x, y, this.orientation === "right" ? 1 : -1, this.selected);
  }
}

const demoSelection = {
  run() {
    hint.textContent = "Charakter anklicken, um ihn auszuwählen — nur der ausgewählte reagiert auf ←/→/Space.";
    const bus = new EventTarget();
    const characters = [];
    const keys = { left: false, right: false, jump: false };
    let activeCharacter = null;

    // entspricht dem "Main"-Root, der auf registerCharacter/characterClicked lauscht
    bus.addEventListener("registerCharacter", (e) => {
      characters.push(e.detail);
      if (characters.length === 1) { activeCharacter = e.detail; e.detail.selected = true; }
    });
    bus.addEventListener("characterClicked", (e) => {
      if (activeCharacter) activeCharacter.selected = false;
      activeCharacter = e.detail;
      activeCharacter.selected = true;
    });

    [0, 1, 2].forEach(i => new SelectableCharacter(bus, 120 + i * 140, i));
    // (Charaktere registrieren sich selbst im Konstruktor über den bus
    // und werden dort in "characters" eingetragen)

    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") { keys.left = true; e.preventDefault(); }
      else if (e.key === "ArrowRight" || e.key === "d") { keys.right = true; e.preventDefault(); }
      else if (e.key === " ") { keys.jump = true; e.preventDefault(); }
    };
    const onKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
      else if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
      else if (e.key === " ") keys.jump = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const groundY = H - 30;
    const onClick = (e) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      for (const c of characters) if (c.hitTest(mx, my, groundY)) { c.handleClick(); break; }
    };
    canvas.addEventListener("click", onClick);

    let lastTime = 0, raf;
    const frame = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05) || 0.016;
      lastTime = now;
      clearStage();
      characters.forEach(c => { c.update(dt, keys); c.draw(ctx, groundY); });
      ctx.fillStyle = "#5b6b7d";
      ctx.font = "12px 'JetBrains Mono'";
      ctx.fillText(`ausgewählt: ${activeCharacter ? activeCharacter.name : "keiner"}`, 14, 20);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  },
};

const DEMOS = { hittest: demoHitTest, selection: demoSelection };
let cleanup = null;
function load(key) {
  if (cleanup) cleanup();
  cleanup = DEMOS[key].run() || null;
}
buttons.forEach(b => b.addEventListener("click", () => {
  buttons.forEach(x => x.classList.remove("btn-active"));
  b.classList.add("btn-active");
  load(b.dataset.demo);
}));
load("hittest");
