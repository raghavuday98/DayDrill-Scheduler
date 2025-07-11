//Window open DOM
window.addEventListener('DOMContentLoaded', () => {
    startClock(); // ⏰ auto start clock when page loads
});

const clock = document.getElementById("clock");
const timer = document.getElementById("timer");
const stopwatch = document.getElementById("stopwatch");
const clockHour = document.getElementById("clockHour");
const clockMin = document.getElementById("clockMin");
const clockSec = document.getElementById("clockSec");
const timerStartBtn = document.getElementById("timerStartBtn");
const timerStopBtn = document.getElementById("timerStopBtn");

// CLOCK MODE
clock.addEventListener('click', startClock);

function startClock() {
    clearInterval(intervalId);
    clock.classList.add('active');
    timer.classList.remove('active');
    timerStopBtn.style.display = "none";

    function format(val) {
        return val.toString().padStart(2, "0");
    }

    intervalId = setInterval(() => {
        const now = new Date();
        clockHour.innerText = format(now.getHours());
        clockMin.innerText = format(now.getMinutes());
        clockSec.innerText = format(now.getSeconds());
    }, 10);
}

// TIMER MODE
timer.addEventListener('click', () => {
    clearInterval(intervalId);
    timerStartBtn.style.display = "block";
    timerStopBtn.style.display = "none";
    clockHour.innerText = "00";
    clockMin.innerText = "00";
    clockSec.innerText = "00";
    timer.classList.add('active');
    clock.classList.remove('active');
});
let intervalId;
let hour = 0,
    min = 0,
    sec = 0;

// START TIMER
timerStartBtn.addEventListener('click', startTimer);

function startTimer() {
    clearInterval(intervalId);
    timerStartBtn.style.display = "none";
    timerStopBtn.style.display = "block";

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
}

// STOP TIMER
timerStopBtn.addEventListener('click', () => {
    clearInterval(intervalId);
    timerStopBtn.style.display = "none";
    timerStartBtn.style.display = "block";

    //Keep current time on screen
    clockHour.innerText = hour.toString().padStart(2, "0");
    clockMin.innerText = min.toString().padStart(2, "0");
    clockSec.innerText = sec.toString().padStart(2, "0");
});

//Task
const taskContainer = document.querySelector(".tasks-card");
const taskInp = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskScrollArea = document.getElementById("tasksScrollArea");
const taskTimeInput = document.getElementById("taskTimeInput");
const popup = document.getElementById("popupAlert");
const closeBtn = document.getElementById("closePopup");
const tasks = document.querySelectorAll(".task");

addTaskButton.addEventListener('click', () => {
    const taskName = taskInp.value.trim();
    const taskTime = taskTimeInput.value.trim();

    // Extract hours and minutes from the "HH:MM" format
    const [taskHour, taskMin] = taskTime.split(":");


    if (taskName !== "" && taskTime !== "") {
        const newTask = document.createElement("div");
        newTask.className = "task";
        newTask.innerHTML = `
             <div class="task-left">
                            <input type="checkbox" />
                            <span class="task-name">${taskName}</span>
                        </div>
                        <div class="task-right">
                            <span class="taskTimeSpan">${taskHour} Hours ${taskMin} Min</span>
                            <img src="Images/remove.png" alt="Remove" class="task-remove-btn" />
                        </div>
        `;
        taskScrollArea.appendChild(newTask);
        taskInp.value = "";
        taskTimeInput.value = "";
    } else {
        popup.style.display = "flex";
        return;
    }

});


//Close Popup
closeBtn.addEventListener("click", () => {
    taskInp.value = "";
    taskTimeInput.value = "00:00";
    popup.style.display = "none";
})

//Remove Btn

const taskRemoveBtn = document.getElementsByClassName("task-remove-btn");

taskScrollArea.addEventListener("click", (event) => {
    if (event.target.classList.contains("task-remove-btn")) {
        const taskDiv = event.target.closest(".task");
        taskDiv.classList.add("fade-out");
        setTimeout(() => {
            taskDiv.remove();
        }, 250);
    }
});

//Cowntdown Timer
const countdownHour = document.getElementById("countdownHour");
const countdownMin = document.getElementById("countdownMin");
const countdownSec = document.getElementById("countdownSec");
const countdownName = document.querySelector(".countdownName");
const CountdownStartBtn = document.querySelector(".CountdownStartBtn");
const CountdownPauseBtn = document.querySelector(".CountdownPauseBtn");
const CountdownDisplay = document.querySelector(".time-display");

let countdownInterval;
let countdownHours = 0;
let countdownMinutes = 0;
let countdownSeconds = 0;

taskScrollArea.addEventListener('click', (e) => {
    const task = e.target.closest('.task');
    if (!task) return;

    const nameEl = task.querySelector('.task-name');
    const timeEl = task.querySelector('.task-time');

    if (!nameEl || !timeEl) return;

    const name = nameEl.textContent;
    const timeText = timeEl.textContent.toLowerCase();

    const hourMatch = timeText.match(/(\d+)\s*hour/);
    const minMatch = timeText.match(/(\d+)\s*min/);

    countdownHours = hourMatch ? parseInt(hourMatch[1]) : 0;
    countdownMinutes = minMatch ? parseInt(minMatch[1]) : 0;
    countdownSeconds = 0;

    countdownName.textContent = `${name} Countdown`;
    countdownHour.textContent = countdownHours.toString().padStart(2, "0");
    countdownMin.textContent = countdownMinutes.toString().padStart(2, "0");
    countdownSec.textContent = "00";
    CountdownStartBtn.style.display = "block";
});

// Countdown Start
CountdownStartBtn.addEventListener("click", () => {
    clearInterval(countdownInterval); // Reset existing interval
    CountdownPauseBtn.style.display="block";
    CountdownStartBtn.style.display="none";

    countdownInterval = setInterval(() => {
        if (countdownHours === 0 && countdownMinutes === 0 && countdownSeconds === 0) {
            clearInterval(countdownInterval);
            alert("Good Job!");
            return;
        }

        if (countdownSeconds === 0) {
            if (countdownMinutes > 0) {
                countdownMinutes--;
                countdownSeconds = 59;
            } else if (countdownHours > 0) {
                countdownHours--;
                countdownMinutes = 59;
                countdownSeconds = 59;
            }
        } else {
            countdownSeconds--;
        }

        countdownHour.textContent = countdownHours.toString().padStart(2, "0");
        countdownMin.textContent = countdownMinutes.toString().padStart(2, "0");
        countdownSec.textContent = countdownSeconds.toString().padStart(2, "0");

    }, 1000);
});

//Countdown Pause
CountdownPauseBtn.addEventListener('click', () => {
    clearInterval(countdownInterval); // just stops the ticking
    CountdownStartBtn.innerHTML="Resume";
    CountdownStartBtn.style.display = "block"; // show Start again
    CountdownPauseBtn.style.display = "none";  // hide Pause
});