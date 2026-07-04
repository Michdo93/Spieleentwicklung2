/**
 * Übung 2 · Charakter-Rig bauen
 * Portierung von Übung 2 (Charakter.fla mit den Teilsymbolen Figur, Body,
 * Neck, Shoulder_Left/Right, Forearm_Left/Right, Hand, Leg)
 *
 * Das Original hat keine einzige Zeile ActionScript — es ist reine
 * Rigging-/Animationsarbeit im Animate-Editor: eine Figur aus Einzelteilen
 * zusammensetzen (verschachtelte MovieClips, jedes Teil sein eigenes
 * Symbol mit eigenem Drehpunkt), dann für die drei Zustände Idle/Walk/Jump
 * jeweils eigene Zeitleisten-Animationen von Hand bauen.
 *
 * Die Web-Entsprechung von "mehrere verschachtelte MovieClips mit eigenem
 * Drehpunkt" ist eine Klassenhierarchie aus Objekten, die jedes ihren
 * eigenen Rotationswinkel tragen — kombiniert mit Sinus-Funktionen statt
 * von Hand gesetzter Keyframes, um die drei Zustände zu erzeugen.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-state]");
const hint = document.getElementById("hint");

/* ---------------------------------------------------------------- */
/* CharacterRig — entspricht der "Figur"-Symbolhierarchie im Original */
/* Jedes Körperteil trägt seinen eigenen Rotationswinkel, genau wie   */
/* jedes verschachtelte MovieClip im Original seinen eigenen          */
/* Drehpunkt (registration point) hatte.                              */
/* ---------------------------------------------------------------- */
class CharacterRig {
  constructor() {
    this.state = "idle";
    this.t = 0;
    // Basis-Pose, wird je nach Zustand von den *Pose-Funktionen überschrieben
    this.pose = {
      hipY: 0,
      shoulderL: 15, shoulderR: -15,   // Oberarm-Winkel
      forearmL: 10, forearmR: -10,      // Unterarm-Winkel (relativ zum Oberarm)
      legL: 8, legR: -8,                // Bein-Winkel
      headTilt: 0,
    };
  }

  setState(state) {
    this.state = state;
    this.t = 0;
  }

  update(dt) {
    this.t += dt;
    if (this.state === "idle") this.poseIdle();
    else if (this.state === "walk") this.poseWalk();
    else if (this.state === "jump") this.poseJump();
  }

  // entspricht der Idle-Zeitleiste: leichtes Atmen/Wippen
  poseIdle() {
    const s = Math.sin(this.t * 2);
    this.pose.hipY = s * 2;
    this.pose.shoulderL = 12 + s * 3;
    this.pose.shoulderR = -12 - s * 3;
    this.pose.forearmL = 8;
    this.pose.forearmR = -8;
    this.pose.legL = 4;
    this.pose.legR = -4;
    this.pose.headTilt = s * 2;
  }

  // entspricht der Walk-Zeitleiste: gegenläufige Arm-/Beinbewegung
  poseWalk() {
    const s = Math.sin(this.t * 8);
    this.pose.hipY = Math.abs(Math.cos(this.t * 8)) * 3;
    this.pose.shoulderL = s * 35;
    this.pose.shoulderR = -s * 35;
    this.pose.forearmL = 15 + s * 15;
    this.pose.forearmR = -15 - s * 15;
    this.pose.legL = -s * 35;
    this.pose.legR = s * 35;
    this.pose.headTilt = s * 3;
  }

  // entspricht der Jump-Zeitleiste: Arme hoch, Beine angezogen, Sprungkurve
  poseJump() {
    const cyclePos = Math.min(this.t / 0.7, 1);
    const arc = Math.sin(cyclePos * Math.PI); // 0 -> 1 -> 0
    this.pose.hipY = -arc * 40;
    this.pose.shoulderL = 150 - arc * 40;
    this.pose.shoulderR = -150 + arc * 40;
    this.pose.forearmL = 10;
    this.pose.forearmR = -10;
    this.pose.legL = 60 * arc;
    this.pose.legR = -60 * arc;
    this.pose.headTilt = 0;
    if (this.t > 0.7 && this.jumpDoneCallback) this.jumpDoneCallback();
  }

  draw(ctx, x, y) {
    const p = this.pose;
    ctx.save();
    ctx.translate(x, y + p.hipY);

    ctx.strokeStyle = "#5fe0c9";
    ctx.fillStyle = "#5fe0c9";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";

    // Beine (von der Hüfte)
    this.drawLimb(ctx, 0, 0, p.legL, 42);
    this.drawLimb(ctx, 0, 0, p.legR, 42);

    // Rumpf (Body/Torso)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -55);
    ctx.stroke();

    // Arme (Shoulder + Forearm, zwei Segmente wie im Original)
    this.drawArm(ctx, 0, -50, p.shoulderL, p.forearmL);
    this.drawArm(ctx, 0, -50, p.shoulderR, p.forearmR);

    // Kopf (Neck + Head)
    ctx.save();
    ctx.translate(0, -55);
    ctx.rotate((p.headTilt * Math.PI) / 180);
    ctx.beginPath(); ctx.arc(0, -14, 13, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  drawLimb(ctx, x, y, angleDeg, length) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angleDeg * Math.PI) / 180);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, length); ctx.stroke();
    ctx.restore();
  }

  // zweisegmentiger Arm: Oberarm (shoulder) dreht um die Schulter,
  // Unterarm (forearm) dreht zusätzlich relativ zum Oberarm — genau wie
  // im Original zwei verschachtelte Symbole mit eigenem Drehpunkt
  drawArm(ctx, x, y, shoulderAngle, forearmAngle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((shoulderAngle * Math.PI) / 180);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 26); ctx.stroke();
    ctx.translate(0, 26);
    ctx.rotate((forearmAngle * Math.PI) / 180);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 24); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 24, 4, 0, Math.PI * 2); ctx.fill(); // Hand
    ctx.restore();
  }
}

const rig = new CharacterRig();
rig.jumpDoneCallback = () => {
  // entspricht onActionDone("jump") — nach dem Sprung zurück zu Idle
  if (rig.state === "jump" && rig.t > 0.7) {
    rig.setState("idle");
    buttons.forEach(b => b.classList.remove("btn-active"));
    document.querySelector('[data-state="idle"]').classList.add("btn-active");
  }
};

let lastTime = 0;
function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  ctx.fillStyle = "#05070a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#141a22";
  ctx.fillRect(0, H - 40, W, 40);

  rig.update(dt);
  rig.draw(ctx, W / 2, H - 40);

  ctx.fillStyle = "#5b6b7d";
  ctx.font = "13px 'JetBrains Mono'";
  ctx.fillText(`currentAnimation = "${rig.state}"`, 14, 24);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

buttons.forEach(b => b.addEventListener("click", () => {
  buttons.forEach(x => x.classList.remove("btn-active"));
  b.classList.add("btn-active");
  rig.setState(b.dataset.state);
  hint.textContent = {
    idle: "Idle: leichtes Wippen über eine Sinusfunktion, keine Fortbewegung.",
    walk: "Walk: Arme und Beine schwingen gegenläufig — dieselbe Sinusfunktion, größere Amplitude.",
    jump: "Jump: eine einmalige Bewegung (Sinus-Bogen von 0 bis π), kehrt danach automatisch zu Idle zurück.",
  }[b.dataset.state];
}));
