const clock = document.getElementById("clock");
const timer = document.getElementById("timer");
const stopwatch = document.getElementById("stopwatch");
const clockHour = document.getElementById("clockHour");
const clockMin = document.getElementById("clockMin");
const clockSec = document.getElementById("clockSec");
const timerStartBtn = document.getElementById("timerStartBtn");
let intervalId = null;

// CLOCK MODE
clock.addEventListener('click', () => {
    clearInterval(intervalId);

    function format(val) {
        return val.toString().padStart(2, "0");
    }

    intervalId = setInterval(() => {
        const now = new Date();
        clockHour.innerText = format(now.getHours());
        clockMin.innerText = format(now.getMinutes());
        clockSec.innerText = format(now.getSeconds());
    }, 1000);
});

// TIMER MODE
timer.addEventListener('click', () => {
    clearInterval(intervalId);
    timerStartBtn.style.display = "block";
    clockHour.innerText = "00";
    clockMin.innerText = "00";
    clockSec.innerText = "00";
});

// START TIMER
timerStartBtn.addEventListener('click', () => {
    clearInterval(intervalId);

    let hour = 0,
        min = 0,
        sec = 0;

    intervalId = setInterval(() => {
        sec++;
        if (sec === 60) {
            sec = 0;
            min++;
        }
        if (min === 60) {
            min = 0;
            hour++;
        }

        clockHour.innerText = hour.toString().padStart(2, "0");
        clockMin.innerText = min.toString().padStart(2, "0");
        clockSec.innerText = sec.toString().padStart(2, "0");
    }, 1000);
});

const taskContainer = document.querySelector(".tasks-card");
const taskInp = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskScrollArea = document.getElementById("tasksScrollArea");

addTaskButton.addEventListener('click', () => {
    const taskName = taskInp.value.trim();
    if (taskName === "") return;

    const newTask = document.createElement("div");
    newTask.className = "task";
    newTask.innerHTML = `
    <input type="checkbox" />
    <label>${taskName} <span>15 min</span></label>
  `;

    taskScrollArea.appendChild(newTask);
    taskInp.value = "";
});

window.addEventListener("DOMContentLoaded", () => {
  // all your JavaScript here
});
