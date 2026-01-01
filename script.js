let timeMs = 0;          
let interval = null;
let running = false;
let isCountdown = false;

const display = document.getElementById("display");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const modeBtn = document.getElementById("modeBtn");
const input = document.getElementById("countdownInput");
const unitSelect = document.getElementById("unit");
const darkBtn = document.getElementById("darkMode");
const alarm = document.getElementById("alarm");

function format(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  return (
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0") + "." +
    String(centiseconds).padStart(2, "0")
  );
}

function update() {
  display.textContent = format(timeMs);
  localStorage.setItem("timeMs", timeMs);
  localStorage.setItem("mode", isCountdown ? "countdown" : "stopwatch");
}

function tick() {
  if (isCountdown) {
    timeMs -= 10;

    if (timeMs <= 0) {
      timeMs = 0;
      clearInterval(interval);
      running = false;
      alarm.play();
    }
  } else {
    timeMs += 10;
  }

  update();
}

function convertToMs(value, unit) {
  if (unit === "seconds") return value * 1000;
  if (unit === "minutes") return value * 60000;
  if (unit === "hours") return value * 3600000;
}

startBtn.onclick = () => {
  if (running) return;

  if (isCountdown && timeMs === 0) {
    const value = Number(input.value);
    if (value <= 0) return;

    timeMs = convertToMs(value, unitSelect.value);
  }

  running = true;
  pauseBtn.textContent = "Pause";
  interval = setInterval(tick, 10);
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
  timeMs = 0;
  pauseBtn.textContent = "Pause";
  update();
};

modeBtn.onclick = () => {
  isCountdown = !isCountdown;

  input.hidden = !isCountdown;
  unitSelect.hidden = !isCountdown;

  modeBtn.textContent = isCountdown
    ? "Switch to Stopwatch"
    : "Switch to Countdown";

  resetBtn.click();
};

darkBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "dark",
    document.body.classList.contains("dark")
  );
};

(function load() {
  timeMs = Number(localStorage.getItem("timeMs")) || 0;
  isCountdown = localStorage.getItem("mode") === "countdown";

  if (isCountdown) {
    input.hidden = false;
    unitSelect.hidden = false;
    modeBtn.textContent = "Switch to Stopwatch";
  }

  if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark");
  }

  update();
})();

