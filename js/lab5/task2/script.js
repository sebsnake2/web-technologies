const redLight = document.getElementById("redLight");
const yellowLight = document.getElementById("yellowLight");
const greenLight = document.getElementById("greenLight");

const statusText = document.getElementById("statusText");
const timerText = document.getElementById("timerText");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const settingsBtn = document.getElementById("settingsBtn");
const stopBtn = document.getElementById("stopBtn");

let redDuration = 5;
let yellowDuration = 3;
let greenDuration = 7;

let currentState = "red";
let countdown = redDuration;

let countdownInterval = null;
let stateTimeout = null;
let blinkingInterval = null;
let isRunning = false;

function clearAllTimers() {
    clearInterval(countdownInterval);
    clearTimeout(stateTimeout);
    clearInterval(blinkingInterval);
}

function resetLights() {
    redLight.classList.remove("active");
    yellowLight.classList.remove("active");
    greenLight.classList.remove("active");
}

function updateLights(state) {
    resetLights();

    if (state === "red") {
        redLight.classList.add("active");
        statusText.textContent = "Поточний стан: червоний";
    } else if (state === "yellow") {
        yellowLight.classList.add("active");
        statusText.textContent = "Поточний стан: жовтий";
    } else if (state === "green") {
        greenLight.classList.add("active");
        statusText.textContent = "Поточний стан: зелений";
    } else if (state === "blinking-yellow") {
        statusText.textContent = "Поточний стан: миготливий жовтий";
    }
}

function startCountdown(seconds) {
    countdown = seconds;
    timerText.textContent = `Залишилось: ${countdown} с`;

    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        countdown--;
        timerText.textContent = `Залишилось: ${countdown} с`;

        if (countdown <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);
}

function goToState(state) {
    clearAllTimers();
    currentState = state;

    if (state === "red") {
        updateLights("red");
        startCountdown(redDuration);

        stateTimeout = setTimeout(() => {
            goToState("yellow");
        }, redDuration * 1000);
    } else if (state === "yellow") {
        updateLights("yellow");
        startCountdown(yellowDuration);

        stateTimeout = setTimeout(() => {
            goToState("green");
        }, yellowDuration * 1000);
    } else if (state === "green") {
        updateLights("green");
        startCountdown(greenDuration);

        stateTimeout = setTimeout(() => {
            goToState("blinking-yellow");
        }, greenDuration * 1000);
    } else if (state === "blinking-yellow") {
        let blinkCount = 0;
        let visible = true;

        timerText.textContent = "Миготіння 3 рази";

        blinkingInterval = setInterval(() => {
            if (visible) {
                yellowLight.classList.add("active");
            } else {
                yellowLight.classList.remove("active");
            }

            visible = !visible;
            blinkCount++;

            if (blinkCount >= 6) {
                clearInterval(blinkingInterval);
                goToState("red");
            }
        }, 500);

        updateLights("blinking-yellow");
    }
}

function startTrafficLight() {
    if (isRunning) return;
    isRunning = true;
    goToState(currentState);
}

function stopTrafficLight() {
    isRunning = false;
    clearAllTimers();
    resetLights();
    statusText.textContent = "Світлофор зупинено";
    timerText.textContent = "Залишилось: --";
}

function nextState() {
    clearAllTimers();

    if (currentState === "red") {
        goToState("yellow");
    } else if (currentState === "yellow") {
        goToState("green");
    } else if (currentState === "green") {
        goToState("red");
    } else if (currentState === "blinking-yellow") {
        goToState("red");
    }
}

function changeDurations() {
    const newRed = prompt(
        "Введіть тривалість червоного сигналу (сек):",
        redDuration,
    );
    const newYellow = prompt(
        "Введіть тривалість жовтого сигналу (сек):",
        yellowDuration,
    );
    const newGreen = prompt(
        "Введіть тривалість зеленого сигналу (сек):",
        greenDuration,
    );

    if (newRed !== null && !isNaN(newRed) && Number(newRed) > 0) {
        redDuration = Number(newRed);
    }

    if (newYellow !== null && !isNaN(newYellow) && Number(newYellow) > 0) {
        yellowDuration = Number(newYellow);
    }

    if (newGreen !== null && !isNaN(newGreen) && Number(newGreen) > 0) {
        greenDuration = Number(newGreen);
    }

    alert("Тривалість сигналів оновлено.");
}

startBtn.addEventListener("click", startTrafficLight);
stopBtn.addEventListener("click", stopTrafficLight);
nextBtn.addEventListener("click", nextState);
settingsBtn.addEventListener("click", changeDurations);

updateLights("red");
timerText.textContent = `Залишилось: ${redDuration} с`;
