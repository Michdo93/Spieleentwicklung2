/**
 * Übung 6 · Schwerkraft & Level-Kollision
 * Portierung von Übung 6 (vl7.fla, vl7_2.fla, uebung6.fla)
 *
 * Drei Demos: (1) ein Objekt, das mit Schwerkraft fällt und auf einem
 * Level abprallt; (2) ein 10×10-Raster anklickbarer Rechtecke; (3) die
 * Charakter-Auswahl aus Übung 5, jetzt mit echter Schwerkraft und
 * Boden-/Plattform-Kollision — über dieselbe Collider/LevelBox-
 * Registrierungskette wie im Original (RegisterCollider →
 * RegisterLevelElement).
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");

function clearStage() { ctx.fillStyle = "#05070a"; ctx.fillRect(0, 0, W, H); }

/* ================================================================== */
/*  Demo 1: vl7.fla — Schwerkraft + Abprallen                          */
/* ================================================================== */
const demoBounce = {
  run() {
    hint.textContent = "deltaY += 1 pro Frame (Schwerkraft), bei Bodenkontakt springt es zurück auf deltaY = -10.";
    const level = [{ x: 0, y: H - 30, w: W, h: 30 }, { x: 150, y: H - 140, w: 140, h: 16 }];
    let rect = { x: 60, y: 40, w: 26, h: 26, deltaY: 0 };

    const frame = () => {
      // entspricht update() in vl7.fla — 1:1, nur zeitbasiert skaliert
      rect.deltaY += 1 * (60 / 60); // Original: += 1 pro Frame bei ~60fps
      rect.y += rect.deltaY;

      level.forEach(l => {
        const hit = rect.x < l.x + l.w && rect.x + rect.w > l.x && rect.y < l.y + l.h && rect.y + rect.h > l.y;
        if (hit && rect.deltaY > 0) { rect.deltaY = -10; rect.y = l.y - rect.h; }
      });
      if (rect.x > W) rect.x = 0;

      clearStage();
      ctx.fillStyle = "#263041";
      level.forEach(l => ctx.fillRect(l.x, l.y, l.w, l.h));
      ctx.fillStyle = "#ffb84d";
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.fillStyle = "#5b6b7d";
      ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`deltaY = ${rect.deltaY.toFixed(1)}`, 14, 24);

      raf = requestAnimationFrame(frame);
    };
    let raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  },
};

/* ================================================================== */
/*  Demo 2: vl7_2.fla — 10×10-Raster, Klick entfernt ein Feld            */
/* ================================================================== */
const demoGrid = {
  run() {
    hint.textContent = "Auf ein Feld klicken, um es zu entfernen — genau wie this.removeChild(_event.target) im Original.";
    const cells = [];
    for (let x = 0; x < 10; x++) for (let y = 0; y < 10; y++) cells.push({ x: x * 32 + 60, y: y * 24 + 10, w: 28, h: 20, alive: true });

    function render() {
      clearStage();
      cells.forEach(c => {
        if (!c.alive) return;
        ctx.fillStyle = "#5fe0c9";
        ctx.fillRect(c.x, c.y, c.w, c.h);
        ctx.strokeStyle = "#05070a"; ctx.lineWidth = 1; ctx.strokeRect(c.x, c.y, c.w, c.h);
      });
    }
    const onClick = (e) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      const hitCell = cells.find(c => c.alive && mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h);
      if (hitCell) { hitCell.alive = false; render(); }
    };
    canvas.addEventListener("click", onClick);
    render();
    return () => canvas.removeEventListener("click", onClick);
  },
};

/* ================================================================== */
/*  Demo 3: uebung6.fla — Charaktere mit echter Level-Kollision         */
/* ================================================================== */
class CharacterRig {
  constructor() { this.pose = { hipY: 0, shoulderL: 15, shoulderR: -15, forearmL: 10, forearmR: -10, legL: 8, legR: -8, headTilt: 0 }; }
  poseIdle(t) { const s = Math.sin(t * 2); Object.assign(this.pose, { hipY: s * 2, shoulderL: 12 + s * 3, shoulderR: -12 - s * 3, forearmL: 8, forearmR: -8, legL: 4, legR: -4, headTilt: s * 2 }); }
  poseWalk(t) { const s = Math.sin(t * 8); Object.assign(this.pose, { hipY: Math.abs(Math.cos(t * 8)) * 3, shoulderL: s * 35, shoulderR: -s * 35, forearmL: 15 + s * 15, forearmR: -15 - s * 15, legL: -s * 35, legR: s * 35, headTilt: s * 3 }); }
  poseJump() { Object.assign(this.pose, { hipY: 0, shoulderL: 150, shoulderR: -150, forearmL: 10, forearmR: -10, legL: 30, legR: -30, headTilt: 0 }); }
  draw(ctx, x, y, scaleX, selected) {
    const p = this.pose;
    ctx.save(); ctx.translate(x, y + p.hipY);
    if (selected) { ctx.save(); ctx.strokeStyle = "#ffb84d"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.ellipse(0, -20, 22, 40, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    ctx.scale(scaleX, 1);
    ctx.strokeStyle = selected ? "#ffb84d" : "#5fe0c9"; ctx.fillStyle = selected ? "#ffb84d" : "#5fe0c9";
    ctx.lineWidth = 5; ctx.lineCap = "round";
    this.limb(ctx, p.legL, 26); this.limb(ctx, p.legR, 26);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -38); ctx.stroke();
    this.arm(ctx, p.shoulderL, p.forearmL); this.arm(ctx, p.shoulderR, p.forearmR);
    ctx.save(); ctx.translate(0, -38); ctx.rotate((p.headTilt * Math.PI) / 180);
    ctx.beginPath(); ctx.arc(0, -9, 9, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.restore();
  }
  limb(ctx, angleDeg, length) { ctx.save(); ctx.rotate((angleDeg * Math.PI) / 180); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, length); ctx.stroke(); ctx.restore(); }
  arm(ctx, shoulderAngle, forearmAngle) {
    ctx.save(); ctx.translate(0, -36); ctx.rotate((shoulderAngle * Math.PI) / 180);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 18); ctx.stroke();
    ctx.translate(0, 18); ctx.rotate((forearmAngle * Math.PI) / 180);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 16); ctx.stroke();
    ctx.restore();
  }
}

// entspricht LevelBox/Collider — meldet sich beim Level an
class LevelPlatform {
  constructor(bus, x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    bus.dispatchEvent(new CustomEvent("RegisterLevelElement", { detail: this }));
  }
}

// entspricht CharakterControl.xml aus uebung6.fla — jetzt mit Schwerkraft
// und checkHit() gegen registrierte Level-Elemente
class LevelCharacter {
  constructor(bus, level, x, id) {
    this.bus = bus; this.level = level;
    this.x = x; this.y = 60; this.dy = 0;
    this.id = id; this.name = "character" + id;
    this.orientation = "right";
    this.width = 50;
    this.speed = this.width * 0.06 * 60;
    this.rig = new CharacterRig();
    this.currentAnimation = "idle";
    this.t = 0;
    this.selected = false;
    this.onGround = false;
    bus.dispatchEvent(new CustomEvent("registerCharacter", { detail: this }));
  }

  handleClick() { this.bus.dispatchEvent(new CustomEvent("characterClicked", { detail: this })); }

  hitTest(mx, my) { return mx > this.x - this.width / 2 && mx < this.x + this.width / 2 && my > this.y - 80 && my < this.y; }

  // entspricht checkHit()/hitTestCollider() — testet den "Fußpunkt" gegen
  // alle registrierten Level-Elemente
  footHitsPlatform(footY) {
    for (const p of this.level) {
      if (this.x > p.x && this.x < p.x + p.w && footY >= p.y && footY <= p.y + p.h + 6) return p;
    }
    return null;
  }

  update(dt, keys) {
    this.t += dt;

    if (this.selected) {
      if (keys.left || keys.right) {
        this.orientation = keys.left ? "left" : "right";
        this.x += (this.orientation === "right" ? 1 : -1) * this.speed * dt;
      }
      if (keys.jump && this.onGround) { this.dy = -320; this.onGround = false; }
    }

    // Schwerkraft — entspricht "deltaY += 1" pro Frame in CharakterControl
    this.dy += 700 * dt;
    const nextY = this.y + this.dy * dt;
    const landing = this.footHitsPlatform(nextY);
    if (landing && this.dy >= 0) {
      this.y = landing.y;
      this.dy = 0;
      this.onGround = true;
    } else {
      this.y = nextY;
      this.onGround = false;
    }
    if (this.y > H + 40) { this.x = 60; this.y = 20; this.dy = 0; } // zurück, falls durchgefallen

    if (!this.onGround) this.currentAnimation = "jump";
    else if (this.selected && (keys.left || keys.right)) this.currentAnimation = "walk";
    else this.currentAnimation = "idle";

    if (this.currentAnimation === "walk") this.rig.poseWalk(this.t);
    else if (this.currentAnimation === "jump") this.rig.poseJump();
    else this.rig.poseIdle(this.t);
  }

  draw(ctx) { this.rig.draw(ctx, this.x, this.y, this.orientation === "right" ? 1 : -1, this.selected); }
}

const demoLevel = {
  run() {
    hint.textContent = "Charakter anklicken, mit ←/→/Space über die Plattformen steuern — echte Schwerkraft und Landung.";
    const bus = new EventTarget();
    const level = [];
    new LevelPlatform(bus, 0, H - 20, W, 20);
    new LevelPlatform(bus, 60, H - 100, 120, 14);
    new LevelPlatform(bus, 250, H - 160, 130, 14);
    new LevelPlatform(bus, 420, H - 90, 120, 14);
    bus.addEventListener("RegisterLevelElement", (e) => level.push(e.detail));

    const characters = [];
    let activeCharacter = null;
    bus.addEventListener("registerCharacter", (e) => {
      characters.push(e.detail);
      if (characters.length === 1) { activeCharacter = e.detail; e.detail.selected = true; }
    });
    bus.addEventListener("characterClicked", (e) => {
      if (activeCharacter) activeCharacter.selected = false;
      activeCharacter = e.detail;
      activeCharacter.selected = true;
    });

    new LevelCharacter(bus, level, 90, 0);
    new LevelCharacter(bus, level, 280, 1);

    const keys = { left: false, right: false, jump: false };
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

    const onClick = (e) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      for (const c of characters) if (c.hitTest(mx, my)) { c.handleClick(); break; }
    };
    canvas.addEventListener("click", onClick);

    let lastTime = 0, raf;
    const frame = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.03) || 0.016;
      lastTime = now;
      clearStage();
      ctx.fillStyle = "#263041";
      level.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
      characters.forEach(c => { c.update(dt, keys); c.draw(ctx); });
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

const DEMOS = { bounce: demoBounce, grid: demoGrid, level: demoLevel };
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
load("bounce");
