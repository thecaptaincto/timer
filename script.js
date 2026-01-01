let time = 0;
let interval = null;
let running = false;
let isCountdown = false;

const display = document.getElementById("display");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const modeBtn = document.getElementById("modeBtn");
const input = document.getElementById("countdownInput");
const darkBtn = document.getElementById("darkMode");
const alarm = document.getElementById("alarm");

function format(t) {
  let m = Math.floor(t / 60);
  let s = t % 60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function update() {
  display.textContent = format(time);
  localStorage.setItem("time", time);
}

function tick() {
  if (isCountdown) {
    time--;
    if (time <= 0) {
      clearInterval(interval);
      alarm.play();
      running = false;
      time = 0;
    }
  } else {
    time++;
  }
  update();
}

startBtn.onclick = () => {
  if (running) return;
  if (isCountdown && time === 0) time = Number(input.value);
  if (time <= 0) return;

  running = true;
  pauseBtn.textContent = "Pause";
  interval = setInterval(tick, 1000);
};

pauseBtn.onclick = () => {
  if (!running) return;
  clearInterval(interval);
  running = false;
  pauseBtn.textContent = "Resume";
};

resetBtn.onclick = () => {
  clearInterval(interval);
  running = false;
  time = 0;
  update();
};

modeBtn.onclick = () => {
  isCountdown = !isCountdown;
  input.hidden = !isCountdown;
  modeBtn.textContent = isCountdown ? "Switch to Stopwatch" : "Switch to Countdown";
  resetBtn.click();
};

darkBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("dark", document.body.classList.contains("dark"));
};

(function load() {
  time = Number(localStorage.getItem("time")) || 0;
  if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark");
  }
  update();
})();
