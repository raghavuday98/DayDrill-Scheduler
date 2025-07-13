//Window open DOM
window.addEventListener('DOMContentLoaded', () => {
    startClock();
    loadTasksFromLocalStorage();
    loadTimerFromLocalStorage();
    updateTaskProgress();

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
    timerStartBtn.style.display ="none";

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
        saveTimerToLocalStorage();
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

// TASK SECTION ✅
const taskContainer = document.querySelector(".tasks-card");
const taskInp = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskScrollArea = document.getElementById("tasksScrollArea");
const taskTimeInput = document.getElementById("taskTimeInput");
const popup = document.getElementById("popupAlert");
const closeBtn = document.getElementById("closePopup");

// ➕ ADD TASK BUTTON
addTaskButton.addEventListener('click', () => {
    const taskName = taskInp.value.trim();
    const taskTime = taskTimeInput.value.trim();

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

        addTaskListeners();
        updateTaskProgress();
        saveTasksToLocalStorage();
    } else {
        popup.style.display = "flex";
    }
});

// ❌ REMOVE TASK
taskScrollArea.addEventListener("click", (event) => {
    if (event.target.classList.contains("task-remove-btn")) {
        const taskDiv = event.target.closest(".task");
        taskDiv.classList.add("fade-out");
        setTimeout(() => {
            taskDiv.remove();
            updateTaskProgress();
            saveTasksToLocalStorage();
        }, 250);
    }
});

// ❌ CLOSE POPUP
closeBtn.addEventListener("click", () => {
    taskInp.value = "";
    taskTimeInput.value = "00:00";
    popup.style.display = "none";
});

// ✅ SAVE TASKS TO LOCAL STORAGE
function saveTasksToLocalStorage() {
    const allTasks = [...document.querySelectorAll(".task")].map(task => {
        const nameEl = task.querySelector(".task-name");
        const timeEl = task.querySelector(".taskTimeSpan, .task-time");
        const checkbox = task.querySelector("input[type='checkbox']");

        const name = nameEl ? nameEl.textContent : "";
        const time = timeEl ? timeEl.textContent : "0 Hours 0 Min";
        const checked = checkbox ? checkbox.checked : false;

        return { name, time, checked };
    });

    localStorage.setItem("tasks", JSON.stringify(allTasks));
}

// ✅ LOAD TASKS FROM LOCAL STORAGE
function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    taskScrollArea.innerHTML = ""; // clear old

    savedTasks.forEach(({ name, time, checked }) => {
        const newTask = document.createElement("div");
        newTask.className = "task";
        newTask.innerHTML = `
            <div class="task-left">
                <input type="checkbox" ${checked ? "checked" : ""} />
                <span class="task-name">${name}</span>
            </div>
            <div class="task-right">
                <span class="taskTimeSpan">${time}</span>
                <img src="Images/remove.png" alt="Remove" class="task-remove-btn" />
            </div>
        `;
        taskScrollArea.appendChild(newTask);
    });

    addTaskListeners();
    updateTaskProgress();
}

// ✅ CHECKBOX PROGRESS
function addTaskListeners() {
    const checkboxes = document.querySelectorAll(".task input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            updateTaskProgress();
            saveTasksToLocalStorage();
        });
    });
}


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

    // Mark clicked task as active
    document.querySelectorAll(".task").forEach(t => t.classList.remove("active"));
    task.classList.add("active");


    const nameEl = task.querySelector('.task-name');
    const timeEl = task.querySelector('.task-time, .taskTimeSpan');


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

    // 👇 Hide Start/Pause if already checked
    const checkbox = task.querySelector("input[type='checkbox']");
    if (checkbox && checkbox.checked) {
        CountdownStartBtn.style.display = "block";
        CountdownStartBtn.innerHTML = "Restart";
        CountdownPauseBtn.style.display = "none";
        countdownHour.textContent = "00";
        countdownMin.textContent = "00";
        countdownSec.textContent = "00";

    } else {
        CountdownStartBtn.style.display = "block";
        CountdownStartBtn.innerHTML = "Start";
        CountdownPauseBtn.style.display = "none";
    }

});

// Countdown Start
CountdownStartBtn.addEventListener("click", () => {
    clearInterval(countdownInterval); // Reset existing interval
    CountdownPauseBtn.style.display = "block";
    CountdownStartBtn.style.display = "none";

    countdownInterval = setInterval(() => {
        if (countdownHours === 0 && countdownMinutes === 0 && countdownSeconds === 0) {
            clearInterval(countdownInterval);
            const activeTask = document.querySelector(".task.active");
            if (activeTask) {
                const checkbox = activeTask.querySelector("input[type='checkbox']");
                if (checkbox) {
                    checkbox.checked = true;
                    updateTaskProgress();
                    saveTasksToLocalStorage();
                }

            }


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

        saveCountdownToLocalStorage();

    }, 1000);
});

//Countdown Pause
CountdownPauseBtn.addEventListener('click', () => {
    clearInterval(countdownInterval); // just stops the ticking
    CountdownStartBtn.innerHTML = "Resume";
    CountdownStartBtn.style.display = "block"; // show Start again
    CountdownPauseBtn.style.display = "none";  // hide Pause
});

//Quote Section
const quotes = [
    { quote: "The fragrance of flowers spreads only in the direction of the wind. But the goodness of a person spreads in all directions", saidBy: "Chanakya" },
    { quote: "Put your heart, mind, and soul into even your smallest acts. This is the secret of success", saidBy: "Swami Sivananda" },
    { quote: "Everything happening around me is very random. I am enjoying the phase, as the journey is far more enjoyable than the destination", saidBy: "Sushant Singh Rajput" },
    { quote: "If you tell the truth, you don't have to remember anything", saidBy: "Mark Twain" },
    { quote: "Success is not final; failure is not fatal: It is the courage to continue that counts", saidBy: "Winston Churchill" },
    { quote: "Imagination is more important than knowledge", saidBy: "Albert Einstein" },
    { quote: "If you want to go fast, go alone. If you want to go far, go together", saidBy: "African proverb" },
]
const today = new Date();
const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)

const quoteToday = quotes[dayOfWeek];
const quoteCard = document.querySelector(".quote-card");

quoteCard.innerHTML = `
    <h2>Quote of the Day</h2>
    <blockquote class="quoteDisplay">"${quoteToday.quote}"</blockquote>
    <p class="saidByDisplay">- ${quoteToday.saidBy}</p>
`;

//Percent// ⏱️ Extracts time in minutes from task text
function getTimeFromText(timeText) {
    const hourMatch = timeText.match(/(\d+)\s*hour/);
    const minMatch = timeText.match(/(\d+)\s*min/);

    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const mins = minMatch ? parseInt(minMatch[1]) : 0;

    return (hours * 60) + mins;
}

// 📊 Updates the circular progress chart
function updateTaskProgress() {
    const tasks = document.querySelectorAll(".task");
    let totalTime = 0;
    let completedTime = 0;

    tasks.forEach(task => {
        const timeEl = task.querySelector(".task-time, .taskTimeSpan");
        const checkbox = task.querySelector("input[type='checkbox']");

        if (!timeEl || !checkbox) return;

        const timeText = timeEl.textContent.toLowerCase();
        const taskTime = getTimeFromText(timeText);
        totalTime += taskTime;

        if (checkbox.checked) {
            completedTime += taskTime;
        }
    });

    const percent = totalTime > 0 ? Math.round((completedTime / totalTime) * 100) : 0;

    const ring = document.querySelector(".progress-value");
    const percentText = document.getElementById("progressPercent");

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = offset;
    percentText.textContent = `${percent}%`;
    
}

function addTaskListeners() {
    const checkboxes = document.querySelectorAll(".task input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            updateTaskProgress();
            saveTasksToLocalStorage();
        });
    });
}


// LocalStorage
function saveTasksToLocalStorage() {
    const allTasks = [...document.querySelectorAll(".task")].map(task => {
        const nameEl = task.querySelector(".task-name");
        const timeEl = task.querySelector(".taskTimeSpan, .task-time"); // ✅ safer

        const name = nameEl ? nameEl.textContent : "Unnamed Task";
        const time = timeEl ? timeEl.textContent : "0 Hours 0 Min";
        const checked = task.querySelector("input[type='checkbox']")?.checked || false;

        return { name, time, checked };
    });

    localStorage.setItem("tasks", JSON.stringify(allTasks));
}



function saveTimerToLocalStorage() {
    const timerState = { hour, min, sec };
    localStorage.setItem("timer", JSON.stringify(timerState));
}



function saveCountdownToLocalStorage() {
    const activeTask = document.querySelector(".task.active");
    const name = activeTask?.querySelector(".task-name")?.textContent || "";
    const isChecked = activeTask?.querySelector("input[type='checkbox']")?.checked || false;

    const state = {
        name,
        hours: countdownHours,
        minutes: countdownMinutes,
        seconds: countdownSeconds,
        isRunning: true,
        isChecked
    };

    localStorage.setItem("countdown", JSON.stringify(state));
}

function loadCountdownFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("countdown"));
    if (!data || data.isChecked) return; // Don't restore if already done

    countdownHours = data.hours;
    countdownMinutes = data.minutes;
    countdownSeconds = data.seconds;

    countdownName.textContent = `${data.name} Countdown`;
    countdownHour.textContent = countdownHours.toString().padStart(2, "0");
    countdownMin.textContent = countdownMinutes.toString().padStart(2, "0");
    countdownSec.textContent = countdownSeconds.toString().padStart(2, "0");

    CountdownStartBtn.style.display = "block";
    CountdownPauseBtn.style.display = "none";
}
