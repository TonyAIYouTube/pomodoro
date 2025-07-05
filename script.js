const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const workInput = document.getElementById('work-duration');
const breakInput = document.getElementById('break-duration');
const cyclesInput = document.getElementById('cycles');
const statusText = document.getElementById('status');
const alarmSound = document.getElementById('alarm-sound');

let workDuration = +workInput.value * 60; // in seconds
let breakDuration = +breakInput.value * 60; // in seconds
let totalCycles = +cyclesInput.value;
let currentCycle = 1;
let isWorkInterval = true;
let remainingTime = workDuration;
let timerInterval = null;

function updateDisplay(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  timerDisplay.textContent = `${mins}:${secs}`;
}

function switchInterval() {
  isWorkInterval = !isWorkInterval;
  if (isWorkInterval) {
    remainingTime = workDuration;
    statusText.textContent = `作業中 - サイクル ${currentCycle}/${totalCycles}`;
    statusText.style.color = '#16a34a';
  } else {
    remainingTime = breakDuration;
    statusText.textContent = '休憩中';
    statusText.style.color = '#dc2626';
  }
  updateDisplay(remainingTime);
  alarmSound.play();
}

function tick() {
  if (remainingTime > 0) {
    remainingTime--;
    updateDisplay(remainingTime);
  } else {
    if (!isWorkInterval) {
      // finished break, go to next cycle
      currentCycle++;
    }
    if (currentCycle > totalCycles && isWorkInterval) {
      clearInterval(timerInterval);
      statusText.textContent = 'すべてのサイクルが完了しました！';
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      return;
    }
    switchInterval();
  }
}

function startTimer() {
  workDuration = +workInput.value * 60;
  breakDuration = +breakInput.value * 60;
  totalCycles = +cyclesInput.value;

  startBtn.disabled = true;
  pauseBtn.disabled = false;
  workInput.disabled = true;
  breakInput.disabled = true;
  cyclesInput.disabled = true;

  if (!timerInterval) {
    statusText.textContent = `作業中 - サイクル ${currentCycle}/${totalCycles}`;
    timerInterval = setInterval(tick, 1000);
  }
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    pauseBtn.textContent = '再開';
  } else {
    timerInterval = setInterval(tick, 1000);
    pauseBtn.textContent = '一時停止';
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  workDuration = +workInput.value * 60;
  breakDuration = +breakInput.value * 60;
  remainingTime = workDuration;
  isWorkInterval = true;
  currentCycle = 1;

  updateDisplay(remainingTime);
  statusText.textContent = '作業中';
  statusText.style.color = '#16a34a';

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  pauseBtn.textContent = '一時停止';
  workInput.disabled = false;
  breakInput.disabled = false;
  cyclesInput.disabled = false;
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize display
updateDisplay(remainingTime);
