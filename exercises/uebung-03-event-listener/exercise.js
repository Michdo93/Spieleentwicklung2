/**
 * Übung 3 · Event-Listener & Zustände
 * Portierung von Übung 3 (eventListener.fla, uebung3.fla)
 *
 * Zwei Demos: (1) ein Quadrat, das per ENTER_FRAME kontinuierlich bewegt,
 * gedreht und (ab einem bestimmten Winkel) verkleinert wird, mit
 * Bildschirm-Wrapping; (2) die Charakterfigur aus Übung 2 bekommt zum
 * ersten Mal echte Steuerlogik — ein Zufallsgenerator ruft in
 * unregelmäßigen Abständen doAction("walk"/"idle"/"jump") auf, genauso
 * wie im Original.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");

function clearStage() { ctx.fillStyle = "#05070a"; ctx.fillRect(0, 0, W, H); }

/* ================================================================== */
/*  Demo 1: eventListener.fla — kontinuierliche Transformation          */
/* ================================================================== */
const demoTransform = {
  run() {
    hint.textContent = "square_mc.x += 5 · rotation += 30° · ab 180° schrumpft es · wraps am rechten Rand.";
    let x = 40, rotation = 0, scale = 1;

    const frame = () => {
      // entspricht exakt der ENTER_FRAME-Funktion "update()" im Original
      x += 2.2;               // Original: += 5 pro Frame ≈ 130/s bei 26fps
      rotation += 13;         // Original: += 30° pro Frame
      if (rotation >= 180 && rotation < 180 + 13) {
        scale -= scale / 10;
      }
      if (x > W + 30) x = -30;

      clearStage();
      ctx.save();
      ctx.translate(x, H / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.fillStyle = "#ffb84d";
      ctx.fillRect(-25, -25, 50, 50);
      ctx.restore();

      ctx.fillStyle = "#5b6b7d";
      ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`rotation = ${Math.round(rotation % 360)}°   scale = ${scale.toFixed(2)}`, 14, 24);

      raf = requestAnimationFrame(frame);
    };
    let raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  },
};

/* ================================================================== */
/*  Demo 2: uebung3.fla — Zufallssteuerung der Charakterfigur           */
/*  (dieselbe CharacterRig-Klasse wie in Übung 2, hier mit echter        */
/*  Aufrufsteuerung statt Buttons)                                       */
/* ================================================================== */
class CharacterRig {
  constructor() {
    this.state = "idle";
    this.currentAnimation = null; // entspricht currentAnimation im Original
    this.t = 0;
    this.pose = { hipY: 0, shoulderL: 15, shoulderR: -15, forearmL: 10, forearmR: -10, legL: 8, legR: -8, headTilt: 0 };
  }

  // entspricht doAction() aus CharakterAnimation.xml — wechselt nur, wenn
  // sich der Zustand tatsächlich ändert
  doAction(action) {
    if (this.currentAnimation !== action) {
      this.currentAnimation = action;
      this.state = action;
      this.t = 0;
    }
  }

  update(dt) {
    this.t += dt;
    if (this.state === "idle") this.poseIdle();
    else if (this.state === "walk") this.poseWalk();
    else if (this.state === "jump") this.poseJump();
  }
  poseIdle() {
    const s = Math.sin(this.t * 2);
    Object.assign(this.pose, { hipY: s * 2, shoulderL: 12 + s * 3, shoulderR: -12 - s * 3, forearmL: 8, forearmR: -8, legL: 4, legR: -4, headTilt: s * 2 });
  }
  poseWalk() {
    const s = Math.sin(this.t * 8);
    Object.assign(this.pose, { hipY: Math.abs(Math.cos(this.t * 8)) * 3, shoulderL: s * 35, shoulderR: -s * 35, forearmL: 15 + s * 15, forearmR: -15 - s * 15, legL: -s * 35, legR: s * 35, headTilt: s * 3 });
  }
  poseJump() {
    const cyclePos = Math.min(this.t / 0.7, 1);
    const arc = Math.sin(cyclePos * Math.PI);
    Object.assign(this.pose, { hipY: -arc * 40, shoulderL: 150 - arc * 40, shoulderR: -150 + arc * 40, forearmL: 10, forearmR: -10, legL: 60 * arc, legR: -60 * arc, headTilt: 0 });
    if (this.t > 0.7) this.doAction("idle");
  }
  draw(ctx, x, y) {
    const p = this.pose;
    ctx.save();
    ctx.translate(x, y + p.hipY);
    ctx.strokeStyle = "#5fe0c9"; ctx.fillStyle = "#5fe0c9"; ctx.lineWidth = 6; ctx.lineCap = "round";
    this.drawLimb(ctx, p.legL, 42); this.drawLimb(ctx, p.legR, 42);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -55); ctx.stroke();
    this.drawArm(ctx, 0, -50, p.shoulderL, p.forearmL);
    this.drawArm(ctx, 0, -50, p.shoulderR, p.forearmR);
    ctx.save(); ctx.translate(0, -55); ctx.rotate((p.headTilt * Math.PI) / 180);
    ctx.beginPath(); ctx.arc(0, -14, 13, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.restore();
  }
  drawLimb(ctx, angleDeg, length) {
    ctx.save(); ctx.rotate((angleDeg * Math.PI) / 180);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, length); ctx.stroke(); ctx.restore();
  }
  drawArm(ctx, x, y, shoulderAngle, forearmAngle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate((shoulderAngle * Math.PI) / 180);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 26); ctx.stroke();
    ctx.translate(0, 26); ctx.rotate((forearmAngle * Math.PI) / 180);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 24); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 24, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

const demoRandom = {
  run() {
    hint.textContent = "Alle ~1,2s ruft der Zufallsgenerator doAction() auf — genau wie im Original.";
    const rig = new CharacterRig();
    const log = document.getElementById("action-log");
    log.textContent = "";

    // entspricht der Zufallslogik aus uebung3.fla
    function randomAction() {
      const random = Math.random();
      let action;
      if (random <= 0.7) action = "walk";
      else if (random <= 0.9) action = "idle";
      else action = "jump";
      rig.doAction(action);
      log.textContent = `Math.random() = ${random.toFixed(3)} → doAction("${action}")\n` + log.textContent;
    }
    randomAction();
    const interval = setInterval(randomAction, 1200);

    let lastTime = 0, raf;
    const frame = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05) || 0.016;
      lastTime = now;
      clearStage();
      rig.update(dt);
      rig.draw(ctx, W / 2, H - 40);
      ctx.fillStyle = "#5b6b7d";
      ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`currentAnimation = "${rig.currentAnimation}"`, 14, 24);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => { clearInterval(interval); cancelAnimationFrame(raf); };
  },
};

const DEMOS = { transform: demoTransform, random: demoRandom };
let cleanup = null;
function load(key) {
  if (cleanup) cleanup();
  document.getElementById("action-log-wrap").style.display = key === "random" ? "block" : "none";
  cleanup = DEMOS[key].run() || null;
}
buttons.forEach(b => b.addEventListener("click", () => {
  buttons.forEach(x => x.classList.remove("btn-active"));
  b.classList.add("btn-active");
  load(b.dataset.demo);
}));
load("transform");
