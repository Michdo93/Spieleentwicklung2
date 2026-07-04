/**
 * Übung 8 · Plattformer-Projekt
 * Portierung von Übung 8 (Main.as, CharacterController.as,
 * CharacterAnimationController.as, CoinController.as, Collider.as,
 * LevelBox.as, LevelStage.as)
 *
 * Das Kursprojekt: alles aus Übung 1–7 kommt hier zusammen. Drei
 * Charaktere (Übung 2/3), per Klick auswählbar (Übung 5), mit echter
 * Schwerkraft und Plattform-Kollision (Übung 6), sauber in Klassen
 * organisiert (Übung 7) — plus neu: fallende Münzen, die von jedem
 * Charakter eingesammelt werden können, und eine Punkteanzeige.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlay-text");
const startBtn = document.getElementById("start-btn");
const scoreEl = document.getElementById("hud-score");

const GRAVITY = 900;
const NUM_COINS = 10;

/* ---------------------------------------------------------------- */
/* CharacterAnimationController — reine Zustandsmaschine, wie in      */
/* Übung 2/3, hier als eigene Klasse (entspricht                      */
/* CharacterAnimationController.as im Original)                       */
/* ---------------------------------------------------------------- */
class CharacterAnimationController {
  constructor() { this.pose = { hipY: 0, shoulderL: 15, shoulderR: -15, forearmL: 10, forearmR: -10, legL: 8, legR: -8, headTilt: 0 }; }
  update(state, t, jumpDuration) {
    if (state === "walk") this.walk(t);
    else if (state === "jump") this.jump(t, jumpDuration);
    else this.idle(t);
  }
  idle(t) { const s = Math.sin(t * 2); Object.assign(this.pose, { hipY: s * 2, shoulderL: 12 + s * 3, shoulderR: -12 - s * 3, forearmL: 8, forearmR: -8, legL: 4, legR: -4, headTilt: s * 2 }); }
  walk(t) { const s = Math.sin(t * 8); Object.assign(this.pose, { hipY: Math.abs(Math.cos(t * 8)) * 3, shoulderL: s * 35, shoulderR: -s * 35, forearmL: 15 + s * 15, forearmR: -15 - s * 15, legL: -s * 35, legR: s * 35, headTilt: s * 3 }); }
  jump() { Object.assign(this.pose, { hipY: 0, shoulderL: 155, shoulderR: -155, forearmL: 10, forearmR: -10, legL: 32, legR: -32, headTilt: 0 }); }
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

/* ---------------------------------------------------------------- */
/* Collider / LevelBox — melden sich als Plattform an (Übung 6)        */
/* ---------------------------------------------------------------- */
class LevelPlatform {
  constructor(game, x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    game.bus.dispatchEvent(new CustomEvent("registerLevelElement", { detail: this }));
  }
}

/* ---------------------------------------------------------------- */
/* CoinController — entspricht CoinController.as                       */
/* ---------------------------------------------------------------- */
class CoinController {
  constructor(game, x, y) {
    this.game = game;
    this.x = x; this.y = y; this.dy = 0;
    this.collected = false;
    game.bus.dispatchEvent(new CustomEvent("registerCoin", { detail: this }));
  }
  update(dt, level) {
    if (this.collected) return;
    this.dy += GRAVITY * dt;
    const nextY = this.y + this.dy * dt;
    const landing = level.find(p => this.x > p.x && this.x < p.x + p.w && nextY >= p.y - 6 && nextY <= p.y + p.h);
    if (landing && this.dy > 0) { this.y = landing.y - 6; this.dy = 0; }
    else this.y = nextY;
  }
  draw(ctx) {
    if (this.collected) return;
    ctx.fillStyle = "#ffd23f";
    ctx.beginPath(); ctx.arc(this.x, this.y, 9, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#a67432"; ctx.lineWidth = 1.5; ctx.stroke();
  }
}

/* ---------------------------------------------------------------- */
/* CharacterController — entspricht CharacterController.as             */
/* ---------------------------------------------------------------- */
class CharacterController {
  constructor(game, x, id) {
    this.game = game;
    this.x = x; this.y = 40; this.dy = 0;
    this.id = id; this.name = "character" + id;
    this.orientation = "right";
    this.width = 46;
    this.speed = this.width * 0.07 * 60;
    this.animCtrl = new CharacterAnimationController();
    this.currentAnimation = "idle";
    this.t = 0;
    this.selected = false;
    this.onGround = false;
    game.bus.dispatchEvent(new CustomEvent("registerCharacter", { detail: this }));
  }

  clicked() { this.game.bus.dispatchEvent(new CustomEvent("characterClicked", { detail: this })); }
  hitTest(mx, my) { return mx > this.x - this.width / 2 && mx < this.x + this.width / 2 && my > this.y - 80 && my < this.y; }

  footHitsPlatform(footY, level) {
    for (const p of level) if (this.x > p.x && this.x < p.x + p.w && footY >= p.y && footY <= p.y + p.h + 6) return p;
    return null;
  }

  checkCoins(coins) {
    for (const c of coins) {
      if (c.collected) continue;
      if (Math.hypot(this.x - c.x, this.y - 30 - c.y) < 26) {
        c.collected = true;
        this.game.addScore(1);
      }
    }
  }

  update(dt, keys, level, coins) {
    this.t += dt;

    if (this.selected) {
      if (keys.left || keys.right) {
        this.orientation = keys.left ? "left" : "right";
        this.x += (this.orientation === "right" ? 1 : -1) * this.speed * dt;
        this.x = Math.max(this.width / 2, Math.min(W - this.width / 2, this.x));
      }
      if (keys.jump && this.onGround) { this.dy = -340; this.onGround = false; }
    }

    this.dy += GRAVITY * dt;
    const nextY = this.y + this.dy * dt;
    const landing = this.footHitsPlatform(nextY, level);
    if (landing && this.dy >= 0) { this.y = landing.y; this.dy = 0; this.onGround = true; }
    else { this.y = nextY; this.onGround = false; }
    if (this.y > H + 60) { this.x = 80 + this.id * 90; this.y = 20; this.dy = 0; }

    this.checkCoins(coins);

    if (!this.onGround) this.currentAnimation = "jump";
    else if (this.selected && (keys.left || keys.right)) this.currentAnimation = "walk";
    else this.currentAnimation = "idle";

    this.animCtrl.update(this.currentAnimation, this.t);
  }

  draw(ctx) { this.animCtrl.draw(ctx, this.x, this.y, this.orientation === "right" ? 1 : -1, this.selected); }
}

/* ---------------------------------------------------------------- */
/* Main — entspricht Main.as: erzeugt alles, hält Score & Eingabe       */
/* ---------------------------------------------------------------- */
class Game {
  constructor() {
    this.bus = new EventTarget();
    this.characters = [];
    this.coins = [];
    this.level = [];
    this.activeCharacter = null;
    this.score = 0;
    this.keys = { left: false, right: false, jump: false };

    this.bus.addEventListener("registerLevelElement", e => this.level.push(e.detail));
    this.bus.addEventListener("registerCoin", e => this.coins.push(e.detail));
    this.bus.addEventListener("registerCharacter", e => {
      this.characters.push(e.detail);
      if (this.characters.length === 1) { this.activeCharacter = e.detail; e.detail.selected = true; }
    });
    this.bus.addEventListener("characterClicked", e => {
      if (this.activeCharacter) this.activeCharacter.selected = false;
      this.activeCharacter = e.detail;
      this.activeCharacter.selected = true;
    });
  }

  addScore(n) { this.score += n; scoreEl.textContent = `Coins: ${this.score} / ${NUM_COINS}`; if (this.score >= NUM_COINS) this.win(); }

  win() {
    overlayText.textContent = `Alle ${NUM_COINS} Münzen eingesammelt!`;
    overlay.style.display = "flex";
    startBtn.textContent = "Nochmal spielen";
  }

  start() {
    this.characters = []; this.coins = []; this.level = [];
    this.activeCharacter = null; this.score = 0;
    scoreEl.textContent = `Coins: 0 / ${NUM_COINS}`;
    overlay.style.display = "none";

    new LevelPlatform(this, 0, H - 20, W, 20);
    new LevelPlatform(this, 40, H - 100, 130, 14);
    new LevelPlatform(this, 250, H - 160, 140, 14);
    new LevelPlatform(this, 440, H - 90, 130, 14);

    for (let i = 0; i < 3; i++) new CharacterController(this, 90 + i * 130, i);
    for (let i = 0; i < NUM_COINS; i++) new CoinController(this, 40 + Math.random() * (W - 80), -40 - Math.random() * 300);
  }
}

const game = new Game();

const onKeyDown = (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") { game.keys.left = true; e.preventDefault(); }
  else if (e.key === "ArrowRight" || e.key === "d") { game.keys.right = true; e.preventDefault(); }
  else if (e.key === " ") { game.keys.jump = true; e.preventDefault(); }
};
const onKeyUp = (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") game.keys.left = false;
  else if (e.key === "ArrowRight" || e.key === "d") game.keys.right = false;
  else if (e.key === " ") game.keys.jump = false;
};
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

canvas.addEventListener("click", (e) => {
  const r = canvas.getBoundingClientRect();
  const mx = e.clientX - r.left, my = e.clientY - r.top;
  for (const c of game.characters) if (c.hitTest(mx, my)) { c.clicked(); break; }
});

let lastTime = 0;
function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.03) || 0.016;
  lastTime = now;

  ctx.fillStyle = "#0a0e14"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#263041";
  game.level.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

  game.coins.forEach(c => { c.update(dt, game.level); c.draw(ctx); });
  game.characters.forEach(c => { c.update(dt, game.keys, game.level, game.coins); c.draw(ctx); });

  requestAnimationFrame(loop);
}

startBtn.addEventListener("click", () => { game.start(); canvas.focus(); });
requestAnimationFrame(loop);
