/**
 * Movement · Richtungs-Sprites
 * Portierung des Bonus-Projekts "Movement" (movement.fla + vier
 * ninja_*.swf-Grafiken für die vier Blickrichtungen)
 *
 * Das denkbar kompakteste Beispiel im ganzen Kurs: pro Tastendruck bewegt
 * sich die Figur um einen festen Betrag UND wechselt gleichzeitig ihr
 * Sprite auf die passende Blickrichtung. Anders als in den meisten
 * anderen Übungen gibt es hier keinen ENTER_FRAME-Loop — die Bewegung
 * passiert direkt im Tastendruck-Event, nicht pro Frame.
 *
 * Die vier Original-Grafiken (ninja_front/back/left/right.swf) waren
 * winzige, im Animate-Editor gezeichnete Vektorformen ohne extrahierbare
 * Bilddaten — hier durch vier selbst gezeichnete Blickrichtungen ersetzt.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const hint = document.getElementById("hint");
const posEl = document.getElementById("hud-pos");

const character = { x: W / 2, y: H / 2, direction: "front" };
const STEP = 5;

/* entspricht character_mc.gotoAndStop("left"/"right"/"up"/"down") —
   hier vier gezeichnete Blickrichtungen statt vier Bibliotheksgrafiken */
function drawCharacter(ctx, x, y, direction) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#5fe0c9";
  ctx.strokeStyle = "#0a0e14";
  ctx.lineWidth = 2;

  // Körper (in jeder Richtung gleich)
  ctx.beginPath(); ctx.roundRect(-14, -10, 28, 34, 6); ctx.fill(); ctx.stroke();

  // Kopf
  ctx.beginPath(); ctx.arc(0, -20, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#0a0e14";
  if (direction === "front") {
    // Blick nach unten (zum Betrachter): zwei Augen
    ctx.beginPath(); ctx.arc(-5, -21, 2, 0, Math.PI * 2); ctx.arc(5, -21, 2, 0, Math.PI * 2); ctx.fill();
  } else if (direction === "back") {
    // Blick nach oben (vom Betrachter weg): keine Augen sichtbar, Haarwirbel
    ctx.beginPath(); ctx.arc(0, -24, 3, 0, Math.PI * 2); ctx.fill();
  } else if (direction === "left") {
    ctx.beginPath(); ctx.arc(-6, -21, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-13, -20); ctx.lineTo(-20, -18); ctx.lineWidth = 2; ctx.strokeStyle = "#5fe0c9"; ctx.stroke(); // Nase/Profil
  } else if (direction === "right") {
    ctx.beginPath(); ctx.arc(6, -21, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(13, -20); ctx.lineTo(20, -18); ctx.lineWidth = 2; ctx.strokeStyle = "#5fe0c9"; ctx.stroke();
  }

  ctx.restore();
}

// entspricht keyDown() — Bewegung UND Richtungswechsel direkt im Event,
// kein ENTER_FRAME-Loop nötig
function keyDown(e) {
  const map = {
    ArrowLeft: "left", a: "left",
    ArrowRight: "right", d: "right",
    ArrowUp: "back", w: "back",
    ArrowDown: "front", s: "front",
  };
  const dir = map[e.key];
  if (!dir) return;
  e.preventDefault();

  if (dir === "left") character.x -= STEP;
  else if (dir === "right") character.x += STEP;
  else if (dir === "back") character.y -= STEP;
  else if (dir === "front") character.y += STEP;

  character.x = Math.max(20, Math.min(W - 20, character.x));
  character.y = Math.max(30, Math.min(H - 20, character.y));
  character.direction = dir;

  render();
}

function render() {
  ctx.fillStyle = "#05070a";
  ctx.fillRect(0, 0, W, H);
  drawCharacter(ctx, character.x, character.y, character.direction);
  posEl.textContent = `x=${Math.round(character.x)} y=${Math.round(character.y)} Richtung=${character.direction}`;
}

window.addEventListener("keydown", keyDown);
hint.textContent = "WASD oder Pfeiltasten — jeder Tastendruck bewegt die Figur um 5px und wechselt ihre Blickrichtung.";
render();
canvas.setAttribute("tabindex", "0");
canvas.focus();
