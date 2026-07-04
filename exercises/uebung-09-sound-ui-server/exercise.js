/**
 * Übung 9 · Sound, UI & Server
 * Portierung von Übung 9 (vl10.fla, vl10_2.fla, vl11.fla, footstep.as)
 *
 * Drei Demos: (1) Flash-UI-Komponenten (Stepper, Button, CheckBox,
 * ColorPicker, Slider) → native HTML-Formularelemente; (2) eingebettete
 * und gestreamte Sounds — footstep.mp3 und SlowLoop.mp3 wurden aus den
 * Original-FLA-Dateien extrahiert und nach MP3 konvertiert; (3) eine
 * HTTP-Anfrage an einen Server, portiert von URLLoader zu fetch().
 */

const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");
const panels = { ui: document.getElementById("panel-ui"), sound: document.getElementById("panel-sound"), server: document.getElementById("panel-server") };
const log = document.getElementById("action-log");

function trace(msg) { log.textContent = msg + "\n" + log.textContent; }

/* ================================================================== */
/*  Demo 1: vl10.fla — UI-Komponenten                                   */
/* ================================================================== */
document.getElementById("ui-stepper").addEventListener("change", (e) => trace(`stepper: ${e.target.value}`));
document.getElementById("ui-button").addEventListener("click", () => trace("button_mc: clicked"));
document.getElementById("ui-checkbox").addEventListener("change", (e) => trace(`checkBox_mc: ${e.target.checked}`));
document.getElementById("ui-colorpicker").addEventListener("input", (e) => trace(`colorPicker_mc: ${e.target.value}`));
document.getElementById("ui-slider").addEventListener("input", (e) => {
  trace(`slider_mc: ${e.target.value}`);
  document.getElementById("ui-slider-value").textContent = e.target.value;
});

/* ================================================================== */
/*  Demo 2: vl10_2.fla — Sound abspielen (Original-Assets)              */
/* ================================================================== */
const footstepSound = new Audio("assets/footstep.mp3");
const loopSound = new Audio("assets/SlowLoop.mp3");
loopSound.loop = true;
loopSound.volume = 0.5;

document.getElementById("play-footstep").addEventListener("click", () => {
  footstepSound.currentTime = 0;
  footstepSound.play();
  trace("footstep.play()");
});

const loopBtn = document.getElementById("toggle-loop");
let loopPlaying = false;
loopBtn.addEventListener("click", () => {
  if (loopPlaying) { loopSound.pause(); loopBtn.textContent = "Loop abspielen"; trace("SlowLoop gestoppt"); }
  else { loopSound.play(); loopBtn.textContent = "Loop stoppen"; trace("SlowLoop gestartet (SoundTransform: volume=0.5)"); }
  loopPlaying = !loopPlaying;
});
document.getElementById("loop-volume").addEventListener("input", (e) => {
  loopSound.volume = e.target.value / 100;
});

/* ================================================================== */
/*  Demo 3: vl11.fla — Server-Kommunikation                             */
/* ================================================================== */
document.getElementById("server-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("server-name").value || "Player1";
  const resultEl = document.getElementById("server-result");
  resultEl.textContent = "Sende Anfrage …";
  try {
    // entspricht: request.data = variables; loader.load(request);
    const response = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    resultEl.textContent = `Server hat empfangen: name = "${data.json.name}"`;
    trace(`httpRequestComplete: name="${data.json.name}"`);
  } catch (err) {
    resultEl.textContent = "Fehler bei der Anfrage: " + err.message;
    trace("Fehler: " + err.message);
  }
});

/* ================================================================== */
const DEMO_HINTS = {
  ui: "Flash-Komponenten (Stepper, Button, CheckBox, ColorPicker, Slider) → native HTML-Formularelemente.",
  sound: "footstep.mp3 und SlowLoop.mp3 sind Original-Assets, aus den FLA-Dateien extrahiert und nach MP3 konvertiert.",
  server: "Sendet einen Namen an einen öffentlichen Test-Server (httpbin.org) und zeigt die Antwort — Ersatz für den Original-PHP-Endpunkt, damit die Demo überall funktioniert.",
};
function show(key) {
  Object.entries(panels).forEach(([k, el]) => el.style.display = k === key ? "block" : "none");
  hint.textContent = DEMO_HINTS[key];
  log.textContent = "";
}
buttons.forEach(b => b.addEventListener("click", () => {
  buttons.forEach(x => x.classList.remove("btn-active"));
  b.classList.add("btn-active");
  show(b.dataset.demo);
}));
show("ui");
