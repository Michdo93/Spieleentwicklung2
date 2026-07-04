/**
 * Übung 1 · Animation-Grundlagen
 * Portierung von Übung 1 (strichmännchen.fla, uebung1.fla, testAnimSkripting.fla)
 *
 * Drei kleine Demos, die die drei grundlegenden Animationstechniken in
 * Animate/Flash zeigen — und wie sich jede davon im Web wiederfindet:
 *   1. Frame-by-Frame (von Hand gezeichnete Einzelbilder, keine Interpolation)
 *   2. Klassisches Tweening (Animate berechnet die Zwischenschritte)
 *   3. Skriptgesteuerte Animation über benannte Frames/Zustände (doAction())
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");
const actionButtons = document.getElementById("action-buttons");

function clearStage() { ctx.fillStyle = "#05070a"; ctx.fillRect(0, 0, W, H); }

/* ================================================================== */
/*  Demo 1: Frame-by-Frame — strichmännchen.fla                       */
/*  Klassische Flipbook-Animation: feste Posen, keine Interpolation,   */
/*  nur das Umschalten zwischen fertig gezeichneten Frames.            */
/* ================================================================== */
function drawStickFigure(x, y, pose) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = "#5fe0c9";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";

  // Kopf + Rumpf (in jeder Pose gleich)
  ctx.beginPath(); ctx.arc(0, -70, 12, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -58); ctx.lineTo(0, -10); ctx.stroke();

  // Arme und Beine unterscheiden sich je Pose (Walk-Zyklus, 4 Posen)
  const poses = [
    { armL: -30, armR: 30, legL: -20, legR: 20 },
    { armL: -10, armR: 10, legL: -5, legR: 5 },
    { armL: 30, armR: -30, legL: 20, legR: -20 },
    { armL: 10, armR: -10, legL: 5, legR: -5 },
  ];
  const p = poses[pose % poses.length];

  ctx.beginPath();
  ctx.moveTo(0, -45);
  ctx.lineTo(Math.sin((p.armL * Math.PI) / 180) * 26, -45 + Math.cos((p.armL * Math.PI) / 180) * 26);
  ctx.moveTo(0, -45);
  ctx.lineTo(Math.sin((p.armR * Math.PI) / 180) * 26, -45 + Math.cos((p.armR * Math.PI) / 180) * 26);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(Math.sin((p.legL * Math.PI) / 180) * 30, -10 + Math.cos((p.legL * Math.PI) / 180) * 30);
  ctx.moveTo(0, -10);
  ctx.lineTo(Math.sin((p.legR * Math.PI) / 180) * 30, -10 + Math.cos((p.legR * Math.PI) / 180) * 30);
  ctx.stroke();

  ctx.restore();
}

const demoFrameByFrame = {
  run() {
    hint.textContent = "4 feste Posen, im Wechsel gezeigt — keine Zwischenschritte, wie im Original per Hand gezeichnet.";
    let pose = 0;
    const interval = setInterval(() => {
      clearStage();
      drawStickFigure(W / 2, H / 2 + 60, pose);
      ctx.fillStyle = "#5b6b7d";
      ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`Frame ${pose + 1} / 4`, 14, 24);
      pose++;
    }, 150);
    return () => clearInterval(interval);
  },
};

/* ================================================================== */
/*  Demo 2: Klassisches Tweening — uebung1.fla                         */
/*  Animate berechnet automatisch alle Zwischenschritte zwischen zwei  */
/*  Keyframes. Im Web übernimmt das eine Interpolationsformel.         */
/* ================================================================== */
function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

const demoTween = {
  run() {
    hint.textContent = "Position, Rotation und Skalierung werden zwischen zwei Keyframes interpoliert (ease-in-out).";
    const duration = 1400;
    let start = null;
    let raf;
    const frame = (now) => {
      if (!start) start = now;
      let t = ((now - start) % (duration * 2)) / duration;
      const forward = t <= 1;
      const p = easeInOutQuad(forward ? t : 2 - t);

      clearStage();
      const x = 90 + p * (W - 180);
      const rotation = p * 360;
      const scale = 0.6 + p * 0.8;

      ctx.save();
      ctx.translate(x, H / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.fillStyle = "#ffb84d";
      ctx.fillRect(-25, -25, 50, 50);
      ctx.restore();

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  },
};

/* ================================================================== */
/*  Demo 3: Skriptgesteuerte Animation — testAnimSkripting.fla         */
/*  Statt Zeitleisten-Frames von Hand abzuspielen, entscheidet Code    */
/*  über doAction(label), welcher benannte Zustand jetzt laufen soll.  */
/* ================================================================== */
const demoScripted = {
  run() {
    hint.textContent = 'doAction("translate"/"rotate"/"scale") wechselt den Animationszustand — Knöpfe rechts oben ausprobieren.';
    actionButtons.style.display = "flex";

    let action = "idle";
    let t0 = performance.now();
    let raf;

    function doAction(newAction) {
      action = newAction;
      t0 = performance.now();
    }
    document.getElementById("act-translate").onclick = () => doAction("translate");
    document.getElementById("act-rotate").onclick = () => doAction("rotate");
    document.getElementById("act-scale").onclick = () => doAction("scale");

    const frame = (now) => {
      const t = Math.min((now - t0) / 900, 1);
      clearStage();

      let x = W / 2, y = H / 2, rot = 0, scale = 1;
      if (action === "translate") x = 80 + t * (W - 160);
      else if (action === "rotate") rot = t * 360;
      else if (action === "scale") scale = 1 + Math.sin(t * Math.PI) * 0.8;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.fillStyle = "#a78bfa";
      ctx.beginPath(); ctx.roundRect(-30, -30, 60, 60, 10); ctx.fill();
      ctx.restore();

      ctx.fillStyle = "#5b6b7d";
      ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`currentAnimation = "${action}"`, 14, 24);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); actionButtons.style.display = "none"; };
  },
};

const DEMOS = { framebyframe: demoFrameByFrame, tween: demoTween, scripted: demoScripted };
let cleanup = null;
function load(key) {
  if (cleanup) cleanup();
  actionButtons.style.display = "none";
  cleanup = DEMOS[key].run() || null;
}
buttons.forEach(b => b.addEventListener("click", () => {
  buttons.forEach(x => x.classList.remove("btn-active"));
  b.classList.add("btn-active");
  load(b.dataset.demo);
}));
load("framebyframe");
